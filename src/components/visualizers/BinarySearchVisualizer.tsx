import React, { useState, useEffect } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { BinarySearchVisualizationData, BinarySearchStep } from '@/types/visualization';

interface BinarySearchVisualizerProps {
  problem: Problem;
  customData?: BinarySearchVisualizationData;
}

export const BinarySearchVisualizer: React.FC<BinarySearchVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultSteps: BinarySearchStep[] = [
    {
      title: 'Initialize Search Interval [Low..High]',
      whatHappens: 'Initialize Low = 0, High = 9. Search interval encompasses entire sorted array.',
      whyRationale: 'Binary search eliminates half the search space per iteration.',
      array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
      low: 0,
      mid: 4,
      high: 9,
      condition: 'Check mid element array[4] = 16',
      states: { low: 0, mid: 4, high: 9, target: 23 },
      codeSnippet: 'low, high = 0, len(nums) - 1\nmid = (low + high) // 2',
      impact: 'Time: O(log N) | Space: O(1)',
    }
  ];

  const steps: BinarySearchStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
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
          <span className="text-sky-sticker font-bold max-w-[320px] truncate">{cur.condition}</span>
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6 overflow-x-auto select-none">
        <div className="flex items-center justify-center gap-1.5 md:gap-2 flex-wrap min-w-max">
          {cur.array.map((val, idx) => {
            const isLow = idx === cur.low;
            const isHigh = idx === cur.high;
            const isMid = idx === cur.mid;
            const isEliminated = cur.eliminatedRange && idx >= cur.eliminatedRange[0] && idx <= cur.eliminatedRange[1];
            const isFound = cur.foundIndex === idx;

            const valStr = String(val);
            const isLong = valStr.length > 3;

            return (
              <div key={idx} className="flex flex-col items-center gap-1 min-w-[48px]">
                <div className="h-5 flex gap-1 items-center justify-center">
                  {isLow && <span className="bg-sky-500 text-white px-1.5 py-0.2 rounded text-[9px] font-mono font-bold">L</span>}
                  {isMid && <span className="bg-orange-500 text-white px-1.5 py-0.2 rounded text-[9px] font-mono font-bold">M</span>}
                  {isHigh && <span className="bg-emerald-500 text-white px-1.5 py-0.2 rounded text-[9px] font-mono font-bold">H</span>}
                </div>
                <div
                  className={`min-w-[44px] px-1.5 h-13 md:h-15 flex items-center justify-center font-mono font-bold rounded-lg border-2 transition-all duration-300 overflow-hidden text-center ${
                    isLong ? 'text-xs' : 'text-sm md:text-base'
                  } ${
                    isFound
                      ? 'border-sprout-sticker bg-[#22c55e]/20 text-charcoal scale-110 shadow-md'
                      : isMid
                      ? 'border-marker-orange bg-primary-fixed text-charcoal scale-105 shadow-sm'
                      : isLow || isHigh
                      ? 'border-sky-500 bg-sky-50 text-charcoal'
                      : isEliminated
                      ? 'border-outline/30 bg-surface-container-high/40 text-on-surface-variant/40 line-through'
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

      <StepCard
        stepNumber={step + 1}
        totalSteps={steps.length}
        title={cur.title}
        whatHappens={cur.whatHappens}
        whyRationale={cur.whyRationale}
        variableStates={cur.states || {}}
        codeSnippet={cur.codeSnippet}
        timeSpaceImpact={cur.impact || 'Time: O(log N) | Space: O(1)'}
      />
    </div>
  );
};