import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';

interface MatrixStep {
  title: string;
  whatHappens: string;
  whyRationale: string;
  grid: (number | string)[][];
  highlightCells?: [number, number][];
  activeCell?: [number, number];
  states: Record<string, string | number | boolean | undefined>;
  codeSnippet: string;
  impact?: string;
}

function buildMatrixSteps(problem: Problem): MatrixStep[] {
  const t = (problem.title || '').toLowerCase();

  // 1. Rotate Image
  if (t.includes('rotate image') || t.includes('rotate')) {
    const original = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const transposed = [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ];
    const rotated = [
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3],
    ];

    return [
      {
        title: 'Step 1: Original 3x3 Matrix',
        whatHappens: 'Input matrix before 90° clockwise rotation: [[1, 2, 3], [4, 5, 6], [7, 8, 9]].',
        whyRationale: 'A 90° clockwise rotation equals: Transpose the matrix, then Reverse each row.',
        grid: original,
        states: { state: 'Original', rows: 3, cols: 3 },
        codeSnippet: '# Rotate in-place: Transpose + Reverse Rows',
        impact: 'Time: O(N²) | Space: O(1)',
      },
      {
        title: 'Step 2: Transpose Matrix (Swap across Diagonal)',
        whatHappens: 'Swap matrix[i][j] with matrix[j][i]. (2 ↔ 4, 3 ↔ 7, 6 ↔ 8). Diagonal elements (1, 5, 9) remain in place.',
        whyRationale: 'Transposition reflects elements across the main diagonal: columns become rows.',
        grid: transposed,
        highlightCells: [[0, 1], [1, 0], [0, 2], [2, 0], [1, 2], [2, 1]],
        states: { step: 'Transposed', 'matrix[0][1]': 4, 'matrix[1][0]': 2 },
        codeSnippet: 'for i in range(n):\n    for j in range(i + 1, n):\n        matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]',
      },
      {
        title: 'Step 3: Reverse Each Row (Final 90° Rotation)',
        whatHappens: 'Reverse row 0: [1, 4, 7] → [7, 4, 1]. Reverse row 1: [2, 5, 8] → [8, 5, 2]. Reverse row 2: [3, 6, 9] → [9, 6, 3].',
        whyRationale: 'Horizontal reversal flips the transposed columns to the right side, completing exact 90° rotation.',
        grid: rotated,
        highlightCells: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
        states: { rotation: '90° Clockwise Complete', result: '[[7,4,1],[8,5,2],[9,6,3]]' },
        codeSnippet: 'for row in matrix:\n    row.reverse()\nreturn matrix',
      },
    ];
  }

  // 2. Search a 2D Matrix
  if (t.includes('search a 2d') || t.includes('search 2d')) {
    const grid = [
      [1, 3, 5, 7],
      [10, 11, 16, 20],
      [23, 30, 34, 60],
    ];
    return [
      {
        title: 'Step 1: Treat 2D Matrix as Flattened 1D Array',
        whatHappens: 'Matrix 3x4 (12 elements). Treat as sorted array of length 12. Search for Target = 3.',
        whyRationale: 'Row-major 1D index mid maps to row = mid // cols and col = mid % cols.',
        grid: grid,
        activeCell: [0, 0],
        states: { low: 0, high: 11, target: 3 },
        codeSnippet: 'm, n = len(matrix), len(matrix[0])\nlow, high = 0, m * n - 1',
        impact: 'Time: O(log(M × N)) | Space: O(1)',
      },
      {
        title: 'Step 2: Binary Search Mid = 5 (row 1, col 1 = 11)',
        whatHappens: 'mid = (0 + 11) // 2 = 5 → matrix[1][1] = 11. Target 3 < 11 → Eliminate right half (high = mid - 1 = 4).',
        whyRationale: 'Since matrix is sorted, all elements after mid are strictly greater than 11.',
        grid: grid,
        activeCell: [1, 1],
        states: { mid: 5, value: 11, target: 3, comparison: '3 < 11 -> go left' },
        codeSnippet: 'mid = (low + high) // 2\nval = matrix[mid // n][mid % n]\nif target < val: high = mid - 1',
      },
      {
        title: 'Step 3: Mid = 1 (row 0, col 1 = 3) -> Found!',
        whatHappens: 'mid = (0 + 4) // 2 = 2 → matrix[0][2] = 5. Target 3 < 5 → high = 1. Next mid = 1 → matrix[0][1] = 3. Match found!',
        whyRationale: 'Binary search converges in O(log(M*N)) steps.',
        grid: grid,
        activeCell: [0, 1],
        states: { found: true, row: 0, col: 1, target: 3 },
        codeSnippet: 'if val == target: return True',
      },
    ];
  }

  // 3. Default: Set Matrix Zeroes
  const defaultMatrix = [
    [1, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 1],
  ];

  return [
    {
      title: 'Step 1: Check Boundary Flags',
      whatHappens: 'Scan row 0 and column 0 for any existing zeros. firstColZero = True (since matrix[3][0] == 0), firstRowZero = False.',
      whyRationale: 'We store inner cell markers in row 0 and col 0, so we must preserve their original zero status.',
      grid: defaultMatrix,
      highlightCells: [[3, 0]],
      states: { firstColZero: true, firstRowZero: false },
      codeSnippet: 'first_col_zero = any(matrix[i][0] == 0 for i in range(m))\nfirst_row_zero = any(matrix[0][j] == 0 for j in range(n))',
      impact: 'Time: O(M × N) | Space: O(1)',
    },
    {
      title: 'Step 2: Record Markers in Row 0 and Col 0',
      whatHappens: 'matrix[1][1] == 0 → Mark matrix[1][0] = 0 and matrix[0][1] = 0.',
      whyRationale: 'Top row and leftmost column act as an in-place hash set.',
      grid: [
        [1, '0*', 1, 1],
        ['0*', 0, 1, 1],
        [1, 1, 1, 1],
        [0, 1, 1, 1],
      ],
      highlightCells: [[0, 1], [1, 0]],
      states: { markedRow: 1, markedCol: 1 },
      codeSnippet: 'if matrix[i][j] == 0:\n    matrix[i][0] = 0\n    matrix[0][j] = 0',
    },
    {
      title: 'Step 3: Zero Out Inner Cells Using Markers',
      whatHappens: 'Set all inner cells where matrix[i][0] == 0 or matrix[0][j] == 0 to 0.',
      whyRationale: 'Consulting markers updates all inner elements in-place.',
      grid: [
        [1, 0, 1, 1],
        [0, 0, 0, 0],
        [1, 0, 1, 1],
        [0, 0, 0, 0],
      ],
      highlightCells: [[1, 0], [1, 1], [1, 2], [1, 3], [3, 0], [3, 1], [3, 2], [3, 3]],
      states: { innerZeroed: true },
      codeSnippet: 'if matrix[i][0] == 0 or matrix[0][j] == 0:\n    matrix[i][j] = 0',
    },
    {
      title: 'Step 4: Apply Boundary Flags',
      whatHappens: 'firstColZero was True → Zero out column 0. Matrix completely zeroed.',
      whyRationale: 'Finalizing boundary markers completes the algorithm.',
      grid: [
        [0, 0, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0],
      ],
      states: { complete: true },
      codeSnippet: 'if first_col_zero:\n    for i in range(m): matrix[i][0] = 0',
    },
  ];
}

