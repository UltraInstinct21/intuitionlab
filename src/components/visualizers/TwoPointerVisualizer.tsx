import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';

export const TwoPointerVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const defaultArr = [2, 7, 11, 15];
  const defaultTarget = 9;

  const arr = (() => {
    if (problem.examples?.[0]?.input) {
      const match = problem.examples[0].input.match(/\[(-?\d+(?:\s*,\s*-?\d+)*)\]/);
      if (match) {
        const parsed = match[1].split(',').map(Number).filter(n => !isNaN(n));
        if (parsed.length >= 2) return parsed;
      }
    }
    return defaultArr;
  })();

  const target = (() => {
    if (problem.examples?.[0]?.input) {
      const match = problem.examples[0].input.match(/target\s*=\s*(-?\d+)/i);
      if (match) return parseInt(match[1]);
    }
    return defaultTarget;
  })();

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(arr.length - 1);
  const sum = arr[left] + arr[right];

  let actionText = '', rationaleText = '';
  if (sum === target) { actionText = `Found! arr[${left}](${arr[left]}) + arr[${right}](${arr[right]}) == ${target}.`; rationaleText = "Target reached."; }
  else if (sum < target) { actionText = `Sum ${sum} < target ${target}. left++.`; rationaleText = "Sorted array: increment left increases sum."; }
  else { actionText = `Sum ${sum} > target ${target}. right--.`; rationaleText = "Sorted array: decrement right decreases sum."; }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2.5">
          <Button size="sm" variant="primary" onClick={() => {
            if (sum < target && left < right - 1) setLeft(l => l + 1);
            else if (sum > target && right > left + 1) setRight(r => r - 1);
          }} disabled={sum === target} className="text-xs h-8 px-3">
            {sum === target ? 'found!' : sum < target ? 'left++' : 'right--'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setLeft(0); setRight(arr.length - 1); }} className="h-8"><RotateCcw className="w-4 h-4" /></Button>
        </div>
        <span className="text-xs md:text-sm font-mono font-bold text-marker-orange">
          arr[{left}]({arr[left]}) + arr[{right}]({arr[right]}) = {sum} {sum === target ? `== ${target}` : `(target: ${target})`}
        </span>
      </div>

      <div className="py-8 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        <div className="flex items-end gap-4 flex-wrap justify-center">
          {arr.map((val, idx) => {
            const isL = idx === left, isR = idx === right, isMatch = sum === target && (isL || isR);
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className="h-6 text-xs font-mono font-bold">
                  {isL && <span className="bg-sky-sticker text-white px-2 py-0.5 rounded">L</span>}
                  {isR && <span className="bg-sprout-sticker text-white px-2 py-0.5 rounded">R</span>}
                </div>
                <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-mono font-bold text-lg rounded-lg border-2 shadow-hard transition-all duration-300 ${
                  isMatch ? 'border-marker-orange bg-primary-container text-on-primary-container scale-105'
                  : isL || isR ? 'border-charcoal bg-secondary-container'
                  : 'border-outline/40 bg-surface-container'
                }`}>{val}</div>
                <span className="text-xs font-mono text-on-surface-variant">idx {idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      <StepCard stepNumber={left + (arr.length - 1 - right) + 1} totalSteps={arr.length}
        title={`Pointers: left=${left}, right=${right}`}
        whatHappens={actionText} whyRationale={rationaleText}
        variableStates={{ left, right, "arr[left]": arr[left], "arr[right]": arr[right], sum, target }}
        codeSnippet="if sum == target: return [left, right]\nelif sum < target: left += 1\nelse: right -= 1"
        timeSpaceImpact="Time: O(N) | Space: O(1)"
      />
    </div>
  );
};