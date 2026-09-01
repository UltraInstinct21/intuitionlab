import React from 'react';
import { Problem } from '@/types/problem';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <footer className="w-full mt-12 mb-6 rounded-2xl border-[1.5px] border-charcoal bg-surface p-4 sm:p-6 shadow-hard flex flex-wrap items-center justify-between gap-4">
      {/* Prev Problem Button */}
      <button
        onClick={onPrev}
        disabled={!prevProblem}
        className="flex items-center gap-2 text-xs font-mono font-semibold text-cocoa-ink hover:text-marker-orange disabled:opacity-40 disabled:pointer-events-none transition-all group active:scale-95 px-3 py-2 rounded-xl bg-dew-drop border border-outline/30"
      >
        <ChevronLeft className="w-4 h-4 text-marker-orange group-hover:-translate-x-0.5 transition-transform" />
        <div className="flex flex-col items-start text-left">
          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">prev problem</span>
          <span className="truncate max-w-[120px] sm:max-w-[200px] lowercase font-bold text-charcoal hidden xs:inline-block">
            {prevProblem ? prevProblem.title : 'start of sheet'}
          </span>
        </div>
      </button>

      {/* Center Tagline */}
      <div className="flex items-center gap-1.5 text-xs font-mono text-on-surface-variant">
        <span>made with</span>
        <span className="font-bold text-marker-orange">marker orange</span>
        <span>&</span>
        <span className="font-bold text-cocoa-ink">cocoa ink</span>
        <span className="text-marker-orange">✦</span>
      </div>

      {/* Next Problem Button */}
      <button
        onClick={onNext}
        disabled={!nextProblem}
        className="flex items-center gap-2 text-xs font-mono font-semibold text-cocoa-ink hover:text-marker-orange disabled:opacity-40 disabled:pointer-events-none transition-all group active:scale-95 text-right px-3 py-2 rounded-xl bg-dew-drop border border-outline/30"
      >
        <div className="flex flex-col items-end text-right">
          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">next problem</span>
          <span className="truncate max-w-[120px] sm:max-w-[200px] lowercase font-bold text-charcoal hidden xs:inline-block">
            {nextProblem ? nextProblem.title : 'end of sheet'}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-marker-orange group-hover:translate-x-0.5 transition-transform" />
      </button>
    </footer>
  );
};
