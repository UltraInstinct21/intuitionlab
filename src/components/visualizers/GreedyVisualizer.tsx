import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

export const GreedyVisualizer: React.FC = () => {
  const intervals = [[1, 3], [2, 4], [3, 5], [0, 6], [5, 7], [8, 9], [8, 10]];
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  const [selected, setSelected] = useState<number[]>([0]);
  const [stepIdx, setStepIdx] = useState(0);

  const lastEnd = sorted[selected[selected.length - 1]][1];
  const nextValid = sorted.findIndex((iv, i) => !selected.includes(i) && iv[0] >= lastEnd);

  const stepForward = () => {
    if (nextValid !== -1) {
      setSelected([...selected, nextValid]);
      setStepIdx(stepIdx + 1);
    }
  };

  const reset = () => { setSelected([0]); setStepIdx(0); };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={stepForward} disabled={nextValid === -1} className="text-xs h-8 px-3">
            select next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} className="h-8"><RotateCcw className="w-4 h-4" /></Button>
        </div>
        <span className="text-xs font-mono font-bold text-marker-orange">
          selected: {selected.length} | last end: {lastEnd}
        </span>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-mono">sorted by end time — greedy picks</span>
        <div className="space-y-2 w-full max-w-md">
          {sorted.map((iv, i) => {
            const isSelected = selected.includes(i);
            const isCandidate = i === nextValid;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="w-16 text-xs font-mono font-bold">[{iv[0]},{iv[1]}]</span>
                <div className="flex-1 bg-surface-container-high h-7 rounded-md relative border border-outline/30 overflow-hidden">
                  <div className={`absolute top-0 bottom-0 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 ${
                    isSelected ? 'bg-primary-container text-on-primary-container border border-charcoal shadow-sm'
                    : isCandidate ? 'bg-sky-100 text-sky-900 border border-sky-sticker border-dashed'
                    : 'bg-surface-container-high text-on-surface-variant border border-outline/30'
                  }`} style={{ left: `${(iv[0] / 10) * 100}%`, width: `${((iv[1] - iv[0]) / 10) * 100}%` }}></div>
                </div>
                {isSelected && <span className="text-xs font-mono font-bold text-sprout-sticker">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      <StepCard stepNumber={selected.length} totalSteps={sorted.length}
        title="Greedy: Interval Scheduling Maximization"
        whatHappens={nextValid !== -1 ? `Next valid: [${sorted[nextValid][0]},${sorted[nextValid][1]}] starts after previous ends (${lastEnd}).` : 'No more non-overlapping intervals. Maximum reached.'}
        whyRationale="Greedy strategy: always pick the interval with the earliest finish time. This maximizes count of non-overlapping intervals."
        variableStates={{ last_end: lastEnd, total_selected: selected.length, next_candidate: nextValid !== -1 ? `[${sorted[nextValid][0]},${sorted[nextValid][1]}]` : 'none' }}
        codeSnippet="intervals.sort(key=lambda x: x[1])\ncount = 1\nlast_end = intervals[0][1]\nfor i in range(1, n):\n    if intervals[i][0] >= last_end:\n        count += 1\n        last_end = intervals[i][1]"
        timeSpaceImpact="Time: O(N log N) | Space: O(1)"
      />
    </div>
  );
};