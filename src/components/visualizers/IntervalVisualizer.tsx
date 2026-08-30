import React from 'react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';

export const IntervalVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const intervals = [
    { start: 1, end: 3, label: '[1, 3]' },
    { start: 2, end: 6, label: '[2, 6]' },
    { start: 8, end: 10, label: '[8, 10]' },
    { start: 15, end: 18, label: '[15, 18]' },
  ];
  const merged = [
    { start: 1, end: 6, label: '[1, 6]' },
    { start: 8, end: 10, label: '[8, 10]' },
    { start: 15, end: 18, label: '[15, 18]' },
  ];

  return (
    <div className="space-y-6">
      <div className="py-5 px-5 bg-cream-paper rounded-xl border border-dashed border-outline/40 space-y-6">
        <div>
          <span className="text-xs md:text-sm font-bold font-mono text-on-surface-variant block mb-2.5">Input Intervals (sorted):</span>
          <div className="space-y-2.5">
            {intervals.map((iv, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-20 text-xs md:text-sm font-mono font-bold">{iv.label}</span>
                <div className="flex-1 bg-surface-container-high h-8 rounded-lg relative border border-outline/30 overflow-hidden">
                  <div className="absolute top-0 bottom-0 bg-secondary-container border border-charcoal rounded-md flex items-center justify-center text-xs font-mono font-bold"
                    style={{ left: `${(iv.start / 18) * 90}%`, width: `${((iv.end - iv.start) / 18) * 90}%` }}>{iv.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-outline/30 pt-4">
          <span className="text-xs md:text-sm font-bold font-mono text-marker-orange block mb-2.5">Merged Result:</span>
          <div className="space-y-2.5">
            {merged.map((iv, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-28 text-xs md:text-sm font-mono font-bold">{iv.label}</span>
                <div className="flex-1 bg-surface-container-high h-9 rounded-lg relative border border-outline/30 overflow-hidden">
                  <div className="absolute top-0 bottom-0 bg-primary-container text-on-primary-container border border-charcoal rounded-md flex items-center justify-center text-xs md:text-sm font-mono font-bold shadow-sm"
                    style={{ left: `${(iv.start / 18) * 90}%`, width: `${((iv.end - iv.start) / 18) * 90}%` }}>{iv.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StepCard stepNumber={2} totalSteps={3} title="Interval Overlap Resolution"
        whatHappens="[1,3] and [2,6] overlap (2<=3). Fused to [1, max(3,6)] = [1,6]. [8,10] starts after 6, new range."
        whyRationale="Sort by start time. If current overlaps last merged, extend. Otherwise start new."
        variableStates={{ condition: "current.start <= lastMerged.end", result: "[[1,6],[8,10],[15,18]]" }}
        codeSnippet="if current[0] <= merged[-1][1]:\n    merged[-1][1] = max(merged[-1][1], current[1])\nelse:\n    merged.append(current)"
        timeSpaceImpact="O(N log N) sort + O(N) merge"
      />
    </div>
  );
};