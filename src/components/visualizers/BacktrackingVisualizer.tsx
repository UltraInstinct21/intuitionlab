import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

export const BacktrackingVisualizer: React.FC = () => {
  const [board, setBoard] = useState([['Q', '.', '.', '.'], ['.', '.', 'Q', '.'], ['.', '.', '.', '.'], ['.', 'Q', '.', '.']]);
  const [currentQueen, setCurrentQueen] = useState(0);
  const [moveLog, setMoveLog] = useState<string[]>([]);

  const isValid = (r: number, c: number, b: string[][]) => {
    for (let i = 0; i < r; i++) {
      if (b[i][c] === 'Q') return false;
      if (c - (r - i) >= 0 && b[i][c - (r - i)] === 'Q') return false;
      if (c + (r - i) < 4 && b[i][c + (r - i)] === 'Q') return false;
    }
    return true;
  };

  const placeQueen = (row: number, col: number) => {
    const newBoard = board.map(r => r.map(c => c === 'Q' ? '.' : c));
    for (let r = 0; r < row; r++) {
      for (let c = 0; c < 4; c++) {
        if (isValid(r, c, newBoard)) { newBoard[r][c] = 'Q'; break; }
      }
    }
    if (row < 4 && isValid(row, col, newBoard)) {
      newBoard[row][col] = 'Q';
      setBoard(newBoard);
      setCurrentQueen(row + 1);
      setMoveLog([...moveLog, `Place Q at (${row},${col})`]);
    }
  };

  const reset = () => {
    setBoard([['.', '.', '.', '.'], ['.', '.', '.', '.'], ['.', '.', '.', '.'], ['.', '.', '.', '.']]);
    setCurrentQueen(0); setMoveLog([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={() => placeQueen(currentQueen, [0, 1, 0, 1][currentQueen])}
            disabled={currentQueen >= 4} className="text-xs h-8 px-3">place row {currentQueen}</Button>
          <Button size="sm" variant="ghost" onClick={reset} className="h-8"><RotateCcw className="w-4 h-4" /></Button>
        </div>
        <span className="text-xs font-mono font-bold text-marker-orange">queens placed: {currentQueen}/4</span>
      </div>

      <div className="py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        <div className="grid grid-cols-4 gap-1.5 p-3 bg-surface-container-high rounded-xl border border-charcoal shadow-hard">
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div key={`${r}-${c}`} className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center font-mono font-bold text-lg rounded-md transition-all duration-200 ${
                cell === 'Q' ? 'bg-primary-container text-on-primary-container border-2 border-charcoal shadow-sm'
                : (r + c) % 2 === 0 ? 'bg-cream-paper border border-outline/40' : 'bg-secondary-container border border-outline/30'
              }`}>{cell === 'Q' ? '♛' : ''}</div>
            ))
          )}
        </div>
        {moveLog.length > 0 && (
          <div className="text-xs font-mono text-on-surface-variant max-h-20 overflow-y-auto w-full max-w-xs">
            {moveLog.map((log, i) => <div key={i}>{log}</div>)}
          </div>
        )}
      </div>

      <StepCard stepNumber={currentQueen + 1} totalSteps={5}
        title={`N-Queens: Row ${currentQueen} placement`}
        whatHappens="Try placing queen in current row. Check column and diagonal conflicts against placed queens."
        whyRationale="Backtracking: place one queen per row. If conflict found, backtrack and try next column. O(N!) time."
        variableStates={{ row: currentQueen, queens_placed: currentQueen, board_size: '4x4' }}
        codeSnippet="for col in range(N):\n    if is_safe(row, col):\n        board[row][col] = 'Q'\n        if solve(row + 1):\n            return True\n        board[row][col] = '.'  # backtrack"
        timeSpaceImpact="Time: O(N!) | Space: O(N²)"
      />
    </div>
  );
};