"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, GitBranch, Link2, Copy, Check, ExternalLink, ArrowRight, Cpu } from 'lucide-react';
import { Hero } from '@/types';
import Card from '../ui/card';
import Button from '../ui/button';
import toast from '../ui/toast';

export interface ContactSectionProps {
  data: Hero | null;
}

export const ContactSection = ({ data }: ContactSectionProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const contactItems = [
    {
      icon: Mail,
      label: 'Email Address',
      value: data?.email ?? 'jane.doe@example.com',
      actionUrl: data?.email ? `mailto:${data.email}` : undefined,
    },
    {
      icon: GitBranch,
      label: 'GitHub Profile',
      value: data?.github_url?.replace('https://', '') ?? 'github.com/janedoe',
      actionUrl: data?.github_url ?? undefined,
    },
    {
      icon: Link2,
      label: 'LinkedIn Profile',
      value: data?.linkedin_url?.replace('https://', '') ?? 'linkedin.com/in/janedoe',
      actionUrl: data?.linkedin_url ?? undefined,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    const rawValue = text.includes('github.com') || text.includes('linkedin.com') ? `https://${text}` : text;
    navigator.clipboard.writeText(rawValue);
    setCopiedIndex(index);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <section id="contact" className="py-12 md:py-20 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,229,255,0.07)] border border-[rgba(0,229,255,0.25)] text-[#00e5ff] text-xs font-bold tracking-widest uppercase rounded-full shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Cpu className="w-3.5 h-3.5" /> Contact
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-[#e0f7fa] tracking-tight">
            Let&#39;s <span className="text-[#00e5ff]">Connect</span>
          </h2>
          <p className="text-sm text-[#00b4d8] uppercase tracking-widest font-bold max-w-md">
            Reach me via socials or drop a direct email.
          </p>
        </div>

        {/* Main Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          {/* Neon Corner Accents */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-all" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-all" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-all" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-all" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactItems.map((item, idx) => {
              const Icon = item.icon;
              const isCopied = copiedIndex === idx;
              return (
                <Card
                  key={idx}
                  glass
                  className="p-5 rounded-2xl flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-lg">
                      <Icon className="w-5 h-5 text-[#00e5ff]" />
                    </div>
                    <span className="text-[10px] font-bold font-mono text-[#00ff88] uppercase tracking-widest">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#b2ebf2] break-all" title={item.value}>
                    {item.value}
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-[#00e5ff]/10">
                    <button
                      onClick={() => handleCopy(item.value, idx)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#001a33] hover:bg-[#00e5ff]/15 rounded text-xs font-medium text-[#00e5ff] transition-colors"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isCopied ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-0.5"
                          >
                            <Check className="w-3.5 h-3.5" /> Copied
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-0.5"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                    {item.actionUrl && (
                      <a
                        href={item.actionUrl}
                        target={item.label.includes('Email') ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="p-2 bg-[#001a33] hover:bg-[#00e5ff]/15 rounded text-[#00e5ff] transition-colors"
                        title="Open Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Email CTA Button */}
        {data?.email && (
          <div className="flex justify-center pt-8">
            <Button
              variant="primary"
              onClick={() => window.open(`mailto:${data.email}`, '_self')}
              className="flex items-center gap-2 px-8 py-3 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/25 border border-[#00e5ff] text-[#00e5ff] hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
              style={{ clipPath: 'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)' }}
            >
              <Mail className="w-4 h-4" /> Send me an email
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
