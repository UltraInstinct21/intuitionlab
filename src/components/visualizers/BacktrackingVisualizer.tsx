import React, { useState } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

interface BacktrackStep {
  title: string;
  whatHappens: string;
  whyRationale: string;
  grid?: (string | number)[][];
  activeCell?: [number, number];
  treePath?: string[];
  states: Record<string, string | number | boolean | undefined>;
  codeSnippet: string;
  impact?: string;
}

function buildBacktrackingSteps(problem?: Problem): BacktrackStep[] {
  const t = (problem?.title || '').toLowerCase();

  // 1. Sudoku Solver
  if (t.includes('sudoku')) {
    const initialGrid = [
      ['5', '3', '.', '.'],
      ['6', '.', '.', '1'],
      ['.', '9', '8', '.'],
      ['.', '.', '.', '6'],
    ];
    return [
      {
        title: 'Scan for Empty Cell',
        whatHappens: 'Find first empty cell at row=0, col=2. Test numbers 1 through 4.',
        whyRationale: 'Sudoku solver scans for empty "." cells and tries valid digits 1..N.',
        grid: initialGrid,
        activeCell: [0, 2],
        states: { cell: '(0, 2)', tryingDigit: 1 },
        codeSnippet: 'for r in range(9):\n    for c in range(9):\n        if board[r][c] == ".":\n            for digit in "123456789":',
        impact: 'Time: O(9^(empty_cells)) | Space: O(1)',
      },
      {
        title: 'Validate Row, Column, and Subgrid',
        whatHappens: 'Digit "1" is valid in row 0, col 2, and 2x2 box. Place "1" and recurse.',
        whyRationale: 'isSafe checks: no duplicate in row, col, or 2x2 subgrid.',
        grid: [
          ['5', '3', '1', '.'],
          ['6', '.', '.', '1'],
          ['.', '9', '8', '.'],
          ['.', '.', '.', '6'],
        ],
        activeCell: [0, 2],
        states: { placed: '1 at (0,2)', valid: true },
        codeSnippet: 'if isValid(board, r, c, digit):\n    board[r][c] = digit\n    if solve(board): return True',
      },
      {
        title: 'Backtrack on Conflict',
        whatHappens: 'At (0, 3), digits 1,2,3,4 all create conflicts! Reset (0, 2) back to "." and try next digit.',
        whyRationale: 'Backtracking undoes the choice when a dead end is reached.',
        grid: initialGrid,
        activeCell: [0, 2],
        states: { backtrack: true, resetCell: '(0, 2) -> "."' },
        codeSnippet: 'board[r][c] = "." # Backtrack',
      },
      {
        title: 'Solve Successfully',
        whatHappens: 'All cells filled satisfying all Sudoku constraints.',
        whyRationale: 'Recursion returns True once the final cell is solved.',
        grid: [
          ['5', '3', '4', '2'],
          ['6', '2', '3', '1'],
          ['1', '9', '8', '4'],
          ['4', '8', '2', '6'],
        ],
        states: { solved: true, result: 'Board Complete' },
        codeSnippet: 'return True # Entire puzzle solved',
      },
    ];
  }

  // 2. Subsets / Combination Sum / Permutations
  if (t.includes('subset') || t.includes('combination') || t.includes('permutation')) {
    return [
      {
        title: 'Start at Root: Empty Subset []',
        whatHappens: 'Input: [1, 2, 3]. Start with current subset = []. Add [] to result.',
        whyRationale: 'Every node in the state-space decision tree represents a valid subset.',
        treePath: ['[]'],
        states: { currentSubset: '[]', resultCount: 1, index: 0 },
        codeSnippet: 'result.append(list(current))\nfor i in range(start, len(nums)):',
        impact: 'Time: O(2^N) | Space: O(N)',
      },
      {
        title: 'Branch 1: Include 1 → [1]',
        whatHappens: 'Choose 1: subset becomes [1]. Recurse with start = 1.',
        whyRationale: 'Generate all subsets starting with 1.',
        treePath: ['[]', '[1]'],
        states: { currentSubset: '[1]', choosing: 1 },
        codeSnippet: 'current.append(nums[i])\nbacktrack(i + 1, current)',
      },
      {
        title: 'Branch 1.1: Include 2 → [1, 2]',
        whatHappens: 'Choose 2: subset becomes [1, 2]. Add to result.',
        whyRationale: 'Explore deeper along the decision path.',
        treePath: ['[]', '[1]', '[1, 2]'],
        states: { currentSubset: '[1, 2]', choosing: 2 },
        codeSnippet: 'current.append(nums[i])',
      },
      {
        title: 'Backtrack & Pop: [1, 2] → [1] → [1, 3]',
        whatHappens: 'Pop 2 to backtrack to [1]. Next iteration picks 3 → [1, 3].',
        whyRationale: 'Pop restores state so sibling branches receive clean subset list.',
        treePath: ['[]', '[1]', '[1, 3]'],
        states: { currentSubset: '[1, 3]', popped: 2, appended: 3 },
        codeSnippet: 'current.pop() # Backtrack',
      },
      {
        title: 'All Subsets Generated',
        whatHappens: 'Total 2^3 = 8 subsets generated: [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3].',
        whyRationale: 'Binary inclusion tree fully explored.',
        treePath: ['[]', '[1]', '[2]', '[3]'],
        states: { totalSubsets: 8, result: '[[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]' },
        codeSnippet: 'return result',
      },
    ];
  }

  // 3. Default: N-Queens (4x4)
  return [
    {
      title: 'Initialize 4x4 Board',
      whatHappens: 'Start with 4x4 empty board. Try placing Queen 0 in row 0.',
      whyRationale: 'Place 1 queen per row. No two queens can share row, column, or diagonal.',
      grid: [
        ['.', '.', '.', '.'],
        ['.', '.', '.', '.'],
        ['.', '.', '.', '.'],
        ['.', '.', '.', '.'],
      ],
      activeCell: [0, 1],
      states: { row: 0, queensPlaced: 0 },
      codeSnippet: 'def solve(row):\n    if row == N: return True',
      impact: 'Time: O(N!) | Space: O(N²)',
    },
    {
      title: 'Place Queen at (0, 1)',
      whatHappens: 'Place Q at row 0, col 1. Col 1 and diagonals now restricted for next rows.',
      whyRationale: 'Fast O(1) conflict checking via column and diagonal boolean arrays.',
      grid: [
        ['.', 'Q', '.', '.'],
        ['.', '.', '.', '.'],
        ['.', '.', '.', '.'],
        ['.', '.', '.', '.'],
      ],
      activeCell: [0, 1],
      states: { placed: 'Q at (0, 1)', queensPlaced: 1 },
      codeSnippet: 'board[row][col] = "Q"\nif solve(row + 1): return True',
    },
    {
      title: 'Place Queen at (1, 3)',
      whatHappens: 'Row 1: cols 0, 1, 2 are under attack by Q(0,1). Col 3 is safe! Place Q at (1, 3).',
      whyRationale: 'Diagonal (0,1)->(1,2) and col 1 are blocked.',
      grid: [
        ['.', 'Q', '.', '.'],
        ['.', '.', '.', 'Q'],
        ['.', '.', '.', '.'],
        ['.', '.', '.', '.'],
      ],
      activeCell: [1, 3],
      states: { placed: 'Q at (1, 3)', queensPlaced: 2 },
      codeSnippet: 'if is_safe(1, 3): board[1][3] = "Q"',
    },
    {
      title: 'Place Queen at (2, 0) & (3, 2)',
      whatHappens: 'Row 2: col 0 is safe. Row 3: col 2 is safe. All 4 queens successfully placed!',
      whyRationale: 'Valid N-Queens configuration: [. Q . .], [. . . Q], [Q . . .], [. . Q .].',
      grid: [
        ['.', 'Q', '.', '.'],
        ['.', '.', '.', 'Q'],
        ['Q', '.', '.', '.'],
        ['.', '.', 'Q', '.'],
      ],
      states: { solutionFound: true, totalQueens: 4 },
      codeSnippet: 'solutions.append(construct(board))\nreturn',
    },
  ];
}

