import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';

interface KadaneStep {
  title: string;
  whatHappens: string;
  whyRationale: string;
  arrayState: number[];
  activeIdx?: number;
  highlightRange?: [number, number];
  states: Record<string, string | number | boolean | undefined>;
  codeSnippet: string;
  impact?: string;
}

function buildKadaneSteps(problem: Problem): KadaneStep[] {
  const t = (problem.title || '').toLowerCase();

  // 1. Best Time to Buy and Sell Stock
  if (t.includes('best time to buy and sell stock') || t.includes('stock')) {
    const prices = [7, 1, 5, 3, 6, 4];
    return [
      {
        title: 'Step 1: Day 0 (Price = 7)',
        whatHappens: 'Initialize min_price = 7, max_profit = 0.',
        whyRationale: 'Cannot sell on day 0. Record first price as baseline minimum purchase price.',
        arrayState: prices,
        activeIdx: 0,
        states: { day: 0, price: 7, min_price: 7, max_profit: 0 },
        codeSnippet: 'min_price = float("inf")\nmax_profit = 0',
        impact: 'Time: O(N) | Space: O(1)',
      },
      {
        title: 'Step 2: Day 1 (Price = 1) -> New Lowest Price',
        whatHappens: 'Price 1 < min_price (7) → Update min_price = 1. Profit if sold today = 0.',
        whyRationale: 'Buying at 1 gives the highest profit potential for all future selling days.',
        arrayState: prices,
        activeIdx: 1,
        states: { day: 1, price: 1, min_price: 1, max_profit: 0 },
        codeSnippet: 'min_price = min(min_price, price) # min_price = 1',
      },
      {
        title: 'Step 3: Day 4 (Price = 6) -> Maximum Profit Found',
        whatHappens: 'Profit = price (6) - min_price (1) = 5. Max profit updated from 4 to 5!',
        whyRationale: 'Buying on Day 1 (price 1) and selling on Day 4 (price 6) yields maximum profit 5.',
        arrayState: prices,
        activeIdx: 4,
        highlightRange: [1, 4],
        states: { buyDay: 1, sellDay: 4, buyPrice: 1, sellPrice: 6, max_profit: 5 },
        codeSnippet: 'max_profit = max(max_profit, price - min_price) # max_profit = 5',
      },
      {
        title: 'Step 4: Return Max Profit = 5',
        whatHappens: 'Day 5 (price 4): profit = 4 - 1 = 3 < 5. Algorithm completes with max_profit = 5.',
        whyRationale: 'Single linear pass computes global optimal buy/sell transaction.',
        arrayState: prices,
        highlightRange: [1, 4],
        states: { finalProfit: 5 },
        codeSnippet: 'return max_profit # 5',
      },
    ];
  }

  // 2. Maximum Product Subarray
  if (t.includes('product subarray')) {
    const nums = [2, 3, -2, 4];
    return [
      {
        title: 'Step 1: Track Max Product & Min Product',
        whatHappens: 'nums = [2, 3, -2, 4]. Start: max_prod = 2, min_prod = 2, res = 2.',
        whyRationale: 'Multiplying by a negative number flips max and min: a negative number * min_prod could yield a huge positive max.',
        arrayState: nums,
        activeIdx: 0,
        states: { num: 2, max_prod: 2, min_prod: 2, globalMax: 2 },
        codeSnippet: 'max_prod = min_prod = res = nums[0]',
        impact: 'Time: O(N) | Space: O(1)',
      },
      {
        title: 'Step 2: Process 3 (nums[1])',
        whatHappens: 'max_prod = max(3, 2*3, 2*3) = 6. min_prod = min(3, 2*3, 2*3) = 3. res = 6.',
        whyRationale: 'Subarray [2, 3] gives product 6.',
        arrayState: nums,
        activeIdx: 1,
        states: { num: 3, max_prod: 6, min_prod: 3, globalMax: 6 },
        codeSnippet: 'temp_max = max(n, max_prod * n, min_prod * n)\nmin_prod = min(n, max_prod * n, min_prod * n)',
      },
      {
        title: 'Step 3: Process -2 (Negative Number Inverts Bounds)',
        whatHappens: 'max_prod becomes max(-2, 6*-2, 3*-2) = -2. min_prod becomes min(-2, 6*-2, 3*-2) = -12. res stays 6.',
        whyRationale: 'Negative value stores -12 in min_prod, ready to flip if another negative appears.',
        arrayState: nums,
        activeIdx: 2,
        states: { num: -2, max_prod: -2, min_prod: -12, globalMax: 6 },
        codeSnippet: 'max_prod, min_prod = temp_max, temp_min',
      },
      {
        title: 'Step 4: Final Max Product Subarray = 6',
        whatHappens: 'nums[3] = 4. max_prod becomes max(4, -2*4, -12*4) = 4. Global max product is 6 from [2, 3].',
        whyRationale: 'Tracking both min and max handles any number of sign inversions in O(N).',
        arrayState: nums,
        activeIdx: 3,
        highlightRange: [0, 1],
        states: { result: 6 },
        codeSnippet: 'return res # 6',
      },
    ];
  }

  // 3. Default Kadane: Maximum Subarray
  const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  return [
    {
      title: 'Step 1: Start at Index 0 (val = -2)',
      whatHappens: 'curr_sum = -2. max_sum = -2. Since curr_sum < 0, reset curr_sum = 0.',
      whyRationale: 'A negative prefix will only reduce the sum of any subsequent subarray. Drop it immediately.',
      arrayState: arr,
      activeIdx: 0,
      states: { curr_sum: -2, max_sum: -2, reset: 'true' },
      codeSnippet: 'curr_sum += num\nmax_sum = max(max_sum, curr_sum)\nif curr_sum < 0: curr_sum = 0',
      impact: 'Time: O(N) | Space: O(1)',
    },
    {
      title: 'Step 2: Start Optimal Subarray at Index 3 (val = 4)',
      whatHappens: 'curr_sum becomes 4. max_sum updated to 4. New candidate window begins.',
      whyRationale: 'Element 4 starts a fresh positive accumulation window.',
      arrayState: arr,
      activeIdx: 3,
      highlightRange: [3, 3],
      states: { curr_sum: 4, max_sum: 4, window_start: 3 },
      codeSnippet: 'curr_sum = 4 # Starting window',
    },
    {
      title: 'Step 3: Accumulate through Index 6 [4, -1, 2, 1]',
      whatHappens: 'curr_sum reaches 4 + (-1) + 2 + 1 = 6. Global max_sum updated to 6!',
      whyRationale: 'Peak sum of 6 achieved spanning subarray [4, -1, 2, 1] (indices 3 to 6).',
      arrayState: arr,
      activeIdx: 6,
      highlightRange: [3, 6],
      states: { curr_sum: 6, max_sum: 6, best_window: '[3..6]' },
      codeSnippet: 'max_sum = max(max_sum, curr_sum) # max_sum = 6',
    },
    {
      title: 'Step 4: Complete Scan with Global Maximum = 6',
      whatHappens: 'Scanned remaining elements. Global maximum subarray sum is 6.',
      whyRationale: 'Kadane algorithm guarantees finding optimal continuous subarray in single linear pass.',
      arrayState: arr,
      highlightRange: [3, 6],
      states: { max_subarray_sum: 6 },
      codeSnippet: 'return max_sum # 6',
    },
  ];
}

