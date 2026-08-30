import React, { useState } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

interface Step {
  title: string;
  whatHappens: string;
  whyRationale: string;
  nodes: { val: string | number; label?: string; status?: 'active' | 'success' | 'danger' | 'muted' }[];
  pointers: { slow?: string | number; fast?: string | number; prev?: string | number; curr?: string | number; l1?: string | number; l2?: string | number };
  states: Record<string, string | number | boolean | undefined>;
  codeSnippet: string;
  impact?: string;
}

function buildLinkedListSteps(problem?: Problem): Step[] {
  const t = (problem?.title || '').toLowerCase();

  // 1. Middle of Linked List
  if (t.includes('middle of')) {
    return [
      {
        title: 'Initialize Slow & Fast at Head',
        whatHappens: 'Both slow and fast start at Node(1).',
        whyRationale: 'Fast moves twice as fast as slow. When fast reaches the end, slow is exactly in the middle.',
        nodes: [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }, { val: 5 }],
        pointers: { slow: 1, fast: 1 },
        states: { slow: 'Node(1)', fast: 'Node(1)' },
        codeSnippet: 'slow = head\nfast = head',
        impact: 'Time: O(N) | Space: O(1)',
      },
      {
        title: 'Step 1: Advance Pointers',
        whatHappens: 'slow moves 1 step to Node(2). fast moves 2 steps to Node(3).',
        whyRationale: 'Each iteration maintains the 2:1 distance invariant.',
        nodes: [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }, { val: 5 }],
        pointers: { slow: 2, fast: 3 },
        states: { slow: 'Node(2)', fast: 'Node(3)' },
        codeSnippet: 'slow = slow.next\nfast = fast.next.next',
      },
      {
        title: 'Step 2: Advance to Tail',
        whatHappens: 'slow moves to Node(3). fast moves to Node(5) (tail).',
        whyRationale: 'fast.next is None, so fast cannot move further.',
        nodes: [{ val: 1 }, { val: 2 }, { val: 3, status: 'success' }, { val: 4 }, { val: 5 }],
        pointers: { slow: 3, fast: 5 },
        states: { slow: 'Node(3) [MIDDLE]', fast: 'Node(5) [TAIL]' },
        codeSnippet: 'while fast and fast.next:\n    slow = slow.next\n    fast = fast.next.next',
      },
      {
        title: 'Return Middle Node',
        whatHappens: 'Loop terminates. slow points to Node(3), which is the exact middle.',
        whyRationale: 'For odd length N=5, node 3 is middle. For even length N=6, node 4 (second middle) is returned.',
        nodes: [{ val: 1, status: 'muted' }, { val: 2, status: 'muted' }, { val: 3, status: 'success' }, { val: 4 }, { val: 5 }],
        pointers: { slow: 3 },
        states: { result: 'Node(3)' },
        codeSnippet: 'return slow',
      },
    ];
  }

  // 2. Merge Two Sorted Lists
  if (t.includes('merge two sorted')) {
    return [
      {
        title: 'Initialize Dummy Head',
        whatHappens: 'Create dummy node. Set l1=Node(1), l2=Node(1).',
        whyRationale: 'Dummy head simplifies edge cases so we do not need special head initialization.',
        nodes: [{ val: 'dummy', label: 'dummy' }, { val: '1 (L1)' }, { val: '1 (L2)' }, { val: '2 (L1)' }, { val: '3 (L2)' }, { val: '4 (L1)' }],
        pointers: { l1: '1 (L1)', l2: '1 (L2)' },
        states: { 'dummy.next': 'null', l1: 1, l2: 1 },
        codeSnippet: 'dummy = ListNode(0)\ntail = dummy',
        impact: 'Time: O(N + M) | Space: O(1)',
      },
      {
        title: 'Compare & Append Smaller',
        whatHappens: 'l1.val (1) <= l2.val (1) → Attach l1. Advance l1 to 2.',
        whyRationale: 'Always take the smaller value to maintain sorted ascending order.',
        nodes: [{ val: 'dummy' }, { val: '1 (L1)', status: 'success' }, { val: '1 (L2)' }, { val: '2 (L1)' }],
        pointers: { curr: '1 (L1)', l1: '2 (L1)', l2: '1 (L2)' },
        states: { attached: '1 (L1)', l1: 2, l2: 1 },
        codeSnippet: 'if l1.val <= l2.val:\n    tail.next = l1\n    l1 = l1.next',
      },
      {
        title: 'Attach Remaining Nodes',
        whatHappens: 'Compare next elements and stitch remainder list: 1 -> 1 -> 2 -> 3 -> 4 -> 4.',
        whyRationale: 'When one list is exhausted, attach the non-null list in O(1) time.',
        nodes: [{ val: 1 }, { val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }, { val: 4, status: 'success' }],
        pointers: { curr: 4 },
        states: { merged: '[1, 1, 2, 3, 4, 4]' },
        codeSnippet: 'tail.next = l1 if l1 else l2\nreturn dummy.next',
      },
    ];
  }

  // 3. Linked List Cycle / Cycle II
  if (t.includes('cycle')) {
    return [
      {
        title: 'Cycle Detection: Slow & Fast',
        whatHappens: 'Start slow & fast at head of [3 -> 2 -> 0 -> -4 -> (loops to 2)].',
        whyRationale: 'If a cycle exists, fast will lap slow inside the loop.',
        nodes: [{ val: 3 }, { val: 2 }, { val: 0 }, { val: -4, label: 'loop to 2' }],
        pointers: { slow: 3, fast: 3 },
        states: { slow: 3, fast: 3, cycle: 'unknown' },
        codeSnippet: 'slow = head\nfast = head',
        impact: 'Time: O(N) | Space: O(1)',
      },
      {
        title: 'Step 1: Traverse Cycle',
        whatHappens: 'slow moves to 2. fast moves to 0.',
        whyRationale: 'Fast closes distance by 1 node each step inside the loop.',
        nodes: [{ val: 3 }, { val: 2 }, { val: 0 }, { val: -4 }],
        pointers: { slow: 2, fast: 0 },
        states: { slow: 2, fast: 0 },
        codeSnippet: 'slow = slow.next\nfast = fast.next.next',
      },
      {
        title: 'Collision Detected',
        whatHappens: 'slow and fast meet at Node(-4). Cycle confirmed!',
        whyRationale: 'Relative speed is 1 node/step, so meeting is guaranteed within loop length.',
        nodes: [{ val: 3 }, { val: 2, status: 'success' }, { val: 0 }, { val: -4, status: 'danger' }],
        pointers: { slow: -4, fast: -4 },
        states: { meetingPoint: -4, cycleDetected: true },
        codeSnippet: 'if slow == fast:\n    break # Cycle detected',
      },
      {
        title: 'Find Entry Point (Cycle II)',
        whatHappens: 'Reset slow to head (3). Move both slow and fast 1 step at a time until they meet at Node(2).',
        whyRationale: 'Distance from head to entry equals distance from meeting point to entry.',
        nodes: [{ val: 3 }, { val: 2, status: 'success', label: 'CYCLE ENTRY' }, { val: 0 }, { val: -4 }],
        pointers: { slow: 2, fast: 2 },
        states: { cycleEntryNode: 2 },
        codeSnippet: 'slow = head\nwhile slow != fast:\n    slow = slow.next\n    fast = fast.next\nreturn slow',
      },
    ];
  }

  // 4. Remove Nth Node From End
  if (t.includes('remove nth') || t.includes('delete node in a linked list')) {
    return [
      {
        title: 'Two Pointers with N Gap',
        whatHappens: 'Remove 2nd node from end of [1, 2, 3, 4, 5]. Advance fast pointer by N=2 steps.',
        whyRationale: 'Maintaining an N-step gap between slow and fast identifies the target in 1 pass.',
        nodes: [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }, { val: 5 }],
        pointers: { slow: 1, fast: 3 },
        states: { n: 2, fastOffset: '2 steps ahead' },
        codeSnippet: 'for _ in range(n):\n    fast = fast.next',
        impact: 'Time: O(N) | Space: O(1)',
      },
      {
        title: 'Move Both until Fast reaches End',
        whatHappens: 'Move slow and fast simultaneously until fast reaches tail (5). slow is now at Node(3).',
        whyRationale: 'slow.next is now exactly the N-th node from the end (Node 4).',
        nodes: [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 4, status: 'danger', label: 'TARGET' }, { val: 5 }],
        pointers: { slow: 3, fast: 5 },
        states: { slow: 3, targetToDelete: 4 },
        codeSnippet: 'while fast.next:\n    slow = slow.next\n    fast = fast.next',
      },
      {
        title: 'Bypass & Delete Node',
        whatHappens: 'Set slow.next = slow.next.next (skip Node 4). Result: [1 -> 2 -> 3 -> 5].',
        whyRationale: 'Unlinking the node frees it in O(1) space without full array reallocation.',
        nodes: [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 5, status: 'success' }],
        pointers: { curr: 3 },
        states: { removed: 4, result: '[1, 2, 3, 5]' },
        codeSnippet: 'slow.next = slow.next.next\nreturn dummy.next',
      },
    ];
  }

  // 5. Add Two Numbers
  if (t.includes('add two numbers')) {
    return [
      {
        title: 'Initialize Sum with Carry=0',
        whatHappens: 'l1=[2 -> 4 -> 3] (342) and l2=[5 -> 6 -> 4] (465). Start at units digit.',
        whyRationale: 'Numbers are stored in reverse order, allowing natural left-to-right addition with carry.',
        nodes: [{ val: '2 + 5 = 7' }, { val: '4 + 6 = 10' }, { val: '3 + 4 + 1 = 8' }],
        pointers: { l1: 2, l2: 5 },
        states: { carry: 0, currentDigit: 7 },
        codeSnippet: 'carry = 0\ndummy = ListNode(0)',
        impact: 'Time: O(max(N, M)) | Space: O(max(N, M))',
      },
      {
        title: 'Tens Column: 4 + 6 = 10',
        whatHappens: 'sum = 10. Node value = 10 % 10 = 0. New carry = 10 // 10 = 1.',
        whyRationale: 'Standard column arithmetic with digit propagation.',
        nodes: [{ val: 7 }, { val: 0, status: 'success' }, { val: '3 + 4 (+1)' }],
        pointers: { l1: 4, l2: 6 },
        states: { digitCreated: 0, newCarry: 1 },
        codeSnippet: 'val = (l1.val + l2.val + carry)\ncarry = val // 10\ncurr.next = ListNode(val % 10)',
      },
      {
        title: 'Hundreds Column: 3 + 4 + 1 = 8',
        whatHappens: 'sum = 8, carry = 0. Result list: [7 -> 0 -> 8] (represents 807).',
        whyRationale: '342 + 465 = 807. Done in single linear pass.',
        nodes: [{ val: 7 }, { val: 0 }, { val: 8, status: 'success' }],
        pointers: { curr: 8 },
        states: { totalResult: '[7, 0, 8]', carry: 0 },
        codeSnippet: 'return dummy.next',
      },
    ];
  }

  // 6. Default: Reverse Linked List
  return [
    {
      title: 'Initialize (prev=null, curr=Node 1)',
      whatHappens: 'Initialize prev = null and curr = head (Node 1).',
      whyRationale: 'Three pointers needed because changing curr.next severs the link. Saving next ensures we can advance.',
      nodes: [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }, { val: 5 }],
      pointers: { prev: 'null', curr: 1 },
      states: { prev: 'null', curr: 'Node(1)', next: 'Node(2)' },
      codeSnippet: 'prev = None\ncurrent = head',
      impact: 'Time: O(N) | Space: O(1)',
    },
    {
      title: 'Reverse Node 1 → null',
      whatHappens: 'Set Node(1).next = prev (null). Move prev=Node(1), curr=Node(2).',
      whyRationale: 'Node 1 is the new tail, so its next must point to null.',
      nodes: [{ val: 1, status: 'success' }, { val: 2 }, { val: 3 }, { val: 4 }, { val: 5 }],
      pointers: { prev: 1, curr: 2 },
      states: { prev: 'Node(1)', curr: 'Node(2)', next: 'Node(3)' },
      codeSnippet: 'next_node = current.next\ncurrent.next = prev\nprev = current\ncurrent = next_node',
    },
    {
      title: 'Reverse Node 2 → Node 1',
      whatHappens: 'Set Node(2).next = Node(1). Advance prev=Node(2), curr=Node(3).',
      whyRationale: 'Sub-chain [2 -> 1 -> null] formed.',
      nodes: [{ val: 2, status: 'success' }, { val: 1 }, { val: 3 }, { val: 4 }, { val: 5 }],
      pointers: { prev: 2, curr: 3 },
      states: { prev: 'Node(2)', curr: 'Node(3)', next: 'Node(4)' },
      codeSnippet: 'current.next = prev\nprev = current; current = next_node',
    },
    {
      title: 'Reverse Node 3 → Node 2',
      whatHappens: 'Set Node(3).next = Node(2). Advance prev=Node(3), curr=Node(4).',
      whyRationale: 'Sub-chain [3 -> 2 -> 1 -> null] formed.',
      nodes: [{ val: 3, status: 'success' }, { val: 2 }, { val: 1 }, { val: 4 }, { val: 5 }],
      pointers: { prev: 3, curr: 4 },
      states: { prev: 'Node(3)', curr: 'Node(4)', next: 'Node(5)' },
      codeSnippet: 'current.next = prev\nprev = current; current = next_node',
    },
    {
      title: 'Reverse Complete & Return Head',
      whatHappens: 'Set Node(5).next = Node(4). curr=null. Return prev (Node 5) as new head.',
      whyRationale: 'All nodes inverted. prev points to old tail = new head: [5 -> 4 -> 3 -> 2 -> 1].',
      nodes: [{ val: 5, status: 'success' }, { val: 4 }, { val: 3 }, { val: 2 }, { val: 1 }],
      pointers: { prev: 5, curr: 'null' },
      states: { prev: 'Node(5) [HEAD]', curr: 'null' },
      codeSnippet: 'return prev',
    },
  ];
}

