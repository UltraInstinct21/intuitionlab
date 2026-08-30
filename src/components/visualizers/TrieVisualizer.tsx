import React, { useState } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

interface TrieStep {
  title: string;
  whatHappens: string;
  whyRationale: string;
  nodes: { char: string; isEnd?: boolean; count?: number; active?: boolean }[];
  states: Record<string, string | number | boolean | undefined>;
  codeSnippet: string;
  impact?: string;
}

function buildTrieSteps(problem?: Problem): TrieStep[] {
  const t = (problem?.title || '').toLowerCase();

  // 1. Longest Common Prefix
  if (t.includes('longest common prefix')) {
    return [
      {
        title: 'Insert Words: ["flower", "flow", "flight"]',
        whatHappens: 'Insert strings into Trie. Root branches on "f" -> "l".',
        whyRationale: 'The common prefix is the unbranched path from the root before any node splits.',
        nodes: [
          { char: 'root', active: true },
          { char: 'f', active: true, count: 3 },
          { char: 'l', active: true, count: 3 },
          { char: 'o / i (fork)', isEnd: false },
        ],
        states: { currentCommonPrefix: '"fl"', matchingWords: 3 },
        codeSnippet: 'prefix = ""\nnode = root\nwhile len(node.children) == 1 and not node.is_end:\n    char = next(iter(node.children))\n    prefix += char\n    node = node.children[char]',
        impact: 'Time: O(N × L) | Space: O(N × L)',
      },
      {
        title: 'Detect Branching at "l" (splits into "o" and "i")',
        whatHappens: 'Node "l" has 2 children: "o" (flower, flow) and "i" (flight). Stop traversal.',
        whyRationale: 'Branching indicates characters differ across the input strings. Longest common prefix is "fl".',
        nodes: [
          { char: 'root' },
          { char: 'f', active: true },
          { char: 'l', active: true, isEnd: true },
          { char: 'o', count: 2 },
          { char: 'i', count: 1 },
        ],
        states: { branchFound: true, resultLCP: '"fl"' },
        codeSnippet: 'return prefix # "fl"',
      },
    ];
  }

  // 2. Default: Trie Insert & Search
  return [
    {
      title: 'Initialize Root TrieNode',
      whatHappens: 'Create root with empty children map and isEnd = False.',
      whyRationale: 'Trie root serves as anchor for all words starting with any character a-z.',
      nodes: [{ char: 'root', active: true }],
      states: { wordsInTrie: 0 },
      codeSnippet: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False',
      impact: 'Time: O(L) per operation | Space: O(N × L)',
    },
    {
      title: 'Insert "apple"',
      whatHappens: 'Create path root -> "a" -> "p" -> "p" -> "l" -> "e". Mark "e" as isEnd = True.',
      whyRationale: 'Every character creates or follows an existing child pointer.',
      nodes: [
        { char: 'a' },
        { char: 'p' },
        { char: 'p' },
        { char: 'l' },
        { char: 'e', isEnd: true, active: true },
      ],
      states: { insertedWord: '"apple"', wordLength: 5 },
      codeSnippet: 'for ch in word:\n    if ch not in node.children:\n        node.children[ch] = TrieNode()\n    node = node.children[ch]\nnode.is_end = True',
    },
    {
      title: 'Search "app" vs "apple"',
      whatHappens: 'search("apple") -> True (isEnd is True). search("app") -> False ("p" has isEnd=False). startsWith("app") -> True.',
      whyRationale: 'isEnd flag differentiates complete words from mere prefixes.',
      nodes: [
        { char: 'a' },
        { char: 'p' },
        { char: 'p', isEnd: false, active: true },
        { char: 'l' },
        { char: 'e', isEnd: true },
      ],
      states: { 'search("app")': false, 'startsWith("app")': true, 'search("apple")': true },
      codeSnippet: 'return node.is_end # for search()\nreturn True # for startsWith()',
    },
  ];
}

export const TrieVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const steps = buildTrieSteps(problem);
  const cur = steps[step] || steps[0];

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
          <Button size="sm" variant="ghost" onClick={() => setStep(0)} className="h-8"><RotateCcw className="w-3.5 h-3.5" /></Button>
        </div>
        <div className="text-xs md:text-sm font-mono flex items-center gap-3">
          <span className="text-marker-orange font-bold">step {step + 1} of {steps.length}</span>
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {cur.nodes.map((n, i) => (
            <React.Fragment key={i}>
              <div
                className={`px-3.5 py-2.5 rounded-xl border-2 shadow-hard font-mono font-bold text-sm flex items-center gap-1.5 transition-all duration-200 ${
                  n.active
                    ? 'bg-primary-container text-on-primary-container border-charcoal scale-105'
                    : 'bg-surface text-charcoal border-outline/40'
                }`}
              >
                <span>{n.char}</span>
                {n.isEnd && <span className="text-xs font-bold text-sprout-sticker">* [END]</span>}
                {n.count !== undefined && <span className="text-[10px] text-on-surface-variant">({n.count})</span>}
              </div>
              {i < cur.nodes.length - 1 && <span className="text-charcoal font-bold">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <StepCard
        stepNumber={step + 1}
        totalSteps={steps.length}
        title={cur.title}
        whatHappens={cur.whatHappens}
        whyRationale={cur.whyRationale}
        variableStates={cur.states}
        codeSnippet={cur.codeSnippet}
        timeSpaceImpact={cur.impact || 'Time: O(L) | Space: O(N × L)'}
      />
    </div>
  );
};