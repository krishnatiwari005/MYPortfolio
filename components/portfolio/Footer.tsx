'use client';

import { GitBranch, Link2, MessageCircle, Mail, Code2 } from 'lucide-react';
import { Hero, Settings } from '@/types';
import { formatDate } from '@/lib/utils';

export interface FooterProps {
  hero: Hero | null;
  settings: Settings | null;
}

export const Footer = ({ hero, settings }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const name = hero?.name ?? 'Jane Doe';

  const socialLinks = [
    { icon: GitBranch, href: hero?.github_url, label: 'GitHub' },
    { icon: Link2, href: hero?.linkedin_url, label: 'LinkedIn' },
    { icon: MessageCircle, href: hero?.twitter_url, label: 'Twitter' },
    { icon: Code2, href: hero?.leetcode_url, label: 'LeetCode' },
    { icon: Mail, href: hero?.email ? `mailto:${hero.email}` : undefined, label: 'Email' },
  ].filter((link) => link.href);

  return (
    <footer className="w-full h-20 border-t border-border-subtle bg-white relative z-10">
      <div className="w-full max-w-[1100px] mx-auto h-full px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* Left: Copyright */}
        <p className="text-text-tertiary font-medium">
          &copy; {currentYear} {name}. All rights reserved.
        </p>

        {/* Center: Social Icons */}
        <div className="flex items-center gap-4">
          {socialLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <a
                key={idx}
                href={link.href ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-tertiary hover:text-accent-primary transition-colors duration-200"
                aria-label={link.label}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>

        {/* Right: Last Updated */}
        <p className="text-text-tertiary font-medium">
          {settings?.last_updated_at && (
            <span>Last updated: {formatDate(settings.last_updated_at)}</span>
          )}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
