'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Hero } from '@/types';

const GitHubCalendar = dynamic(() =>
  import('react-github-calendar').then((mod) => mod.GitHubCalendar),
  { ssr: false, loading: () => <div className="h-32 w-full animate-pulse bg-black/5 rounded-xl" /> }
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
    <section className="py-16 md:py-20 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
           <div className="px-3 py-1 bg-accent-light border border-accent-primary/10 text-accent-primary text-xs font-bold tracking-widest uppercase rounded-full">
            Continuous Learning
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-text-primary tracking-tight">
            Open Source & Problem Solving
          </h2>
          <p className="text-sm text-text-tertiary max-w-md">
            A track record of consistent coding, contributions, and algorithm practice.
          </p>
        </div>

        <div className="flex flex-col gap-20 pt-8">
          {/* GitHub Activity */}
          {githubUsername && (
            <div id="github" className="flex flex-col items-center w-full scroll-mt-24">
              <h3 className="text-xl md:text-2xl font-bold font-display text-text-primary mb-8 tracking-tight">GitHub Contributions</h3>
              <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border-default scrollbar-track-transparent flex justify-center">
                <div className="min-w-max p-4">
                  <GitHubCalendar 
                    username={githubUsername} 
                    colorScheme="light"
                    blockSize={16}
                    blockMargin={6}
                    fontSize={14}
                    theme={{
                      light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* LeetCode Activity */}
          {leetcodeUsername && (
            <div id="leetcode" className="flex flex-col items-center w-full scroll-mt-24">
              <h3 className="text-xl md:text-2xl font-bold font-display text-text-primary mb-8 tracking-tight">LeetCode Consistency</h3>
              
              <div className="w-full overflow-x-auto pb-4 flex justify-center scrollbar-thin scrollbar-thumb-border-default scrollbar-track-transparent">
                <div className="w-full flex justify-center">
                  <img 
                    src={`https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=light&font=Inter&ext=heatmap&border=0&radius=0`}
                    alt={`${leetcodeUsername}'s LeetCode Heatmap`}
                    className="w-full max-w-[750px] h-auto object-contain mix-blend-multiply"
                    loading="lazy"
                  />
                </div>
              </div>


            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contributions;
