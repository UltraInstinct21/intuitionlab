import React, { useState, useEffect } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { GreedyVisualizationData, GreedyStep, GreedyItemVisual } from '@/types/visualization';

interface GreedyVisualizerProps {
  problem: Problem;
  customData?: GreedyVisualizationData;
}

export const GreedyVisualizer: React.FC<GreedyVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultItems: GreedyItemVisual[] = [
    { id: 1, label: 'Item 1', weight: 10, value: 60, status: 'selected' },
    { id: 2, label: 'Item 2', weight: 20, value: 100, status: 'pending' },
    { id: 3, label: 'Item 3', weight: 30, value: 120, status: 'rejected' },
  ];

  const defaultSteps: GreedyStep[] = [
    {
      title: 'Initialize Greedy Strategy',
      whatHappens: 'Sort candidate items by greedy criterion (e.g. value/weight ratio or finish time).',
      whyRationale: 'Greedy choice property makes the locally optimal choice at each step.',
      items: defaultItems,
      states: { totalSelected: 1 },
      codeSnippet: 'items.sort(key=lambda x: x.ratio, reverse=True)',
      impact: 'Time: O(N log N) | Space: O(1)',
    }
  ];

  const steps: GreedyStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
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
          {cur.runningMetric && (
            <span className="text-sprout-sticker font-bold max-w-[280px] truncate">{cur.runningMetric}</span>
          )}
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6 overflow-x-auto select-none">
        <div className="flex items-center gap-3 flex-wrap justify-center min-w-max">
          {cur.items.map(item => {
            const isSelected = item.status === 'selected';
            const isRejected = item.status === 'rejected';
            const isCurrent = item.status === 'current' || cur.currentItemId === item.id;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border-2 shadow-hard flex flex-col gap-1.5 min-w-[130px] max-w-[220px] transition-all duration-200 overflow-hidden ${
                  isCurrent
                    ? 'border-marker-orange bg-primary-fixed scale-105 shadow-md text-charcoal'
                    : isSelected
                    ? 'border-sprout-sticker bg-[#22c55e]/15 text-charcoal'
                    : isRejected
                    ? 'border-destructive bg-destructive/10 text-on-surface-variant opacity-60'
                    : 'border-charcoal bg-surface text-charcoal'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-xs truncate max-w-[90px]">{item.label}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold flex-shrink-0 ${
                    isSelected ? 'bg-emerald-200 text-emerald-800'
                    : isRejected ? 'bg-rose-200 text-rose-800'
                    : isCurrent ? 'bg-orange-200 text-orange-800'
                    : 'bg-surface-container-high'
                  }`}>
                    {item.status}
                  </span>
                </div>
                {item.value !== undefined && <span className="text-xs font-mono truncate">Val: {String(item.value)}</span>}
                {item.weight !== undefined && <span className="text-xs font-mono truncate">Wt: {String(item.weight)}</span>}
                {item.ratio !== undefined && <span className="text-xs font-mono font-bold text-marker-orange truncate">Ratio: {String(item.ratio)}</span>}
                {item.start !== undefined && item.end !== undefined && (
                  <span className="text-xs font-mono truncate">Interval: [{item.start}, {item.end}]</span>
                )}
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
        timeSpaceImpact={cur.impact || 'Time: O(N log N) | Space: O(1)'}
      />
    </div>
  );
};