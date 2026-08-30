import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';

interface Step {
  title: string;
  whatHappens: string;
  whyRationale: string;
  codeLine: string;
  stack: (number | string)[];
  action: string;
  auxStack?: (number | string)[];
  extraInfo?: string;
}

function buildStackSteps(problem: Problem): Step[] {
  const t = (problem.title || '').toLowerCase();
  const steps: Step[] = [];

  // 1. Valid Parentheses
  if (t.includes('valid parentheses')) {
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    return [
      {
        title: 'Initialize Stack with Input "({[]})"',
        whatHappens: 'Empty stack. Encountered opening bracket "(". Push onto stack.',
        whyRationale: 'Stack enforces LIFO — the innermost opening bracket must match the first closing bracket.',
        codeLine: 'stack = []\nstack.append("(") # pushed "("',
        stack: ['('],
        action: 'push "("',
      },
      {
        title: 'Push "{" and "["',
        whatHappens: 'Encountered "{" then "[". Push both onto stack. Stack: ["(", "{", "["].',
        whyRationale: 'Every opening bracket is stored waiting for its corresponding closing pair.',
        codeLine: 'stack.append("{")\nstack.append("[")',
        stack: ['(', '{', '['],
        action: 'push "{" & "["',
      },
      {
        title: 'Match "]" with Top "["',
        whatHappens: 'Encountered closing "]". Matches stack top "[". Pop "[" from stack. Stack becomes ["(", "{"].',
        whyRationale: 'Top of stack is valid matching opener.',
        codeLine: 'if stack and stack[-1] == "[":\n    stack.pop()',
        stack: ['(', '{'],
        action: 'pop "[" (matched)',
      },
      {
        title: 'Match "}" and ")"',
        whatHappens: 'Closing "}" pops "{" and closing ")" pops "(". Stack is now empty.',
        whyRationale: 'All brackets closed in correct symmetrical order.',
        codeLine: 'return len(stack) == 0 # True',
        stack: [],
        action: 'stack empty',
        extraInfo: 'Valid Parentheses: True',
      },
    ];
  }

  // 2. Largest Rectangle in Histogram
  if (t.includes('largest rectangle')) {
    const heights = [2, 1, 5, 6, 2, 3];
    return [
      {
        title: 'Step 1: Monotonic Increasing Stack',
        whatHappens: 'Histogram heights: [2, 1, 5, 6, 2, 3]. Stack stores indices of increasing heights.',
        whyRationale: 'A bar can extend as a rectangle as long as subsequent bars are greater than or equal to its height.',
        codeLine: 'stack = [-1]\nmax_area = 0',
        stack: [2],
        action: 'push idx 0 (h=2)',
      },
      {
        title: 'Step 2: Pop on Dip at Index 1 (h=1 < h=2)',
        whatHappens: 'Height 1 < height 2. Pop index 0. Area = height (2) * width (1) = 2. Max area = 2.',
        whyRationale: 'Height 2 cannot extend past index 1, so its maximum potential area is finalized.',
        codeLine: 'h = heights[stack.pop()]\nw = i - stack[-1] - 1\nmax_area = max(max_area, h * w)',
        stack: [1],
        action: 'pop idx 0, area=2',
      },
      {
        title: 'Step 3: Push 5 & 6, Pop at Index 4 (h=2)',
        whatHappens: 'Push 5 and 6. At index 4 (h=2 < 6), pop 6: area = 6 * 1 = 6. Pop 5: area = 5 * (4 - 1 - 1) = 5 * 2 = 10!',
        whyRationale: 'Height 5 extends across width 2 (indices 2 and 3) yielding area 10.',
        codeLine: 'max_area = max(10, 6) # Area 10 discovered',
        stack: [1, 2],
        action: 'max area = 10',
        extraInfo: 'Max Area = 10 (height 5 × width 2)',
      },
      {
        title: 'Step 4: Finalize Remaining Bars',
        whatHappens: 'Pop remaining stack elements with virtual right boundary at N=6. Global maximum area remains 10.',
        whyRationale: 'Linear O(N) pass with monotonic stack solves histogram area in single traversal.',
        codeLine: 'return max_area # 10',
        stack: [],
        action: 'complete',
        extraInfo: 'Max Area = 10',
      },
    ];
  }

  // 3. Sliding Window Maximum
  if (t.includes('sliding window maximum')) {
    return [
      {
        title: 'Step 1: First Window [1, 3, -1], k=3',
        whatHappens: 'Array: [1, 3, -1, -3, 5, 3, 6, 7], k=3. Deque stores indices in decreasing value order. Deque: [index 1 (val 3), index 2 (val -1)].',
        whyRationale: '1 is smaller than 3 and appeared earlier, so it can never be the maximum of this or future windows.',
        codeLine: 'while dq and nums[dq[-1]] < nums[i]: dq.pop()\ndq.append(i)',
        stack: [3, -1],
        action: 'window 1 max = 3',
      },
      {
        title: 'Step 2: Slide Window to [3, -1, -3]',
        whatHappens: 'Add index 3 (val -3). Deque: [3, -1, -3]. Window maximum is front of deque: 3.',
        whyRationale: 'Front of monotonic deque always holds maximum element for current window in O(1) time.',
        codeLine: 'res.append(nums[dq[0]]) # 3',
        stack: [3, -1, -3],
        action: 'window 2 max = 3',
      },
      {
        title: 'Step 3: Slide Window to [-1, -3, 5]',
        whatHappens: 'Index 1 (val 3) falls out of window. 5 is larger than all elements in deque, so all are popped! Deque: [5].',
        whyRationale: '5 dominates all smaller preceding elements.',
        codeLine: 'if dq[0] < i - k + 1: dq.popleft()\n# 5 clears smaller',
        stack: [5],
        action: 'window 3 max = 5',
        extraInfo: 'Output so far: [3, 3, 5]',
      },
      {
        title: 'Step 4: Complete All Windows',
        whatHappens: 'Final result across all sliding windows: [3, 3, 5, 5, 6, 7].',
        whyRationale: 'Each index pushed and popped at most once → O(N) total time.',
        codeLine: 'return result # [3, 3, 5, 5, 6, 7]',
        stack: [7],
        action: 'completed',
        extraInfo: 'Result: [3, 3, 5, 5, 6, 7]',
      },
    ];
  }

  // 4. Min Stack
  if (t.includes('min stack')) {
    return [
      {
        title: 'Step 1: Push 5 (min = 5)',
        whatHappens: 'Main Stack: [5]. Min Stack: [5]. Current minimum is 5.',
        whyRationale: 'First element pushed is automatically the current minimum.',
        codeLine: 'self.stack.append(5)\nself.min_stack.append(5)',
        stack: [5],
        auxStack: [5],
        action: 'push 5, min=5',
      },
      {
        title: 'Step 2: Push 3 (new min = 3)',
        whatHappens: 'Push 3. 3 < 5 → Min Stack gets 3. Main Stack: [5, 3]. Min Stack: [5, 3].',
        whyRationale: 'New smaller value updates top of min stack.',
        codeLine: 'self.min_stack.append(min(3, 5)) # 3',
        stack: [5, 3],
        auxStack: [5, 3],
        action: 'push 3, min=3',
      },
      {
        title: 'Step 3: Push 7 (min stays 3)',
        whatHappens: 'Push 7. 7 >= 3 → Min Stack gets 3. Main Stack: [5, 3, 7]. Min Stack: [5, 3, 3].',
        whyRationale: 'Minimum remains 3 for this stack height.',
        codeLine: 'self.min_stack.append(min(7, 3)) # 3',
        stack: [5, 3, 7],
        auxStack: [5, 3, 3],
        action: 'push 7, min=3',
      },
      {
        title: 'Step 4: Pop 7 & getMin() = 3',
        whatHappens: 'Pop 7. Top of Min Stack is 3. getMin() returns 3 in O(1) time.',
        whyRationale: 'Parallel auxiliary stack guarantees constant time retrieval of historical minimums.',
        codeLine: 'def getMin(): return self.min_stack[-1] # 3',
        stack: [5, 3],
        auxStack: [5, 3],
        action: 'getMin() -> 3',
        extraInfo: 'getMin() = 3 in O(1)',
      },
    ];
  }

  // 5. Default Fallback / Monotonic Next Greater
  const arr = [4, 5, 2, 25];
  return [
    {
      title: 'Initialize Stack with [4, 5, 2, 25]',
      whatHappens: 'Array: [4, 5, 2, 25]. Push index 0 (val 4) onto stack.',
      whyRationale: 'Elements wait on stack until a greater element appears to their right.',
      codeLine: 'stack = [0]\nres = [-1] * len(nums)',
      stack: [4],
      action: 'push 4',
    },
    {
      title: 'arr[1]=5 > arr[0]=4 → Next Greater for 4 is 5',
      whatHappens: '5 > 4. Pop 4, set result[0] = 5. Push 5 onto stack.',
      whyRationale: 'First element strictly larger than 4 encountered.',
      codeLine: 'while stack and nums[stack[-1]] < nums[i]:\n    res[stack.pop()] = nums[i]',
      stack: [5],
      action: 'res[0] = 5',
      extraInfo: 'Next Greater for 4 = 5',
    },
    {
      title: 'Push 2, then Pop on 25',
      whatHappens: 'Push 2 (stack: [5, 2]). 25 > 2 and 25 > 5 → Pop both! Set res[2]=25, res[1]=25.',
      whyRationale: '25 resolves all smaller pending elements on stack.',
      codeLine: 'res[stack.pop()] = 25',
      stack: [25],
      action: 'res[1]=25, res[2]=25',
      extraInfo: 'Result: [5, 25, 25, -1]',
    },
  ];
}