export const KadaneVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const steps = buildKadaneSteps(problem);
  const cur = steps[step] || steps[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="default" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="h-8 px-2.5 text-xs">
            <ChevronLeft className="w-4 h-4" /><span>prev</span>
          </Button>
          <Button size="sm" variant="primary" onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} className="h-8 px-3 text-xs">
            <span>{step === steps.length - 1 ? 'completed!' : 'next step →'}</span><ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setStep(0)} className="h-8"><RotateCcw className="w-3.5 h-3.5" /></Button>
        </div>
        <div className="text-xs md:text-sm font-mono flex items-center gap-3">
          <span className="text-marker-orange font-bold">step {step + 1} of {steps.length}</span>
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6 overflow-x-auto select-none">
        <div className="flex flex-wrap items-center justify-center gap-2.5 min-w-max">
          {cur.arrayState.map((val, idx) => {
            const isCurrent = cur.activeIdx === idx;
            const inHighlight = cur.highlightRange && idx >= cur.highlightRange[0] && idx <= cur.highlightRange[1];

            const valStr = String(val);
            const isLong = valStr.length > 3;

            return (
              <div key={idx} className="flex flex-col items-center gap-1 min-w-[48px]">
                <div
                  className={`min-w-[48px] px-2 h-14 md:h-16 flex items-center justify-center font-mono font-bold rounded-xl border-2 transition-all duration-200 overflow-hidden text-center ${
                    isLong ? 'text-xs md:text-sm' : 'text-base md:text-lg'
                  } ${
                    isCurrent
                      ? 'border-marker-orange bg-primary-fixed scale-110 shadow-hard text-charcoal'
                      : inHighlight
                      ? 'border-sprout-sticker bg-[#22c55e]/15 text-charcoal shadow-sm'
                      : 'border-charcoal bg-surface text-charcoal'
                  }`}
                >
                  <span className="truncate max-w-full">{val}</span>
                </div>
                <span className="text-[10px] md:text-xs font-mono text-on-surface-variant font-medium">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      <StepCard
        stepNumber={step + 1}
        totalSteps={steps.length}
        title={cur.title}
        whatHappens={cur.whatHappens}
        whyRationale={cur.whyRationale}
        variableStates={cur.states}
        codeSnippet={cur.codeSnippet}
        timeSpaceImpact={cur.impact || 'Time: O(N) | Space: O(1)'}
      />
    </div>
  );
};