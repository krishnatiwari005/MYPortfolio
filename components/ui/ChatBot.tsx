'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [visibleGreetings, setVisibleGreetings] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Clean up any ongoing stream on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Scroll to bottom when messages change; auto behavior during streaming prevents jitter
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: streamingMessageId ? 'auto' : 'smooth',
    });
  }, [messages, isLoading, streamingMessageId]);

  // Helper for word-by-word incremental slicing with adaptive pace
  const getNextSlice = (target: string, current: string): string => {
    if (current.length >= target.length) return target;
    const remaining = target.slice(current.length);
    const backlog = remaining.length;

    // Adaptive pace: if the model produced lots of text, reveal slightly more per tick
    let wordsToTake = 1;
    if (backlog > 200) wordsToTake = 4;
    else if (backlog > 90) wordsToTake = 3;
    else if (backlog > 40) wordsToTake = 2;

    let sub = remaining;
    let addedLength = 0;
    for (let i = 0; i < wordsToTake; i++) {
      const match = sub.match(/^(\s*[^\s]+(\s+|$))/);
      if (!match) {
        if (sub.length > 0 && addedLength === 0) addedLength = sub.length;
        break;
      }
      addedLength += match[0].length;
      sub = sub.slice(match[0].length);
    }

    return target.slice(0, current.length + (addedLength || 1));
  };

  // Greeting sequence animation when chatbot is closed
  useEffect(() => {
    if (isOpen) {
      setVisibleGreetings([]);
      return;
    }

    let isMounted = true;
    const timeouts: NodeJS.Timeout[] = [];

    const startSequence = () => {
      setVisibleGreetings([]);
      timeouts.push(setTimeout(() => { if(isMounted) setVisibleGreetings([0]); }, 2000));
      timeouts.push(setTimeout(() => { if(isMounted) setVisibleGreetings([0, 1]); }, 4500));
      timeouts.push(setTimeout(() => { if(isMounted) setVisibleGreetings([0, 1, 2]); }, 7000));
      timeouts.push(setTimeout(() => { if(isMounted) setVisibleGreetings([]); }, 12000));
    };

    startSequence();
    const interval = setInterval(startSequence, 14000);

    return () => {
      isMounted = false;
      timeouts.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input?.trim() || isLoading || streamingMessageId) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const assistantMsgId = (Date.now() + 1).toString();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages.map(m => ({ role: m.role, content: m.content })),
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        let errMessage = 'Unable to reach KrisNova right now.';
        try {
          const errData = await response.json();
          if (errData.error) errMessage = errData.error;
        } catch {
          // ignore
        }
        throw new Error(errMessage);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Initialize the assistant message for streaming
      setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);
      setIsLoading(false);
      setStreamingMessageId(assistantMsgId);

      let fullTargetText = '';
      let currentDisplayedText = '';
      let isStreamDone = false;

      // Concurrently read the stream from backend
      const readStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              isStreamDone = true;
              break;
            }
            fullTargetText += decoder.decode(value, { stream: true });
          }
        } catch (err: unknown) {
          if ((err as Error)?.name !== 'AbortError') {
            console.error('Stream reader error:', err);
          }
          isStreamDone = true;
        }
      };

      const streamPromise = readStream();

      // Word-by-word streaming typewriter loop
      while (true) {
        if (abortController.signal.aborted) break;

        if (currentDisplayedText.length < fullTargetText.length) {
          currentDisplayedText = getNextSlice(fullTargetText, currentDisplayedText);
          const textToShow = currentDisplayedText;

          setMessages(prev =>
            prev.map(msg => (msg.id === assistantMsgId ? { ...msg, content: textToShow } : msg))
          );

          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
          }

          const backlog = fullTargetText.length - currentDisplayedText.length;
          const delay = backlog > 120 ? 16 : backlog > 50 ? 24 : 32;
          await new Promise(r => setTimeout(r, delay));
        } else if (isStreamDone) {
          // Ensure any trailing text is cleanly displayed
          if (currentDisplayedText !== fullTargetText) {
            currentDisplayedText = fullTargetText;
            setMessages(prev =>
              prev.map(msg => (msg.id === assistantMsgId ? { ...msg, content: fullTargetText } : msg))
            );
          }
          break;
        } else {
          // Waiting for next chunk from network
          await new Promise(r => setTimeout(r, 20));
        }
      }

      await streamPromise;
    } catch (error: unknown) {
      if ((error as Error)?.name !== 'AbortError') {
        console.error('Chat error:', error);
        setMessages(prev => {
          const exists = prev.some(m => m.id === assistantMsgId);
          if (exists) {
            return prev.map(m =>
              m.id === assistantMsgId
                ? { ...m, content: m.content || 'Sorry, I encountered an error. Please try again.' }
                : m
            );
          }
          return [
            ...prev,
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: 'Sorry, I encountered an error. Please try again.',
            },
          ];
        });
      }
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-3 bottom-20 sm:absolute sm:inset-auto sm:bottom-16 sm:right-0 w-auto sm:w-[490px] h-[75vh] sm:h-[550px] max-h-[640px] rounded-2xl flex flex-col overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.2),0_0_80px_rgba(6,182,212,0.1)]"
            style={{ background: 'linear-gradient(160deg, #001f3f 0%, #000d1a 60%, #001a2e 100%)', border: '1px solid rgba(0,229,255,0.3)' }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ background: 'linear-gradient(90deg, rgba(0,229,255,0.15), rgba(6,182,212,0.1))', borderBottom: '1px solid rgba(0,229,255,0.25)' }}>
              <div className="flex items-center gap-2.5">
                <img src="/krisnova-avatar.jpg" alt="KrisNova" className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-400/50" />
                <div>
                  <span className="font-bold leading-none text-sm" style={{ background: 'linear-gradient(90deg, #e0f7fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KrisNova</span>
                  <p className="text-[9px] text-cyan-300/70 leading-none mt-0.5">Personal Portfolio Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 rounded-lg text-cyan-300/70 hover:text-cyan-200 hover:bg-cyan-500/10 transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#00e5ff]/20 scrollbar-track-transparent">
              {messages.length === 0 && (
                <div className="flex flex-col items-center text-center mt-4 sm:mt-6 px-2 gap-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-cyan-500/50 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                    <img src="/krisnova-avatar.jpg" alt="KrisNova" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-[#001f3f] border border-[#00e5ff]/20 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#e0f7fa] leading-relaxed shadow-lg">
                    <p className="font-semibold text-[#00e5ff] mb-1">👋 Hi there! I&apos;m <span className="font-bold">KrisNova</span> — Krishna Tiwari&apos;s Personal Assistant.</p>
                    <p className="text-[#80deea]">Feel free to ask me anything about his <span className="text-[#e0f7fa] font-medium">portfolio</span>, <span className="text-[#e0f7fa] font-medium">tech stack</span>, <span className="text-[#e0f7fa] font-medium">projects</span>, or <span className="text-[#e0f7fa] font-medium">experience</span>. I&apos;m here to help! 🚀</p>
                  </div>
                </div>
              )}
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-2.5 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                   <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden ring-1 ring-cyan-400/40 shrink-0">
                      <img src="/krisnova-avatar.jpg" alt="KrisNova" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`max-w-[88%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm break-words overflow-wrap-anywhere ${message.role === 'user' ? 'bg-[#00e5ff] text-[#000d1a] rounded-tr-sm font-medium shadow-md' : 'bg-[#001f3f] text-[#e0f7fa] border border-[#00e5ff]/20 rounded-tl-sm shadow-md'}`} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                    {message.role === 'assistant' ? (
                      <div>
                        {message.content ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-[#e0f7fa]">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold text-[#00e5ff]">{children}</strong>,
                              em: ({ children }) => <em className="text-[#80deea] not-italic font-medium">{children}</em>,
                              ul: ({ children }) => <ul className="my-2 space-y-1.5 list-none pl-0">{children}</ul>,
                              ol: ({ children }) => <ol className="my-2 space-y-1.5 list-decimal pl-4 text-[#e0f7fa]">{children}</ol>,
                              li: ({ children }) => (
                                <li className="flex gap-2 items-start text-[#e0f7fa]">
                                  <span className="text-[#00e5ff] mt-0.5 shrink-0 text-xs">▸</span>
                                  <div className="flex-1 leading-snug">{children}</div>
                                </li>
                              ),
                              code: ({ children }) => (
                                <code className="bg-[#00e5ff]/10 text-[#00e5ff] px-1.5 py-0.5 rounded text-xs font-mono border border-[#00e5ff]/20">
                                  {children}
                                </code>
                              ),
                              h1: ({ children }) => (
                                <h1 className="font-bold text-base text-[#00e5ff] mb-2 pb-1 border-b border-[#00e5ff]/25">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="font-semibold text-sm text-[#00e5ff] mb-1.5">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="font-medium text-xs text-[#80deea] mb-1">
                                  {children}
                                </h3>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-[#00e5ff] pl-3 py-1 my-2 bg-[#00e5ff]/5 rounded-r-lg text-xs italic text-[#b2ebf2]">
                                  {children}
                                </blockquote>
                              ),
                              table: ({ children }) => (
                                <div className="w-full my-2.5 overflow-x-auto rounded-xl border border-[#00e5ff]/25 bg-[#001020]/90 shadow-md">
                                  <table className="w-full text-xs text-left border-collapse">{children}</table>
                                </div>
                              ),
                              thead: ({ children }) => (
                                <thead className="bg-[#002244] text-[#00e5ff] font-bold border-b border-[#00e5ff]/30 text-[11px] uppercase tracking-wider">
                                  {children}
                                </thead>
                              ),
                              tbody: ({ children }) => <tbody className="divide-y divide-[#00e5ff]/10">{children}</tbody>,
                              tr: ({ children }) => <tr className="hover:bg-[#00e5ff]/5 transition-colors">{children}</tr>,
                              th: ({ children }) => <th className="px-3 py-2 font-semibold text-[#00e5ff] whitespace-nowrap">{children}</th>,
                              td: ({ children }) => <td className="px-3 py-2 text-[#e0f7fa] align-top text-xs leading-relaxed">{children}</td>,
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[#00e5ff] underline underline-offset-2 decoration-[#00e5ff]/40 hover:decoration-[#00e5ff] hover:text-white font-medium transition-colors break-all"
                                >
                                  <span>{children}</span>
                                  <span className="text-[10px] opacity-70">↗</span>
                                </a>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        ) : null}
                        {streamingMessageId === message.id && (
                          <span className="inline-block w-1.5 h-3.5 bg-[#00e5ff] shadow-[0_0_8px_#00e5ff] rounded-xs ml-1 animate-pulse align-middle" />
                        )}
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00e5ff] flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#000d1a]" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2.5 sm:gap-3 justify-start">
                   <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00e5ff]/10 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00e5ff]" />
                    </div>
                    <div className="bg-[#001f3f] border border-[#00e5ff]/20 rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-[#00e5ff] animate-spin" />
                      <span className="text-xs text-[#80deea]/80">KrisNova is thinking...</span>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t shrink-0" style={{ background: '#000d1a', borderColor: 'rgba(0,229,255,0.2)' }}>
              <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask KrisNova anything..."
                  className="w-full text-[#e0f7fa] rounded-full px-4 py-2.5 pr-10 focus:outline-none transition-colors text-xs sm:text-sm"
                  style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.25)', color: '#e0f7fa' }}
                  onFocus={e => e.currentTarget.style.border = '1px solid rgba(0,229,255,0.5)'}
                  onBlur={e => e.currentTarget.style.border = '1px solid rgba(0,229,255,0.25)'}
                />
                <button
                  type="submit"
                  disabled={isLoading || !!streamingMessageId || !input?.trim()}
                  className="absolute right-1.5 p-2 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Greetings - Desktop ONLY (hidden on mobile so it never covers the user's face) */}
      {!isOpen && (
        <div className="hidden md:flex absolute bottom-20 right-0 flex-col items-end gap-2 pointer-events-none z-40">
          <AnimatePresence>
            {visibleGreetings.includes(0) && (
              <motion.div
                key="msg-0"
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#001f3f] border border-[#00e5ff]/30 text-[#e0f7fa] px-4 py-2 rounded-2xl rounded-br-sm text-sm shadow-[0_0_15px_rgba(0,229,255,0.2)] font-medium whitespace-nowrap"
              >
                Hello! Have any doubts? 🤔
              </motion.div>
            )}
            {visibleGreetings.includes(1) && (
              <motion.div
                key="msg-1"
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#001f3f] border border-[#00e5ff]/30 text-[#e0f7fa] px-4 py-2 rounded-2xl rounded-br-sm text-sm shadow-[0_0_15px_rgba(0,229,255,0.2)] font-medium whitespace-nowrap"
              >
                Want to know about his projects? 🚀
              </motion.div>
            )}
            {visibleGreetings.includes(2) && (
              <motion.div
                key="msg-2"
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#001f3f] border border-[#00e5ff]/30 text-[#e0f7fa] px-4 py-2 rounded-2xl rounded-br-sm text-sm shadow-[0_0_15px_rgba(0,229,255,0.2)] font-medium whitespace-nowrap"
              >
                Come here! 👇
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 relative group overflow-hidden"
        style={{ boxShadow: '0 0 25px rgba(0,229,255,0.4), 0 0 50px rgba(6,182,212,0.2)' }}
        aria-label="Toggle KrisNova Chat"
      >
        {isOpen
          ? <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00e5ff,#06b6d4)' }}><X className="w-5 h-5 sm:w-6 sm:h-6 text-[#000d1a]" /></div>
          : <img src="/krisnova-avatar.jpg" alt="KrisNova" className="w-full h-full object-cover" />
        }
        {!isOpen && <span className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ background: 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}></span>}
      </button>
    </div>
  );
}