export const BacktrackingVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const steps = buildBacktrackingSteps(problem);
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

      <div className="py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        {cur.grid ? (
          <div className="grid grid-cols-4 gap-1.5 p-3 bg-surface-container-high rounded-xl border border-charcoal shadow-hard">
            {cur.grid.map((row, r) =>
              row.map((cell, c) => {
                const isActive = cur.activeCell?.[0] === r && cur.activeCell?.[1] === c;
                const isQueen = cell === 'Q';

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center font-mono font-bold text-lg rounded-md transition-all duration-200 ${
                      isQueen
                        ? 'bg-primary-container text-on-primary-container border-2 border-charcoal shadow-sm'
                        : isActive
                        ? 'bg-primary-fixed border-2 border-marker-orange'
                        : (r + c) % 2 === 0
                        ? 'bg-cream-paper border border-outline/40 text-charcoal'
                        : 'bg-secondary-container border border-outline/30 text-charcoal'
                    }`}
                  >
                    {cell === '.' ? '' : String(cell)}
                  </div>
                );
              })
            )}
          </div>
        ) : cur.treePath ? (
          <div className="flex items-center gap-2 flex-wrap justify-center font-mono text-sm py-4">
            {cur.treePath.map((node, i) => (
              <React.Fragment key={i}>
                <span className="px-3 py-1.5 rounded-lg bg-primary-container border border-charcoal font-bold text-charcoal shadow-xs">
                  {node}
                </span>
                {i < cur.treePath!.length - 1 && <span className="text-marker-orange font-bold">→</span>}
              </React.Fragment>
            ))}
          </div>
        ) : null}
      </div>

      <StepCard
        stepNumber={step + 1}
        totalSteps={steps.length}
        title={cur.title}
        whatHappens={cur.whatHappens}
        whyRationale={cur.whyRationale}
        variableStates={cur.states}
        codeSnippet={cur.codeSnippet}
        timeSpaceImpact={cur.impact || 'Time: O(N!) | Space: O(N)'}
      />
    </div>
  );
};