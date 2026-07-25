'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Hero } from '@/types';
import { Activity, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../ui/card';

const GitHubCalendar = dynamic(() =>
  import('react-github-calendar').then((mod) => mod.GitHubCalendar),
  { ssr: false, loading: () => <div className="h-32 w-full animate-pulse bg-[#001a33] rounded-xl border border-[#00e5ff]/20" /> }
);

export interface ContributionsProps {
  hero: Hero | null;
}

export const Contributions = ({ hero }: ContributionsProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const getUsernameFromUrl = (url: string | null): string | null => {
    if (!url) return null;
    const match = url.match(/(?:github\.com|leetcode\.com(?:\/u)?)\/([^\/?]+)/);
    return match ? match[1] : null;
  };

  const githubUsername = getUsernameFromUrl(hero?.github_url ?? null);
  const leetcodeUsername = getUsernameFromUrl(hero?.leetcode_url ?? null);

  if (!githubUsername && !leetcodeUsername) {
    return null; // Nothing to show
  }

  return (
    <section className="py-16 md:py-24 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-bold tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <Activity className="w-3.5 h-3.5" />
            Continuous Learning
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-[#e0f7fa] tracking-tight">
            Open Source & <span className="text-[#00e5ff]">Problem Solving</span>
          </h2>
          <p className="text-sm text-[#00b4d8] uppercase tracking-widest font-bold max-w-lg">
            A track record of consistent coding, contributions, and algorithm practice.
          </p>
        </div>

        {/* Custom CSS for Snake-like Animation and Grid Visibility */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes snakePulse {
            0% { filter: brightness(1) drop-shadow(0 0 0px transparent); transform: scale(1); }
            50% { filter: brightness(1.5) drop-shadow(0 0 4px #00ffcc); transform: scale(1.05); }
            100% { filter: brightness(1) drop-shadow(0 0 0px transparent); transform: scale(1); }
          }
          .github-calendar-container svg {
            overflow: visible;
          }
          .github-calendar-container rect {
            transition: all 0.3s ease;
            transform-origin: center;
          }
          /* Create a staggered snake-like wave effect across the grid */
          .github-calendar-container rect[data-level="1"] { animation: snakePulse 4s infinite 0.5s; }
          .github-calendar-container rect[data-level="2"] { animation: snakePulse 4s infinite 1.5s; }
          .github-calendar-container rect[data-level="3"] { animation: snakePulse 4s infinite 2.5s; }
          .github-calendar-container rect[data-level="4"] { animation: snakePulse 4s infinite 3.5s; z-index: 10; }
          
          /* Make empty cells slightly more visible with a subtle pulse */
          @keyframes subtlePulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          .github-calendar-container rect[data-level="0"] { 
            animation: subtlePulse 4s infinite;
            stroke: rgba(0, 229, 255, 0.1);
            stroke-width: 1px;
          }
        `}} />

        <div className="flex flex-col gap-12">
          {/* GitHub Activity */}
          {githubUsername && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              id="github"
              className="w-full scroll-mt-24 relative group"
            >
              {/* HUD Corners */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-all z-20" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-all z-20" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-all z-20" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-all z-20" />

              <div className="p-8 md:p-10 rounded-2xl border border-[#00e5ff]/20 bg-[#001a33]/80 backdrop-blur-md shadow-[0_0_30px_rgba(0,229,255,0.1)] flex flex-col items-center group-hover:border-[#00e5ff]/40 transition-all">
                <div className="flex items-center gap-3 mb-8 w-full justify-start border-b border-[#00e5ff]/10 pb-4">
                  <Terminal className="w-5 h-5 text-[#00ff88]" />
                  <h3 className="text-[12px] font-bold font-mono text-[#00ff88] uppercase tracking-widest">
                    [MODULE: GITHUB_CONTRIBUTIONS]
                  </h3>
                </div>
                
                <div className="w-full overflow-x-auto pb-4 flex justify-center text-white/80 font-mono text-xs custom-scrollbar">
                  <div className="min-w-max p-4 glass-card bg-[#000d1a]/50 rounded-xl border border-[#00e5ff]/20 shadow-[0_0_20px_rgba(0,229,255,0.1)] github-calendar-container">
                    <GitHubCalendar 
                      username={githubUsername} 
                      colorScheme="dark"
                      blockSize={15}
                      blockMargin={5}
                      fontSize={12}
                      theme={{
                        dark: ['#0f2942', '#00b386', '#00e6ac', '#00ffcc', '#ffffff'],
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* LeetCode Activity */}
          {leetcodeUsername && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              id="leetcode"
              className="w-full scroll-mt-24 relative group"
            >
              {/* HUD Corners */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#ff00ff]/60 group-hover:border-[#ff00ff] transition-all z-20" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#ff00ff]/60 group-hover:border-[#ff00ff] transition-all z-20" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[#ff00ff]/60 group-hover:border-[#ff00ff] transition-all z-20" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#ff00ff]/60 group-hover:border-[#ff00ff] transition-all z-20" />

              <div className="p-8 md:p-10 rounded-2xl border border-[#ff00ff]/20 bg-[#001a33]/80 backdrop-blur-md shadow-[0_0_30px_rgba(255,0,255,0.08)] flex flex-col items-center group-hover:border-[#ff00ff]/40 transition-all">
                <div className="flex items-center gap-3 mb-8 w-full justify-start border-b border-[#ff00ff]/10 pb-4">
                  <Terminal className="w-5 h-5 text-[#ff00ff]" />
                  <h3 className="text-[12px] font-bold font-mono text-[#ff00ff] uppercase tracking-widest">
                    [MODULE: LEETCODE_CONSISTENCY]
                  </h3>
                </div>
                
                <div className="w-full overflow-x-auto pb-4 flex justify-center text-white/80 font-mono text-xs custom-scrollbar">
                  <div className="w-full max-w-[800px] flex justify-center p-4 glass-card bg-[#000d1a]/50 rounded-xl border border-[#ff00ff]/20 shadow-[0_0_20px_rgba(255,0,255,0.1)]">
                    <img 
                      src={`https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=dark&font=Inter&ext=heatmap&border=0&radius=0`}
                      alt={`${leetcodeUsername}'s LeetCode Heatmap`}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contributions;
