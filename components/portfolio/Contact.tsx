"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, GitBranch, Link2, ExternalLink, Cpu, Send, Loader2 } from 'lucide-react';
import { Hero } from '@/types';
import Card from '../ui/card';
import Button from '../ui/button';

export interface ContactSectionProps {
  data: Hero | null;
}

export const ContactSection = ({ data }: ContactSectionProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    website: '', // honeypot
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const contactItems = [
    {
      icon: Mail,
      label: 'Email Directly',
      actionUrl: data?.email ? `mailto:${data.email}` : undefined,
    },
    {
      icon: Link2,
      label: 'LinkedIn',
      actionUrl: data?.linkedin_url ?? undefined,
    },
    {
      icon: GitBranch,
      label: 'GitHub',
      actionUrl: data?.github_url ?? undefined,
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setStatus('success');
      setFormData({ name: '', email: '', company: '', subject: '', message: '', website: '' });
    } catch (err: unknown) {
      setStatus('error');
      if (err instanceof Error) {
        setErrorMessage(err.message || 'Something went wrong.');
      } else {
        setErrorMessage('Something went wrong.');
      }
    }
  };

  return (
    <section id="contact" className="py-12 md:py-20 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[800px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.4)] text-[#00e5ff] text-xs font-bold tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(0,229,255,0.25)]">
            <Cpu className="w-3.5 h-3.5" /> GET IN TOUCH
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white tracking-tight">
            Let&#39;s <span className="text-[#00e5ff] text-glow">Connect</span>
          </h2>
          <p className="text-sm md:text-base text-[#80deea] font-medium max-w-md">
            Have an opportunity, project, or collaboration in mind? I&#39;d love to hear from you.
          </p>
        </div>

        {/* Main Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          {/* Glowing Corner Accents */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[#00e5ff] group-hover:shadow-[0_0_10px_#00e5ff] transition-all z-10" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#00e5ff] group-hover:shadow-[0_0_10px_#00e5ff] transition-all z-10" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#00e5ff] group-hover:shadow-[0_0_10px_#00e5ff] transition-all z-10" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[#00e5ff] group-hover:shadow-[0_0_10px_#00e5ff] transition-all z-10" />

          <Card glass className="p-6 md:p-10 rounded-2xl flex flex-col space-y-8 relative overflow-hidden bg-[#001329]/90 border border-[#00e5ff]/35 backdrop-blur-xl shadow-[0_0_35px_rgba(0,229,255,0.12)]">
            
            {/* Open to opportunities status */}
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 pb-6 border-b border-[#00e5ff]/25">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff88]"></span>
                </span>
                <span className="text-xs font-bold font-mono text-[#00ff88] tracking-widest uppercase">
                  Open to Opportunities
                </span>
              </div>
              <p className="text-xs md:text-sm font-medium text-[#b2ebf2] text-center md:text-right">
                Internships &bull; Software Development &bull; Collaborations
              </p>
            </div>

            {/* Form */}
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 space-y-4 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#00ff88]/15 flex items-center justify-center mb-2 border border-[#00ff88]/50 shadow-[0_0_20px_rgba(0,255,136,0.3)]">
                  <Send className="w-8 h-8 text-[#00ff88]" />
                </div>
                <h3 className="text-2xl font-bold text-[#00ff88]">Message sent successfully!</h3>
                <p className="text-[#e0f7fa]">Thanks for reaching out. I&#39;ll get back to you as soon as possible.</p>
                <Button 
                  variant="secondary" 
                  onClick={() => setStatus('idle')}
                  className="mt-6 border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff]/20 font-bold"
                >
                  Send another message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">Send me a message</h3>
                
                {/* Honeypot field - visually hidden */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="name" className="text-xs font-bold font-mono text-[#00e5ff] uppercase tracking-wider">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-[#002244]/80 border border-[#00e5ff]/40 focus:border-[#00e5ff] rounded-lg px-4 py-3 text-sm text-white font-medium placeholder:text-[#80deea]/60 focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 transition-all shadow-inner"
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="email" className="text-xs font-bold font-mono text-[#00e5ff] uppercase tracking-wider">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-[#002244]/80 border border-[#00e5ff]/40 focus:border-[#00e5ff] rounded-lg px-4 py-3 text-sm text-white font-medium placeholder:text-[#80deea]/60 focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="company" className="text-xs font-bold font-mono text-[#00e5ff] uppercase tracking-wider">
                      Company / Organization
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company or organization"
                      className="w-full bg-[#002244]/80 border border-[#00e5ff]/40 focus:border-[#00e5ff] rounded-lg px-4 py-3 text-sm text-white font-medium placeholder:text-[#80deea]/60 focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="subject" className="text-xs font-bold font-mono text-[#00e5ff] uppercase tracking-wider">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What would you like to discuss?"
                      className="w-full bg-[#002244]/80 border border-[#00e5ff]/40 focus:border-[#00e5ff] rounded-lg px-4 py-3 text-sm text-white font-medium placeholder:text-[#80deea]/60 focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="message" className="text-xs font-bold font-mono text-[#00e5ff] uppercase tracking-wider">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about the opportunity or project..."
                    className="w-full bg-[#002244]/80 border border-[#00e5ff]/40 focus:border-[#00e5ff] rounded-lg px-4 py-3 text-sm text-white font-medium placeholder:text-[#80deea]/60 focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/50 transition-all resize-y min-h-[120px] shadow-inner"
                  />
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {status === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-sm font-medium bg-red-400/15 border border-red-400/40 p-3.5 rounded-lg shadow-md"
                    >
                      <p className="font-bold mb-1">Something went wrong.</p>
                      <p className="text-red-300">{errorMessage || 'Please try again or contact me directly by email.'}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={status === 'loading'}
                    className="w-full md:w-auto flex justify-center items-center gap-2.5 px-9 py-3.5 bg-[#00e5ff] hover:bg-[#00ffe7] text-[#001020] font-mono font-extrabold text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ clipPath: 'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)' }}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#001020]" /> Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#001020]" /> Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </motion.div>

        {/* Direct Contact Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-col items-center justify-center space-y-4"
        >
          <p className="text-sm font-mono text-[#00e5ff] font-bold uppercase tracking-wider">
            Prefer direct contact?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {contactItems.map((item, idx) => {
              if (!item.actionUrl) return null;
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.actionUrl}
                  target={item.label.includes('Email') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#001e3d]/80 hover:bg-[#00e5ff]/25 border border-[#00e5ff]/40 hover:border-[#00e5ff] rounded-lg text-xs font-mono font-bold text-[#00e5ff] hover:text-white transition-all shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {!item.label.includes('Email') && <ExternalLink className="w-3.5 h-3.5 ml-1" />}
                </a>
              );
            })}
          </div>
        </motion.div>
        
      </div>
    </section>
  );
};

export default ContactSection;
