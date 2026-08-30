import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';

interface Step {
  title: string;
  whatHappens: string;
  whyRationale: string;
  codeLine: string;
  arrayState: number[];
  pointers: { idx: number; label: string; color: string }[];
  highlightRange?: [number, number];
  result?: string;
}

function buildSteps(problem: Problem): Step[] {
  const t = problem.title.toLowerCase();
  const ex0 = problem.examples?.[0]?.input || '';
  const numMatch = ex0.match(/\[(-?\d+(?:\s*,\s*-?\d+)*)\]/);
  const arr = numMatch ? numMatch[1].split(',').map(Number).filter(n => !isNaN(n)) : [2, 7, 11, 15, 1, 8];
  const targetMatch = ex0.match(/target\s*=\s*(-?\d+)/i);
  const target = targetMatch ? parseInt(targetMatch[1]) : 9;

  if (t.includes('two sum')) {
    const steps: Step[] = [];
    let l = 0, r = arr.length - 1;
    const sorted = [...arr].sort((a, b) => a - b);
    steps.push({ title: 'Sort array and initialize two pointers', whatHappens: `Sort the array. Set left=0, right=${sorted.length - 1}.`, whyRationale: 'Sorting enables two-pointer technique: if sum is too small, move left; if too large, move right.', codeLine: 'arr.sort()\nleft, right = 0, len(arr) - 1', arrayState: sorted, pointers: [{ idx: 0, label: 'L', color: '#0ea5e9' }, { idx: sorted.length - 1, label: 'R', color: '#22c55e' }] });
    while (l < r) {
      const sum = sorted[l] + sorted[r];
      if (sum === target) {
        steps.push({ title: `Found! arr[${l}]+arr[${r}]=${target}`, whatHappens: `Sum = ${sorted[l]} + ${sorted[r]} = ${sum}. Match found!`, whyRationale: 'Two pointers converge on the answer.', codeLine: 'if sum == target: return [left, right]', arrayState: sorted, pointers: [{ idx: l, label: 'L', color: '#0ea5e9' }, { idx: r, label: 'R', color: '#22c55e' }], highlightRange: [l, r], result: `[${l}, ${r}]` });
        break;
      } else if (sum < target) {
        steps.push({ title: `Sum ${sum} < target ${target}`, whatHappens: `Left pointer ${sorted[l]} + right pointer ${sorted[r]} = ${sum}, too small. Move left++.`, whyRationale: 'Sum too small, need larger element. Moving left increases sum.', codeLine: 'elif sum < target: left += 1', arrayState: sorted, pointers: [{ idx: l, label: 'L', color: '#0ea5e9' }, { idx: r, label: 'R', color: '#22c55e' }], highlightRange: [l, r] });
        l++;
      } else {
        steps.push({ title: `Sum ${sum} > target ${target}`, whatHappens: `Sum ${sorted[l]} + ${sorted[r]} = ${sum}, too large. Move right--.`, whyRationale: 'Sum too large, need smaller element.', codeLine: 'else: right -= 1', arrayState: sorted, pointers: [{ idx: l, label: 'L', color: '#0ea5e9' }, { idx: r, label: 'R', color: '#22c55e' }], highlightRange: [l, r] });
        r--;
      }
    }
    return steps;
  }

  if (t.includes('3sum')) {
    const sorted = [...arr].sort((a, b) => a - b);
    const steps: Step[] = [];
    steps.push({ title: 'Sort array for three-pointer approach', whatHappens: `Sorted: [${sorted.join(', ')}]. Fix first element, use two pointers for rest.`, whyRationale: 'Sorting allows two-pointer for each fixed element, O(n²) overall.', codeLine: 'arr.sort()\nfor i in range(n-2):', arrayState: sorted, pointers: [{ idx: 0, label: 'i', color: '#ff6f1e' }, { idx: 1, label: 'L', color: '#0ea5e9' }, { idx: sorted.length - 1, label: 'R', color: '#22c55e' }] });
    return steps;
  }

  if (t.includes('merge sorted') || t.includes('merge interval')) {
    const steps: Step[] = [];
    steps.push({ title: 'Initialize merge pointers', whatHappens: `Two arrays to merge: [${arr.slice(0, Math.floor(arr.length / 2)).join(',')}] and [${arr.slice(Math.floor(arr.length / 2)).join(',')}]`, whyRationale: 'Compare elements from both arrays, place smaller first.', codeLine: 'i, j = 0, 0\nwhile i < len(a) and j < len(b):', arrayState: arr, pointers: [{ idx: 0, label: 'i', color: '#0ea5e9' }, { idx: Math.floor(arr.length / 2), label: 'j', color: '#22c55e' }] });
    return steps;
  }

  if (t.includes('remove duplicate') || t.includes('max consecutive')) {
    const steps: Step[] = [];
    steps.push({ title: 'Initialize slow pointer', whatHappens: `slow=0 scans array. When arr[slow] != arr[fast], copy to slow+1.`, whyRationale: 'Slow pointer tracks the position of unique elements.', codeLine: 'slow = 0\nfor fast in range(1, n):\n    if arr[fast] != arr[slow]:\n        slow += 1\n        arr[slow] = arr[fast]', arrayState: arr, pointers: [{ idx: 0, label: 'slow', color: '#0ea5e9' }, { idx: 1, label: 'fast', color: '#ff6f1e' }] });
    return steps;
  }

  if (t.includes('majority')) {
    const steps: Step[] = [];
    steps.push({ title: "Moore's Voting Algorithm", whatHappens: `Scan array. Maintain candidate and count. If count=0, pick new candidate.`, whyRationale: 'Majority element appears > n/2 times, survives cancellation.', codeLine: 'candidate, count = None, 0\nfor num in arr:\n    if count == 0: candidate = num\n    count += 1 if num == candidate else -1', arrayState: arr, pointers: [{ idx: 0, label: 'candidate', color: '#ff6f1e' }] });
    return steps;
  }

  if (t.includes('next permutation')) {
    const steps: Step[] = [];
    steps.push({ title: 'Find the rightmost dip', whatHappens: `Scan from right: find first i where arr[i] < arr[i+1].`, whyRationale: 'The dip marks where we can increase the permutation minimally.', codeLine: 'i = n - 2\nwhile i >= 0 and arr[i] >= arr[i+1]:\n    i -= 1', arrayState: arr, pointers: [{ idx: arr.length - 2, label: 'i', color: '#ff6f1e' }] });
    return steps;
  }

  if (t.includes('largest subarray with k') || t.includes('longest consecutive') || t.includes('count subarrays with given xor')) {
    const steps: Step[] = [];
    steps.push({ title: 'Initialize prefix sum / hash map', whatHappens: 'Use hash map to store prefix sums. For each element, check if (prefix - target) exists.', whyRationale: 'Hash map enables O(1) lookup of complementary sums.', codeLine: 'prefix_sum = {0: -1}\ncurr_sum = 0\nfor i in range(n):', arrayState: arr, pointers: [{ idx: 0, label: 'i', color: '#ff6f1e' }] });
    return steps;
  }

  if (t.includes('pow') || t.includes('search a 2d')) {
    const steps: Step[] = [];
    steps.push({ title: 'Binary search approach', whatHappens: 'Use binary search to find the target efficiently.', whyRationale: 'Binary search reduces search space by half each step.', codeLine: 'lo, hi = 0, n - 1\nwhile lo <= hi:\n    mid = (lo + hi) // 2', arrayState: arr, pointers: [{ idx: 0, label: 'lo', color: '#0ea5e9' }, { idx: arr.length - 1, label: 'hi', color: '#22c55e' }, { idx: Math.floor(arr.length / 2), label: 'mid', color: '#ff6f1e' }] });
    return steps;
  }

  if (t.includes('pascal')) {
    const steps: Step[] = [];
    steps.push({ title: 'Build Pascal triangle row by row', whatHappens: 'Each element = sum of two elements from previous row.', whyRationale: 'Properties of binomial coefficients: C(n,k) = C(n-1,k-1) + C(n-1,k).', codeLine: 'for i in range(n):\n    row = [1] * (i+1)\n    for j in range(1, i):\n        row[j] = prev[j-1] + prev[j]', arrayState: [1, 1], pointers: [{ idx: 0, label: 'row', color: '#ff6f1e' }] });
    return steps;
  }

  if (t.includes('trapping rain')) {
    const steps: Step[] = [];
    steps.push({ title: 'Calculate left and right max boundaries', whatHappens: `For each bar, water = min(leftMax, rightMax) - height[i].`, whyRationale: 'Water trapped at position i is limited by the shorter of the tallest bars on each side.', codeLine: 'left_max = [0] * n\nright_max = [0] * n\nfor i in range(n):\n    left_max[i] = max(left_max[i-1], arr[i])', arrayState: arr, pointers: [{ idx: 0, label: 'i', color: '#ff6f1e' }] });
    return steps;
  }

  if (t.includes('unique paths')) {
    const steps: Step[] = [];
    steps.push({ title: 'Fill DP grid row by row', whatHappens: 'dp[i][j] = dp[i-1][j] + dp[i][j-1]. First row/col = 1.', whyRationale: 'Robot can only move right or down. Paths to (i,j) = paths from above + paths from left.', codeLine: 'dp = [[1]*cols for _ in range(rows)]\nfor i in range(1, rows):\n    for j in range(1, cols):\n        dp[i][j] = dp[i-1][j] + dp[i][j-1]', arrayState: [1, 1, 1, 1], pointers: [{ idx: 1, label: 'dp', color: '#ff6f1e' }] });
    return steps;
  }

  if (t.includes('reverse pair') || t.includes('inversion')) {
    const steps: Step[] = [];
    steps.push({ title: 'Merge sort with inversion counting', whatHappens: 'During merge step, count pairs where left[i] > 2 * right[j].', whyRationale: 'Merge sort naturally processes elements in sorted order, enabling O(n) inversion counting per merge.', codeLine: 'def merge_sort(arr):\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])', arrayState: arr, pointers: [{ idx: 0, label: 'L', color: '#0ea5e9' }, { idx: Math.floor(arr.length / 2), label: 'R', color: '#22c55e' }] });
    return steps;
  }

  if (t.includes('find the duplicate') || t.includes('repeating and missing')) {
    const steps: Step[] = [];
    steps.push({ title: 'Use array as hash (Floyd cycle)', whatHappens: 'Treat array values as indices. A duplicate creates a cycle.', whyRationale: 'If arr[i] values are valid indices, duplicates cause repeated visits → cycle.', codeLine: 'slow = arr[0]\nfast = arr[0]\nwhile True:\n    slow = arr[slow]\n    fast = arr[arr[fast]]', arrayState: arr, pointers: [{ idx: 0, label: 'slow', color: '#0ea5e9' }, { idx: 0, label: 'fast', color: '#ff6f1e' }] });
    return steps;
  }

  if (t.includes('longest substring without repeating')) {
    const steps: Step[] = [];
    steps.push({ title: 'Sliding window with hash set', whatHappens: 'Expand right. When duplicate found, shrink left until unique.', whyRationale: 'Sliding window maintains a unique-character window. O(n) time.', codeLine: 'char_set = set()\nleft = 0\nfor right in range(n):\n    while arr[right] in char_set:\n        char_set.remove(arr[left])\n        left += 1\n    char_set.add(arr[right])', arrayState: arr.map((_, i) => i), pointers: [{ idx: 0, label: 'L', color: '#0ea5e9' }, { idx: 0, label: 'R', color: '#22c55e' }] });
    return steps;
  }

  if (t.includes('rotate image') || t.includes('rotate')) {
    const steps: Step[] = [];
    steps.push({ title: 'Transpose then reverse', whatHappens: 'Step 1: Transpose matrix (swap [i][j] with [j][i]). Step 2: Reverse each row.', whyRationale: 'Transpose reflects across diagonal. Reverse each row completes 90° clockwise rotation.', codeLine: '# Transpose\nfor i in range(n):\n    for j in range(i+1, n):\n        matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n# Reverse rows\nfor row in matrix: row.reverse()', arrayState: arr, pointers: [{ idx: 0, label: 'i', color: '#ff6f1e' }, { idx: 0, label: 'j', color: '#0ea5e9' }] });
    return steps;
  }

  if (t.includes('merge intervals')) {
    const steps: Step[] = [];
    steps.push({ title: 'Sort intervals by start time', whatHappens: 'Sort by start. Merge overlapping: if current.start <= last.end, extend.', whyRationale: 'Sorted order ensures overlaps are only with the most recent merged interval.', codeLine: 'intervals.sort()\nmerged = [intervals[0]]\nfor curr in intervals[1:]:\n    if curr[0] <= merged[-1][1]:\n        merged[-1][1] = max(merged[-1][1], curr[1])', arrayState: arr, pointers: [{ idx: 0, label: 'merged', color: '#ff6f1e' }] });
    return steps;
  }

  // Default fallback for any array problem
  const steps: Step[] = [];
  steps.push({ title: problem.approaches?.[0]?.name || 'Algorithm', whatHappens: problem.approachOverview?.split('\n')[0]?.replace(/\*\*/g, '') || `Process array [${arr.join(', ')}] step by step.`, whyRationale: problem.keyInsight || problem.intuition || 'Follow the algorithmic approach.', codeLine: problem.approaches?.[problem.approaches.length - 1]?.pythonCode?.split('\n').slice(0, 3).join('\n') || 'for i in range(n):', arrayState: arr, pointers: [{ idx: 0, label: 'i', color: '#ff6f1e' }] });
  if (problem.approachOverview) {
    const lines = problem.approachOverview.split('\n').map(l => l.trim()).filter(l => l.match(/^\d/));
    lines.forEach((line, i) => {
      steps.push({ title: `Step ${i + 1}`, whatHappens: line.replace(/^\d+[\.\)]\s*/, '').replace(/\*\*/g, ''), whyRationale: problem.keyInsight || '', codeLine: '', arrayState: arr, pointers: [{ idx: Math.min(i, arr.length - 1), label: 'i', color: '#ff6f1e' }] });
    });
  }
  return steps;
}

