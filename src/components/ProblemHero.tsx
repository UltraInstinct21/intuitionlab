import React from 'react';
import { Problem } from '@/types/problem';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Clock, HardDrive, Compass, Sparkles } from 'lucide-react';

import { FormattedText } from '@/components/FormattedText';

interface ProblemHeroProps {
  problem: Problem;
}

export const ProblemHero: React.FC<ProblemHeroProps> = ({ problem }) => {
  return (
    <section className="space-y-6">
      {/* Top Badges: Difficulty, Problem #, Topic Tags */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge variant={problem.difficulty.toLowerCase() as any} className="text-sm px-3.5 py-1">
          {problem.difficulty}
        </Badge>

        {problem.number && (
          <Badge variant="default" className="text-sm px-3.5 py-1 font-mono font-bold">
            #{problem.number}
          </Badge>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {problem.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-dew-drop border border-outline/30 rounded-pill text-xs md:text-sm font-mono text-on-surface-variant font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Chunky Lowercase Display Title with Floating Sticker */}
      <div className="relative">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold lowercase text-charcoal tracking-tight leading-[1.02] break-words">
          {problem.title}
        </h1>

        {/* Playful Floating Illustrated Stickers */}
        <div className="absolute -top-6 right-2 sm:right-10 flex items-center gap-2.5 pointer-events-none select-none">
          <div className="w-11 h-11 rounded-full bg-primary-container text-on-primary-container border-[1.5px] border-charcoal flex items-center justify-center font-bold text-base shadow-hard rotate-12">
            ★
          </div>
          <div className="w-10 h-10 rounded-md bg-bubblegum-sticker text-white border-[1.5px] border-charcoal flex items-center justify-center text-sm font-bold shadow-sm -rotate-6 hidden sm:flex">
            ♥
          </div>
        </div>
      </div>

      {/* Problem Statement Card */}
      <div className="rounded-xl border-[1.5px] border-charcoal bg-surface p-6 sm:p-8 shadow-hard relative overflow-hidden">
        {/* Paper margin accent */}
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-marker-orange" />

        <div className="flex items-center gap-2.5 mb-3.5">
          <Compass className="w-5 h-5 text-marker-orange" />
          <h3 className="font-display text-lg sm:text-xl font-bold lowercase text-charcoal">
            problem statement
          </h3>
        </div>

        <FormattedText
          text={problem.problemStatement}
          className="font-sans text-base sm:text-lg leading-relaxed text-cocoa-ink"
        />

        {/* Expected Complexity Chips */}
        <div className="mt-6 pt-4 border-t border-outline/20 flex flex-wrap items-center gap-6 text-sm font-mono">
          <div className="flex items-center gap-2 text-cocoa-ink">
            <Clock className="w-4 h-4 text-marker-orange" />
            <span className="text-on-surface-variant font-medium">expected time:</span>
            <span className="font-bold text-charcoal">{problem.expectedComplexities?.time || 'O(N)'}</span>
          </div>

          <div className="flex items-center gap-2 text-cocoa-ink">
            <HardDrive className="w-4 h-4 text-sky-sticker" />
            <span className="text-on-surface-variant font-medium">expected space:</span>
            <span className="font-bold text-charcoal">{problem.expectedComplexities?.space || 'O(1)'}</span>
          </div>
        </div>
      </div>

      {/* Intuition & Key Insight Banner (Rendered clearly from md files) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problem.intuition && (
          <div className="rounded-xl border-[1.5px] border-charcoal bg-surface-container p-5 sm:p-6 shadow-hard relative">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-5 h-5 text-sky-sticker" />
              <span className="font-display text-base font-bold lowercase text-charcoal">
                intuition & core logic
              </span>
            </div>
            <FormattedText
              text={problem.intuition}
              className="font-sans text-sm sm:text-base leading-relaxed text-cocoa-ink font-medium"
            />
          </div>
        )}

        {problem.keyInsight && (
          <div className="rounded-xl border-[1.5px] border-charcoal bg-secondary-container p-5 sm:p-6 shadow-hard relative">
            <div className="flex items-center gap-2 mb-2.5">
              <Lightbulb className="w-5 h-5 text-marker-orange" />
              <span className="font-display text-base font-bold lowercase text-on-secondary-container">
                key notebook insight
              </span>
            </div>
            <FormattedText
              text={problem.keyInsight}
              className="font-sans text-sm sm:text-base leading-relaxed text-cocoa-ink font-medium"
            />
          </div>
        )}
      </div>
    </section>
  );
};
