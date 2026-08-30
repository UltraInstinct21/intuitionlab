import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

export const SortColorsVisualizer: React.FC = () => {
  const initialArr = [2, 0, 2, 1, 1, 0];
  const states: { arr: number[]; low: number; mid: number; high: number; action: string; rationale: string; codeLine: string }[] = [];

  let curArr = [...initialArr];
  let curLow = 0, curMid = 0, curHigh = curArr.length - 1;

  states.push({
    arr: [...curArr], low: curLow, mid: curMid, high: curHigh,
    action: "Initialize pointers: low=0, mid=0, high=5.",
    rationale: "Dutch National Flag maintains 4 partitions: [0..low-1] for 0s, [low..mid-1] for 1s, [mid..high] unclassified, [high+1..n-1] for 2s.",
    codeLine: "low = 0, mid = 0, high = len(nums) - 1",
  });

  while (curMid <= curHigh) {
    if (curArr[curMid] === 0) {
      [curArr[curLow], curArr[curMid]] = [curArr[curMid], curArr[curLow]];
      curLow++; curMid++;
      states.push({ arr: [...curArr], low: curLow, mid: curMid, high: curHigh,
        action: `Encountered 0 at mid. Swapped with index low. Advanced both low and mid.`,
        rationale: "0 belongs in the left partition. Place it at 'low' and expand the sorted 0 boundary.",
        codeLine: "nums[low], nums[mid] = nums[mid], nums[low]\nlow += 1; mid += 1" });
    } else if (curArr[curMid] === 1) {
      curMid++;
      states.push({ arr: [...curArr], low: curLow, mid: curMid, high: curHigh,
        action: `Encountered 1. No swap needed. Advanced mid.`,
        rationale: "1 is already in its correct middle partition, so just increment mid.",
        codeLine: "mid += 1" });
    } else {
      [curArr[curMid], curArr[curHigh]] = [curArr[curHigh], curArr[curMid]];
      curHigh--;
      states.push({ arr: [...curArr], low: curLow, mid: curMid, high: curHigh,
        action: `Encountered 2 at mid. Swapped with high. Decremented high.`,
        rationale: "2 belongs in the right partition. Swap to high and decrement. Do NOT increment mid yet.",
        codeLine: "nums[mid], nums[high] = nums[high], nums[mid]\nhigh -= 1" });
    }
  }

  const [stepIdx, setStepIdx] = useState(0);
  const cur = states[stepIdx];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="default" onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx === 0} className="h-8 px-2.5 text-xs">
            <ChevronLeft className="w-4 h-4" /><span>prev</span>
          </Button>
          <Button size="sm" variant="primary" onClick={() => setStepIdx(Math.min(states.length - 1, stepIdx + 1))} disabled={stepIdx === states.length - 1} className="h-8 px-3 text-xs">
            <span>{stepIdx === states.length - 1 ? 'complete!' : 'next step'}</span><ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setStepIdx(0)} className="h-8"><RotateCcw className="w-3.5 h-3.5" /></Button>
        </div>
        <div className="flex items-center gap-3 text-xs md:text-sm font-mono font-bold">
          <span className="text-[#93000a]">low: {cur.low}</span>
          <span className="text-sky-sticker">mid: {cur.mid}</span>
          <span className="text-burnt-sienna">high: {cur.high}</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40">
        <div className="flex items-end gap-3 flex-wrap justify-center">
          {cur.arr.map((val, idx) => {
            const isLow = idx === cur.low, isMid = idx === cur.mid, isHigh = idx === cur.high;
            const colorClass = val === 0 ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]'
              : val === 1 ? 'bg-cream-paper text-charcoal border-charcoal'
              : 'bg-primary-fixed text-burnt-sienna border-marker-orange';
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className="h-6 flex items-center justify-center gap-0.5 font-mono text-xs font-bold">
                  {isLow && <span className="bg-[#ba1a1a] text-white px-1.5 rounded-xs">L</span>}
                  {isMid && <span className="bg-sky-sticker text-white px-1.5 rounded-xs">M</span>}
                  {isHigh && <span className="bg-sprout-sticker text-white px-1.5 rounded-xs">H</span>}
                </div>
                <div className={`w-14 h-16 md:w-16 md:h-18 flex items-center justify-center font-mono font-bold text-xl rounded-lg border-2 shadow-hard transition-all duration-300 ${colorClass} ${isMid ? 'ring-2 ring-marker-orange scale-105' : ''}`}>
                  {val}
                </div>
                <span className="text-xs font-mono text-on-surface-variant font-medium">idx {idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      <StepCard
        stepNumber={stepIdx + 1} totalSteps={states.length}
        title={`Iteration ${stepIdx + 1}`}
        whatHappens={cur.action} whyRationale={cur.rationale}
        variableStates={{ low: cur.low, mid: cur.mid, high: cur.high, "nums[mid]": cur.mid < cur.arr.length ? cur.arr[cur.mid] : "OOB" }}
        codeSnippet={cur.codeLine} timeSpaceImpact="Time: O(N) | Space: O(1)"
      />
    </div>
  );
};