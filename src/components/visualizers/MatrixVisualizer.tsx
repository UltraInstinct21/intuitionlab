import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';

export const MatrixVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const defaultMatrix = [
    [1, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 1],
  ];

  const exampleMatrix = (() => {
    if (problem.examples?.[0]?.input) {
      const match = problem.examples[0].input.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed) && Array.isArray(parsed[0])) return parsed;
        } catch {}
      }
    }
    return defaultMatrix;
  })();

  const [matrix, setMatrix] = useState<number[][]>(exampleMatrix.map(r => [...r]));
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stepsData = [
    {
      title: "Inspect Matrix & Record Original Boundary Zeros",
      whatHappens: "Scan row 0 and column 0 to check if they already contain any zeros. Store results in two boolean flags: firstRowZero and firstColZero.",
      whyRationale: "Since we will overwrite row 0 and column 0 to store markers for inner cells, we must remember beforehand if row 0 and col 0 themselves needed zeroing out.",
      variableStates: {
        firstRowZero: matrix[0]?.some(v => v === 0) ? "true" : "false",
        firstColZero: matrix.some(r => r[0] === 0) ? "true" : "false",
        matrix_size: `${matrix.length} x ${matrix[0]?.length || 0}`,
      },
      codeSnippet: "first_row_zero = any(matrix[0][j] == 0 for j in range(n))\nfirst_col_zero = any(matrix[i][0] == 0 for i in range(m))",
      timeSpaceImpact: "Time: O(m + n) | Space: O(1)",
    },
    {
      title: "Use First Row & First Column as In-Place Markers",
      whatHappens: "Iterate through the inner matrix. Whenever matrix[r][c] == 0, mark matrix[r][0] = 0 and matrix[0][c] = 0.",
      whyRationale: "Instead of allocating extra memory arrays, we reuse the matrix's own top row and left column as hash markers.",
      variableStates: {
        scan_range: "inner cells",
        rule: "matrix[r][0]=0, matrix[0][c]=0 if matrix[r][c]==0",
      },
      codeSnippet: "for i in range(1, m):\n    for j in range(1, n):\n        if matrix[i][j] == 0:\n            matrix[i][0] = 0\n            matrix[0][j] = 0",
      timeSpaceImpact: "Time: O(m × n) | Space: O(1)",
    },
    {
      title: "Zero Out Inner Matrix Cells Using Recorded Markers",
      whatHappens: "For each inner cell, if its row marker or column marker is 0, set it to 0.",
      whyRationale: "Each inner cell consults its corresponding row and column markers. If either is 0, this cell belongs to a zeroed line.",
      variableStates: {
        rule: "matrix[r][c] = 0 if (matrix[r][0]==0 or matrix[0][c]==0)",
      },
      codeSnippet: "for i in range(1, m):\n    for j in range(1, n):\n        if matrix[i][0] == 0 or matrix[0][j] == 0:\n            matrix[i][j] = 0",
      timeSpaceImpact: "Time: O(m × n) | Space: O(1)",
    },
    {
      title: "Apply Boundary Flags to Row 0 and Col 0",
      whatHappens: "If firstRowZero was true, zero out row 0. If firstColZero was true, zero out column 0.",
      whyRationale: "We delayed updating the first row and column until the end so their marker information wouldn't be corrupted.",
      variableStates: {
        status: "In-place zeroing complete!",
      },
      codeSnippet: "if first_row_zero: matrix[0] = [0] * n\nif first_col_zero:\n    for i in range(m): matrix[i][0] = 0",
      timeSpaceImpact: "Total Time: O(m × n) | Total Space: O(1)",
    },
  ];

  const getSimulatedMatrix = (currentStep: number) => {
    if (currentStep === 0) return matrix;
    const m = matrix.length;
    const n = matrix[0].length;
    const copy = matrix.map(r => [...r]);
    if (currentStep >= 1) {
      for (let r = 1; r < m; r++)
        for (let c = 1; c < n; c++)
          if (matrix[r][c] === 0) { copy[r][0] = 0; copy[0][c] = 0; }
    }
    if (currentStep >= 2) {
      for (let r = 1; r < m; r++)
        for (let c = 1; c < n; c++)
          if (copy[r][0] === 0 || copy[0][c] === 0) copy[r][c] = 0;
    }
    if (currentStep >= 3) {
      if (matrix[0].some(v => v === 0)) for (let c = 0; c < n; c++) copy[0][c] = 0;
      if (matrix.some(r => r[0] === 0)) for (let r = 0; r < m; r++) copy[r][0] = 0;
    }
    return copy;
  };

  const displayMatrix = getSimulatedMatrix(step);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep(prev => {
          if (prev >= stepsData.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2 flex-wrap">
          {stepsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setStep(idx); setIsPlaying(false); }}
              className={`px-3 py-1.5 rounded-pill text-xs font-mono font-bold transition-all ${
                step === idx
                  ? 'bg-primary-container text-on-primary-container border-[1.5px] border-charcoal shadow-xs scale-105'
                  : 'bg-surface text-on-surface-variant hover:bg-cream-paper border border-outline/30'
              }`}
            >
              step {idx + 1}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={() => setIsPlaying(!isPlaying)} className="flex items-center gap-1.5 text-xs h-8 px-3">
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'pause' : 'auto play'}</span>
          </Button>
          <Button size="sm" variant="default" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} className="h-8 px-2">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="default" onClick={() => step < stepsData.length - 1 && setStep(step + 1)} disabled={step === stepsData.length - 1} className="h-8 px-2">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setMatrix(exampleMatrix.map(r => [...r])); setStep(0); setIsPlaying(false); }} className="h-8">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40">
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-mono">
            {step === 0 ? 'interactive matrix (click to toggle 0/1)' : `matrix state at step ${step + 1}`}
          </span>
          <div className={`grid gap-2 p-3 bg-surface-container-high rounded-xl border-[1.5px] border-charcoal shadow-hard`}
            style={{ gridTemplateColumns: `repeat(${matrix[0]?.length || 4}, minmax(0, 1fr))` }}>
            {displayMatrix.map((row, r) =>
              row.map((val, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => step === 0 && setMatrix(m => m.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? (v === 0 ? 1 : 0) : v))))}
                  disabled={step !== 0}
                  className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center font-mono font-bold text-sm sm:text-lg rounded-lg transition-all duration-300 ${
                    val === 0
                      ? 'bg-primary-container text-on-primary-container border-[1.5px] border-charcoal shadow-sm scale-95'
                      : (r === 0 || c === 0) && step > 0
                      ? 'bg-secondary-container text-on-secondary-container border border-outline'
                      : 'bg-cream-paper text-charcoal border border-outline/50 hover:bg-dew-drop'
                  }`}
                >
                  {val}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <StepCard
        stepNumber={step + 1}
        totalSteps={stepsData.length}
        title={stepsData[step].title}
        whatHappens={stepsData[step].whatHappens}
        whyRationale={stepsData[step].whyRationale}
        variableStates={stepsData[step].variableStates}
        codeSnippet={stepsData[step].codeSnippet}
        timeSpaceImpact={stepsData[step].timeSpaceImpact}
      />
    </div>
  );
};