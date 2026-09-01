import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';
import { MatrixVisualizationData, MatrixStep } from '@/types/visualization';

interface MatrixVisualizerProps {
  problem: Problem;
  customData?: MatrixVisualizationData;
}

export const MatrixVisualizer: React.FC<MatrixVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultSteps: MatrixStep[] = [
    {
      title: 'Initialize Matrix',
      whatHappens: 'Process 2D matrix structure.',
      whyRationale: 'Check matrix dimensions and initialize markers.',
      grid: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
      ],
      states: { rows: 3, cols: 3 },
      codeSnippet: 'm, n = len(matrix), len(matrix[0])',
      impact: 'Time: O(M × N) | Space: O(1)',
    }
  ];

  const steps: MatrixStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
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
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4 overflow-x-auto select-none">
        <div
          className="grid gap-2 p-3.5 bg-surface-container-high rounded-xl border border-charcoal shadow-hard"
          style={{ gridTemplateColumns: `repeat(${cur.grid[0]?.length || 3}, minmax(0, 1fr))` }}
        >
          {cur.grid.map((row, r) =>
            row.map((cell, c) => {
              const isHighlight = cur.highlightCells?.some(([hr, hc]) => hr === r && hc === c);
              const isActive = cur.activeCell?.[0] === r && cur.activeCell?.[1] === c;

              const cellStr = String(cell);
              const isLong = cellStr.length > 3;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`min-w-[44px] min-h-[44px] md:min-w-[50px] md:min-h-[50px] px-1.5 flex items-center justify-center font-mono font-bold rounded-lg border transition-all duration-200 overflow-hidden text-center ${
                    isLong ? 'text-[10px] md:text-xs' : 'text-xs md:text-sm'
                  } ${
                    isActive
                      ? 'border-2 border-marker-orange bg-primary-fixed scale-105 shadow-md text-charcoal'
                      : isHighlight
                      ? 'border-2 border-sprout-sticker bg-[#22c55e]/15 text-charcoal shadow-sm'
                      : cell === 0 || cell === '0*' || cell === 'X' || cell === 'visited'
                      ? 'border-charcoal bg-primary-container text-on-primary-container'
                      : 'border-outline/40 bg-surface text-charcoal'
                  }`}
                >
                  <span className="truncate max-w-full">{cell}</span>
                </div>
              );
            })
          )}
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
        timeSpaceImpact={cur.impact || 'Time: O(M × N) | Space: O(1)'}
      />
    </div>
  );
};