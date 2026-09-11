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
                <div className="flex items-center gap-3 mb-8 w-full justify-between border-b border-[#00e5ff]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-[#00ff88]" />
                    <h3 className="text-[12px] font-bold font-mono text-[#00ff88] uppercase tracking-widest">
                      [MODULE: GITHUB_CONTRIBUTIONS]
                    </h3>
                  </div>
                  <a
                    href={hero?.github_url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono text-[#00ff88] border border-[#00ff88]/40 bg-[#00ff88]/5 hover:bg-[#00ff88]/15 hover:border-[#00ff88] hover:shadow-[0_0_10px_rgba(0,255,136,0.3)] transition-all duration-200 whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    View Profile →
                  </a>
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
                <div className="flex items-center gap-3 mb-8 w-full justify-between border-b border-[#ff00ff]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-[#ff00ff]" />
                    <h3 className="text-[12px] font-bold font-mono text-[#ff00ff] uppercase tracking-widest">
                      [MODULE: LEETCODE_CONSISTENCY]
                    </h3>
                  </div>
                  <a
                    href={hero?.leetcode_url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono text-[#ff00ff] border border-[#ff00ff]/40 bg-[#ff00ff]/5 hover:bg-[#ff00ff]/15 hover:border-[#ff00ff] hover:shadow-[0_0_10px_rgba(255,0,255,0.3)] transition-all duration-200 whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>
                    View Profile →
                  </a>
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
