'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, GitBranch, Link2, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';
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

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <section id="contact" className="py-12 md:py-16 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 space-y-8 md:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="px-3 py-1 bg-accent-light border border-accent-primary/10 text-accent-primary text-xs font-bold tracking-widest uppercase rounded-full">
            Contact
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-text-primary tracking-tight">
            Let&apos;s Work Together
          </h2>
          <p className="text-sm text-text-tertiary max-w-sm">
            Feel free to reach out via socials or drop a direct email message.
          </p>
        </div>

        {/* Copy Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contactItems.map((item, idx) => {
            const Icon = item.icon;
            const isCopied = copiedIndex === idx;

            return (
              <Card key={idx} glass className="p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="p-2.5 bg-accent-light text-accent-primary rounded-xl w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">{item.label}</span>
                    <p className="text-xs font-semibold text-text-primary truncate mt-0.5" title={item.value}>
                      {item.value}
                    </p>
                  </div>
                </div>

                {/* Card footer controls */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-border-subtle">
                  <button
                    onClick={() => handleCopy(item.value, idx)}
                    className="flex-1 py-1.5 bg-bg-primary hover:bg-border-subtle rounded-lg text-[10px] font-semibold text-text-secondary flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isCopied ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="text-success flex items-center gap-0.5"
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
                          <Copy className="w-3 h-3 text-text-tertiary" /> Copy
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>

                  {item.actionUrl && (
                    <a
                      href={item.actionUrl}
                      target={item.label.includes('Email') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      className="p-1.5 bg-bg-primary hover:bg-border-subtle text-text-tertiary hover:text-text-primary rounded-lg transition-colors cursor-pointer"
                      title="Open Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Large Compose Button */}
        {data?.email && (
          <div className="flex items-center justify-center pt-4">
            <Button
              variant="primary"
              onClick={() => window.open(`mailto:${data.email}`, '_self')}
              className="group flex items-center gap-2 px-8 py-3"
            >
              Send me an email
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
