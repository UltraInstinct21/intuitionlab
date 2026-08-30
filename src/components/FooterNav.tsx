import React from 'react';
import { Problem } from '@/types/problem';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface FooterNavProps {
  prevProblem?: Problem;
  nextProblem?: Problem;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalProblems: number;
}

export const FooterNav: React.FC<FooterNavProps> = ({
  prevProblem,
  nextProblem,
  onPrev,
  onNext,
  currentIndex,
  totalProblems,
}) => {
  return (
    <footer className="sticky bottom-0 left-0 right-0 z-30 h-16 bg-surface border-t border-charcoal/30 flex items-center justify-between px-4 sm:px-8 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] backdrop-blur-xs">
      {/* Signature Marker Orange Brand Band on Top Edge */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container" />

      {/* Prev Problem Button */}
      <button
        onClick={onPrev}
        disabled={!prevProblem}
        className="flex items-center gap-1.5 text-xs font-mono font-semibold text-cocoa-ink hover:text-marker-orange disabled:opacity-40 disabled:pointer-events-none transition-all group active:scale-95"
      >
        <ChevronLeft className="w-4 h-4 text-marker-orange group-hover:-translate-x-0.5 transition-transform" />
        <div className="flex flex-col items-start text-left">
          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">prev problem</span>
          <span className="truncate max-w-[120px] sm:max-w-[200px] lowercase hidden xs:inline-block">
            {prevProblem ? prevProblem.title : 'start of sheet'}
          </span>
        </div>
      </button>

      {/* Center Tagline */}
      <div className="flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hidden md:flex">
        <span>made with</span>
        <span className="font-bold text-marker-orange">marker orange</span>
        <span>&</span>
        <span className="font-bold text-cocoa-ink">cocoa ink</span>
        <span className="text-primary-container">✦</span>
      </div>

      {/* Next Problem Button */}
      <button
        onClick={onNext}
        disabled={!nextProblem}
        className="flex items-center gap-1.5 text-xs font-mono font-semibold text-cocoa-ink hover:text-marker-orange disabled:opacity-40 disabled:pointer-events-none transition-all group active:scale-95 text-right"
      >
        <div className="flex flex-col items-end text-right">
          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">next problem</span>
          <span className="truncate max-w-[120px] sm:max-w-[200px] lowercase hidden xs:inline-block">
            {nextProblem ? nextProblem.title : 'end of sheet'}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-marker-orange group-hover:translate-x-0.5 transition-transform" />
      </button>
    </footer>
  );
};
