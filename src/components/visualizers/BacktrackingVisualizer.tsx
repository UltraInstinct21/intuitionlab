import React, { useState, useEffect } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { BacktrackingVisualizationData, BacktrackingStep } from '@/types/visualization';

interface BacktrackingVisualizerProps {
  problem: Problem;
  customData?: BacktrackingVisualizationData;
}

export const BacktrackingVisualizer: React.FC<BacktrackingVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultSteps: BacktrackingStep[] = [
    {
      title: 'Initialize Recursive Search',
      whatHappens: 'Start exploration at root state.',
      whyRationale: 'Backtracking explores decision tree with depth-first search.',
      choicePath: [],
      status: 'explore',
      states: { depth: 0 },
      codeSnippet: 'def backtrack(path, choices):\n    if is_solution(path): res.append(path)',
      impact: 'Time: O(2^N) | Space: O(N)',
    }
  ];

  const steps: BacktrackingStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
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
          <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase text-[11px] ${
            cur.status === 'solution' ? 'bg-sprout-sticker/20 text-emerald-700 border border-sprout-sticker'
            : cur.status === 'backtrack' ? 'bg-destructive/20 text-destructive border border-destructive'
            : cur.status === 'prune' ? 'bg-amber-100 text-amber-800 border border-amber-300'
            : 'bg-primary-container text-on-primary-container border border-charcoal'
          }`}>
            {cur.status}
          </span>
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6 overflow-x-auto select-none">
        {/* If grid / board state exists (Sudoku, N-Queens, Maze) */}
        {cur.boardState && (
          <div
            className="grid gap-1.5 p-3 bg-surface-container-high rounded-xl border border-charcoal shadow-hard"
            style={{ gridTemplateColumns: `repeat(${cur.boardState[0]?.length || 4}, minmax(0, 1fr))` }}
          >
            {cur.boardState.map((row, r) =>
              row.map((cell, c) => {
                const isQueen = cell === 'Q' || cell === '👑';
                const isVisited = cell === 'X' || cell === '1' || cell === '✓';
                const cellStr = String(cell);
                const isLong = cellStr.length > 2;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`min-w-[44px] min-h-[44px] md:min-w-[48px] md:min-h-[48px] p-1 flex items-center justify-center font-mono font-bold rounded-lg border transition-all duration-200 overflow-hidden text-center ${
                      isLong ? 'text-xs' : 'text-sm md:text-base'
                    } ${
                      isQueen
                        ? 'border-2 border-marker-orange bg-primary-fixed scale-105 shadow-sm text-charcoal'
                        : isVisited
                        ? 'border-2 border-sprout-sticker bg-[#22c55e]/15 text-charcoal'
                        : cell === '.' || cell === 0
                        ? 'border-outline/30 bg-surface text-on-surface-variant'
                        : 'border-charcoal bg-surface text-charcoal'
                    }`}
                  >
                    <span className="truncate max-w-full">{cell}</span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Choice Path & Decision Chain */}
        {cur.choicePath && cur.choicePath.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-mono font-bold text-on-surface-variant">Current Decision Path:</span>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {cur.choicePath.map((choice, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-3 py-1 bg-surface rounded-lg border border-charcoal font-mono text-xs font-bold shadow-xs max-w-[200px] truncate">
                    {choice}
                  </span>
                  {idx < cur.choicePath!.length - 1 && <span className="text-marker-orange font-bold">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {cur.currentChoices && cur.currentChoices.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-mono flex-wrap justify-center">
            <span className="text-on-surface-variant font-bold">Branching Choices:</span>
            {cur.currentChoices.map((ch, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-0.5 rounded border max-w-[150px] truncate ${
                  ch === cur.activeChoice
                    ? 'bg-primary-fixed border-marker-orange font-bold text-charcoal'
                    : 'bg-surface border-outline/30'
                }`}
              >
                {ch}
              </span>
            ))}
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
        timeSpaceImpact={cur.impact || 'Time: O(2^N) | Space: O(N)'}
      />
    </div>
  );
};