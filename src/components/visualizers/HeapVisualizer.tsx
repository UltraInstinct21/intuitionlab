import React, { useState } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

interface HeapStep {
  title: string;
  whatHappens: string;
  whyRationale: string;
  heapNodes: number[];
  extraElements?: { label: string; val: number | string }[];
  states: Record<string, string | number | boolean | undefined>;
  codeSnippet: string;
  impact?: string;
}

function buildHeapSteps(problem?: Problem): HeapStep[] {
  const t = (problem?.title || '').toLowerCase();

  // 1. Kth Largest Element in an Array
  if (t.includes('kth largest')) {
    return [
      {
        title: 'Maintain Min-Heap of Size K=3',
        whatHappens: 'Input: [3, 2, 1, 5, 6, 4], k=3. Push first 3 elements [3, 2, 1] into min-heap → heap becomes [1, 2, 3].',
        whyRationale: 'A min-heap of size k always keeps the top k largest elements seen so far at the root (smallest of the top k).',
        heapNodes: [1, 2, 3],
        states: { heap: '[1, 2, 3]', k: 3, rootSmallest: 1 },
        codeSnippet: 'heap = []\nfor num in nums:\n    heappush(heap, num)\n    if len(heap) > k: heappop(heap)',
        impact: 'Time: O(N log K) | Space: O(K)',
      },
      {
        title: 'Push 5: Size > K → Pop Min (1)',
        whatHappens: 'Push 5 into heap: [1, 2, 3, 5]. Size is 4 > 3 → Pop min (1). Heap becomes [2, 5, 3].',
        whyRationale: 'Discarding the smallest element ensures heap holds the 3 largest elements: [2, 3, 5].',
        heapNodes: [2, 5, 3],
        states: { popped: 1, heap: '[2, 5, 3]', root: 2 },
        codeSnippet: 'heappush(heap, 5) # [1, 2, 3, 5]\nheappop(heap) # 1 popped -> [2, 5, 3]',
      },
      {
        title: 'Push 6 & 4: Final Heap [4, 5, 6]',
        whatHappens: 'Push 6, pop 2. Push 4, pop 3. Final min-heap contains [4, 5, 6].',
        whyRationale: 'The root of the min-heap (4) is the 3rd largest element overall!',
        heapNodes: [4, 5, 6],
        states: { heap: '[4, 5, 6]', kthLargest: 4 },
        codeSnippet: 'return heap[0] # Returns 4 (3rd largest)',
      },
    ];
  }

  // 2. Find Median from Data Stream
  if (t.includes('median')) {
    return [
      {
        title: 'Two Heaps: Max-Heap (Left) & Min-Heap (Right)',
        whatHappens: 'Max-heap `left` stores smaller half. Min-heap `right` stores larger half.',
        whyRationale: 'Median is either root of `left` (odd count) or average of both roots (even count).',
        heapNodes: [2, 1],
        extraElements: [{ label: 'Left Max-Heap', val: 'root: 2' }, { label: 'Right Min-Heap', val: 'root: 5' }],
        states: { leftMax: '[2, 1]', rightMin: '[5, 8]', count: 4, median: '(2 + 5) / 2 = 3.5' },
        codeSnippet: 'heappush(self.small, -num)\n# Balance sizes\nif len(self.small) > len(self.large) + 1:\n    val = -heappop(self.small)\n    heappush(self.large, val)',
        impact: 'Time: O(log N) insert, O(1) median | Space: O(N)',
      },
      {
        title: 'Add Number 3 into Stream',
        whatHappens: '3 is <= right.root(5) → Push into left max-heap. Balance heaps.',
        whyRationale: 'Left heap now has size 3, right has size 2 (odd total 5).',
        heapNodes: [3, 2, 1],
        extraElements: [{ label: 'Left Max-Heap (Size 3)', val: 'root: 3' }, { label: 'Right Min-Heap (Size 2)', val: 'root: 5' }],
        states: { leftRoot: 3, rightRoot: 5, totalElements: 5, currentMedian: 3 },
        codeSnippet: 'if len(self.small) > len(self.large):\n    return -self.small[0] # 3',
      },
    ];
  }

  // 3. Default: Max-Heap / Extract Min
  return [
    {
      title: 'Initialize Min-Heap [1, 3, 5, 7, 9, 8, 6]',
      whatHappens: 'Complete binary tree where parent <= children at every node.',
      whyRationale: 'Root always contains the minimum element in O(1) lookup time.',
      heapNodes: [1, 3, 5, 7, 9, 8, 6],
      states: { rootMin: 1, size: 7 },
      codeSnippet: 'min_val = heap[0]',
      impact: 'Time: O(log N) | Space: O(1)',
    },
    {
      title: 'Extract-Min: Pop 1 & Replace with Last (6)',
      whatHappens: 'Remove root 1. Move last leaf (6) to root: [6, 3, 5, 7, 9, 8]. Heap property temporarily violated.',
      whyRationale: 'Moving last element preserves complete binary tree shape.',
      heapNodes: [6, 3, 5, 7, 9, 8],
      states: { extracted: 1, tempRoot: 6 },
      codeSnippet: 'min_val = heap[0]\nheap[0] = heap.pop()\nsift_down(0)',
    },
    {
      title: 'Sift Down: Swap 6 with Smallest Child (3)',
      whatHappens: '6 > children(3, 5). Swap 6 with 3. Then swap 6 with 7. Final valid heap: [3, 6, 5, 7, 9, 8].',
      whyRationale: 'Sifting down restores the min-heap invariant in O(log N) operations.',
      heapNodes: [3, 6, 5, 7, 9, 8],
      states: { newRoot: 3, restored: true },
      codeSnippet: 'return min_val # 1 extracted',
    },
  ];
}

export const HeapVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const steps = buildHeapSteps(problem);
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

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        {cur.extraElements && (
          <div className="flex items-center gap-3 flex-wrap justify-center mb-2">
            {cur.extraElements.map((el, i) => (
              <span key={i} className="px-3 py-1 bg-dew-drop border border-charcoal/40 rounded-pill text-xs font-mono font-bold text-charcoal shadow-xs">
                {el.label}: <strong>{el.val}</strong>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {cur.heapNodes.map((val, idx) => (
            <div
              key={idx}
              className={`w-12 h-14 md:w-14 md:h-16 flex flex-col items-center justify-center rounded-xl border-2 shadow-hard font-mono font-bold transition-all duration-200 ${
                idx === 0
                  ? 'bg-primary-container text-on-primary-container border-charcoal scale-105'
                  : 'bg-surface text-charcoal border-outline/40'
              }`}
            >
              <span className="text-xs text-on-surface-variant font-medium">#{idx}</span>
              <span className="text-base md:text-lg">{val}</span>
            </div>
          ))}
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
        timeSpaceImpact={cur.impact || 'Time: O(log N) | Space: O(1)'}
      />
    </div>
  );
};