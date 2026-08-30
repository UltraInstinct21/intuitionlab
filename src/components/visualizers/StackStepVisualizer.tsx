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
  stack: number[];
  action: string;
  auxStack?: number[];
}

function buildStackSteps(problem: Problem): Step[] {
  const t = problem.title.toLowerCase();
  const steps: Step[] = [];

  if (t.includes('valid parentheses')) {
    const input = problem.examples?.[0]?.input || '({[]})';
    const chars = input.replace(/"/g, '').split('');
    const stack: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    steps.push({ title: 'Initialize empty stack', whatHappens: 'Push opening brackets onto stack. When closing bracket matches top, pop.', whyRationale: 'Stack enforces LIFO — most recent open must close first (innermost matches first).', codeLine: 'stack = []\nfor char in s:', stack: [], action: 'init' });
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if ('([{'.includes(c)) {
        stack.push(c);
        steps.push({ title: `Push '${c}' onto stack`, whatHappens: `Encountered opening bracket '${c}'. Push onto stack.`, whyRationale: 'Opening brackets are pushed to be matched later.', codeLine: `stack.append('${c}')`, stack: stack.map(Number).filter(n => !isNaN(n)), action: `push ${c}` });
      } else if (stack.length && stack[stack.length - 1] === pairs[c]) {
        const popped = stack.pop()!;
        steps.push({ title: `Match! Pop '${popped}' for '${c}'`, whatHappens: `Closing '${c}' matches top '${popped}'. Pop stack.`, whyRationale: 'Correct matching — stack top is the corresponding opener.', codeLine: `if stack and stack[-1] == '${pairs[c]}':\n    stack.pop()`, stack: stack.map(Number).filter(n => !isNaN(n)), action: `pop ${popped}` });
      } else {
        steps.push({ title: `Mismatch! '${c}' doesn't match top`, whatHappens: `Stack empty or top doesn't match. Return False.`, whyRationale: 'Invalid bracket sequence.', codeLine: 'return False', stack: stack.map(Number).filter(n => !isNaN(n)), action: 'return false' });
        break;
      }
    }
    if (stack.length === 0) steps.push({ title: 'Valid! Stack empty', whatHappens: 'All brackets matched. Stack is empty. Return True.', whyRationale: 'Empty stack means all opening brackets were properly closed.', codeLine: 'return len(stack) == 0', stack: [], action: 'return true' });
    return steps;
  }

  if (t.includes('next greater element') || t.includes('next smaller')) {
    const arr = problem.examples?.[0]?.input?.match(/\[(-?\d+(?:\s*,\s*-?\d+)*)\]/)?.[1]?.split(',').map(Number) || [4, 5, 2, 25];
    const stack: number[] = [];
    const result: number[] = Array(arr.length).fill(-1);
    steps.push({ title: 'Initialize monotonic stack', whatHappens: `Process arr = [${arr.join(', ')}] left to right. Stack stores indices.`, whyRationale: 'Monotonic stack: elements that are "blocked" stay until a greater element resolves them.', codeLine: 'stack = []\nresult = [-1] * n', stack: [], action: 'init' });
    for (let i = 0; i < arr.length; i++) {
      while (stack.length && arr[stack[stack.length - 1]] < arr[i]) {
        const idx = stack.pop()!;
        result[idx] = arr[i];
        steps.push({ title: `arr[${i}]=${arr[i]} > arr[${idx}]=${arr[idx]}`, whatHappens: `${arr[i]} is the next greater for ${arr[idx]}. Pop ${idx} from stack.`, whyRationale: 'Found the answer for the smaller element — it can never be resolved by anything smaller.', codeLine: `while stack and arr[stack[-1]] < arr[${i}]:\n    result[stack.pop()] = arr[${i}]`, stack: stack.map(i => arr[i]), action: `result[${idx}] = ${arr[i]}` });
      }
      stack.push(i);
      steps.push({ title: `Push index ${i} (value ${arr[i]})`, whatHappens: `Push current element onto stack. Waiting for its next greater.`, whyRationale: 'This element might be the answer for future elements.', codeLine: `stack.append(${i})`, stack: stack.map(i => arr[i]), action: `push ${arr[i]}` });
    }
    steps.push({ title: 'Done — remaining have no next greater', whatHappens: `Result: [${result.join(', ')}]. -1 means no greater element found.`, whyRationale: 'Elements left in stack are the largest — nothing greater exists to their right.', codeLine: 'return result', stack: [], action: `result = [${result.join(',')}]` });
    return steps;
  }

  if (t.includes('implement stack') || t.includes('sort a stack')) {
    steps.push({ title: 'Stack operations demo', whatHappens: 'Push: add to top (O(1)). Pop: remove from top (O(1)). Peek: view top.', whyRationale: 'LIFO data structure. Last in, first out.', codeLine: 'self.stack = []\ndef push(val): self.stack.append(val)\ndef pop(): return self.stack.pop()', stack: [4, 2, 7], action: 'init' });
    steps.push({ title: 'Push value 5', whatHappens: 'Append 5 to the top of the stack.', whyRationale: 'Push adds to the end of the array — O(1).', codeLine: 'self.stack.append(5)', stack: [5, 4, 2, 7], action: 'push 5' });
    steps.push({ title: 'Pop top value', whatHappens: 'Remove and return 5 from the top.', whyRationale: 'Pop removes from the end — O(1).', codeLine: 'return self.stack.pop()', stack: [4, 2, 7], action: 'pop 5' });
    return steps;
  }

  if (t.includes('implement queue')) {
    steps.push({ title: 'Queue operations demo', whatHappens: 'Enqueue: add to rear. Dequeue: remove from front.', whyRationale: 'FIFO data structure. First in, first out.', codeLine: 'self.queue = []\ndef enqueue(val): self.queue.append(val)\ndef dequeue(): return self.queue.pop(0)', stack: [3, 5, 1], action: 'init' });
    steps.push({ title: 'Enqueue value 8', whatHappens: 'Append 8 to the rear of the queue.', whyRationale: 'Queue enqueue adds to the end — O(1).', codeLine: 'self.queue.append(8)', stack: [3, 5, 1, 8], action: 'enqueue 8' });
    steps.push({ title: 'Dequeue front value', whatHappens: 'Remove and return 3 from the front.', whyRationale: 'Queue dequeue removes from front — O(n) for array, O(1) for linked list.', codeLine: 'return self.queue.pop(0)', stack: [5, 1, 8], action: 'dequeue 3' });
    return steps;
  }

  if (t.includes('min stack')) {
    steps.push({ title: 'Min stack with auxiliary', whatHappens: 'Track min alongside each element. Main stack stores values, min stack stores current min.', whyRationale: 'O(1) getMin by maintaining parallel min stack.', codeLine: 'self.stack = []\nself.min_stack = []\ndef push(val):\n    self.stack.append(val)\n    self.min_stack.append(min(val, self.min_stack[-1] if self.min_stack else val))', stack: [], action: 'init' });
    steps.push({ title: 'Push 3, min=3', whatHappens: 'Push 3. Min stack also gets 3.', whyRationale: 'First element is always the current min.', codeLine: 'push(3)', stack: [3], action: 'push 3, min=3' });
    steps.push({ title: 'Push 5, min=3', whatHappens: 'Push 5. Min stays 3.', whyRationale: '5 > 3, so min doesn\'t change.', codeLine: 'push(5)', stack: [3, 5], action: 'push 5, min=3' });
    steps.push({ title: 'Push 2, min=2', whatHappens: 'Push 2. Min updates to 2.', whyRationale: '2 < 3, new min is 2.', codeLine: 'push(2)', stack: [3, 5, 2], action: 'push 2, min=2' });
    steps.push({ title: 'getMin() → 2', whatHappens: 'Return top of min stack = 2.', whyRationale: 'Min stack always has the current minimum at its top.', codeLine: 'def getMin(): return self.min_stack[-1]', stack: [3, 5, 2], action: 'getMin → 2' });
    return steps;
  }

  if (t.includes('largest rectangle')) {
    const arr = problem.examples?.[0]?.input?.match(/\[(-?\d+(?:\s*,\s*-?\d+)*)\]/)?.[1]?.split(',').map(Number) || [2, 1, 5, 6, 2, 3];
    steps.push({ title: 'Monotonic increasing stack', whatHappens: `Heights: [${arr.join(', ')}]. Push indices. When current < top, calculate area.`, whyRationale: 'Stack maintains indices of increasing heights. Each pop computes the max area with that bar as the shortest.', codeLine: 'stack = [-1]\nmax_area = 0\nfor i in range(n):\n    while stack[-1] != -1 and heights[i] < heights[stack[-1]]:', stack: [], action: 'init' });
    for (let i = 0; i < Math.min(arr.length, 4); i++) {
      steps.push({ title: `Process bar [${i}] = ${arr[i]}`, whatHappens: `Push index ${i} onto stack. Height = ${arr[i]}.`, whyRationale: 'Bar can extend to the right as long as heights are non-decreasing.', codeLine: `stack.append(${i})`, stack: arr.slice(0, i + 1), action: `push bar ${arr[i]}` });
    }
    return steps;
  }

  if (t.includes('sliding window maximum')) {
    const arr = problem.examples?.[0]?.input?.match(/\[(-?\d+(?:\s*,\s*-?\d+)*)\]/)?.[1]?.split(',').map(Number) || [1, 3, -1, -3, 5, 3, 6, 7];
    steps.push({ title: 'Monotonic deque approach', whatHappens: `Window size k. Deque stores indices of useful elements (decreasing order).`, whyRationale: 'Deque front always holds the max for current window. Remove indices outside window and smaller elements.', codeLine: 'from collections import deque\ndq = deque()\nfor i in range(n):\n    while dq and dq[0] < i - k + 1:\n        dq.popleft()\n    while dq and arr[dq[-1]] < arr[i]:\n        dq.pop()', stack: arr.slice(0, 4), action: 'init' });
    steps.push({ title: 'Window [0..k-1]', whatHappens: `First window. Deque maintains decreasing order of indices.`, whyRationale: 'Deque front = max of current window.', codeLine: 'dq.append(i)\nresult.append(arr[dq[0]])', stack: arr.slice(0, 3), action: 'window max = ' + Math.max(...arr.slice(0, 3)) });
    return steps;
  }

  if (t.includes('rotten oranges')) {
    steps.push({ title: 'BFS from all rotten oranges', whatHappens: 'Put all rotten oranges in queue. BFS level = 1 minute. Fresh oranges adjacent become rotten.', whyRationale: 'Multi-source BFS simultaneously spreads rot from all rotten oranges. Each level = 1 time unit.', codeLine: 'queue = deque()\nfor i in range(m):\n    for j in range(n):\n        if grid[i][j] == 2: queue.append((i, j, 0))', stack: [], action: 'init BFS' });
    steps.push({ title: 'Process level 0 (initial rotten)', whatHappens: 'All initially rotten oranges spread to neighbors simultaneously.', whyRationale: 'BFS processes all nodes at current depth before moving to next.', codeLine: 'while queue:\n    r, c, time = queue.popleft()\n    for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:', stack: [], action: 'spread rot' });
    return steps;
  }

  if (t.includes('online stock span')) {
    steps.push({ title: 'Monotonic stack of (price, span)', whatHappens: 'For each day, pop all prices <= current. Span = days since last higher price.', whyRationale: 'Monotonic decreasing stack. Each element\'s span is determined by the next greater element.', codeLine: 'self.stack = []  # (price, span)\ndef next(price):\n    span = 1\n    while self.stack and self.stack[-1][0] <= price:\n        span += self.stack.pop()[1]\n    self.stack.append((price, span))', stack: [], action: 'init' });
    steps.push({ title: 'Day 1: price=100', whatHappens: 'Stack empty. Push (100, 1). Span = 1.', whyRationale: 'No previous day, span is 1.', codeLine: 'self.stack.append((100, 1))', stack: [100], action: 'span = 1' });
    steps.push({ title: 'Day 2: price=80', whatHappens: '80 < 100. Push (80, 1). Span = 1.', whyRationale: '80 < 100, can\'t extend span.', codeLine: 'self.stack.append((80, 1))', stack: [100, 80], action: 'span = 1' });
    steps.push({ title: 'Day 3: price=60', whatHappens: '60 < 80. Push (60, 1). Span = 1.', whyRationale: 'Descending prices, each has span 1.', codeLine: 'self.stack.append((60, 1))', stack: [100, 80, 60], action: 'span = 1' });
    steps.push({ title: 'Day 4: price=70', whatHappens: '70 > 60, pop (60,1). 70 < 80. Push (70, 2). Span = 2.', whyRationale: 'Popped 60 (1 day). 70 spans 2 days (including yesterday).', codeLine: 'span += self.stack.pop()[1]  # pop 60\nself.stack.append((70, 2))', stack: [100, 80, 70], action: 'span = 2' });
    steps.push({ title: 'Day 5: price=60', whatHappens: '60 < 70. Push (60, 1). Span = 1.', whyRationale: 'New low, span resets to 1.', codeLine: 'self.stack.append((60, 1))', stack: [100, 80, 70, 60], action: 'span = 1' });
    steps.push({ title: 'Day 6: price=75', whatHappens: 'Pop (60,1). 75 < 80. Push (75, 3). Span = 3.', whyRationale: '75 spans 3 days (60, 70, and today).', codeLine: 'span += self.stack.pop()[1]\nself.stack.append((75, 3))', stack: [100, 80, 75], action: 'span = 3' });
    steps.push({ title: 'Day 7: price=85', whatHappens: 'Pop (75,3), pop (80,4). 85 > 100? No. Push (85, 7).', whyRationale: '85 is the new max! Spans entire history.', codeLine: 'span += self.stack.pop()[1]\nspan += self.stack.pop()[1]\nself.stack.append((85, 7))', stack: [100, 85], action: 'span = 7' });
    return steps;
  }

  // Default
  steps.push({ title: problem.approaches?.[0]?.name || 'Stack/Queue Algorithm', whatHappens: problem.approachOverview?.split('\n')[0]?.replace(/\*\*/g, '') || 'Apply stack/queue operations.', whyRationale: problem.keyInsight || '', codeLine: '', stack: [], action: 'init' });
  if (problem.approachOverview) {
    problem.approachOverview.split('\n').map(l => l.trim()).filter(l => l.match(/^\d/)).forEach((line, i) => {
      steps.push({ title: `Step ${i + 1}`, whatHappens: line.replace(/^\d+[\.\)]\s*/, '').replace(/\*\*/g, ''), whyRationale: problem.keyInsight || '', codeLine: '', stack: [], action: '' });
    });
  }
  return steps;
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
        setStep(prev => { if (prev >= steps.length - 1) { setIsPlaying(false); return prev; } return prev + 1; });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const t = problem.title.toLowerCase();
  const isQueue = t.includes('queue');

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-1.5 flex-wrap">
          {steps.map((_, i) => (
            <button key={i} onClick={() => { setStep(i); setIsPlaying(false); }}
              className={`w-7 h-7 rounded-full text-[10px] font-mono font-bold transition-all flex items-center justify-center ${
                step === i ? 'bg-primary-container text-on-primary-container border-2 border-charcoal shadow-xs scale-110'
                : i < step ? 'bg-sprout-sticker/20 text-[#15803d] border border-sprout-sticker/40'
                : 'bg-surface text-on-surface-variant border border-outline/30'
              }`}>
              {i < step ? '✓' : i + 1}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)} className="h-7 px-2">
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </Button>
          <Button size="sm" variant="default" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="h-7 px-2 text-xs"><ChevronLeft className="w-3.5 h-3.5" /></Button>
          <Button size="sm" variant="primary" onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step >= steps.length - 1} className="h-7 px-2 text-xs"><ChevronRight className="w-3.5 h-3.5" /></Button>
          <Button size="sm" variant="ghost" onClick={() => { setStep(0); setIsPlaying(false); }} className="h-7"><RotateCcw className="w-3.5 h-3.5" /></Button>
        </div>
      </div>

      {/* Stack/Queue Visualization */}
      <div className="py-8 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-5">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-mono">
          {isQueue ? 'queue (FIFO)' : 'stack (LIFO)'} — {s.action}
        </span>

        <div className="flex items-end gap-6">
          {/* Main structure */}
          <div className={`flex flex-col-reverse gap-1.5 ${isQueue ? 'flex-row-reverse' : ''} items-center`}>
            {s.stack.length === 0 ? (
              <div className="w-24 h-16 flex items-center justify-center text-xs font-mono text-on-surface-variant border-2 border-dashed border-outline/40 rounded-lg">
                empty
              </div>
            ) : (
              s.stack.map((v, i) => {
                const isTop = i === s.stack.length - 1;
                return (
                  <div key={i}
                    className={`w-24 h-10 flex items-center justify-center font-mono font-bold text-sm rounded-lg border-2 transition-all duration-300 ${
                      isTop ? 'border-sprout-sticker bg-[#22c55e]/15 shadow-md scale-105' : 'border-charcoal bg-surface'
                    }`}>
                    {v} {isTop && (isQueue ? '← front' : '← top')}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="text-xs font-mono text-on-surface-variant">
          {isQueue ? 'front → rear' : 'bottom → top'} | size: {s.stack.length}
        </div>
      </div>

      <StepCard
        stepNumber={step + 1} totalSteps={steps.length}
        title={s.title} whatHappens={s.whatHappens} whyRationale={s.whyRationale}
        variableStates={{ stack: `[${s.stack.join(', ')}]`, size: s.stack.length, action: s.action }}
        codeSnippet={s.codeLine} timeSpaceImpact={problem.approaches?.[problem.approaches.length - 1]?.timeComplexity || 'O(N)'}
      />
    </div>
  );
};