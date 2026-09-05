import React, { useState, useEffect } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, ArrowRight } from 'lucide-react';
import { StepCard } from './StepCard';
import { LinkedListVisualizationData, LinkedListStep } from '@/types/visualization';

interface LinkedListVisualizerProps {
  problem: Problem;
  customData?: LinkedListVisualizationData;
}

const POINTER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  slow: { bg: 'bg-sky-500', text: 'text-white', border: 'border-sky-600' },
  fast: { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600' },
  curr: { bg: 'bg-marker-orange', text: 'text-white', border: 'border-amber-700' },
  current: { bg: 'bg-marker-orange', text: 'text-white', border: 'border-amber-700' },
  prev: { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600' },
  next: { bg: 'bg-indigo-500', text: 'text-white', border: 'border-indigo-600' },
  head: { bg: 'bg-charcoal', text: 'text-cream-paper', border: 'border-charcoal' },
  tail: { bg: 'bg-rose-500', text: 'text-white', border: 'border-rose-600' },
  l1: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700' },
  l2: { bg: 'bg-teal-600', text: 'text-white', border: 'border-teal-700' },
  dummy: { bg: 'bg-stone-600', text: 'text-white', border: 'border-stone-700' },
  left: { bg: 'bg-sky-500', text: 'text-white', border: 'border-sky-600' },
  right: { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600' },
};

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultSteps: LinkedListStep[] = [
    {
      title: 'Initialize Linked List Traversal',
      whatHappens: 'Linked list nodes initialized with head pointer.',
      whyRationale: 'Sequential node traversal maintaining reference pointers.',
      nodes: [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }, { val: 5 }],
      pointers: { curr: 1 },
      states: { head: 1 },
      codeSnippet: 'curr = head',
      impact: 'Time: O(N) | Space: O(1)',
    }
  ];

  const steps: LinkedListStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
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

      <div className="py-8 px-5 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6 overflow-x-auto select-none">
        <div className="flex items-center gap-2 md:gap-3 flex-nowrap min-w-max pb-2">
          {cur.nodes.map((node, idx) => {
            const activePtrs = Object.entries(cur.pointers || {}).filter(
              ([, v]) => v === node.val || v === idx || String(v) === String(node.val) || String(v) === `Node(${node.val})`
            );

            const isHighlighted = node.status === 'active' || activePtrs.length > 0;
            const isSuccess = node.status === 'success';
            const isDanger = node.status === 'danger';
            const isMuted = node.status === 'muted';

            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-1 min-w-[72px]">
                  {/* Floating Pointer Badges with Carat */}
                  <div className="min-h-[26px] flex flex-col items-center justify-end">
                    {activePtrs.length > 0 && (
                      <div className="flex flex-wrap gap-1 items-center justify-center animate-bounce-subtle">
                        {activePtrs.map(([pName]) => {
                          const col = POINTER_COLORS[pName.toLowerCase()] || { bg: 'bg-primary-fixed', text: 'text-charcoal', border: 'border-charcoal' };
                          return (
                            <span
                              key={pName}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-xs border ${col.bg} ${col.text} ${col.border}`}
                            >
                              {pName}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Clean Memory-Card Node */}
                  <div
                    className={`w-16 h-20 md:w-18 md:h-22 rounded-xl border-[1.5px] shadow-hard flex flex-col overflow-hidden transition-all duration-200 ${
                      isHighlighted
                        ? 'border-marker-orange ring-2 ring-marker-orange/20 scale-105 bg-primary-fixed'
                        : isSuccess
                        ? 'border-sprout-sticker bg-[#22c55e]/15'
                        : isDanger
                        ? 'border-destructive bg-destructive/15'
                        : isMuted
                        ? 'border-outline/30 bg-surface-container-high opacity-50'
                        : 'border-charcoal bg-surface'
                    }`}
                  >
                    {/* Node Header (index / address) */}
                    <div className="px-1.5 py-0.5 bg-surface-container-high/60 border-b border-outline/20 text-[9px] font-mono text-on-surface-variant flex items-center justify-between">
                      <span>[{idx}]</span>
                      <span className="text-[8px] opacity-70">val</span>
                    </div>

                    {/* Node Main Value */}
                    <div className="flex-1 flex items-center justify-center font-mono font-bold text-base md:text-lg text-charcoal px-1">
                      {node.val}
                    </div>

                    {/* Node Footer Label (if any) */}
                    {node.label && (
                      <div className="px-1 py-0.5 bg-dew-drop/80 border-t border-outline/20 text-[9px] font-sans font-medium text-center text-on-surface-variant truncate">
                        {node.label}
                      </div>
                    )}
                  </div>

                  {/* Auxiliary Pointers (random / bottom) */}
                  <div className="min-h-[20px] flex flex-col items-center gap-0.5 pt-1">
                    {node.randomVal !== undefined && (
                      <span className="text-[9px] font-mono font-bold text-sky-700 bg-sky-100 border border-sky-300 px-1.5 py-0.2 rounded">
                        rand ⤹ {String(node.randomVal)}
                      </span>
                    )}
                    {node.bottomVal !== undefined && (
                      <span className="text-[9px] font-mono font-bold text-purple-700 bg-purple-100 border border-purple-300 px-1.5 py-0.2 rounded">
                        child ↓ {String(node.bottomVal)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Connecting Arrow */}
                {idx < cur.nodes.length - 1 && (
                  <div className="flex items-center text-charcoal px-1 pt-2">
                    <div className="w-6 h-[2px] bg-charcoal relative">
                      <div className="absolute -right-1 -top-[3px] w-2 h-2 border-t-2 border-r-2 border-charcoal rotate-45" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* Clean NULL Termination Pill */}
          <div className="flex items-center gap-1.5 pl-1 pt-2">
            <div className="w-5 h-[2px] bg-outline relative">
              <div className="absolute -right-1 -top-[3px] w-2 h-2 border-t-2 border-r-2 border-outline rotate-45" />
            </div>
            <div className="px-2.5 py-1 rounded-lg border border-dashed border-outline/50 bg-surface-container-high text-on-surface-variant font-mono text-xs font-bold shadow-xs">
              ∅ null
            </div>
          </div>
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