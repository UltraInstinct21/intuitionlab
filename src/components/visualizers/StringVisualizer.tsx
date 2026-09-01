import React, { useState, useEffect } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { StringVisualizationData, StringStep } from '@/types/visualization';

interface StringVisualizerProps {
  problem: Problem;
  customData?: StringVisualizationData;
}

export const StringVisualizer: React.FC<StringVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultSteps: StringStep[] = [
    {
      title: 'Initialize String Pointers',
      whatHappens: 'Initialize pointer references at string boundaries.',
      whyRationale: 'Two pointer / sliding window scanning.',
      chars: ['a', 'b', 'c', 'd', 'e'],
      pointers: [{ idx: 0, label: 'L', color: '#0ea5e9' }, { idx: 4, label: 'R', color: '#22c55e' }],
      states: { left: 0, right: 4 },
      codeSnippet: 'left, right = 0, len(s) - 1',
      impact: 'Time: O(N) | Space: O(1)',
    }
  ];

  const steps: StringStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
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
          {cur.result && <span className="text-sprout-sticker font-bold">result: {cur.result}</span>}
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6 overflow-x-auto select-none">
        <div className="flex items-center justify-center gap-1.5 md:gap-2 flex-wrap min-w-max">
          {cur.chars.map((char, idx) => {
            const ptr = cur.pointers?.find(p => p.idx === idx);
            const inHighlight = cur.highlightRange && idx >= cur.highlightRange[0] && idx <= cur.highlightRange[1];
            const inWindow = cur.window && idx >= cur.window[0] && idx <= cur.window[1];

            const charStr = String(char);
            const isLong = charStr.length > 2;

            return (
              <div key={idx} className="flex flex-col items-center gap-1 min-w-[46px]">
                <div className="h-5 text-xs font-mono font-bold flex items-center justify-center">
                  {ptr && (
                    <span
                      className="text-white px-2 py-0.5 rounded-pill text-[10px] shadow-xs max-w-[70px] truncate"
                      style={{ backgroundColor: ptr.color || '#ff6f1e' }}
                    >
                      {ptr.label}
                    </span>
                  )}
                </div>
                <div
                  className={`min-w-[42px] px-1.5 h-13 md:h-15 flex items-center justify-center font-mono font-bold rounded-xl border-2 shadow-hard transition-all duration-200 overflow-hidden text-center ${
                    isLong ? 'text-xs md:text-sm' : 'text-base md:text-lg'
                  } ${
                    inHighlight || inWindow
                      ? 'border-sprout-sticker bg-[#22c55e]/15 scale-105 shadow-md'
                      : ptr
                      ? 'border-marker-orange bg-primary-fixed scale-105 shadow-sm'
                      : 'border-charcoal bg-surface text-charcoal'
                  }`}
                >
                  <span className="truncate max-w-full">{char}</span>
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
        timeSpaceImpact={cur.impact || 'Time: O(N) | Space: O(1)'}
      />
    </div>
  );
};