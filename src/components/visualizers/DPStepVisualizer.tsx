import React, { useState, useEffect } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { DPVisualizationData, DPStep } from '@/types/visualization';

interface DPStepVisualizerProps {
  problem: Problem;
  customData?: DPVisualizationData;
}

export const DPStepVisualizer: React.FC<DPStepVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultSteps: DPStep[] = [
    {
      title: 'Initialize DP Table',
      whatHappens: 'Create DP table and initialize base cases.',
      whyRationale: 'Store solutions to overlapping subproblems.',
      grid: [
        [0, 1, 2, 3],
        [1, 2, 3, 4]
      ],
      states: { state: 'Initialized' },
      codeSnippet: 'dp = [[0] * (n + 1) for _ in range(m + 1)]',
      impact: 'Time: O(M × N) | Space: O(M × N)',
    }
  ];

  const steps: DPStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
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
          {cur.formula && <span className="text-sprout-sticker font-mono text-xs font-bold hidden sm:inline">formula: {cur.formula}</span>}
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4 overflow-x-auto select-none">
        <div className="overflow-x-auto max-w-full p-2">
          <table className="border-collapse font-mono shadow-hard rounded-lg overflow-hidden border border-charcoal bg-surface">
            {cur.colHeaders && (
              <thead>
                <tr className="bg-surface-container-high border-b border-charcoal">
                  {cur.rowHeaders && <th className="p-2 border-r border-charcoal text-xs"></th>}
                  {cur.colHeaders.map((col, cIdx) => (
                    <th key={cIdx} className="p-2 border-r border-charcoal font-bold text-center text-xs text-on-surface-variant max-w-[80px] truncate">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {cur.grid.map((row, r) => (
                <tr key={r} className="border-b border-outline/30 last:border-b-0">
                  {cur.rowHeaders && (
                    <td className="p-2 bg-surface-container-high font-bold border-r border-charcoal text-center text-xs text-on-surface-variant max-w-[80px] truncate">
                      {cur.rowHeaders[r] || r}
                    </td>
                  )}
                  {row.map((val, c) => {
                    const isActive = cur.activeCell?.[0] === r && cur.activeCell?.[1] === c;
                    const isHighlight = cur.highlightCells?.some(([hr, hc]) => hr === r && hc === c);

                    const valStr = String(val);
                    const isLong = valStr.length > 4;

                    return (
                      <td
                        key={c}
                        className={`p-2.5 min-w-[46px] max-w-[80px] text-center font-bold border-r border-outline/30 last:border-r-0 transition-all duration-200 overflow-hidden ${
                          isLong ? 'text-[10px]' : 'text-xs md:text-sm'
                        } ${
                          isActive
                            ? 'bg-primary-fixed border-2 border-marker-orange text-charcoal scale-105 shadow-sm font-black'
                            : isHighlight
                            ? 'bg-[#22c55e]/15 border-2 border-sprout-sticker text-charcoal'
                            : 'text-charcoal bg-surface'
                        }`}
                      >
                        <span className="truncate block max-w-full">{val}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
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
        timeSpaceImpact={cur.impact || 'Time: O(N) | Space: O(N)'}
      />
    </div>
  );
};