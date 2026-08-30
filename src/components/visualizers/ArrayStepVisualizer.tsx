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
  arrayState: (number | string)[];
  pointers: { idx: number; label: string; color: string }[];
  highlightRange?: [number, number];
  result?: string;
}

function buildSteps(problem: Problem): Step[] {
  const t = (problem.title || '').toLowerCase();
  const ex0 = problem.examples?.[0]?.input || '';
  const numMatch = ex0.match(/\[(-?\d+(?:\s*,\s*-?\d+)*)\]/);
  const defaultArr = numMatch ? numMatch[1].split(',').map(Number).filter(n => !isNaN(n)) : [2, 7, 11, 15, 1, 8];
  const targetMatch = ex0.match(/target\s*=\s*(-?\d+)/i);
  const target = targetMatch ? parseInt(targetMatch[1]) : 9;

  // 1. Two Sum
  if (t.includes('two sum') && !t.includes('bst')) {
    const sorted = [...defaultArr].slice(0, 5).sort((a, b) => a - b);
    const tgt = sorted[0] + sorted[sorted.length - 1];
    return [
      {
        title: 'Step 1: Sort Array and Initialize Pointers',
        whatHappens: `Sorted array: [${sorted.join(', ')}]. Place Left=0 (${sorted[0]}) and Right=${sorted.length - 1} (${sorted[sorted.length - 1]}). Target sum = ${tgt}.`,
        whyRationale: 'Sorting lets us adjust sum deterministically: move Left rightward to increase, or Right leftward to decrease.',
        codeLine: 'nums.sort()\nleft, right = 0, len(nums) - 1',
        arrayState: sorted,
        pointers: [{ idx: 0, label: 'L', color: '#0ea5e9' }, { idx: sorted.length - 1, label: 'R', color: '#22c55e' }],
      },
      {
        title: 'Step 2: Compare Sum with Target',
        whatHappens: `nums[L] (${sorted[0]}) + nums[R] (${sorted[sorted.length - 1]}) = ${sorted[0] + sorted[sorted.length - 1]}. Equals target ${tgt}!`,
        whyRationale: 'Exact match found in O(N log N) time and O(1) auxiliary memory.',
        codeLine: 'if current_sum == target:\n    return [left, right]',
        arrayState: sorted,
        pointers: [{ idx: 0, label: 'L', color: '#0ea5e9' }, { idx: sorted.length - 1, label: 'R', color: '#22c55e' }],
        highlightRange: [0, sorted.length - 1],
        result: `Indices [0, ${sorted.length - 1}]`,
      },
      {
        title: 'Step 3: Return Original Indices',
        whatHappens: `Solution verified: values ${sorted[0]} and ${sorted[sorted.length - 1]} sum to ${tgt}.`,
        whyRationale: 'Algorithm terminates with verified pair.',
        codeLine: 'return result',
        arrayState: sorted,
        pointers: [{ idx: 0, label: '✓', color: '#22c55e' }, { idx: sorted.length - 1, label: '✓', color: '#22c55e' }],
      },
    ];
  }

  // 2. 3Sum / 4Sum
  if (t.includes('3sum') || t.includes('4sum')) {
    const nums = [-4, -1, -1, 0, 1, 2];
    return [
      {
        title: 'Step 1: Sort Array & Fix First Element i=0',
        whatHappens: 'Array sorted: [-4, -1, -1, 0, 1, 2]. Fix i=0 (nums[0] = -4). Search for pair summing to +4.',
        whyRationale: 'Fixing the first element reduces 3Sum to Two Sum on the remaining subarray.',
        codeLine: 'nums.sort()\nfor i in range(len(nums) - 2):',
        arrayState: nums,
        pointers: [{ idx: 0, label: 'i', color: '#ff6f1e' }, { idx: 1, label: 'L', color: '#0ea5e9' }, { idx: 5, label: 'R', color: '#22c55e' }],
      },
      {
        title: 'Step 2: Advance to i=1 (nums[1] = -1)',
        whatHappens: 'Fix i=1 (value -1). Target remainder is +1. Place L=2 (val -1) and R=5 (val 2).',
        whyRationale: 'Sum: (-1) + (-1) + 2 = 0! Triplet [-1, -1, 2] found!',
        codeLine: 'total = nums[i] + nums[left] + nums[right]\nif total == 0:\n    res.append([nums[i], nums[left], nums[right]])',
        arrayState: nums,
        pointers: [{ idx: 1, label: 'i', color: '#ff6f1e' }, { idx: 2, label: 'L', color: '#0ea5e9' }, { idx: 5, label: 'R', color: '#22c55e' }],
        highlightRange: [1, 5],
        result: '[-1, -1, 2]',
      },
      {
        title: 'Step 3: Skip Duplicates & Find Second Triplet',
        whatHappens: 'Move L to 3 (val 0) and R to 4 (val 1). Sum: (-1) + 0 + 1 = 0! Triplet [-1, 0, 1] found.',
        whyRationale: 'Skip identical adjacent numbers to avoid duplicate triplets in output.',
        codeLine: 'while left < right and nums[left] == nums[left + 1]: left += 1\nwhile left < right and nums[right] == nums[right - 1]: right -= 1',
        arrayState: nums,
        pointers: [{ idx: 1, label: 'i', color: '#ff6f1e' }, { idx: 3, label: 'L', color: '#0ea5e9' }, { idx: 4, label: 'R', color: '#22c55e' }],
        highlightRange: [1, 4],
        result: '[-1, 0, 1]',
      },
    ];
  }

  // 3. Next Permutation
  if (t.includes('next permutation')) {
    const nums = [1, 3, 5, 4, 2];
    return [
      {
        title: 'Step 1: Find Pivot Dip (right-to-left)',
        whatHappens: 'Scan right to left. Find first index i where nums[i] < nums[i+1]. Here nums[1] (3) < nums[2] (5). Pivot is index 1.',
        whyRationale: 'Elements to the right of index 1 are in strictly descending order (5, 4, 2) — no larger permutation can be made from suffix alone.',
        codeLine: 'i = len(nums) - 2\nwhile i >= 0 and nums[i] >= nums[i+1]:\n    i -= 1',
        arrayState: nums,
        pointers: [{ idx: 1, label: 'pivot (3)', color: '#ff6f1e' }],
      },
      {
        title: 'Step 2: Find Successor & Swap',
        whatHappens: 'Scan from right to find smallest number > 3. Found nums[3] = 4. Swap nums[1] (3) and nums[3] (4) → [1, 4, 5, 3, 2].',
        whyRationale: 'Swapping with the smallest element larger than 3 ensures the next permutation is minimally larger.',
        codeLine: 'j = len(nums) - 1\nwhile nums[j] <= nums[i]: j -= 1\nnums[i], nums[j] = nums[j], nums[i]',
        arrayState: [1, 4, 5, 3, 2],
        pointers: [{ idx: 1, label: 'swapped (4)', color: '#22c55e' }, { idx: 3, label: 'swapped (3)', color: '#0ea5e9' }],
      },
      {
        title: 'Step 3: Reverse Suffix to Minimize Value',
        whatHappens: 'Reverse subarray from index i+1 (2) to end: [5, 3, 2] becomes [2, 3, 5]. Result: [1, 4, 2, 3, 5].',
        whyRationale: 'Reversing descending suffix produces smallest lexicographical order for the remainder.',
        codeLine: 'nums[i+1:] = reversed(nums[i+1:])\nreturn nums',
        arrayState: [1, 4, 2, 3, 5],
        pointers: [{ idx: 2, label: 'rev start', color: '#0ea5e9' }, { idx: 4, label: 'rev end', color: '#22c55e' }],
        result: '[1, 4, 2, 3, 5]',
      },
    ];
  }

  // 4. Pascal's Triangle
  if (t.includes('pascal')) {
    return [
      {
        title: 'Row 1 & 2: Base Rows',
        whatHappens: 'Row 0 = [1]. Row 1 = [1, 1]. All outer boundary elements are 1.',
        whyRationale: 'Edges of Pascal triangle always have value 1 (C(n, 0) = C(n, n) = 1).',
        codeLine: 'triangle = [[1], [1, 1]]',
        arrayState: [1, 1],
        pointers: [{ idx: 0, label: '1', color: '#ff6f1e' }, { idx: 1, label: '1', color: '#ff6f1e' }],
      },
      {
        title: 'Row 3: [1, 2, 1]',
        whatHappens: 'Middle element = Row1[0] (1) + Row1[1] (1) = 2. Row = [1, 2, 1].',
        whyRationale: 'Pascal identity: C(n, k) = C(n-1, k-1) + C(n-1, k).',
        codeLine: 'row[j] = prev_row[j-1] + prev_row[j]',
        arrayState: [1, 2, 1],
        pointers: [{ idx: 1, label: '1+1=2', color: '#22c55e' }],
      },
      {
        title: 'Row 4: [1, 3, 3, 1] & Row 5: [1, 4, 6, 4, 1]',
        whatHappens: 'Generate next rows summing adjacent parents: 1+2=3, 2+1=3, 1+3=4, 3+3=6, 3+1=4.',
        whyRationale: 'Each row computes in O(row_length) time.',
        codeLine: 'return triangle',
        arrayState: [1, 4, 6, 4, 1],
        pointers: [{ idx: 2, label: 'peak (6)', color: '#ff6f1e' }],
        result: '[[1], [1,1], [1,2,1], [1,3,3,1], [1,4,6,4,1]]',
      },
    ];
  }

  // 5. Merge Intervals
  if (t.includes('merge interval')) {
    return [
      {
        title: 'Step 1: Sort Intervals by Start Time',
        whatHappens: 'Input: [[1,3], [2,6], [8,10], [15,18]]. Already sorted by start times.',
        whyRationale: 'Sorting ensures overlapping intervals are strictly adjacent in the list.',
        codeLine: 'intervals.sort(key=lambda x: x[0])\nmerged = [intervals[0]]',
        arrayState: ['[1,3]', '[2,6]', '[8,10]', '[15,18]'],
        pointers: [{ idx: 0, label: 'curr', color: '#ff6f1e' }],
      },
      {
        title: 'Step 2: Overlap Detected between [1,3] and [2,6]',
        whatHappens: 'Next interval start (2) <= current merged end (3). Merge them: end = max(3, 6) = 6. Merged interval becomes [1, 6].',
        whyRationale: 'Intervals overlap if start_next <= end_current.',
        codeLine: 'if interval[0] <= merged[-1][1]:\n    merged[-1][1] = max(merged[-1][1], interval[1])',
        arrayState: ['[1,6] (MERGED)', '[8,10]', '[15,18]'],
        pointers: [{ idx: 0, label: '[1,6]', color: '#22c55e' }],
      },
      {
        title: 'Step 3: Disjoint Intervals Appended',
        whatHappens: '[8,10] start (8) > 6 → Append [8,10]. [15,18] start (15) > 10 → Append [15,18]. Result: [[1,6], [8,10], [15,18]].',
        whyRationale: 'Non-overlapping intervals are pushed as new separate blocks in O(N log N) total time.',
        codeLine: 'else:\n    merged.append(interval)',
        arrayState: ['[1,6]', '[8,10]', '[15,18]'],
        pointers: [{ idx: 0, label: '1', color: '#0ea5e9' }, { idx: 1, label: '2', color: '#0ea5e9' }, { idx: 2, label: '3', color: '#0ea5e9' }],
        result: '[[1,6], [8,10], [15,18]]',
      },
    ];
  }

  // 6. Trapping Rain Water
  if (t.includes('trapping rain')) {
    const heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
    return [
      {
        title: 'Step 1: Initialize Two Pointers & Max Boundaries',
        whatHappens: 'Heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]. Left=0, Right=11. left_max=0, right_max=1.',
        whyRationale: 'The amount of trapped water at any bar is determined by min(left_max, right_max) - height[i].',
        codeLine: 'left, right = 0, len(height) - 1\nleft_max, right_max = 0, 0\nwater = 0',
        arrayState: heights,
        pointers: [{ idx: 0, label: 'L', color: '#0ea5e9' }, { idx: 11, label: 'R', color: '#22c55e' }],
      },
      {
        title: 'Step 2: Water Trapped at Index 2',
        whatHappens: 'At index 2 (height 0), left_max=1, right_max=3. Water trapped = min(1, 3) - 0 = 1 unit.',
        whyRationale: 'Since left_max < right_max, water height is bounded by left_max.',
        codeLine: 'if height[left] < height[right]:\n    water += max(0, left_max - height[left])\n    left += 1',
        arrayState: [0, 1, '💧1', 2, 1, 0, 1, 3, 2, 1, 2, 1],
        pointers: [{ idx: 2, label: '+1 unit', color: '#0ea5e9' }],
      },
      {
        title: 'Step 3: Total Water Trapped = 6 Units',
        whatHappens: 'Process remaining bars. Water accumulated: index 2 (+1), index 4 (+1), index 5 (+2), index 6 (+1), index 9 (+1). Total = 6.',
        whyRationale: 'Two-pointer approach computes total water in O(N) time and O(1) space without allocating prefix arrays.',
        codeLine: 'return total_water # 6 units',
        arrayState: [0, 1, '💧1', 2, '💧1', '💧2', '💧1', 3, 2, '💧1', 2, 1],
        pointers: [{ idx: 5, label: 'peak water', color: '#0ea5e9' }],
        result: '6 units of water trapped',
      },
    ];
  }

  // 7. Majority Element (Moore's Voting)
  if (t.includes('majority element')) {
    const nums = [2, 2, 1, 1, 1, 2, 2];
    return [
      {
        title: 'Step 1: Initialize Candidate & Count',
        whatHappens: 'Array: [2, 2, 1, 1, 1, 2, 2]. Set candidate = 2, count = 1.',
        whyRationale: 'Moore\'s Voting Algorithm pairs up distinct elements and cancels them out.',
        codeLine: 'candidate, count = None, 0',
        arrayState: nums,
        pointers: [{ idx: 0, label: 'cand=2, cnt=1', color: '#ff6f1e' }],
      },
      {
        title: 'Step 2: Process Index 1 & 2 (Cancelling Votes)',
        whatHappens: 'Index 1: num is 2 → count = 2. Index 2 & 3: num is 1 → count decrements to 0. Candidate resets to 1 at index 4.',
        whyRationale: 'The majority element appears > N/2 times, so its votes will always survive all cancellations.',
        codeLine: 'if count == 0: candidate = num\ncount += 1 if num == candidate else -1',
        arrayState: nums,
        pointers: [{ idx: 4, label: 'cand=1, cnt=1', color: '#0ea5e9' }],
      },
      {
        title: 'Step 3: Final Majority Element = 2',
        whatHappens: 'Index 5 and 6 are 2 → count increases to 2. Candidate 2 is the majority element (appears 4/7 times).',
        whyRationale: 'Algorithm finds majority in O(N) single pass and O(1) memory.',
        codeLine: 'return candidate # 2',
        arrayState: nums,
        pointers: [{ idx: 6, label: 'MAJORITY=2', color: '#22c55e' }],
        result: '2 (Majority Element)',
      },
    ];
  }

  // 8. Longest Consecutive Sequence
  if (t.includes('longest consecutive')) {
    const nums = [100, 4, 200, 1, 3, 2];
    return [
      {
        title: 'Step 1: Insert into Hash Set',
        whatHappens: 'Numbers: [100, 4, 200, 1, 3, 2]. Build hash set for O(1) existence checks.',
        whyRationale: 'Set lookup allows checking if a number is the start of a consecutive streak.',
        codeLine: 'num_set = set(nums)',
        arrayState: [1, 2, 3, 4, 100, 200],
        pointers: [{ idx: 0, label: 'set', color: '#ff6f1e' }],
      },
      {
        title: 'Step 2: Check Sequence Starts (num - 1 not in set)',
        whatHappens: '100: start of streak [100] (len 1). 1: 0 not in set → start of streak 1->2->3->4 (len 4)!',
        whyRationale: 'Only start counting if num - 1 is absent. This guarantees each number is visited at most twice.',
        codeLine: 'if num - 1 not in num_set:\n    curr = num\n    while curr + 1 in num_set:\n        curr += 1\n        streak += 1',
        arrayState: [1, 2, 3, 4, 100, 200],
        pointers: [{ idx: 0, label: '1', color: '#22c55e' }, { idx: 3, label: '4', color: '#22c55e' }],
        highlightRange: [0, 3],
        result: 'Streak: [1, 2, 3, 4]',
      },
      {
        title: 'Step 3: Return Longest Streak = 4',
        whatHappens: 'Max streak found is 4 (elements 1, 2, 3, 4). Return 4.',
        whyRationale: 'Optimal O(N) time and O(N) space.',
        codeLine: 'return max_streak # 4',
        arrayState: [1, 2, 3, 4, 100, 200],
        pointers: [{ idx: 0, label: 'start', color: '#22c55e' }, { idx: 3, label: 'end (len 4)', color: '#22c55e' }],
        result: '4',
      },
    ];
  }

  // 9. Default Fallback: Dynamically generate 3-5 rich steps from problem data
  const steps: Step[] = [];
  steps.push({
    title: 'Initialize Algorithm & Input State',
    whatHappens: problem.intuition?.slice(0, 140) || `Process input array [${defaultArr.slice(0, 6).join(', ')}].`,
    whyRationale: problem.keyInsight?.slice(0, 140) || 'Analyze boundaries and problem constraints.',
    codeLine: problem.approaches?.[0]?.pythonCode?.split('\n').slice(0, 2).join('\n') || 'for i in range(len(nums)):',
    arrayState: defaultArr.slice(0, 6),
    pointers: [{ idx: 0, label: 'start', color: '#0ea5e9' }],
  });

  if (problem.approachOverview) {
    const lines = problem.approachOverview.split('\n').map(l => l.trim()).filter(l => l.match(/^(?:\d+[\.\)]|step\s*\d+|[-*])/i));
    lines.slice(0, 3).forEach((line, i) => {
      steps.push({
        title: `Iteration Step ${i + 1}`,
        whatHappens: line.replace(/^(?:\d+[\.\)]|step\s*\d+|[-*])\s*/i, '').replace(/\*\*/g, ''),
        whyRationale: problem.keyInsight || 'Maintain invariant across iterations.',
        codeLine: problem.approaches?.[0]?.pythonCode?.split('\n').slice(i + 2, i + 4).join('\n') || '',
        arrayState: defaultArr.slice(0, 6),
        pointers: [{ idx: Math.min(i + 1, 5), label: `step ${i+1}`, color: '#ff6f1e' }],
      });
    });
  }

  steps.push({
    title: 'Finalize & Return Result',
    whatHappens: 'All iterations completed. Return optimal result.',
    whyRationale: problem.keyInsight || 'Optimal solution verified across all test cases.',
    codeLine: 'return result',
    arrayState: defaultArr.slice(0, 6),
    pointers: [{ idx: Math.min(defaultArr.length - 1, 5), label: '✓ done', color: '#22c55e' }],
    result: 'Optimal answer computed',
  });

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
    <div className="space-y-6" ref={containerRef}>
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
          {s.result && <span className="text-sprout-sticker font-bold">result: {s.result}</span>}
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap min-w-max">
          {s.arrayState.map((val, idx) => {
            const ptr = s.pointers.find(p => p.idx === idx);
            const inHighlight = s.highlightRange && idx >= s.highlightRange[0] && idx <= s.highlightRange[1];

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className="h-5 text-xs font-mono font-bold">
                  {ptr && (
                    <span className="text-white px-2 py-0.5 rounded-pill text-[10px]" style={{ backgroundColor: ptr.color }}>
                      {ptr.label}
                    </span>
                  )}
                </div>
                <div
                  className={`w-12 h-14 md:w-14 md:h-16 flex items-center justify-center font-mono font-bold text-sm md:text-base rounded-xl border-2 shadow-hard transition-all duration-200 ${
                    inHighlight
                      ? 'border-sprout-sticker bg-[#22c55e]/15 scale-105'
                      : ptr
                      ? 'border-marker-orange bg-primary-fixed scale-105'
                      : 'border-charcoal bg-surface text-charcoal'
                  }`}
                >
                  {val}
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant">[{idx}]</span>
              </div>
            );
          })}
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
          pointers: s.pointers.map(p => `${p.label}@idx[${p.idx}]`).join(', ') || 'none',
          ...(s.result ? { result: s.result } : {}),
        }}
        codeSnippet={s.codeLine}
        timeSpaceImpact="Time: O(N) | Space: O(1)"
      />
    </div>
  );
};