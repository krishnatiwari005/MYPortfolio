'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visibleGreetings, setVisibleGreetings] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
    if (!input?.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'API Error');
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] rounded-2xl flex flex-col overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #001f3f 0%, #000d1a 60%, #001a2e 100%)', border: '1px solid rgba(0,229,255,0.2)', boxShadow: '0 0 40px rgba(0,229,255,0.15), 0 0 80px rgba(6,182,212,0.08)' }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ background: 'linear-gradient(90deg, rgba(0,229,255,0.1), rgba(6,182,212,0.08))', borderBottom: '1px solid rgba(0,229,255,0.2)' }}>
              <div className="flex items-center gap-2">
                <img src="/krisnova-avatar.jpg" alt="KrisNova" className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-400/50" />
                <div>
                  <span className="font-bold leading-none" style={{ background: 'linear-gradient(90deg, #e0f7fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KrisNova</span>
                  <p className="text-[9px] text-cyan-300/70 leading-none mt-0.5">Personal Portfolio Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-cyan-300/60 hover:text-cyan-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#00e5ff]/20 scrollbar-track-transparent">
              {messages.length === 0 && (
                <div className="flex flex-col items-center text-center mt-6 px-2 gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-cyan-500/50 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                    <img src="/krisnova-avatar.jpg" alt="KrisNova" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-[#001f3f] border border-[#00e5ff]/20 rounded-2xl px-4 py-3 text-sm text-[#e0f7fa] leading-relaxed">
                    <p className="font-semibold text-[#00e5ff] mb-1">👋 Hi there! I'm <span className="font-bold">KrisNova</span> — Krishna Tiwari's Personal Assistant.</p>
                    <p className="text-[#80deea]">Feel free to ask me anything about his <span className="text-[#e0f7fa] font-medium">portfolio</span>, <span className="text-[#e0f7fa] font-medium">tech stack</span>, <span className="text-[#e0f7fa] font-medium">projects</span>, or <span className="text-[#e0f7fa] font-medium">experience</span>. I'm here to help! 🚀</p>
                  </div>
                </div>
              )}
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                   <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-cyan-400/40 shrink-0">
                      <img src="/krisnova-avatar.jpg" alt="KrisNova" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${message.role === 'user' ? 'bg-[#00e5ff] text-[#000d1a] rounded-tr-sm font-medium' : 'bg-[#001f3f] text-[#e0f7fa] border border-[#00e5ff]/20 rounded-tl-sm'}`}>
                    {message.role === 'assistant' ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-1 last:mb-0 leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold text-[#00e5ff]">{children}</strong>,
                          ul: ({ children }) => <ul className="mt-1 mb-1 space-y-0.5 list-none pl-0">{children}</ul>,
                          ol: ({ children }) => <ol className="mt-1 mb-1 space-y-0.5 list-decimal pl-4">{children}</ol>,
                          li: ({ children }) => <li className="flex gap-1.5 items-start"><span className="text-[#00e5ff] mt-0.5 shrink-0">•</span><span>{children}</span></li>,
                          code: ({ children }) => <code className="bg-[#00e5ff]/10 text-[#00e5ff] px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                          h1: ({ children }) => <h1 className="font-bold text-[#00e5ff] mb-1">{children}</h1>,
                          h2: ({ children }) => <h2 className="font-semibold text-[#00e5ff] mb-1">{children}</h2>,
                          h3: ({ children }) => <h3 className="font-medium text-[#80deea] mb-0.5">{children}</h3>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[#00e5ff] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-[#000d1a]" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                   <div className="w-8 h-8 rounded-full bg-[#00e5ff]/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-[#00e5ff]" />
                    </div>
                    <div className="bg-[#001f3f] border border-[#00e5ff]/20 rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center">
                      <Loader2 className="w-4 h-4 text-[#00e5ff] animate-spin" />
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t" style={{ background: '#000d1a', borderColor: 'rgba(0,229,255,0.2)' }}>
              <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask KrisNova anything..."
                  className="w-full text-[#e0f7fa] rounded-full px-4 py-2.5 pr-10 focus:outline-none transition-colors text-sm"
                  style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.2)', color: '#e0f7fa' }}
                  onFocus={e => e.currentTarget.style.border = '1px solid rgba(0,229,255,0.5)'}
                  onBlur={e => e.currentTarget.style.border = '1px solid rgba(0,229,255,0.2)'}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input?.trim()}
                  className="absolute right-1.5 p-1.5 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{ background: 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Greetings */}
      {!isOpen && (
        <div className="absolute bottom-20 right-0 flex flex-col items-end gap-2 pointer-events-none z-40">
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
        className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 relative group overflow-hidden"
        style={{ boxShadow: '0 0 25px rgba(0,229,255,0.4), 0 0 50px rgba(6,182,212,0.2)' }}
      >
        {isOpen
          ? <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00e5ff,#06b6d4)' }}><X className="w-6 h-6 text-[#000d1a]" /></div>
          : <img src="/krisnova-avatar.jpg" alt="KrisNova" className="w-full h-full object-cover" />
        }
        {!isOpen && <span className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ background: 'linear-gradient(135deg, #00e5ff, #06b6d4)' }}></span>}
      </button>
    </div>
  );
}
