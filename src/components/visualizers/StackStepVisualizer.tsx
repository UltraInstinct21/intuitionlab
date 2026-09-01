import React, { useState, useEffect } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, ArrowDown, ArrowUp } from 'lucide-react';
import { StepCard } from './StepCard';
import { StackVisualizationData, StackStep } from '@/types/visualization';

interface StackStepVisualizerProps {
  problem: Problem;
  customData?: StackVisualizationData;
}

export const StackStepVisualizer: React.FC<StackStepVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultSteps: StackStep[] = [
    {
      title: 'Initialize Stack',
      whatHappens: 'Create empty stack for LIFO operations.',
      whyRationale: 'Monotonic stack or LIFO buffer maintains element hierarchy.',
      stack: [],
      action: 'idle',
      states: { stackSize: 0 },
      codeSnippet: 'stack = []',
      impact: 'Time: O(N) | Space: O(N)',
    }
  ];

  const steps: StackStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
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
          {cur.result !== undefined && (
            <span className="text-sprout-sticker font-bold">result: {String(cur.result)}</span>
          )}
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6 overflow-x-auto select-none">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
          {/* Current Action / Input */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-mono font-bold text-on-surface-variant">Incoming Token / Operation</span>
            <div className="flex items-center gap-2">
              {cur.currentItem !== undefined ? (
                <div className="min-w-[48px] px-2.5 h-12 flex items-center justify-center font-mono font-bold text-sm md:text-base rounded-xl border-2 border-marker-orange bg-primary-fixed shadow-hard animate-pulse overflow-hidden text-center">
                  <span className="truncate max-w-full">{cur.currentItem}</span>
                </div>
              ) : (
                <div className="min-w-[48px] px-2 h-12 flex items-center justify-center font-mono text-xs text-on-surface-variant rounded-xl border border-dashed border-outline/40 bg-surface">
                  None
                </div>
              )}
              {cur.action === 'push' && <ArrowDown className="w-5 h-5 text-marker-orange" />}
              {cur.action === 'pop' && <ArrowUp className="w-5 h-5 text-destructive" />}
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-pill uppercase ${
              cur.action === 'push' ? 'bg-primary-container text-on-primary-container border border-charcoal'
              : cur.action === 'pop' ? 'bg-destructive/15 text-destructive border border-destructive'
              : cur.action === 'match' ? 'bg-sprout-sticker/15 text-emerald-700 border border-sprout-sticker'
              : 'bg-surface-container-high text-on-surface-variant'
            }`}>
              {cur.action}
            </span>
          </div>

          {/* Stack Container */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-on-surface-variant">Stack (Top on Right)</span>
            <div className="flex items-center gap-1.5 min-h-[58px] p-2 bg-surface-container-high rounded-xl border-2 border-charcoal shadow-hard min-w-[200px] justify-start flex-wrap">
              {cur.stack.length === 0 ? (
                <span className="text-xs font-mono text-on-surface-variant italic px-4 py-2">Empty Stack</span>
              ) : (
                cur.stack.map((item, idx) => {
                  const isTop = idx === cur.stack.length - 1;
                  const itemStr = String(item);
                  const isLong = itemStr.length > 3;

                  return (
                    <div
                      key={idx}
                      className={`min-w-[44px] px-2 h-10 md:h-11 flex items-center justify-center font-mono font-bold rounded-lg border-2 shadow-xs transition-all duration-200 overflow-hidden text-center ${
                        isLong ? 'text-xs' : 'text-sm'
                      } ${
                        isTop
                          ? 'border-marker-orange bg-primary-fixed scale-105 shadow-sm text-charcoal'
                          : 'border-charcoal bg-surface text-charcoal'
                      }`}
                    >
                      <span className="truncate max-w-full">{item}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {cur.inputRemaining && cur.inputRemaining.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-on-surface-variant font-bold">Remaining Input:</span>
            <span className="bg-surface px-2.5 py-1 rounded border border-outline/30 font-bold max-w-[400px] truncate">
              [{cur.inputRemaining.join(', ')}]
            </span>
          </div>
        )}
      </div>

      <StepCard
        stepNumber={step + 1}
        totalSteps={steps.length}
        title={cur.title}
        whatHappens={cur.whatHappens}
        whyRationale={cur.whyRationale}
        variableStates={cur.states || {}}
        codeSnippet={cur.codeSnippet}
        timeSpaceImpact={cur.impact || 'Time: O(N) | Space: O(N)'}
      />
    </div>
  );
};