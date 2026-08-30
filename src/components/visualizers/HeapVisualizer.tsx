import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

export const HeapVisualizer: React.FC = () => {
  const heap = [1, 3, 5, 7, 9, 8, 6];
  const [extracted, setExtracted] = useState<number[]>([]);
  const [stepIdx, setStepIdx] = useState(0);

  const extract = () => {
    if (heap.length - extracted.length === 0) return;
    setExtracted([...extracted, heap[extracted.length]]);
    setStepIdx(stepIdx + 1);
  };

  const remaining = heap.filter((_, i) => !extracted.includes(heap[i]));

  const parent = (i: number) => Math.floor((i - 1) / 2);
  const leftChild = (i: number) => 2 * i + 1;
  const rightChild = (i: number) => 2 * i + 2;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <Button size="sm" variant="primary" onClick={extract} disabled={extracted.length >= heap.length}
          className="text-xs h-8 px-3">extractMin()</Button>
        <Button size="sm" variant="ghost" onClick={() => { setExtracted([]); setStepIdx(0); }}
          className="h-8"><RotateCcw className="w-4 h-4" /></Button>
      </div>

      <div className="py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        <svg viewBox="0 0 360 180" className="w-96 h-48">
          {remaining.map((val, idx) => {
            const i = heap.indexOf(val);
            const row = Math.floor(Math.log2(i + 1));
            const pos = i - (Math.pow(2, row) - 1);
            const x = (pos + 0.5) * (360 / Math.pow(2, row));
            const y = row * 45 + 20;
            const pi = parent(i);
            if (pi < heap.length) {
              const pRow = Math.floor(Math.log2(pi + 1));
              const pPos = pi - (Math.pow(2, pRow) - 1);
              const px = (pPos + 0.5) * (360 / Math.pow(2, pRow));
              const py = pRow * 45 + 20;
              return <React.Fragment key={i}>
                <line x1={px} y1={py + 18} x2={x} y2={y - 18} stroke="#171717" strokeWidth="2" />
                <circle cx={x} cy={y} r="18" fill="#fdfbf9" stroke="#171717" strokeWidth="2.5" />
                <text x={x} y={y + 5} textAnchor="middle" fill="#171717" fontFamily="Geist Mono" fontSize="14" fontWeight="bold">{val}</text>
              </React.Fragment>;
            }
            return <React.Fragment key={i}>
              <circle cx={x} cy={y} r="18" fill="#fdfbf9" stroke="#171717" strokeWidth="2.5" />
              <text x={x} y={y + 5} textAnchor="middle" fill="#171717" fontFamily="Geist Mono" fontSize="14" fontWeight="bold">{val}</text>
            </React.Fragment>;
          })}
        </svg>

        {extracted.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-on-surface-variant">extracted:</span>
            {extracted.map((v, i) => (
              <span key={i} className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-pill border border-charcoal">{v}</span>
            ))}
          </div>
        )}
      </div>

      <StepCard stepNumber={stepIdx} totalSteps={heap.length}
        title="Extract-Min Operation"
        whatHappens="Remove root (min element). Replace with last element. Sift down to restore heap property."
        whyRationale="Min-heap: parent <= children. Root is always minimum. O(log N) sift-down restores order."
        variableStates={{ root: heap[0], remaining: heap.length - extracted.length, extracted_count: extracted.length }}
        codeSnippet="min_val = heap[0]\nheap[0] = heap.pop()\nsift_down(0)\nreturn min_val"
        timeSpaceImpact="Time: O(log N) extract | O(N) build | Space: O(1)"
      />
    </div>
  );
};