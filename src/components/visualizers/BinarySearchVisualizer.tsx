import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';

export const BinarySearchVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const defaultArr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

  const arr = (() => {
    if (problem.examples?.[0]?.input) {
      const match = problem.examples[0].input.match(/\[(-?\d+(?:\s*,\s*-?\d+)*)\]/);
      if (match) {
        const parsed = match[1].split(',').map(Number).filter(n => !isNaN(n));
        if (parsed.length >= 3 && parsed.every((v, i, a) => i === 0 || v >= a[i - 1])) return parsed;
      }
    }
    return defaultArr;
  })();

  const defaultTarget = 23;
  const target = (() => {
    if (problem.examples?.[0]?.input) {
      const match = problem.examples[0].input.match(/target\s*=\s*(-?\d+)/i);
      if (match) return parseInt(match[1]);
    }
    return defaultTarget;
  })();

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(arr.length - 1);
  const [found, setFound] = useState(false);
  const [done, setDone] = useState(false);

  const mid = Math.floor((left + right) / 2);

  const stepForward = () => {
    if (done) return;
    const m = Math.floor((left + right) / 2);
    if (arr[m] === target) {
      setFound(true);
      setDone(true);
    } else if (arr[m] < target) {
      setLeft(m + 1);
    } else {
      setRight(m - 1);
    }
  };

  const reset = () => { setLeft(0); setRight(arr.length - 1); setFound(false); setDone(false); };

  const searchComplete = done && found;
  const searchFailed = left > right && !found;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={reset} className="text-xs h-8 px-3">
            <RotateCcw className="w-4 h-4 mr-1" />reset
          </Button>
          <Button size="sm" variant="primary" onClick={stepForward} disabled={done} className="text-xs h-8 px-3">
            step
          </Button>
        </div>
        <span className="text-xs md:text-sm font-mono font-bold text-marker-orange">
          target: {target} | {searchComplete ? `found at index ${mid}` : searchFailed ? 'not found' : `searching...`}
        </span>
      </div>

      <div className="py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6">
        <div className="flex items-center justify-center gap-1 md:gap-1.5 flex-wrap">
          {arr.map((val, idx) => {
            const inRange = idx >= left && idx <= right;
            const isMid = idx === mid && inRange && !done;
            const isFound = searchComplete && idx === mid;
            const isEliminated = !inRange;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className="h-5 text-xs font-mono font-bold">
                  {isMid && !searchComplete && <span className="bg-sky-sticker text-white px-1.5 rounded-pill">mid</span>}
                  {isFound && <span className="bg-sprout-sticker text-white px-1.5 rounded-pill">mid</span>}
                </div>
                <div className={`w-11 h-13 md:w-13 md:h-15 flex items-center justify-center font-mono font-bold text-sm md:text-base rounded-lg border-2 transition-all duration-300 ${
                  isFound ? 'border-sprout-sticker bg-[#22c55e]/15 shadow-md scale-110'
                  : isMid ? 'border-sky-sticker bg-sky-100 shadow-sm'
                  : isEliminated ? 'border-outline/30 bg-surface-container-high text-on-surface-variant opacity-50 line-through'
                  : 'border-charcoal bg-surface text-charcoal'
                }`}>{val}</div>
                <span className="text-[10px] font-mono text-on-surface-variant">[{idx}]</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="bg-sprout-sticker text-white px-2 py-0.5 rounded-pill">L={left}</span>
          <span className="bg-sky-sticker text-white px-2 py-0.5 rounded-pill">R={right}</span>
        </div>
      </div>

      <StepCard
        stepNumber={left + 1} totalSteps={arr.length}
        title={searchComplete ? `Found target ${target} at index ${mid}` : searchFailed ? 'Target not found' : `Checking mid=${mid}`}
        whatHappens={searchComplete ? `arr[${mid}] == ${target}. Return mid.` : searchFailed ? 'left > right. Target absent.' : arr[mid] < target ? `arr[${mid}]=${arr[mid]} < ${target}. Discard left half.` : `arr[${mid}]=${arr[mid]} > ${target}. Discard right half.`}
        whyRationale={searchComplete ? 'Binary search converges to exact match.' : 'Eliminate half the search space each step.'}
        variableStates={{ L: left, R: right, M: mid, "arr[M]": arr[mid] ?? 'OOB', target }}
        codeSnippet="while L <= R:\n    mid = (L + R) // 2\n    if arr[mid] == target: return mid\n    elif arr[mid] < target: L = mid + 1\n    else: R = mid - 1"
        timeSpaceImpact="Time: O(log N) | Space: O(1)"
      />
    </div>
  );
};