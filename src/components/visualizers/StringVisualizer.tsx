import React, { useState } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

interface StringStep {
  title: string;
  whatHappens: string;
  whyRationale: string;
  charBlocks: { char: string; highlight?: 'active' | 'success' | 'danger' | 'muted'; label?: string }[];
  states: Record<string, string | number | boolean | undefined>;
  codeSnippet: string;
  impact?: string;
}

function buildStringSteps(problem?: Problem): StringStep[] {
  const t = (problem?.title || '').toLowerCase();

  // 1. Longest Palindromic Substring
  if (t.includes('longest palindromic substring') || t.includes('palindrome')) {
    const chars = ['b', 'a', 'b', 'a', 'd'];
    return [
      {
        title: 'Expand Around Center: i=1 (char "a")',
        whatHappens: 'Center at index 1 ("a"). Expand left and right: "b" == "b". Palindrome "bab" found (length 3).',
        whyRationale: 'Every palindrome expands symmetrically around its center (odd or even length).',
        charBlocks: [
          { char: 'b', highlight: 'success', label: 'L' },
          { char: 'a', highlight: 'active', label: 'center' },
          { char: 'b', highlight: 'success', label: 'R' },
          { char: 'a' },
          { char: 'd' },
        ],
        states: { center: 1, left: 0, right: 2, currentMaxPalindrome: '"bab"', maxLen: 3 },
        codeSnippet: 'while L >= 0 and R < len(s) and s[L] == s[R]:\n    L -= 1\n    R += 1',
        impact: 'Time: O(N²) | Space: O(1)',
      },
      {
        title: 'Expand Around Center: i=2 (char "b")',
        whatHappens: 'Center at index 2 ("b"). Expand: "a" == "a". Palindrome "aba" found (length 3).',
        whyRationale: 'Check both 2i+1 odd centers and 2i even centers.',
        charBlocks: [
          { char: 'b' },
          { char: 'a', highlight: 'success', label: 'L' },
          { char: 'b', highlight: 'active', label: 'center' },
          { char: 'a', highlight: 'success', label: 'R' },
          { char: 'd' },
        ],
        states: { center: 2, left: 1, right: 3, currentPalindrome: '"aba"', longest: '"bab"' },
        codeSnippet: 'if len(palindrome) > len(longest):\n    longest = palindrome',
      },
      {
        title: 'Return Longest Palindrome',
        whatHappens: 'Finished scanning all 2N-1 centers. Return "bab" (or "aba").',
        whyRationale: 'Optimal O(1) space expansion beats O(N²) DP table memory.',
        charBlocks: [
          { char: 'b', highlight: 'success' },
          { char: 'a', highlight: 'success' },
          { char: 'b', highlight: 'success' },
          { char: 'a' },
          { char: 'd' },
        ],
        states: { finalAnswer: '"bab"', length: 3 },
        codeSnippet: 'return s[start : start + max_len]',
      },
    ];
  }

  // 2. Valid Anagram
  if (t.includes('anagram')) {
    return [
      {
        title: 'Initialize Frequency Hash Map',
        whatHappens: 's = "anagram", t = "nagaram". Increment char counts for s, decrement for t.',
        whyRationale: 'Two strings are anagrams if and only if character frequency counts match identically.',
        charBlocks: [
          { char: 'a', label: 'count=3' },
          { char: 'n', label: 'count=1' },
          { char: 'g', label: 'count=1' },
          { char: 'r', label: 'count=1' },
          { char: 'm', label: 'count=1' },
        ],
        states: { len_s: 7, len_t: 7, validLengths: true },
        codeSnippet: 'if len(s) != len(t): return False\ncount = {}\nfor c1, c2 in zip(s, t):\n    count[c1] = count.get(c1, 0) + 1\n    count[c2] = count.get(c2, 0) - 1',
        impact: 'Time: O(N) | Space: O(1) (26 characters)',
      },
      {
        title: 'Check Net Frequency Balance',
        whatHappens: 'All counts in hash map equal 0.',
        whyRationale: 'Every character consumed in s matches t perfectly.',
        charBlocks: [
          { char: 'a: 0', highlight: 'success' },
          { char: 'n: 0', highlight: 'success' },
          { char: 'g: 0', highlight: 'success' },
          { char: 'r: 0', highlight: 'success' },
          { char: 'm: 0', highlight: 'success' },
        ],
        states: { allCountsZero: true, isAnagram: true },
        codeSnippet: 'return all(val == 0 for val in count.values())',
      },
    ];
  }

  // 3. Default: Pattern Search / KMP
  const text = ['A', 'A', 'B', 'A', 'A', 'C', 'A', 'A', 'D', 'A', 'A', 'B', 'A'];
  return [
    {
      title: 'Compare Pattern "AABA" with Text at Index 0',
      whatHappens: 'text[0..3] ("AABA") matches pattern[0..3] ("AABA"). Match found at index 0!',
      whyRationale: 'First occurrence identified.',
      charBlocks: text.map((c, i) => ({ char: c, highlight: i < 4 ? 'success' : undefined, label: i < 4 ? `[${i}]` : undefined })),
      states: { matchIndex: 0, textPtr: 3, patternPtr: 3 },
      codeSnippet: 'if j == len(pattern):\n    result.append(i - j)\n    j = lps[j - 1]',
      impact: 'Time: O(N + M) KMP | Space: O(M)',
    },
    {
      title: 'Shift using LPS (Longest Prefix Suffix) Array',
      whatHappens: 'LPS array tells us pattern has prefix "A" matching suffix "A". Shift pattern to index 3 without backtracking text.',
      whyRationale: 'KMP avoids quadratic O(N*M) worst case by using precomputed LPS fallback table.',
      charBlocks: text.map((c, i) => ({ char: c, highlight: i === 3 ? 'active' : undefined })),
      states: { lps: '[0, 1, 0, 1]', fallbackIndex: 1 },
      codeSnippet: 'j = lps[j - 1] # Skip redundant comparisons',
    },
    {
      title: 'Scan Complete',
      whatHappens: 'Matches found at index 0 and index 9. Return [0, 9].',
      whyRationale: 'Linear time scan complete in single pass.',
      charBlocks: text.map((c, i) => ({ char: c, highlight: i === 0 || i === 9 ? 'success' : undefined })),
      states: { occurrences: '[0, 9]', totalMatches: 2 },
      codeSnippet: 'return result',
    },
  ];
}

export const StringVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const steps = buildStringSteps(problem);
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
        <div className="flex items-center gap-1.5 flex-wrap justify-center min-w-max">
          {cur.charBlocks.map((block, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-on-surface-variant font-bold h-4">
                {block.label || ''}
              </span>
              <div
                className={`w-10 h-12 md:w-12 md:h-14 flex items-center justify-center font-mono font-bold text-sm md:text-base rounded-lg border-2 shadow-hard transition-all duration-200 ${
                  block.highlight === 'success'
                    ? 'border-sprout-sticker bg-[#22c55e]/15 text-charcoal scale-105'
                    : block.highlight === 'active'
                    ? 'border-marker-orange bg-primary-fixed text-burnt-sienna scale-105 ring-2 ring-marker-orange'
                    : 'border-charcoal bg-surface text-charcoal'
                }`}
              >
                {block.char}
              </div>
            </div>
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
        timeSpaceImpact={cur.impact || 'Time: O(N) | Space: O(1)'}
      />
    </div>
  );
};