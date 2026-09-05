import React, { useState, useEffect } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { HeapVisualizationData, HeapStep } from '@/types/visualization';

interface HeapVisualizerProps {
  problem: Problem;
  customData?: HeapVisualizationData;
}

export const HeapVisualizer: React.FC<HeapVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultSteps: HeapStep[] = [
    {
      title: 'Initialize Binary Heap',
      whatHappens: 'Heap structure with root at index 0.',
      whyRationale: 'Complete binary tree satisfies heap-order property.',
      heapArray: [10, 8, 6, 7, 3, 2],
      action: 'idle',
      states: { size: 6, root: 10 },
      codeSnippet: 'heapq.heapify(heap)',
      impact: 'Time: O(N) | Space: O(1)',
    }
  ];

  const steps: HeapStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
  const cur = steps[step] || steps[0];

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [problem.id, customData]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

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
          <Button size="sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)} className="h-8 px-2.5 text-xs">
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setStep(0); setIsPlaying(false); }} className="h-8"><RotateCcw className="w-3.5 h-3.5" /></Button>
        </div>
        <div className="text-xs md:text-sm font-mono flex items-center gap-3">
          <span className="text-marker-orange font-bold">step {step + 1} of {steps.length}</span>
          <span className="text-sky-sticker font-bold uppercase">{cur.action}</span>
        </div>
      </div>

      {cur.heapArray.length > 0 && (
      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6 overflow-x-auto select-none">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono font-bold text-on-surface-variant">Heap Array Representation:</span>
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap justify-center min-w-max">
            {cur.heapArray.map((val, idx) => {
              const isActive = cur.activeIndices?.includes(idx);
              const isRoot = idx === 0;

              const valStr = String(val);
              const isLong = valStr.length > 3;

              return (
                <div key={idx} className="flex flex-col items-center gap-1 min-w-[50px]">
                  <div className="h-5 text-[10px] font-mono font-bold">
                    {isRoot && <span className="bg-sky-500 text-white px-1.5 py-0.2 rounded">root</span>}
                    {isActive && !isRoot && <span className="bg-orange-500 text-white px-1.5 py-0.2 rounded">swap</span>}
                  </div>
                  <div
                    className={`min-w-[48px] px-2 h-14 md:h-16 flex items-center justify-center font-mono font-bold rounded-xl border-2 shadow-hard transition-all duration-200 overflow-hidden text-center ${
                      isLong ? 'text-xs' : 'text-sm md:text-base'
                    } ${
                      isActive
                        ? 'border-marker-orange bg-primary-fixed scale-105 shadow-md text-charcoal'
                        : isRoot
                        ? 'border-sprout-sticker bg-[#22c55e]/15 text-charcoal'
                        : 'border-charcoal bg-surface text-charcoal'
                    }`}
                  >
                    <span className="truncate max-w-full">{val}</span>
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-variant">[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      <StepCard
        stepNumber={step + 1}
        totalSteps={steps.length}
        title={cur.title}
        whatHappens={cur.whatHappens}
        whyRationale={cur.whyRationale}
        variableStates={cur.states || {}}
        codeSnippet={cur.codeSnippet}
        timeSpaceImpact={cur.impact || 'Time: O(N) | Space: O(1)'}
        result={cur.result}
      />
    </div>
  );
};