import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';
import { ArrayVisualizationData, ArrayStep } from '@/types/visualization';

interface ArrayStepVisualizerProps {
  problem: Problem;
  customData?: ArrayVisualizationData;
}

export const ArrayStepVisualizer: React.FC<ArrayStepVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultSteps: ArrayStep[] = [
    {
      title: 'Initialize Array State',
      whatHappens: problem.intuition?.slice(0, 160) || `Process input array elements.`,
      whyRationale: problem.keyInsight?.slice(0, 160) || 'Analyze boundaries and problem invariants.',
      codeSnippet: problem.approaches?.[0]?.pythonCode?.split('\n').slice(0, 3).join('\n') || '# Step 1: Initialize pointers',
      arrayState: [1, 2, 3, 4, 5],
      pointers: [{ idx: 0, label: 'L', color: '#0ea5e9' }, { idx: 4, label: 'R', color: '#22c55e' }],
      states: { start: 0, end: 4 },
      impact: 'Time: O(N) | Space: O(1)',
    }
  ];

  const steps: ArrayStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
  const s = steps[step] || steps[0];

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
    <div className="space-y-6" ref={containerRef}>
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
          <Button size="sm" variant="ghost" onClick={() => { setStep(0); setIsPlaying(false); }} className="h-8">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="text-xs md:text-sm font-mono flex items-center gap-3">
          <span className="text-marker-orange font-bold">step {step + 1} of {steps.length}</span>
          {s.result && <span className="text-sprout-sticker font-bold">result: {s.result}</span>}
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6 overflow-x-auto select-none">
        <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap min-w-max">
          {s.arrayState.map((val, idx) => {
            const ptr = s.pointers?.find(p => p.idx === idx);
            const inRange = s.highlightRange && idx >= s.highlightRange[0] && idx <= s.highlightRange[1];
            const inIndices = s.highlightIndices && s.highlightIndices.includes(idx);
            const isHighlighted = inRange || inIndices;

            const valStr = String(val);
            const isLongText = valStr.length > 3;

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 min-w-[52px]">
                {/* Pointer Badge Container */}
                <div className="h-6 flex items-center justify-center">
                  {ptr && (
                    <span
                      className="text-white px-2 py-0.5 rounded-pill text-[10px] font-mono font-bold shadow-xs max-w-[80px] truncate"
                      style={{ backgroundColor: ptr.color || '#ff6f1e' }}
                    >
                      {ptr.label}
                    </span>
                  )}
                </div>

                {/* Array Box */}
                <div
                  className={`min-w-[48px] px-2 h-14 md:h-16 flex items-center justify-center font-mono font-bold rounded-xl border-2 shadow-hard transition-all duration-200 overflow-hidden text-center ${
                    isLongText ? 'text-xs' : 'text-sm md:text-base'
                  } ${
                    isHighlighted
                      ? 'border-sprout-sticker bg-[#22c55e]/15 scale-105 shadow-md'
                      : ptr
                      ? 'border-marker-orange bg-primary-fixed scale-105 shadow-sm'
                      : 'border-charcoal bg-surface text-charcoal'
                  }`}
                >
                  <span className="truncate max-w-full">{val}</span>
                </div>

                {/* Index Indicator */}
                <span className="text-[10px] font-mono text-on-surface-variant">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      <StepCard
        stepNumber={step + 1}
        totalSteps={steps.length}
        title={s.title}
        whatHappens={s.whatHappens}
        whyRationale={s.whyRationale}
        variableStates={s.states || {
          step: `${step + 1}/${steps.length}`,
          pointers: s.pointers?.map(p => `${p.label}@idx[${p.idx}]`).join(', ') || 'none',
          ...(s.result ? { result: s.result } : {}),
        }}
        codeSnippet={s.codeSnippet}
        timeSpaceImpact={s.impact || 'Time: O(N) | Space: O(1)'}
      />
    </div>
  );
};