export const LinkedListVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const steps = buildLinkedListSteps(problem);
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

      <div className="py-8 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex items-center justify-center overflow-x-auto">
        <div className="flex items-center gap-3.5 min-w-max">
          {cur.nodes.map((node, idx) => {
            const isSlow = cur.pointers.slow === node.val;
            const isFast = cur.pointers.fast === node.val;
            const isCurr = cur.pointers.curr === node.val;
            const isPrev = cur.pointers.prev === node.val;

            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-5 text-xs font-mono font-bold flex items-center gap-1">
                    {isSlow && <span className="bg-sky-sticker text-white px-1 rounded text-[10px]">slow</span>}
                    {isFast && <span className="bg-sprout-sticker text-white px-1 rounded text-[10px]">fast</span>}
                    {isPrev && <span className="bg-[#ba1a1a] text-white px-1 rounded text-[10px]">prev</span>}
                    {isCurr && <span className="bg-marker-orange text-white px-1 rounded text-[10px]">curr</span>}
                    {node.label && <span className="text-cocoa-ink text-[10px]">{node.label}</span>}
                  </div>
                  <div className={`flex items-center rounded-lg border-2 shadow-hard transition-all duration-300 ${
                    node.status === 'success' ? 'border-sprout-sticker bg-[#22c55e]/15'
                    : node.status === 'danger' ? 'border-[#ba1a1a] bg-[#ffdad6]'
                    : isCurr || isSlow ? 'border-marker-orange bg-primary-fixed scale-105'
                    : 'border-charcoal bg-surface'
                  }`}>
                    <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center font-mono font-bold text-sm md:text-base border-r border-charcoal px-2">{node.val}</div>
                    <div className="w-6 h-12 md:w-7 md:h-14 flex items-center justify-center text-xs font-mono text-on-surface-variant bg-dew-drop">•</div>
                  </div>
                </div>
                {idx < cur.nodes.length - 1 && (
                  <div className="flex flex-col items-center justify-center px-1">
                    <span className="text-xl font-bold text-charcoal">→</span>
                  </div>
                )}
              </React.Fragment>
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
        variableStates={cur.states}
        codeSnippet={cur.codeSnippet}
        timeSpaceImpact={cur.impact || 'Time: O(N) | Space: O(1)'}
      />
    </div>
  );
};