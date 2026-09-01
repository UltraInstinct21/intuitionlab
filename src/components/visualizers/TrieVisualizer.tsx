import React, { useState, useEffect } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { TrieVisualizationData, TrieStep } from '@/types/visualization';

interface TrieVisualizerProps {
  problem: Problem;
  customData?: TrieVisualizationData;
}

export const TrieVisualizer: React.FC<TrieVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultSteps: TrieStep[] = [
    {
      title: 'Initialize Root TrieNode',
      whatHappens: 'Create root with empty children dictionary.',
      whyRationale: 'Trie stores common prefixes efficiently.',
      nodes: {
        root: { id: 'root', char: 'ROOT', isEnd: false, children: { a: 'node_a' } },
        node_a: { id: 'node_a', char: 'a', isEnd: true, children: {} }
      },
      activeNodeId: 'root',
      states: { root: 'created' },
      codeSnippet: 'self.root = TrieNode()',
      impact: 'Time: O(L) | Space: O(N × L)',
    }
  ];

  const steps: TrieStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
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

  const nodesList = Object.values(cur.nodes || {});

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
          {cur.currentWord && <span className="text-sky-sticker font-bold max-w-[200px] truncate">word: "{cur.currentWord}"</span>}
          {cur.result !== undefined && <span className="text-sprout-sticker font-bold max-w-[200px] truncate">result: {String(cur.result)}</span>}
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6 overflow-x-auto select-none">
        <div className="flex items-center gap-3 flex-wrap justify-center min-w-max">
          {nodesList.map(node => {
            const isActive = cur.activeNodeId === node.id;
            const isMatched = node.status === 'matched';
            const isInserted = node.status === 'inserted';

            const charStr = String(node.char);
            const isLong = charStr.length > 2;

            return (
              <div
                key={node.id}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 shadow-hard transition-all duration-200 min-w-[70px] max-w-[140px] overflow-hidden ${
                  isActive
                    ? 'border-marker-orange bg-primary-fixed scale-105 shadow-md text-charcoal'
                    : isMatched
                    ? 'border-sprout-sticker bg-[#22c55e]/15 text-charcoal'
                    : isInserted
                    ? 'border-sky-500 bg-sky-50 text-charcoal'
                    : 'border-charcoal bg-surface text-charcoal'
                }`}
              >
                <span className={`font-mono font-bold truncate max-w-full ${isLong ? 'text-xs md:text-sm' : 'text-base md:text-lg'}`}>
                  {node.char}
                </span>
                <div className="flex gap-1 items-center flex-wrap justify-center">
                  {node.isEnd && (
                    <span className="bg-sprout-sticker text-white text-[9px] font-mono px-1 rounded-pill">END</span>
                  )}
                  {node.count !== undefined && (
                    <span className="bg-surface-container-high text-on-surface-variant text-[9px] font-mono px-1 rounded">
                      cnt:{node.count}
                    </span>
                  )}
                </div>
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
        timeSpaceImpact={cur.impact || 'Time: O(L) | Space: O(N × L)'}
      />
    </div>
  );
};