export const ArrayStepVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const steps = buildSteps(problem);
  const s = steps[step] || steps[0];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep(prev => { if (prev >= steps.length - 1) { setIsPlaying(false); return prev; } return prev + 1; });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current.querySelector(`[data-idx="${step}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [step]);

  const arr = s.arrayState;
  const maxVal = Math.max(...arr.map(Math.abs), 1);

  return (
    <div className="space-y-5">
      {/* Controls */}
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

      {/* Array Visualization */}
      <div className="py-8 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-5">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-mono">
          {problem.title}
        </span>
        {/* Bar chart */}
        <div className="flex items-end gap-1.5" style={{ minHeight: '120px' }}>
          {arr.map((val, idx) => {
            const height = Math.max(20, (Math.abs(val) / maxVal) * 100);
            const inRange = s.highlightRange && idx >= s.highlightRange[0] && idx <= s.highlightRange[1];
            const ptr = s.pointers.find(p => p.idx === idx);
            const isTarget = s.result && idx === arr.indexOf(val);
            return (
              <div key={idx} className="flex flex-col items-center gap-1" data-idx={idx}>
                {/* Pointer label */}
                <div className="h-5 flex items-center">
                  {ptr && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: ptr.color }}>
                      {ptr.label}
                    </span>
                  )}
                </div>
                {/* Value */}
                <span className="text-[10px] font-mono font-bold text-on-surface-variant">{val}</span>
                {/* Bar */}
                <div
                  className={`w-8 sm:w-10 rounded-t-md border-2 border-b-0 transition-all duration-300 ${
                    ptr ? 'border-charcoal shadow-md scale-105'
                    : inRange ? 'border-marker-orange bg-primary-fixed'
                    : 'border-outline/40 bg-surface-container-high'
                  }`}
                  style={{
                    height: `${height}px`,
                    backgroundColor: ptr ? ptr.color + '30' : inRange ? undefined : undefined,
                  }}
                />
                {/* Index */}
                <span className="text-[9px] font-mono text-on-surface-variant">[{idx}]</span>
              </div>
            );
          })}
        </div>
        {/* Pointer legend */}
        {s.pointers.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {s.pointers.map((p, i) => (
              <span key={i} className="flex items-center gap-1 text-[10px] font-mono font-bold">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                {p.label} = arr[{p.idx}] = {arr[p.idx]}
              </span>
            ))}
          </div>
        )}
        {s.result && (
          <div className="px-4 py-2 rounded-pill bg-sprout-sticker text-white font-mono font-bold text-sm border-2 border-charcoal shadow-md">
            result: {s.result}
          </div>
        )}
      </div>

      {/* Step Explanation */}
      <StepCard
        stepNumber={step + 1} totalSteps={steps.length}
        title={s.title} whatHappens={s.whatHappens} whyRationale={s.whyRationale}
        variableStates={s.pointers.reduce((acc, p) => ({ ...acc, [p.label]: `${p.idx} → ${arr[p.idx]}` }), {} as Record<string, string | number>)}
        codeSnippet={s.codeLine} timeSpaceImpact={problem.approaches?.[problem.approaches.length - 1]?.timeComplexity || 'O(N)'}
      />
    </div>
  );
};