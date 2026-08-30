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
  table: number[][];
  currentCell: [number, number] | null;
  depCells: [number, number][];
  result?: string;
}

function buildDPSteps(problem: Problem): Step[] {
  const t = problem.title.toLowerCase();
  const steps: Step[] = [];

  if (t.includes('climbing stairs')) {
    const n = 5;
    const dp = Array(n + 1).fill(0);
    dp[0] = 1; dp[1] = 1;
    steps.push({ title: 'Base cases', whatHappens: `dp[0]=1 (1 way to be at ground), dp[1]=1 (1 way to reach step 1).`, whyRationale: 'To reach step i, you can come from step i-1 or i-2.', codeLine: 'dp = [0] * (n+1)\ndp[0] = 1\ndp[1] = 1', table: [dp], currentCell: null, depCells: [] });
    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      steps.push({ title: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}]`, whatHappens: `To reach step ${i}: ${dp[i - 1]} ways from step ${i - 1} + ${dp[i - 2]} ways from step ${i - 2} = ${dp[i]}.`, whyRationale: 'Each step can be reached from the two previous steps. Sum them.', codeLine: `dp[${i}] = dp[${i-1}] + dp[${i-2}]`, table: [dp.slice(0, i + 1)], currentCell: [0, i], depCells: [[0, i - 1], [0, i - 2]], result: i === n ? `Answer: ${dp[n]}` : undefined });
    }
    return steps;
  }

  if (t.includes('longest common subsequence') || t.includes('lcs')) {
    const s1 = 'abcde', s2 = 'ace';
    const m = s1.length, n = s2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    steps.push({ title: 'Initialize DP table', whatHappens: `Strings: "${s1}" and "${s2}". Create ${(m + 1)}×${n + 1} table.`, whyRationale: 'dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1].', codeLine: 'dp = [[0]*(n+1) for _ in range(m+1)]', table: dp, currentCell: null, depCells: [] });
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          steps.push({ title: `Match! s1[${i - 1}]='${s1[i - 1]}' = s2[${j - 1}]='${s2[j - 1]}'`, whatHappens: `Characters match. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}.`, whyRationale: 'Matching characters extend the LCS by 1.', codeLine: `if s1[${i-1}] == s2[${j-1}]:\n    dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1`, table: dp.map(r => [...r]), currentCell: [i, j], depCells: [[i - 1, j - 1]] });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          steps.push({ title: `No match. dp[${i}][${j}] = max`, whatHappens: `s1[${i - 1}]='${s1[i - 1]}' ≠ s2[${j - 1}]='${s2[j - 1]}'. dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}.`, whyRationale: 'No match: take the better of excluding s1[i] or s2[j].', codeLine: `else:\n    dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}])`, table: dp.map(r => [...r]), currentCell: [i, j], depCells: [[i - 1, j], [i, j - 1]] });
        }
      }
    }
    steps.push({ title: 'LCS Complete', whatHappens: `LCS length = ${dp[m][n]}. The longest common subsequence has length ${dp[m][n]}.`, whyRationale: 'Bottom-right cell contains the final answer.', codeLine: `return dp[${m}][${n}]`, table: dp, currentCell: [m, n], depCells: [], result: `LCS length = ${dp[m][n]}` });
    return steps;
  }

  if (t.includes('longest increasing subsequence') || t.includes('lis')) {
    const arr = [10, 9, 2, 5, 3, 7, 101, 18];
    const dp = Array(arr.length).fill(1);
    steps.push({ title: 'Initialize DP array', whatHappens: `Each element is an LIS of length 1 by itself. dp = [1,1,1,1,1,1,1,1].`, whyRationale: 'Base case: each element alone is an increasing subsequence of length 1.', codeLine: 'dp = [1] * n  # each element is LIS of length 1', table: [dp], currentCell: null, depCells: [] });
    for (let i = 1; i < arr.length; i++) {
      for (let j = 0; j < i; j++) {
        if (arr[j] < arr[i]) {
          dp[i] = Math.max(dp[i], dp[j] + 1);
        }
      }
      steps.push({ title: `Process arr[${i}] = ${arr[i]}`, whatHappens: `Check all j < i where arr[j] < arr[i]. Update dp[${i}] = ${dp[i]}.`, whyRationale: 'For each element, check if extending any previous subsequence gives a longer one.', codeLine: `for j in range(i):\n    if arr[j] < arr[${i}]:\n        dp[${i}] = max(dp[${i}], dp[j] + 1)`, table: [dp], currentCell: [0, i], depCells: arr.slice(0, i).map((v, j) => [0, j] as [number, number]).filter(([_, j]) => arr[j] < arr[i]) });
    }
    steps.push({ title: 'LIS Complete', whatHappens: `LIS length = ${Math.max(...dp)}.`, whyRationale: 'Maximum value in dp array is the LIS length.', codeLine: 'return max(dp)', table: [dp], currentCell: null, depCells: [], result: `LIS = ${Math.max(...dp)}` });
    return steps;
  }

  if (t.includes('0/1 knapsack') || t.includes('knapsack')) {
    const W = 7;
    const wt = [1, 3, 4, 5];
    const val = [1, 4, 5, 7];
    const n = wt.length;
    const dp: number[][] = Array(n + 1).fill(null).map(() => Array(W + 1).fill(0));
    steps.push({ title: 'Initialize DP table', whatHappens: `Items: ${n}, Capacity: ${W}. Weights: [${wt.join(',')}], Values: [${val.join(',')}].`, whyRationale: 'dp[i][w] = max value using first i items with capacity w.', codeLine: 'dp = [[0]*(W+1) for _ in range(n+1)]', table: dp, currentCell: null, depCells: [] });
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= W; w++) {
        dp[i][w] = dp[i - 1][w];
        if (wt[i - 1] <= w) {
          dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - wt[i - 1]] + val[i - 1]);
        }
      }
      steps.push({ title: `Process item ${i} (w=${wt[i - 1]}, v=${val[i - 1]})`, whatHappens: `For each capacity w: either skip item (dp[i-1][w]) or take it if weight fits.`, whyRationale: '0/1 knapsack: each item can be taken at most once.', codeLine: `for w in range(W+1):\n    dp[${i}][w] = dp[${i-1}][w]\n    if ${wt[i-1]} <= w:\n        dp[${i}][w] = max(dp[${i}][w], dp[${i-1}][w-${wt[i-1]}] + ${val[i-1]})`, table: dp.map(r => [...r]), currentCell: [i, W], depCells: [[i - 1, W]] });
    }
    steps.push({ title: 'Knapsack Complete', whatHappens: `Max value = ${dp[n][W]}.`, whyRationale: 'Bottom-right cell contains the maximum value.', codeLine: `return dp[${n}][${W}]`, table: dp, currentCell: [n, W], depCells: [], result: `Max value = ${dp[n][W]}` });
    return steps;
  }

  if (t.includes('edit distance')) {
    const word1 = 'horse', word2 = 'ros';
    const m = word1.length, n = word2.length;
    const dp: number[][] = Array(m + 1).fill(null).map((_, i) => Array(n + 1).fill(0).map((_, j) => j === 0 ? i : j === 0 ? i : 0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    steps.push({ title: 'Initialize DP table', whatHappens: `Convert "${word1}" → "${word2}". dp[i][j] = min edits for first i chars → first j chars.`, whyRationale: 'Base: converting to/from empty string costs its length.', codeLine: 'for i in range(m+1): dp[i][0] = i\nfor j in range(n+1): dp[0][j] = j', table: dp.map(r => [...r]), currentCell: null, depCells: [] });
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (word1[i - 1] === word2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
      steps.push({ title: `Process "${word1.substring(0, i)}" → "${word2.substring(0, Math.min(i, n))}"`, whatHappens: `Row ${i}: dp[${i}][..] updated. Match = copy diagonal, else 1 + min(delete, insert, replace).`, whyRationale: 'Edit operations: insert, delete, replace. Take minimum.', codeLine: `for j in range(1, n+1):\n    if word1[${i-1}] == word2[j-1]:\n        dp[${i}][j] = dp[${i-1}][j-1]\n    else:\n        dp[${i}][j] = 1 + min(dp[${i-1}][j], dp[${i}][j-1], dp[${i-1}][j-1])`, table: dp.map(r => [...r]), currentCell: [i, Math.min(i, n)], depCells: [[i - 1, Math.min(i, n)], [i, Math.min(i, n) - 1], [i - 1, Math.min(i, n) - 1]] });
    }
    steps.push({ title: 'Edit Distance Complete', whatHappens: `Min edits = ${dp[m][n]}.`, whyRationale: 'dp[m][n] contains the answer.', codeLine: `return dp[${m}][${n}]`, table: dp, currentCell: [m, n], depCells: [], result: `Edit distance = ${dp[m][n]}` });
    return steps;
  }

  if (t.includes('house robber')) {
    const nums = [2, 7, 9, 3, 1];
    const dp = Array(nums.length).fill(0);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    steps.push({ title: 'Base cases', whatHappens: `dp[0] = ${nums[0]}. dp[1] = max(${nums[0]}, ${nums[1]}) = ${dp[1]}.`, whyRationale: 'Can\'t rob adjacent houses. dp[i] = max money robbing houses 0..i.', codeLine: `dp[0] = nums[0]\ndp[1] = max(nums[0], nums[1])`, table: [dp], currentCell: null, depCells: [] });
    for (let i = 2; i < nums.length; i++) {
      dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
      steps.push({ title: `dp[${i}] = max(skip, rob)`, whatHappens: `House ${i}: skip (${dp[i - 1]}) or rob (${dp[i - 2]} + ${nums[i]} = ${dp[i - 2] + nums[i]}). Result = ${dp[i]}.`, whyRationale: 'Either skip current house (keep previous best) or rob it (add to best of i-2).', codeLine: `dp[${i}] = max(dp[${i-1}], dp[${i-2}] + nums[${i}])`, table: [dp], currentCell: [0, i], depCells: [[0, i - 1], [0, i - 2]], result: i === nums.length - 1 ? `Max profit = ${dp[i]}` : undefined });
    }
    return steps;
  }

  if (t.includes('rod cutting')) {
    const n = 4;
    const prices = [1, 5, 8, 9];
    const dp = Array(n + 1).fill(0);
    steps.push({ title: 'Initialize DP', whatHappens: `Rod length ${n}. Prices for lengths 1..${n}: [${prices.join(',')}].`, whyRationale: 'dp[i] = max revenue for rod of length i.', codeLine: 'dp = [0] * (n+1)', table: [dp], currentCell: null, depCells: [] });
    for (let i = 1; i <= n; i++) {
      for (let j = 0; j < i; j++) {
        dp[i] = Math.max(dp[i], dp[i - j - 1] + prices[j]);
      }
      steps.push({ title: `dp[${i}] — best cut for length ${i}`, whatHappens: `Try all cuts. dp[${i}] = ${dp[i]}.`, whyRationale: 'For each length, try every possible first cut and take maximum.', codeLine: `for j in range(${i}):\n    dp[${i}] = max(dp[${i}], dp[${i} - j - 1] + prices[j])`, table: [dp.slice(0, i + 1)], currentCell: [0, i], depCells: Array.from({ length: i }, (_, idx) => [0, idx] as [number, number]), result: i === n ? `Max revenue = ${dp[n]}` : undefined });
    }
    return steps;
  }

  if (t.includes('egg drop')) {
    const n = 2, k = 6;
    const dp: number[][] = Array(n + 1).fill(null).map(() => Array(k + 1).fill(0));
    for (let j = 1; j <= k; j++) dp[1][j] = j;
    steps.push({ title: 'Base case: 1 egg', whatHappens: `With 1 egg and j floors, need j attempts (linear scan).`, whyRationale: 'Worst case: try each floor from bottom.', codeLine: 'for j in range(1, k+1): dp[1][j] = j', table: dp.map(r => [...r]), currentCell: null, depCells: [] });
    for (let i = 2; i <= n; i++) {
      for (let j = 1; j <= k; j++) {
        dp[i][j] = j;
        for (let x = 1; x < j; x++) {
          dp[i][j] = Math.min(dp[i][j], 1 + Math.max(dp[i - 1][x - 1], dp[i][j - x]));
        }
      }
      steps.push({ title: `${i} eggs, ${k} floors`, whatHappens: `Try each floor x. Egg breaks → dp[${i-1}][x-1]. Survives → dp[${i}][k-x]. Min worst case = ${dp[i][k]}.`, whyRationale: 'Try each floor to minimize worst case attempts.', codeLine: `for x in range(1, k+1):\n    dp[${i}][x] = j\n    for y in range(1, x):\n        dp[${i}][x] = min(dp[${i}][x], 1 + max(dp[${i-1}][y-1], dp[${i}][x-y]))`, table: dp.map(r => [...r]), currentCell: [i, k], depCells: [] });
    }
    steps.push({ title: 'Egg Drop Complete', whatHappens: `Min attempts = ${dp[n][k]}.`, whyRationale: 'dp[n][k] is the answer.', codeLine: `return dp[${n}][${k}]`, table: dp, currentCell: [n, k], depCells: [], result: `Min attempts = ${dp[n][k]}` });
    return steps;
  }

  // Default
  const dp = Array(6).fill(0).map((_, i) => i + 1);
  steps.push({ title: problem.approaches?.[0]?.name || 'DP Approach', whatHappens: problem.approachOverview?.split('\n')[0]?.replace(/\*\*/g, '') || 'Fill DP table bottom-up.', whyRationale: problem.keyInsight || '', codeLine: '', table: [dp], currentCell: null, depCells: [] });
  return steps;
}

export const DPStepVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const steps = buildDPSteps(problem);
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

      {/* DP Table */}
      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4 overflow-x-auto">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-mono">{problem.title} — DP Table</span>
        <div className="flex flex-col items-center gap-1">
          {s.table.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((val, c) => {
                const isCurrent = s.currentCell && s.currentCell[0] === r && s.currentCell[1] === c;
                const isDep = s.depCells.some(([dr, dc]) => dr === r && dc === c);
                return (
                  <div key={c}
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-mono font-bold text-xs sm:text-sm rounded-lg border-2 transition-all duration-300 ${
                      isCurrent ? 'border-marker-orange bg-primary-fixed scale-110 shadow-hard'
                      : isDep ? 'border-sky-sticker bg-sky-100 text-sky-900'
                      : 'border-charcoal bg-surface text-charcoal'
                    }`}>
                    {val}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {s.result && (
          <div className="px-4 py-2 rounded-pill bg-sprout-sticker text-white font-mono font-bold text-sm border-2 border-charcoal shadow-md">
            {s.result}
          </div>
        )}
      </div>

      <StepCard
        stepNumber={step + 1} totalSteps={steps.length}
        title={s.title} whatHappens={s.whatHappens} whyRationale={s.whyRationale}
        variableStates={s.currentCell ? { row: s.currentCell[0], col: s.currentCell[1], value: s.table[s.currentCell[0]]?.[s.currentCell[1]] ?? '?' } : {}}
        codeSnippet={s.codeLine} timeSpaceImpact={problem.approaches?.[problem.approaches.length - 1]?.timeComplexity || 'O(M×N)'}
      />
    </div>
  );
};