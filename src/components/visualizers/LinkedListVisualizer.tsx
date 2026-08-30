import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

export const LinkedListVisualizer: React.FC = () => {
  const stepsInfo = [
    { title: "Initialize (prev=null, curr=Node 1)", whatHappens: "Initialize prev = null and curr = head (Node 1).", whyRationale: "Three pointers needed because changing curr.next severs the link. Saving next ensures we can advance.", states: { prev: "null", curr: "Node(1)", next: "Node(2)" }, codeSnippet: "prev = None\ncurrent = head" },
    { title: "Reverse Node 1 → null", whatHappens: "Set Node(1).next = prev (null). Move prev=Node(1), curr=Node(2).", whyRationale: "Node 1 is the new tail, so its next must point to null.", states: { prev: "Node(1)", curr: "Node(2)", next: "Node(3)" }, codeSnippet: "next_node = current.next\ncurrent.next = prev\nprev = current\ncurrent = next_node" },
    { title: "Reverse Node 2 → Node 1", whatHappens: "Set Node(2).next = Node(1). Advance prev=Node(2), curr=Node(3).", whyRationale: "Sub-chain [2 -> 1 -> null] formed.", states: { prev: "Node(2)", curr: "Node(3)", next: "Node(4)" }, codeSnippet: "current.next = prev\nprev = current; current = next_node" },
    { title: "Reverse Node 3 → Node 2", whatHappens: "Set Node(3).next = Node(2). Advance prev=Node(3), curr=Node(4).", whyRationale: "Sub-chain [3 -> 2 -> 1 -> null] formed.", states: { prev: "Node(3)", curr: "Node(4)", next: "Node(5)" }, codeSnippet: "current.next = prev\nprev = current; current = next_node" },
    { title: "Reverse Node 4 → Node 3", whatHappens: "Set Node(4).next = Node(3). Advance prev=Node(4), curr=Node(5).", whyRationale: "Sub-chain [4 -> 3 -> 2 -> 1 -> null] formed.", states: { prev: "Node(4)", curr: "Node(5)", next: "null" }, codeSnippet: "current.next = prev\nprev = current; current = next_node" },
    { title: "Reverse Node 5 → Node 4 & Return", whatHappens: "Set Node(5).next = Node(4). curr=null. Return prev (Node 5) as new head.", whyRationale: "All nodes inverted. 'prev' points to old tail = new head.", states: { prev: "Node(5) [HEAD]", curr: "null", next: "null" }, codeSnippet: "return prev" },
  ];

  const [step, setStep] = useState(0);
  const cur = stepsInfo[step];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="default" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="h-8 px-2.5 text-xs">
            <ChevronLeft className="w-4 h-4" /><span>prev</span>
          </Button>
          <Button size="sm" variant="primary" onClick={() => setStep(Math.min(stepsInfo.length - 1, step + 1))} disabled={step === stepsInfo.length - 1} className="h-8 px-3 text-xs">
            <span>{step === stepsInfo.length - 1 ? 'reversed!' : 'next flip'}</span><ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setStep(0)} className="h-8"><RotateCcw className="w-3.5 h-3.5" /></Button>
        </div>
        <div className="text-xs md:text-sm font-mono flex items-center gap-3">
          <span className="text-sky-sticker font-bold">prev: {cur.states.prev}</span>
          <span className="text-marker-orange font-bold">curr: {cur.states.curr}</span>
        </div>
      </div>

      <div className="py-8 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex items-center justify-center overflow-x-auto">
        <div className="flex items-center gap-3.5 min-w-max">
          {[1, 2, 3, 4, 5].map((nodeVal, idx) => {
            const isReversed = idx < step, isCurr = idx === step, isPrev = idx === step - 1;
            return (
              <React.Fragment key={nodeVal}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-5 text-xs font-mono font-bold">
                    {isPrev && <span className="text-sky-sticker">prev</span>}
                    {isCurr && <span className="text-marker-orange">curr</span>}
                  </div>
                  <div className={`flex items-center rounded-lg border-2 shadow-hard transition-all duration-300 ${
                    isCurr ? 'border-marker-orange bg-primary-fixed scale-105'
                    : isReversed ? 'border-sprout-sticker bg-[#22c55e]/15'
                    : 'border-charcoal bg-surface'
                  }`}>
                    <div className="w-11 h-12 md:w-12 md:h-14 flex items-center justify-center font-mono font-bold text-base md:text-lg border-r border-charcoal">{nodeVal}</div>
                    <div className="w-8 h-12 md:w-9 md:h-14 flex items-center justify-center text-xs font-mono text-on-surface-variant bg-dew-drop">•</div>
                  </div>
                </div>
                {idx < 4 && (
                  <div className="flex flex-col items-center justify-center px-1">
                    <span className={`text-xl font-bold transition-transform duration-300 ${idx < step ? 'text-sprout-sticker -scale-x-100' : 'text-charcoal'}`}>
                      {idx < step ? '←' : '→'}
                    </span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <StepCard
        stepNumber={step + 1} totalSteps={stepsInfo.length}
        title={cur.title} whatHappens={cur.whatHappens} whyRationale={cur.whyRationale}
        variableStates={cur.states} codeSnippet={cur.codeSnippet}
        timeSpaceImpact="Time: O(N) | Space: O(1)"
      />
    </div>
  );
};