export const StackStepVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const steps = buildStackSteps(problem);
  const s = steps[step] || steps[0];

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
          <Button size="sm" variant="ghost" onClick={() => { setStep(0); setIsPlaying(false); }} className="h-8">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="text-xs md:text-sm font-mono flex items-center gap-3">
          <span className="text-marker-orange font-bold">step {step + 1} of {steps.length}</span>
          {s.extraInfo && <span className="text-sprout-sticker font-bold">{s.extraInfo}</span>}
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6">
        <div className="flex items-end gap-6 justify-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-mono font-bold text-charcoal">Main Stack (LIFO)</span>
            <div className="w-24 min-h-[140px] p-2 bg-surface-container-high rounded-xl border-2 border-charcoal flex flex-col-reverse items-center gap-1.5 shadow-hard">
              {s.stack.length === 0 ? (
                <span className="text-[10px] font-mono text-on-surface-variant my-auto">empty</span>
              ) : (
                s.stack.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-full py-1.5 px-2 rounded-md border text-center font-mono font-bold text-xs transition-all duration-200 ${
                      idx === s.stack.length - 1
                        ? 'bg-primary-container text-on-primary-container border-charcoal scale-105 shadow-xs'
                        : 'bg-surface text-charcoal border-outline/40'
                    }`}
                  >
                    {val}
                    {idx === s.stack.length - 1 && <span className="text-[9px] block text-marker-orange font-normal">TOP</span>}
                  </div>
                ))
              )}
            </div>
          </div>

          {s.auxStack && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono font-bold text-charcoal">Min / Aux Stack</span>
              <div className="w-24 min-h-[140px] p-2 bg-secondary-container rounded-xl border-2 border-charcoal flex flex-col-reverse items-center gap-1.5 shadow-hard">
                {s.auxStack.map((val, idx) => (
                  <div
                    key={idx}
                    className="w-full py-1.5 px-2 rounded-md border border-charcoal bg-dew-drop text-center font-mono font-bold text-xs text-charcoal"
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <StepCard
        stepNumber={step + 1}
        totalSteps={steps.length}
        title={s.title}
        whatHappens={s.whatHappens}
        whyRationale={s.whyRationale}
        variableStates={{
          step: `${step + 1}/${steps.length}`,
          stackTop: s.stack[s.stack.length - 1] ?? 'empty',
          stackSize: s.stack.length,
          action: s.action,
        }}
        codeSnippet={s.codeLine}
        timeSpaceImpact="Time: O(N) | Space: O(N)"
      />
    </div>
  );
};