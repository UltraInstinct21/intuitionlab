import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, ArrowRight } from 'lucide-react';
import { StepCard } from './StepCard';
import { LinkedListVisualizationData, LinkedListStep, LinkedListNodeVisual } from '@/types/visualization';

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

// Fixed lane heights keep every arrow centered on its node box — no offsets.
const BADGE_LANE = 'h-7';
const NODE_H = 'h-14';

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [fit, setFit] = useState({ scale: 1, height: 0, left: 24 });

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

  // ponytail: one status source — nodes and their incoming arrows read the same flags
  const litFlags = (node: LinkedListNodeVisual, idx: number) => {
    const hasPtr = Object.entries(cur.pointers || {}).some(
      ([, v]) => v === node.val || v === idx || String(v) === String(node.val) || String(v) === `Node(${node.val})`
    );
    return {
      hot: node.status === 'active' || hasPtr,
      ok: node.status === 'success',
      bad: node.status === 'danger',
      muted: node.status === 'muted',
    };
  };
  const flags = cur.nodes.map((n, i) => litFlags(n, i));

  // Scale the chain to fit — no horizontal scroll, ever
  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;
    const compute = () => {
      const PAD = 24;
      const avail = container.clientWidth - PAD * 2;
      const natural = content.offsetWidth;
      const scale = natural > 0 ? Math.min(1, avail / natural) : 1;
      const height = content.offsetHeight * scale;
      const left = PAD + Math.max(0, (avail - natural * scale) / 2);
      setFit((prev) =>
        Math.abs(prev.scale - scale) < 0.001 &&
        Math.abs(prev.height - height) < 0.5 &&
        Math.abs(prev.left - left) < 0.5
          ? prev
          : { scale, height, left }
      );
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(container);
    ro.observe(content);
    return () => ro.disconnect();
  }, [step, problem.id, customData]);

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

      <div
        ref={containerRef}
        className="relative bg-cream-paper rounded-xl border border-dashed border-outline/40 overflow-hidden select-none"
        style={fit.height > 0 ? { height: fit.height } : undefined}
      >
        <div ref={contentRef} className="absolute top-0 w-max py-9" style={{ left: fit.left, transform: `scale(${fit.scale})`, transformOrigin: 'top left' }}>
        <div className="flex items-start w-max">
          {cur.nodes.map((node, idx) => {
            const activePtrs = Object.entries(cur.pointers || {}).filter(
              ([, v]) => v === node.val || v === idx || String(v) === String(node.val) || String(v) === `Node(${node.val})`
            );

            const f = flags[idx];
            const isHighlighted = f.hot;
            const isSuccess = f.ok;
            const isDanger = f.bad;
            const isMuted = f.muted;

            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center">
                  {/* Pointer badges — fixed lane, no layout shift */}
                  <div className={`${BADGE_LANE} flex items-end justify-center pb-1`}>
                    {activePtrs.length > 0 && (
                      <div className="flex gap-1 items-center justify-center max-w-[12rem] flex-wrap">
                        {activePtrs.map(([pName]) => {
                          const col = POINTER_COLORS[pName.toLowerCase()] || { bg: 'bg-primary-fixed', text: 'text-charcoal', border: 'border-charcoal' };
                          return (
                            <span
                              key={pName}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-xs border whitespace-nowrap ${col.bg} ${col.text} ${col.border}`}
                            >
                              {pName}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Classic [ data | next ] node — roomy value cell */}
                  <div
                    className={`flex ${NODE_H} rounded-xl border-[1.5px] shadow-hard overflow-hidden transition-all duration-200 ${
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
                    <div className="min-w-[3.5rem] px-4 flex items-center justify-center font-mono font-bold text-lg tabular-nums whitespace-nowrap text-charcoal">
                      {node.val}
                    </div>
                    <div className="w-[1.5px] bg-charcoal/15" />
                    <div className="w-11 flex items-center justify-center bg-charcoal/[0.04]">
                      <span className="w-2 h-2 rounded-full bg-charcoal/60" />
                    </div>
                  </div>

                  {/* Index + auxiliary pointers below the chain */}
                  <div className="min-h-[1.5rem] flex flex-col items-center gap-1 pt-1.5">
                    <span className="text-[10px] font-mono text-on-surface-variant">[{idx}]</span>
                    {node.randomVal !== undefined && (
                      <span className="text-[9px] font-mono font-bold text-sky-700 bg-sky-100 border border-sky-300 px-1.5 py-0.5 rounded whitespace-nowrap">
                        rand ⤹ {String(node.randomVal)}
                      </span>
                    )}
                    {node.bottomVal !== undefined && (
                      <span className="text-[9px] font-mono font-bold text-purple-700 bg-purple-100 border border-purple-300 px-1.5 py-0.5 rounded whitespace-nowrap">
                        child ↓ {String(node.bottomVal)}
                      </span>
                    )}
                    {node.label && (
                      <span className="text-[9px] font-sans font-medium text-on-surface-variant whitespace-nowrap">
                        {node.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Link arrow — glows with its target node's state */}
                {idx < cur.nodes.length - 1 && (() => {
                  const t = flags[idx + 1];
                  const line = t.hot ? 'bg-marker-orange' : t.ok ? 'bg-sprout-sticker' : t.bad ? 'bg-destructive' : 'bg-charcoal/70';
                  const head = t.hot ? 'border-marker-orange' : t.ok ? 'border-sprout-sticker' : t.bad ? 'border-destructive' : 'border-charcoal/70';
                  return (
                    <div className="flex flex-col" aria-hidden>
                      <div className={BADGE_LANE} />
                      <div className={`flex ${NODE_H} w-10 items-center`}>
                        <div className={`relative h-[2.5px] w-full transition-colors duration-200 ${line}`}>
                          <div className={`absolute -right-[1px] -top-[4.5px] h-2.5 w-2.5 border-t-[2.5px] border-r-[2.5px] rotate-45 rounded-[1px] transition-colors duration-200 ${head}`} />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </React.Fragment>
            );
          })}

          {/* NULL terminator on the same baseline */}
          <div aria-hidden>
            <div className={`${BADGE_LANE}`} />
            <div className={`flex ${NODE_H} items-center gap-2 pl-1`}>
              <div className="w-6 h-[2.5px] bg-outline relative">
                <div className="absolute -right-[1px] -top-[4.5px] w-2.5 h-2.5 border-t-[2.5px] border-r-[2.5px] border-outline rotate-45 rounded-[1px]" />
              </div>
              <div className="px-2.5 py-1 rounded-lg border border-dashed border-outline/50 bg-surface-container-high text-on-surface-variant font-mono text-xs font-bold shadow-xs whitespace-nowrap">
                ∅ null
              </div>
            </div>
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
