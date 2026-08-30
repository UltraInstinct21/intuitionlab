import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

export const StringVisualizer: React.FC = () => {
  const text = "AABAACAADAABAABA";
  const pattern = "AABA";

  const [stepIdx, setStepIdx] = useState(0);
  const states = [
    { t: 0, p: 0, action: "Start comparing from text[0] and pattern[0].", rationale: "Begin naive string matching at first position." },
    { t: 0, p: 0, action: "text[0]='A' matches pattern[0]='A'. Advance both.", rationale: "Characters match, continue comparing." },
    { t: 1, p: 1, action: "text[1]='A' matches pattern[1]='A'. Advance both.", rationale: "Second character matches." },
    { t: 2, p: 2, action: "text[2]='B' matches pattern[2]='B'. Advance both.", rationale: "Third character matches." },
    { t: 3, p: 3, action: "text[3]='A' matches pattern[3]='A'. Full match at index 0!", rationale: "Complete match found. Record index and shift right." },
    { t: 1, p: 0, action: "Shift text to index 1. Restart pattern comparison.", rationale: "After match (or mismatch), shift text pointer right and restart." },
    { t: 4, p: 0, action: "text[4]='C' ≠ pattern[0]='A'. Shift text.", rationale: "Mismatch at first character, advance text pointer." },
    { t: 5, p: 0, action: "text[5]='A' = pattern[0]='A'. Start matching.", rationale: "Potential match start at index 5." },
    { t: 8, p: 0, action: "text[8]='D' ≠ pattern[0]='A'. Shift.", rationale: "Mismatch, continue scanning." },
    { t: 9, p: 0, action: "Match found at index 9 (AABA). Complete!", rationale: "Pattern matches text[9..12]. All occurrences found." },
  ];

  const s = states[stepIdx];
  const reset = () => setStepIdx(0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={() => setStepIdx(Math.min(states.length - 1, stepIdx + 1))}
            disabled={stepIdx >= states.length - 1} className="text-xs h-8 px-3">next</Button>
          <Button size="sm" variant="ghost" onClick={reset} className="h-8"><RotateCcw className="w-4 h-4" /></Button>
        </div>
        <span className="text-xs font-mono font-bold text-marker-orange">
          text[{s.t}] vs pattern[{s.p}]
        </span>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-on-surface-variant font-mono">text:</span>
          <div className="flex gap-0.5">
            {text.split('').map((ch, i) => (
              <div key={i} className={`w-7 h-9 md:w-8 md:h-10 flex items-center justify-center font-mono font-bold text-xs md:text-sm rounded transition-all duration-200 ${
                i === s.t ? 'bg-primary-container text-on-primary-container border-2 border-charcoal shadow-sm scale-110'
                : 'bg-surface-container-high text-on-surface-variant border border-outline/30'
              }`}>{ch}</div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-on-surface-variant font-mono">pattern:</span>
          <div className="flex gap-0.5" style={{ marginLeft: `${(s.t - s.p) * (28)}px` }}>
            {pattern.split('').map((ch, i) => (
              <div key={i} className={`w-7 h-9 md:w-8 md:h-10 flex items-center justify-center font-mono font-bold text-xs md:text-sm rounded transition-all duration-200 ${
                i === s.p ? 'bg-secondary-container text-on-secondary-container border-2 border-charcoal'
                : 'bg-cream-paper text-charcoal border border-outline/40'
              }`}>{ch}</div>
            ))}
          </div>
        </div>
      </div>

      <StepCard stepNumber={stepIdx + 1} totalSteps={states.length}
        title={`Text scan at index ${s.t}`}
        whatHappens={s.action} whyRationale={s.rationale}
        variableStates={{ text_ptr: s.t, pattern_ptr: s.p, "text[t]": text[s.t], "pattern[p]": pattern[s.p] }}
        codeSnippet="for i in range(len(text) - len(pattern) + 1):\n    match = True\n    for j in range(len(pattern)):\n        if text[i+j] != pattern[j]:\n            match = False; break\n    if match: result.append(i)"
        timeSpaceImpact="Time: O(M×N) naive | Space: O(1)"
      />
    </div>
  );
};