export const MatrixVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const steps = buildMatrixSteps(problem);
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
        <div className="grid gap-1.5 p-3 bg-surface-container-high rounded-xl border border-charcoal shadow-hard" style={{ gridTemplateColumns: `repeat(${cur.grid[0]?.length || 3}, minmax(0, 1fr))` }}>
          {cur.grid.map((row, r) =>
            row.map((cell, c) => {
              const isHighlight = cur.highlightCells?.some(([hr, hc]) => hr === r && hc === c);
              const isActive = cur.activeCell?.[0] === r && cur.activeCell?.[1] === c;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-11 h-11 md:w-13 md:h-13 flex items-center justify-center font-mono font-bold text-sm md:text-base rounded-lg border transition-all duration-200 ${
                    isActive
                      ? 'border-2 border-marker-orange bg-primary-fixed scale-105 shadow-sm'
                      : isHighlight
                      ? 'border-2 border-sprout-sticker bg-[#22c55e]/15 text-charcoal'
                      : cell === 0 || cell === '0*'
                      ? 'border-charcoal bg-primary-container text-on-primary-container'
                      : 'border-outline/40 bg-surface text-charcoal'
                  }`}
                >
                  {cell}
                </div>
              );
            })
          )}
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
        timeSpaceImpact={cur.impact || 'Time: O(M × N) | Space: O(1)'}
      />
    </div>
  );
};