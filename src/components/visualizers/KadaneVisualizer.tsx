import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';

export const KadaneVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const defaultNums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

  const nums = (() => {
    if (problem.examples?.[0]?.input) {
      const match = problem.examples[0].input.match(/\[(-?\d+(?:\s*,\s*-?\d+)*)\]/);
      if (match) {
        const parsed = match[1].split(',').map(Number).filter(n => !isNaN(n));
        if (parsed.length >= 2) return parsed;
      }
    }
    return defaultNums;
  })();

  const states: { idx: number; val: number; currentSum: number; maxSum: number; action: string; rationale: string; codeLine: string; range: [number, number] }[] = [];
  let cur = 0, maxS = -Infinity, start = 0, bestStart = 0, bestEnd = 0;

  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    let action = '', rationale = '';
    if (i === 0) { cur = val; maxS = val; start = 0; bestStart = 0; bestEnd = 0;
      action = `Initialize current_sum = ${val} and max_sum = ${val}.`;
      rationale = "The only non-empty subarray is [nums[0]].";
    } else if (cur + val < val) { cur = val; start = i;
      action = `Previous sum (${cur - val}) + ${val} < ${val}. Starting fresh from index ${i}.`;
      rationale = "Negative accumulated sum drags down future subarrays. Start new.";
    } else { cur += val;
      action = `Extended subarray: previous (${cur - val}) + ${val} = ${cur}.`;
      rationale = "Previous sum was positive, extending gives larger sum.";
    }
    if (cur > maxS) { maxS = cur; bestStart = start; bestEnd = i; action += ` Updated max_sum to ${maxS}!`; }
    states.push({ idx: i, val, currentSum: cur, maxSum: maxS, action, rationale,
      codeLine: `current_sum = max(nums[${i}], current_sum + nums[${i}])\nmax_sum = max(max_sum, current_sum)`,
      range: [bestStart, bestEnd] });
  }

  const [stepIdx, setStepIdx] = useState(0);
  const s = states[stepIdx];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="default" onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx === 0} className="h-8 px-2.5 text-xs">
            <ChevronLeft className="w-4 h-4" /><span>prev</span>
          </Button>
          <Button size="sm" variant="primary" onClick={() => setStepIdx(Math.min(states.length - 1, stepIdx + 1))} disabled={stepIdx === states.length - 1} className="h-8 px-3 text-xs">
            <span>{stepIdx === states.length - 1 ? 'end' : 'next'}</span><ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setStepIdx(0)} className="h-8"><RotateCcw className="w-3.5 h-3.5" /></Button>
        </div>
        <div className="flex items-center gap-4 text-xs md:text-sm font-mono font-bold">
          <span className="text-cocoa-ink">current: {s.currentSum}</span>
          <span className="text-marker-orange bg-primary-fixed-dim/60 px-3 py-1 rounded-pill border border-marker-orange">max: {s.maxSum}</span>
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {nums.map((n, i) => {
            const isCurrent = i === s.idx;
            const inMax = i >= s.range[0] && i <= s.range[1];
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-12 h-14 md:w-14 md:h-16 flex items-center justify-center font-mono font-bold text-base md:text-lg rounded-lg border transition-all duration-200 ${
                  isCurrent ? 'border-2 border-marker-orange bg-primary-fixed scale-110 shadow-hard'
                  : inMax ? 'border-2 border-charcoal bg-secondary-container shadow-sm'
                  : 'border-outline/40 bg-surface-container text-on-surface-variant'
                }`}>{n}</div>
                <span className="text-[10px] md:text-xs font-mono text-on-surface-variant font-medium">i={i}</span>
              </div>
            );
          })}
        </div>
      </div>

      <StepCard
        stepNumber={stepIdx + 1} totalSteps={states.length}
        title={`Evaluating nums[${s.idx}] = ${s.val}`}
        whatHappens={s.action} whyRationale={s.rationale}
        variableStates={{ i: s.idx, "nums[i]": s.val, current_sum: s.currentSum, max_sum: s.maxSum, best: `nums[${s.range[0]}..${s.range[1]}]` }}
        codeSnippet={s.codeLine} timeSpaceImpact="Time: O(N) | Space: O(1)"
      />
    </div>
  );
};