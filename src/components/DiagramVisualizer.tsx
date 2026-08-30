import React, { useState, useEffect, useRef } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Layers,
  Code,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import gsap from 'gsap';

interface DiagramVisualizerProps {
  problem: Problem;
}

export const DiagramVisualizer: React.FC<DiagramVisualizerProps> = ({ problem }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const titleLower = (problem.title || '').toLowerCase();
  const topicLower = (problem.topicTitle || '').toLowerCase();
  const tagsStr = (problem.tags || []).join(' ').toLowerCase();

  let diagramType: 'matrix' | 'array_pointers' | 'sort_colors' | 'kadane' | 'linked_list' | 'tree' | 'dp_table' | 'stack' | 'interval' | 'generic' = 'generic';

  if (titleLower.includes('matrix') || topicLower.includes('matrix') || tagsStr.includes('matrix')) {
    diagramType = 'matrix';
  } else if (titleLower.includes('sort') && (titleLower.includes('0') || titleLower.includes('color'))) {
    diagramType = 'sort_colors';
  } else if (titleLower.includes('kadane') || titleLower.includes('subarray')) {
    diagramType = 'kadane';
  } else if (titleLower.includes('linked list') || topicLower.includes('linked') || tagsStr.includes('linked list')) {
    diagramType = 'linked_list';
  } else if (topicLower.includes('tree') || tagsStr.includes('binary tree') || tagsStr.includes('bst')) {
    diagramType = 'tree';
  } else if (topicLower.includes('dynamic') || tagsStr.includes('dynamic programming') || titleLower.includes('path')) {
    diagramType = 'dp_table';
  } else if (topicLower.includes('stack') || topicLower.includes('queue') || tagsStr.includes('stack')) {
    diagramType = 'stack';
  } else if (titleLower.includes('interval') || titleLower.includes('overlap')) {
    diagramType = 'interval';
  } else if (topicLower.includes('array') || tagsStr.includes('two pointer') || titleLower.includes('sum')) {
    diagramType = 'array_pointers';
  }

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [problem.id]);

  return (
    <div ref={containerRef} className="rounded-xl border-[1.5px] border-charcoal bg-surface p-5 sm:p-7 shadow-hard-lg relative overflow-hidden space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-outline/30 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container text-sm font-bold border-[1.5px] border-charcoal shadow-xs">
            ✦
          </span>
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold lowercase text-charcoal tracking-tight">
              interactive step-by-step visualizer
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant font-sans">
              step through each iteration with granular state explanations and code mappings.
            </p>
          </div>
        </div>
        <Badge variant="medium" className="text-xs font-mono hidden sm:inline-flex">
          {diagramType.replace('_', ' ')} visual model
        </Badge>
      </div>

      {/* Render specialized visualizer */}
      {diagramType === 'matrix' && <MatrixDiagram problem={problem} />}
      {diagramType === 'sort_colors' && <SortColorsDiagram />}
      {diagramType === 'kadane' && <KadaneDiagram />}
      {diagramType === 'linked_list' && <LinkedListDiagram />}
      {diagramType === 'tree' && <TreeDiagram />}
      {diagramType === 'dp_table' && <DPTableDiagram />}
      {diagramType === 'stack' && <StackDiagram />}
      {diagramType === 'interval' && <IntervalDiagram />}
      {diagramType === 'array_pointers' && <ArrayPointersDiagram problem={problem} />}
      {diagramType === 'generic' && <GenericFlowDiagram problem={problem} />}
    </div>
  );
};

/* Reusable Step Explanation Card Component */
interface StepCardProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  whatHappens: string;
  whyRationale: string;
  variableStates: Record<string, string | number | boolean | undefined>;
  codeSnippet?: string;
  timeSpaceImpact?: string;
}

const StepExplanationCard: React.FC<StepCardProps> = ({
  stepNumber,
  totalSteps,
  title,
  whatHappens,
  whyRationale,
  variableStates,
  codeSnippet,
  timeSpaceImpact,
}) => {
  return (
    <div className="rounded-xl border-[1.5px] border-charcoal bg-dew-drop p-4 sm:p-5 shadow-hard space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline/20 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="bg-primary-container text-on-primary-container text-xs font-mono font-bold px-2.5 py-0.5 rounded-pill border border-charcoal">
            step {stepNumber} / {totalSteps}
          </span>
          <span className="font-display font-bold text-sm sm:text-base text-charcoal lowercase">
            {title}
          </span>
        </div>

        {timeSpaceImpact && (
          <span className="text-xs font-mono text-on-surface-variant font-medium bg-cream-paper px-2.5 py-0.5 rounded border border-outline/30">
            {timeSpaceImpact}
          </span>
        )}
      </div>

      {/* Two Column Explanation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        {/* What Happens */}
        <div className="space-y-1.5 bg-cream-paper p-3 rounded-lg border border-outline/30">
          <div className="flex items-center gap-1.5 font-bold font-mono text-marker-orange text-xs uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>action in this step:</span>
          </div>
          <p className="font-sans text-cocoa-ink leading-relaxed font-medium">
            {whatHappens}
          </p>
        </div>

        {/* Why this rationale */}
        <div className="space-y-1.5 bg-cream-paper p-3 rounded-lg border border-outline/30">
          <div className="flex items-center gap-1.5 font-bold font-mono text-sky-sticker text-xs uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>algorithmic rationale:</span>
          </div>
          <p className="font-sans text-cocoa-ink leading-relaxed font-medium">
            {whyRationale}
          </p>
        </div>
      </div>

      {/* Variables & State Tracker */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-bold font-mono text-charcoal">
          Live Variables:
        </span>
        {Object.entries(variableStates)
          .filter(([_, val]) => val !== undefined)
          .map(([key, val]) => (
            <span
              key={key}
              className="text-xs font-mono px-2.5 py-1 rounded bg-surface border border-charcoal/40 text-charcoal shadow-xs"
            >
              <strong className="text-marker-orange">{key}</strong> = {String(val)}
            </span>
          ))}
      </div>

      {/* Code Snippet Mapping */}
      {codeSnippet && (
        <div className="pt-2 border-t border-outline/20">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-on-surface-variant mb-1">
            <Code className="w-3 h-3 text-marker-orange" />
            <span>Executing Code Line:</span>
          </div>
          <pre className="p-2.5 rounded bg-inverse-surface text-inverse-on-surface font-mono text-xs overflow-x-auto border border-charcoal">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* 1. MATRIX DIAGRAM WITH DETAILED STEP BREAKDOWN                            */
/* ========================================================================= */
const MatrixDiagram: React.FC<{ problem: Problem }> = () => {
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 1],
  ]);

  const [step, setStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const stepsData = [
    {
      title: "Inspect Matrix & Record Original Boundary Zeros",
      whatHappens: "Scan row 0 and column 0 to check if they already contain any zeros. Store results in two boolean flags: firstRowZero and firstColZero.",
      whyRationale: "Since we will overwrite row 0 and column 0 to store markers for inner cells, we must remember beforehand if row 0 and col 0 themselves needed zeroing out.",
      variableStates: {
        "firstRowZero": matrix[0].some(v => v === 0) ? "true" : "false",
        "firstColZero": matrix.some(r => r[0] === 0) ? "true" : "false",
        "matrix_size": "4 x 4",
      },
      codeSnippet: "first_row_zero = any(matrix[0][j] == 0 for j in range(n))\nfirst_col_zero = any(matrix[i][0] == 0 for i in range(m))",
      timeSpaceImpact: "Time: O(m + n) | Auxiliary Space: O(1)",
    },
    {
      title: "Use First Row & First Column as In-Place Markers",
      whatHappens: "Iterate through the inner matrix from (1,1) to (m-1, n-1). Whenever matrix[r][c] == 0, mark matrix[r][0] = 0 (row marker) and matrix[0][c] = 0 (col marker).",
      whyRationale: "Instead of allocating O(m+n) extra memory arrays, we reuse the matrix's own top row and left column as hash markers without extra space overhead.",
      variableStates: {
        "scan_range": "rows 1..3, cols 1..3",
        "row_markers_set": "matrix[1][0]=0",
        "col_markers_set": "matrix[0][1]=0",
      },
      codeSnippet: "for i in range(1, m):\n    for j in range(1, n):\n        if matrix[i][j] == 0:\n            matrix[i][0] = 0\n            matrix[0][j] = 0",
      timeSpaceImpact: "Time: O(m × n) | Auxiliary Space: O(1)",
    },
    {
      title: "Zero Out Inner Matrix Cells Using Recorded Markers",
      whatHappens: "Iterate through cells (1,1) to (m-1, n-1). If matrix[r][0] == 0 OR matrix[0][c] == 0, set matrix[r][c] = 0.",
      whyRationale: "Each inner cell consults its corresponding row marker matrix[r][0] and column marker matrix[0][c]. If either is 0, this cell belongs to a zeroed line.",
      variableStates: {
        "inner_cells_processed": "9 cells",
        "rule": "matrix[r][c] = 0 if (matrix[r][0]==0 or matrix[0][c]==0)",
      },
      codeSnippet: "for i in range(1, m):\n    for j in range(1, n):\n        if matrix[i][0] == 0 or matrix[0][j] == 0:\n            matrix[i][j] = 0",
      timeSpaceImpact: "Time: O(m × n) | Auxiliary Space: O(1)",
    },
    {
      title: "Apply Boundary Flags to Row 0 and Col 0 (Completion)",
      whatHappens: "If firstRowZero was true, set all elements in row 0 to 0. If firstColZero was true, set all elements in column 0 to 0.",
      whyRationale: "We delayed updating the first row and column until the end so their original marker information wouldn't be corrupted while zeroing inner cells.",
      variableStates: {
        "firstRowZeroApplied": matrix[0].some(v => v === 0) ? "yes (all 0s)" : "no",
        "firstColZeroApplied": matrix.some(r => r[0] === 0) ? "yes (all 0s)" : "no",
        "status": "In-place zeroing complete!",
      },
      codeSnippet: "if first_row_zero: matrix[0] = [0] * n\nif first_col_zero:\n    for i in range(m): matrix[i][0] = 0",
      timeSpaceImpact: "Total Time: O(m × n) | Total Space: O(1)",
    },
  ];

  const toggleCell = (r: number, c: number) => {
    const next = matrix.map((row, ri) =>
      row.map((val, ci) => (ri === r && ci === c ? (val === 0 ? 1 : 0) : val))
    );
    setMatrix(next);
  };

  const resetMatrix = () => {
    setMatrix([
      [1, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 1],
    ]);
    setStep(0);
    setIsPlaying(false);
  };

  const getSimulatedMatrix = (currentStep: number) => {
    if (currentStep === 0) return matrix;

    const m = matrix.length;
    const n = matrix[0].length;
    const copy = matrix.map(r => [...r]);

    const firstRowZero = matrix[0].some(v => v === 0);
    const firstColZero = matrix.some(r => r[0] === 0);

    if (currentStep >= 1) {
      for (let r = 1; r < m; r++) {
        for (let c = 1; c < n; c++) {
          if (matrix[r][c] === 0) {
            copy[r][0] = 0;
            copy[0][c] = 0;
          }
        }
      }
    }

    if (currentStep >= 2) {
      for (let r = 1; r < m; r++) {
        for (let c = 1; c < n; c++) {
          if (copy[r][0] === 0 || copy[0][c] === 0) {
            copy[r][c] = 0;
          }
        }
      }
    }

    if (currentStep >= 3) {
      if (firstRowZero) {
        for (let c = 0; c < n; c++) copy[0][c] = 0;
      }
      if (firstColZero) {
        for (let r = 0; r < m; r++) copy[r][0] = 0;
      }
    }

    return copy;
  };

  const displayMatrix = getSimulatedMatrix(step);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep(prev => {
          if (prev >= stepsData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, stepsData.length]);

  return (
    <div className="space-y-6">
      {/* Controls Bar & Step Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2 flex-wrap">
          {stepsData.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setStep(idx);
                setIsPlaying(false);
              }}
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
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 text-xs h-8 px-3"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'pause' : 'auto play'}</span>
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              if (step > 0) setStep(step - 1);
            }}
            disabled={step === 0}
            className="h-8 px-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              if (step < stepsData.length - 1) setStep(step + 1);
            }}
            disabled={step === stepsData.length - 1}
            className="h-8 px-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={resetMatrix} className="h-8">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40">
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-mono">
            {step === 0 ? 'interactive 4x4 matrix (click to toggle 0/1)' : `matrix state at step ${step + 1}`}
          </span>

          <div className="grid grid-cols-4 gap-2 p-3 bg-surface-container-high rounded-xl border-[1.5px] border-charcoal shadow-hard">
            {displayMatrix.map((row, r) =>
              row.map((val, c) => {
                const isZero = val === 0;
                const isMarkerRowOrCol = r === 0 || c === 0;

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => step === 0 && toggleCell(r, c)}
                    disabled={step !== 0}
                    className={`w-13 h-13 sm:w-16 sm:h-16 flex items-center justify-center font-mono font-bold text-base sm:text-xl rounded-lg transition-all duration-300 relative ${
                      isZero
                        ? 'bg-primary-container text-on-primary-container border-[1.5px] border-charcoal shadow-sm scale-95'
                        : isMarkerRowOrCol && step > 0
                        ? 'bg-secondary-container text-on-secondary-container border border-outline'
                        : 'bg-cream-paper text-charcoal border border-outline/50 hover:bg-dew-drop'
                    }`}
                  >
                    {val}
                    {isMarkerRowOrCol && step >= 1 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-marker-orange" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 text-xs sm:text-sm font-mono max-w-xs p-4 bg-dew-drop rounded-xl border border-outline/40">
          <div className="font-bold text-charcoal pb-1 border-b border-outline/20">Matrix Indicators:</div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-primary-container rounded-xs border border-charcoal" />
            <span>0 value cell (zeroed)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-secondary-container rounded-xs border border-outline" />
            <span>boundary marker (row 0 / col 0)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-cream-paper rounded-xs border border-outline/50" />
            <span>non-zero value (1)</span>
          </div>
        </div>
      </div>

      {/* Granular Step Explanation Card */}
      <StepExplanationCard
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

/* ========================================================================= */
/* 2. SORT COLORS (DUTCH NATIONAL FLAG) WITH DETAILED STEP RATIONALE         */
/* ========================================================================= */
const SortColorsDiagram: React.FC = () => {
  const initialArr = [2, 0, 2, 1, 1, 0];

  // Pre-calculate all states
  const states: {
    arr: number[];
    low: number;
    mid: number;
    high: number;
    action: string;
    rationale: string;
    codeLine: string;
  }[] = [];

  let curArr = [...initialArr];
  let curLow = 0;
  let curMid = 0;
  let curHigh = curArr.length - 1;

  states.push({
    arr: [...curArr],
    low: curLow,
    mid: curMid,
    high: curHigh,
    action: "Initialize pointers: low=0, mid=0, high=5. All elements between mid and high are uninspected.",
    rationale: "Dutch National Flag maintains 4 partitions: [0..low-1] for 0s, [low..mid-1] for 1s, [mid..high] unclassified, and [high+1..n-1] for 2s.",
    codeLine: "low = 0, mid = 0, high = len(nums) - 1",
  });

  while (curMid <= curHigh) {
    if (curArr[curMid] === 0) {
      const swappedVal = curArr[curLow];
      [curArr[curLow], curArr[curMid]] = [curArr[curMid], curArr[curLow]];
      curLow++;
      curMid++;
      states.push({
        arr: [...curArr],
        low: curLow,
        mid: curMid,
        high: curHigh,
        action: `Encountered 0 at mid. Swapped nums[${curMid - 1}] with nums[${curLow - 1}] (${swappedVal}). Advanced both low and mid.`,
        rationale: "Since 0 belongs in the left partition, we place it at index 'low' and expand the sorted 0 boundary by incrementing low and mid.",
        codeLine: "nums[low], nums[mid] = nums[mid], nums[low]\nlow += 1; mid += 1",
      });
    } else if (curArr[curMid] === 1) {
      curMid++;
      states.push({
        arr: [...curArr],
        low: curLow,
        mid: curMid,
        high: curHigh,
        action: `Encountered 1 at index ${curMid - 1}. No swap needed. Advanced mid to ${curMid}.`,
        rationale: "1 is already in its correct middle partition [low..mid-1], so we simply increment mid to examine the next item.",
        codeLine: "mid += 1",
      });
    } else {
      const swappedVal = curArr[curHigh];
      [curArr[curMid], curArr[curHigh]] = [curArr[curHigh], curArr[curMid]];
      curHigh--;
      states.push({
        arr: [...curArr],
        low: curLow,
        mid: curMid,
        high: curHigh,
        action: `Encountered 2 at mid (${curMid}). Swapped with nums[${curHigh + 1}] (${swappedVal}). Decremented high to ${curHigh}.`,
        rationale: "2 belongs in the right partition. We swap it to high and decrement high. We do NOT increment mid yet because the newly swapped value at mid is uninspected.",
        codeLine: "nums[mid], nums[high] = nums[high], nums[mid]\nhigh -= 1",
      });
    }
  }

  const [stepIdx, setStepIdx] = useState<number>(0);
  const curState = states[stepIdx];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
            disabled={stepIdx === 0}
            className="h-8 px-2.5 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>prev step</span>
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setStepIdx(Math.min(states.length - 1, stepIdx + 1))}
            disabled={stepIdx === states.length - 1}
            className="h-8 px-3 text-xs"
          >
            <span>{stepIdx === states.length - 1 ? 'partition complete!' : 'next step'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setStepIdx(0)} className="h-8">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-3 text-xs md:text-sm font-mono font-bold">
          <span className="text-[#93000a]">low: {curState.low}</span>
          <span className="text-sky-sticker">mid: {curState.mid}</span>
          <span className="text-burnt-sienna">high: {curState.high}</span>
        </div>
      </div>

      {/* Array Bars */}
      <div className="flex flex-col items-center justify-center gap-6 py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40">
        <div className="flex items-end gap-3 flex-wrap justify-center">
          {curState.arr.map((val, idx) => {
            const isLow = idx === curState.low;
            const isMid = idx === curState.mid;
            const isHigh = idx === curState.high;

            const colorClass =
              val === 0
                ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]'
                : val === 1
                ? 'bg-cream-paper text-charcoal border-charcoal'
                : 'bg-primary-fixed text-burnt-sienna border-marker-orange';

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className="h-6 flex items-center justify-center gap-0.5 font-mono text-xs font-bold">
                  {isLow && <span className="bg-[#ba1a1a] text-white px-1.5 rounded-xs">L</span>}
                  {isMid && <span className="bg-sky-sticker text-white px-1.5 rounded-xs">M</span>}
                  {isHigh && <span className="bg-sprout-sticker text-white px-1.5 rounded-xs">H</span>}
                </div>

                <div
                  className={`w-14 h-16 md:w-16 md:h-18 flex items-center justify-center font-mono font-bold text-xl rounded-lg border-2 shadow-hard transition-all duration-300 ${colorClass} ${
                    isMid ? 'ring-2 ring-marker-orange scale-105' : ''
                  }`}
                >
                  {val}
                </div>

                <span className="text-xs font-mono text-on-surface-variant font-medium">idx {idx}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm font-mono bg-dew-drop px-5 py-2.5 rounded-full border border-outline/40">
          <span className="text-[#93000a] font-bold">0: Red [0..low-1]</span>
          <span className="text-charcoal font-bold">1: White [low..mid-1]</span>
          <span className="text-burnt-sienna font-bold">2: Blue [high+1..n-1]</span>
        </div>
      </div>

      {/* Step Explanation Card */}
      <StepExplanationCard
        stepNumber={stepIdx + 1}
        totalSteps={states.length}
        title={`Iteration ${stepIdx + 1}`}
        whatHappens={curState.action}
        whyRationale={curState.rationale}
        variableStates={{
          "low": curState.low,
          "mid": curState.mid,
          "high": curState.high,
          "nums[mid]": curState.mid < curState.arr.length ? curState.arr[curState.mid] : "out of bounds",
        }}
        codeSnippet={curState.codeLine}
        timeSpaceImpact="Time: O(N) single pass | Space: O(1) in-place"
      />
    </div>
  );
};

/* ========================================================================= */
/* 3. KADANE'S ALGORITHM WITH DETAILED STEP RATIONALE                        */
/* ========================================================================= */
const KadaneDiagram: React.FC = () => {
  const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

  // Pre-calculate Kadane step history
  const states: {
    idx: number;
    val: number;
    currentSum: number;
    maxSum: number;
    action: string;
    rationale: string;
    codeLine: string;
    range: [number, number];
  }[] = [];

  let cur = 0;
  let maxS = -Infinity;
  let start = 0;
  let bestStart = 0;
  let bestEnd = 0;

  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    let action = '';
    let rationale = '';

    if (i === 0) {
      cur = val;
      maxS = val;
      start = 0;
      bestStart = 0;
      bestEnd = 0;
      action = `Initialize current_sum = ${val} and max_sum = ${val} with the first element.`;
      rationale = "At the start, the only non-empty contiguous subarray available is [nums[0]].";
    } else if (cur + val < val) {
      cur = val;
      start = i;
      action = `Adding ${val} to previous sum (${cur - val}) yields ${cur}. Starting fresh subarray from index ${i} is better (${val}).`;
      rationale = "If the accumulated sum is negative, carrying it forward drags down any future subarray. Hence, start a new subarray here.";
    } else {
      cur += val;
      action = `Extended subarray: current_sum = previous (${cur - val}) + ${val} = ${cur}.`;
      rationale = `Since previous sum was positive, extending it gives a larger sum than starting fresh with ${val} alone.`;
    }

    if (cur > maxS) {
      maxS = cur;
      bestStart = start;
      bestEnd = i;
      action += ` Updated max_sum to ${maxS}!`;
    }

    states.push({
      idx: i,
      val,
      currentSum: cur,
      maxSum: maxS,
      action,
      rationale,
      codeLine: `current_sum = max(nums[${i}], current_sum + nums[${i}])\nmax_sum = max(max_sum, current_sum)`,
      range: [bestStart, bestEnd],
    });
  }

  const [stepIdx, setStepIdx] = useState<number>(0);
  const curState = states[stepIdx];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
            disabled={stepIdx === 0}
            className="h-8 px-2.5 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>prev element</span>
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setStepIdx(Math.min(states.length - 1, stepIdx + 1))}
            disabled={stepIdx === states.length - 1}
            className="h-8 px-3 text-xs"
          >
            <span>{stepIdx === states.length - 1 ? 'end of array' : 'next element'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setStepIdx(0)} className="h-8">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs md:text-sm font-mono font-bold">
          <span className="text-cocoa-ink">current sum: {curState.currentSum}</span>
          <span className="text-marker-orange bg-primary-fixed-dim/60 px-3 py-1 rounded-pill border border-marker-orange">
            global max sum: {curState.maxSum}
          </span>
        </div>
      </div>

      {/* Array Elements */}
      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {nums.map((n, i) => {
            const isCurrent = i === curState.idx;
            const inMaxSubarray = i >= curState.range[0] && i <= curState.range[1];

            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-12 h-14 md:w-14 md:h-16 flex items-center justify-center font-mono font-bold text-base md:text-lg rounded-lg border transition-all duration-200 ${
                    isCurrent
                      ? 'border-2 border-marker-orange bg-primary-fixed scale-110 shadow-hard'
                      : inMaxSubarray
                      ? 'border-2 border-charcoal bg-secondary-container shadow-sm'
                      : 'border-outline/40 bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {n}
                </div>
                <span className="text-[10px] md:text-xs font-mono text-on-surface-variant font-medium">i={i}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Explanation Card */}
      <StepExplanationCard
        stepNumber={stepIdx + 1}
        totalSteps={states.length}
        title={`Evaluating Element nums[${curState.idx}] = ${curState.val}`}
        whatHappens={curState.action}
        whyRationale={curState.rationale}
        variableStates={{
          "i": curState.idx,
          "nums[i]": curState.val,
          "current_sum": curState.currentSum,
          "max_sum": curState.maxSum,
          "best_subarray": `nums[${curState.range[0]}..${curState.range[1]}]`,
        }}
        codeSnippet={curState.codeLine}
        timeSpaceImpact="Time: O(1) per step | Total Space: O(1)"
      />
    </div>
  );
};

/* ========================================================================= */
/* 4. LINKED LIST REVERSAL WITH DETAILED STEP RATIONALE                      */
/* ========================================================================= */
const LinkedListDiagram: React.FC = () => {
  const stepsInfo = [
    {
      title: "Initialize Three Pointers (prev=null, curr=Node 1)",
      whatHappens: "Initialize prev = null and curr = head (Node 1). We also prepare to save nextNode = curr.next.",
      whyRationale: "We need three pointers because changing curr.next would sever the link to the rest of the list. Saving nextNode ensures we can advance.",
      states: { "prev": "null", "curr": "Node(1)", "next": "Node(2)" },
      codeSnippet: "prev = None\ncurrent = head",
    },
    {
      title: "Reverse Pointer of Node 1 (Points to null)",
      whatHappens: "Set Node(1).next = prev (null). Move prev = Node(1) and curr = Node(2).",
      whyRationale: "Node 1 is the new tail of the reversed list, so its next pointer must point to null.",
      states: { "prev": "Node(1)", "curr": "Node(2)", "next": "Node(3)" },
      codeSnippet: "next_node = current.next\ncurrent.next = prev\nprev = current\ncurrent = next_node",
    },
    {
      title: "Reverse Pointer of Node 2 (Points to Node 1)",
      whatHappens: "Set Node(2).next = Node(1). Advance prev to Node(2) and curr to Node(3).",
      whyRationale: "Node 2 now points backwards to Node 1. The sub-chain [2 -> 1 -> null] is formed.",
      states: { "prev": "Node(2)", "curr": "Node(3)", "next": "Node(4)" },
      codeSnippet: "current.next = prev\nprev = current; current = next_node",
    },
    {
      title: "Reverse Pointer of Node 3 (Points to Node 2)",
      whatHappens: "Set Node(3).next = Node(2). Advance prev to Node(3) and curr to Node(4).",
      whyRationale: "Sub-chain [3 -> 2 -> 1 -> null] is formed.",
      states: { "prev": "Node(3)", "curr": "Node(4)", "next": "Node(5)" },
      codeSnippet: "current.next = prev\nprev = current; current = next_node",
    },
    {
      title: "Reverse Pointer of Node 4 (Points to Node 3)",
      whatHappens: "Set Node(4).next = Node(3). Advance prev to Node(4) and curr to Node(5).",
      whyRationale: "Sub-chain [4 -> 3 -> 2 -> 1 -> null] is formed.",
      states: { "prev": "Node(4)", "curr": "Node(5)", "next": "null" },
      codeSnippet: "current.next = prev\nprev = current; current = next_node",
    },
    {
      title: "Reverse Pointer of Node 5 & Return prev (New Head)",
      whatHappens: "Set Node(5).next = Node(4). Advance curr to null. Return prev (Node 5) as the new head.",
      whyRationale: "Curr has reached null, meaning all nodes are inverted. 'prev' points to the old tail, which is now the new head.",
      states: { "prev": "Node(5) [New Head]", "curr": "null", "next": "null" },
      codeSnippet: "return prev",
    },
  ];

  const [step, setStep] = useState<number>(0);
  const curStepData = stepsInfo[step];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="h-8 px-2.5 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>prev</span>
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setStep(Math.min(stepsInfo.length - 1, step + 1))}
            disabled={step === stepsInfo.length - 1}
            className="h-8 px-3 text-xs"
          >
            <span>{step === stepsInfo.length - 1 ? 'list reversed!' : 'next flip'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setStep(0)} className="h-8">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="text-xs md:text-sm font-mono flex items-center gap-3">
          <span className="text-sky-sticker font-bold">prev: {curStepData.states.prev}</span>
          <span className="text-marker-orange font-bold">curr: {curStepData.states.curr}</span>
        </div>
      </div>

      {/* Nodes Chain */}
      <div className="py-8 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex items-center justify-center overflow-x-auto">
        <div className="flex items-center gap-3.5 min-w-max">
          {[1, 2, 3, 4, 5].map((nodeVal, idx) => {
            const isReversed = idx < step;
            const isCurr = idx === step;
            const isPrev = idx === step - 1;

            return (
              <React.Fragment key={nodeVal}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-5 text-xs font-mono font-bold">
                    {isPrev && <span className="text-sky-sticker font-bold">prev</span>}
                    {isCurr && <span className="text-marker-orange font-bold">curr</span>}
                  </div>

                  <div
                    className={`flex items-center rounded-lg border-2 shadow-hard transition-all duration-300 ${
                      isCurr
                        ? 'border-marker-orange bg-primary-fixed scale-105'
                        : isReversed
                        ? 'border-sprout-sticker bg-[#22c55e]/15'
                        : 'border-charcoal bg-surface'
                    }`}
                  >
                    <div className="w-11 h-12 md:w-12 md:h-14 flex items-center justify-center font-mono font-bold text-base md:text-lg border-r border-charcoal">
                      {nodeVal}
                    </div>
                    <div className="w-8 h-12 md:w-9 md:h-14 flex items-center justify-center text-xs font-mono text-on-surface-variant bg-dew-drop">
                      •
                    </div>
                  </div>
                </div>

                {idx < 4 && (
                  <div className="flex flex-col items-center justify-center px-1">
                    <span
                      className={`text-xl font-bold transition-transform duration-300 ${
                        idx < step ? 'text-sprout-sticker -scale-x-100' : 'text-charcoal'
                      }`}
                    >
                      {idx < step ? '←' : '→'}
                    </span>
                    <span className="text-[9px] font-mono text-on-surface-variant">
                      {idx < step ? 'reversed' : 'next'}
                    </span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Explanation Card */}
      <StepExplanationCard
        stepNumber={step + 1}
        totalSteps={stepsInfo.length}
        title={curStepData.title}
        whatHappens={curStepData.whatHappens}
        whyRationale={curStepData.whyRationale}
        variableStates={curStepData.states}
        codeSnippet={curStepData.codeSnippet}
        timeSpaceImpact="Time: O(N) linear scan | Space: O(1) in-place pointers"
      />
    </div>
  );
};

/* ========================================================================= */
/* 5. TREE DIAGRAM WITH STEP RATIONALE                                       */
/* ========================================================================= */
const TreeDiagram: React.FC = () => {
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');
  const [visitedStep, setVisitedStep] = useState<number>(0);

  const nodes = [
    { id: 1, val: 1, x: 160, y: 30 },
    { id: 2, val: 2, x: 90, y: 90 },
    { id: 3, val: 3, x: 230, y: 90 },
    { id: 4, val: 4, x: 50, y: 150 },
    { id: 5, val: 5, x: 130, y: 150 },
  ];

  const traversals = {
    inorder: [4, 2, 5, 1, 3],
    preorder: [1, 2, 4, 5, 3],
    postorder: [4, 5, 2, 3, 1],
  };

  const explanations = {
    inorder: "Inorder traversal processes (Left Subtree -> Root -> Right Subtree). On a Binary Search Tree, this produces sorted non-decreasing order.",
    preorder: "Preorder traversal processes (Root -> Left Subtree -> Right Subtree). Ideal for cloning/serializing trees and prefix evaluations.",
    postorder: "Postorder traversal processes (Left Subtree -> Right Subtree -> Root). Ideal for bottom-up subtree calculations like tree height and deleting nodes.",
  };

  const currentOrder = traversals[traversalType];
  const currentNodeVal = visitedStep > 0 ? currentOrder[visitedStep - 1] : null;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          {(['inorder', 'preorder', 'postorder'] as const).map(type => (
            <Button
              key={type}
              size="sm"
              variant={traversalType === type ? 'primary' : 'outline'}
              onClick={() => {
                setTraversalType(type);
                setVisitedStep(0);
              }}
              className="text-xs md:text-sm h-8 px-3"
            >
              {type}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => setVisitedStep(Math.max(0, visitedStep - 1))}
            disabled={visitedStep === 0}
            className="h-8 px-2.5 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setVisitedStep(Math.min(currentOrder.length, visitedStep + 1))}
            disabled={visitedStep === currentOrder.length}
            className="h-8 px-3 text-xs"
          >
            <span>step visit ({visitedStep}/{currentOrder.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setVisitedStep(0)} className="h-8">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* SVG Tree Visualizer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40">
        <svg viewBox="0 0 320 200" className="w-80 h-52 overflow-visible">
          <line x1="160" y1="30" x2="90" y2="90" stroke="#171717" strokeWidth="2.5" />
          <line x1="160" y1="30" x2="230" y2="90" stroke="#171717" strokeWidth="2.5" />
          <line x1="90" y1="90" x2="50" y2="150" stroke="#171717" strokeWidth="2.5" />
          <line x1="90" y1="90" x2="130" y2="150" stroke="#171717" strokeWidth="2.5" />

          {nodes.map(n => {
            const visitedIdx = currentOrder.indexOf(n.val);
            const isVisited = visitedIdx < visitedStep;
            const isCurrent = visitedIdx === visitedStep - 1;

            return (
              <g key={n.id} className="transition-all duration-300">
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="20"
                  fill={isCurrent ? '#ff6f1e' : isVisited ? '#feddbe' : '#fdfbf9'}
                  stroke="#171717"
                  strokeWidth="2.5"
                />
                <text
                  x={n.x}
                  y={n.y + 6}
                  textAnchor="middle"
                  fill={isCurrent ? '#ffffff' : '#171717'}
                  fontFamily="Geist Mono"
                  fontSize="15"
                  fontWeight="bold"
                >
                  {n.val}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex flex-col gap-2.5 max-w-xs text-xs md:text-sm font-mono">
          <span className="font-bold text-charcoal">{traversalType} visit sequence:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {currentOrder.map((val, idx) => {
              const active = idx < visitedStep;
              return (
                <span
                  key={val}
                  className={`px-3 py-1.5 rounded-md border ${
                    active
                      ? 'bg-primary-container text-on-primary-container border-charcoal font-bold shadow-sm'
                      : 'bg-surface-container-high text-on-surface-variant border-outline/30'
                  }`}
                >
                  {val}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Explanation Card */}
      <StepExplanationCard
        stepNumber={visitedStep}
        totalSteps={currentOrder.length}
        title={currentNodeVal !== null ? `Visited Node ${currentNodeVal}` : "Traversal Start"}
        whatHappens={
          currentNodeVal !== null
            ? `Visiting Node(${currentNodeVal}) as item #${visitedStep} in the traversal sequence.`
            : "Starting tree traversal from root."
        }
        whyRationale={explanations[traversalType]}
        variableStates={{
          "traversal_type": traversalType,
          "current_node": currentNodeVal !== null ? currentNodeVal : "none",
          "visited_count": `${visitedStep} / ${currentOrder.length}`,
        }}
        codeSnippet={
          traversalType === 'inorder'
            ? "dfs(node.left)\nresult.append(node.val)\ndfs(node.right)"
            : traversalType === 'preorder'
            ? "result.append(node.val)\ndfs(node.left)\ndfs(node.right)"
            : "dfs(node.left)\ndfs(node.right)\nresult.append(node.val)"
        }
        timeSpaceImpact="Time: O(N) visits each node once | Space: O(H) recursion stack"
      />
    </div>
  );
};

/* ========================================================================= */
/* 6. DYNAMIC PROGRAMMING GRID WITH DETAILED CELL DEPENDENCY EXPLANATION     */
/* ========================================================================= */
const DPTableDiagram: React.FC = () => {
  const [currR, setCurrR] = useState<number>(1);
  const [currC, setCurrC] = useState<number>(1);

  const rows = 3;
  const cols = 4;
  const dp: number[][] = Array(rows).fill(0).map(() => Array(cols).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 || c === 0) dp[r][c] = 1;
      else dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
    }
  }

  const nextCell = () => {
    if (currC < cols - 1) {
      setCurrC(c => c + 1);
    } else if (currR < rows - 1) {
      setCurrR(r => r + 1);
      setCurrC(1);
    } else {
      setCurrR(1);
      setCurrC(1);
    }
  };

  const topVal = dp[currR - 1][currC];
  const leftVal = dp[currR][currC - 1];
  const totalVal = dp[currR][currC];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2.5">
          <Button size="sm" variant="primary" onClick={nextCell} className="flex items-center gap-1.5 text-xs md:text-sm h-8 px-3">
            <SkipForward className="w-4 h-4" />
            <span>calculate dp[{currR}][{currC}]</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setCurrR(1); setCurrC(1); }} className="h-8">
            <RotateCcw className="w-4 h-4" />
            <span>reset</span>
          </Button>
        </div>
        <span className="text-xs md:text-sm font-mono text-marker-orange font-bold">
          dp[{currR}][{currC}] = dp[{currR-1}][{currC}] + dp[{currR}][{currC-1}] = {topVal} + {leftVal} = {totalVal}
        </span>
      </div>

      {/* DP Grid Table */}
      <div className="py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        <div className="grid grid-cols-4 gap-2.5">
          {dp.map((row, r) =>
            row.map((val, c) => {
              const isTarget = r === currR && c === currC;
              const isDepTop = r === currR - 1 && c === currC;
              const isDepLeft = r === currR && c === currC - 1;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-16 h-14 md:w-20 md:h-16 flex flex-col items-center justify-center rounded-lg border-2 font-mono transition-all duration-300 ${
                    isTarget
                      ? 'border-marker-orange bg-primary-fixed scale-110 shadow-hard'
                      : isDepTop || isDepLeft
                      ? 'border-sky-sticker bg-sky-100 text-sky-900 font-bold'
                      : 'border-charcoal bg-surface text-charcoal'
                  }`}
                >
                  <span className="text-sm md:text-base font-bold">{val}</span>
                  <span className="text-[9px] md:text-[10px] text-on-surface-variant font-medium">({r},{c})</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Step Explanation Card */}
      <StepExplanationCard
        stepNumber={currR * 4 + currC + 1}
        totalSteps={rows * cols}
        title={`Computing DP Table Cell (${currR}, ${currC})`}
        whatHappens={`To find the number of unique paths to cell (${currR}, ${currC}), we sum the paths from the cell directly above (${currR - 1}, ${currC}) and the cell directly to the left (${currR}, ${currC - 1}).`}
        whyRationale="Since the robot can only move DOWN or RIGHT, every unique path arriving at (r, c) must come from either (r-1, c) or (r, c-1). This optimal substructure allows overlapping subproblems to be solved in O(1) per cell."
        variableStates={{
          "r": currR,
          "c": currC,
          "dp[r-1][c] (Top)": topVal,
          "dp[r][c-1] (Left)": leftVal,
          "dp[r][c] (Result)": totalVal,
        }}
        codeSnippet="dp[i][j] = dp[i-1][j] + dp[i][j-1]"
        timeSpaceImpact="Time: O(1) per transition | Overall Time: O(M×N) | Space: O(M×N)"
      />
    </div>
  );
};

/* ========================================================================= */
/* 7. STACK DIAGRAM WITH DETAILED STEP EXPLANATION                          */
/* ========================================================================= */
const StackDiagram: React.FC = () => {
  const [stack, setStack] = useState<number[]>([4, 2, 7]);
  const [inputVal, setInputVal] = useState<number>(5);
  const [lastAction, setLastAction] = useState<string>("Initial stack state with 3 items.");

  const pushVal = () => {
    if (stack.length < 5) {
      const pushed = inputVal;
      setStack([pushed, ...stack]);
      const nextRand = Math.floor(Math.random() * 9) + 1;
      setInputVal(nextRand);
      setLastAction(`Pushed ${pushed} onto the top of the stack. Next prepared value is ${nextRand}.`);
    }
  };

  const popVal = () => {
    if (stack.length > 0) {
      const popped = stack[0];
      setStack(stack.slice(1));
      setLastAction(`Popped ${popped} from the top of the stack following LIFO (Last-In-First-Out).`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2.5">
          <Button size="sm" variant="primary" onClick={pushVal} disabled={stack.length >= 5} className="text-xs md:text-sm h-8 px-3">
            push({inputVal})
          </Button>
          <Button size="sm" variant="outline" onClick={popVal} disabled={stack.length === 0} className="text-xs md:text-sm h-8 px-3">
            pop()
          </Button>
        </div>
        <span className="text-xs md:text-sm font-mono font-bold text-marker-orange">
          stack size: {stack.length} | top: {stack[0] !== undefined ? stack[0] : 'empty'}
        </span>
      </div>

      <div className="py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex items-center justify-center gap-8">
        <div className="w-44 min-h-52 border-x-2 border-b-2 border-charcoal bg-surface-container-high rounded-b-xl flex flex-col justify-end p-2.5 gap-2 shadow-hard">
          {stack.map((item, idx) => (
            <div
              key={idx}
              className={`w-full py-2.5 flex items-center justify-center font-mono font-bold text-base rounded-md border border-charcoal transition-all ${
                idx === 0 ? 'bg-primary-container text-on-primary-container shadow-sm' : 'bg-cream-paper text-charcoal'
              }`}
            >
              {item} {idx === 0 ? '← top' : ''}
            </div>
          ))}
          {stack.length === 0 && (
            <div className="text-center text-xs md:text-sm font-mono text-on-surface-variant py-10">
              empty stack
            </div>
          )}
        </div>
      </div>

      <StepExplanationCard
        stepNumber={stack.length}
        totalSteps={5}
        title="Stack LIFO State Transition"
        whatHappens={lastAction}
        whyRationale="Stacks maintain strict Last-In, First-Out order. In problems like Valid Parentheses and Next Greater Element, monotonic stacks store indices or values to achieve linear O(N) lookups."
        variableStates={{
          "stack_depth": stack.length,
          "top_element": stack[0] !== undefined ? stack[0] : "None",
          "next_push_candidate": inputVal,
        }}
        codeSnippet="stack.append(val)  # Push (O(1))\nval = stack.pop()   # Pop (O(1))"
        timeSpaceImpact="Time: O(1) push/pop | Space: O(N) capacity"
      />
    </div>
  );
};

/* ========================================================================= */
/* 8. INTERVALS DIAGRAM WITH STEP RATIONALE                                 */
/* ========================================================================= */
const IntervalDiagram: React.FC = () => {
  const intervals = [
    { start: 1, end: 3, label: '[1, 3]' },
    { start: 2, end: 6, label: '[2, 6]' },
    { start: 8, end: 10, label: '[8, 10]' },
    { start: 15, end: 18, label: '[15, 18]' },
  ];

  const merged = [
    { start: 1, end: 6, label: '[1, 6] (merged)' },
    { start: 8, end: 10, label: '[8, 10]' },
    { start: 15, end: 18, label: '[15, 18]' },
  ];

  return (
    <div className="space-y-6">
      <div className="py-5 px-5 bg-cream-paper rounded-xl border border-dashed border-outline/40 space-y-6">
        <div>
          <span className="text-xs md:text-sm font-bold font-mono text-on-surface-variant block mb-2.5">
            Input Intervals (Sorted by start time):
          </span>
          <div className="space-y-2.5">
            {intervals.map((iv, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-20 text-xs md:text-sm font-mono font-bold">{iv.label}</span>
                <div className="flex-1 bg-surface-container-high h-8 rounded-lg relative border border-outline/30 overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-secondary-container border border-charcoal rounded-md flex items-center justify-center text-xs font-mono font-bold"
                    style={{ left: `${(iv.start / 18) * 90}%`, width: `${((iv.end - iv.start) / 18) * 90}%` }}
                  >
                    {iv.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-outline/30 pt-4">
          <span className="text-xs md:text-sm font-bold font-mono text-marker-orange block mb-2.5">
            Merged Non-Overlapping Result:
          </span>
          <div className="space-y-2.5">
            {merged.map((iv, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-28 text-xs md:text-sm font-mono font-bold">{iv.label}</span>
                <div className="flex-1 bg-surface-container-high h-9 rounded-lg relative border border-outline/30 overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-primary-container text-on-primary-container border border-charcoal rounded-md flex items-center justify-center text-xs md:text-sm font-mono font-bold shadow-sm"
                    style={{ left: `${(iv.start / 18) * 90}%`, width: `${((iv.end - iv.start) / 18) * 90}%` }}
                  >
                    {iv.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StepExplanationCard
        stepNumber={2}
        totalSteps={3}
        title="Interval Overlap Resolution Rule"
        whatHappens="Intervals [1, 3] and [2, 6] overlap because 2 <= 3. They are fused into [1, max(3, 6)] = [1, 6]. Interval [8, 10] starts after 6, so it begins a new disjoint range."
        whyRationale="Sorting intervals by start time guarantees that if interval[i] overlaps with any previous interval, it must overlap with the most recently merged interval."
        variableStates={{
          "condition": "current.start <= lastMerged.end (2 <= 3 -> True)",
          "merged_result": "[[1, 6], [8, 10], [15, 18]]",
        }}
        codeSnippet="if current[0] <= merged[-1][1]:\n    merged[-1][1] = max(merged[-1][1], current[1])\nelse:\n    merged.append(current)"
        timeSpaceImpact="Time: O(N log N) sorting + O(N) merge | Space: O(N) output"
      />
    </div>
  );
};

/* ========================================================================= */
/* 9. ARRAY POINTERS & TWO SUM WITH STEP RATIONALE                          */
/* ========================================================================= */
const ArrayPointersDiagram: React.FC<{ problem: Problem }> = () => {
  const arr = [2, 7, 11, 15];
  const target = 9;
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(3);

  const sum = arr[left] + arr[right];

  let actionText = '';
  let rationaleText = '';

  if (sum === target) {
    actionText = `Found target sum! arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) == ${target}.`;
    rationaleText = "Target reached. Return 1-based or 0-based indices [left, right].";
  } else if (sum < target) {
    actionText = `Sum ${sum} is LESS than target ${target}. Increment left pointer (left++).`;
    rationaleText = "Because the array is sorted, incrementing left increases the sum toward target.";
  } else {
    actionText = `Sum ${sum} is GREATER than target ${target}. Decrement right pointer (right--).`;
    rationaleText = "Because the array is sorted, decrementing right decreases the sum toward target.";
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              if (sum < target && left < right - 1) setLeft(l => l + 1);
              else if (sum > target && right > left + 1) setRight(r => r - 1);
            }}
            disabled={sum === target}
            className="text-xs md:text-sm h-8 px-3"
          >
            {sum === target ? 'target found!' : sum < target ? 'sum < target (left++)' : 'sum > target (right--)'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setLeft(0); setRight(3); }} className="h-8">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <span className="text-xs md:text-sm font-mono font-bold text-marker-orange">
          arr[{left}] ({arr[left]}) + arr[{right}] ({arr[right]}) = {sum} {sum === target ? '🎉 MATCH target ' + target : `(target: ${target})`}
        </span>
      </div>

      <div className="py-8 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        <div className="flex items-end gap-4 flex-wrap justify-center">
          {arr.map((val, idx) => {
            const isLeft = idx === left;
            const isRight = idx === right;
            const isMatch = sum === target && (isLeft || isRight);

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className="h-6 text-xs font-mono font-bold">
                  {isLeft && <span className="bg-sky-sticker text-white px-2 py-0.5 rounded-pill">L</span>}
                  {isRight && <span className="bg-sprout-sticker text-white px-2 py-0.5 rounded-pill">R</span>}
                </div>

                <div
                  className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-mono font-bold text-lg md:text-xl rounded-lg border-2 shadow-hard transition-all duration-300 ${
                    isMatch
                      ? 'border-marker-orange bg-primary-container text-on-primary-container scale-105'
                      : isLeft || isRight
                      ? 'border-charcoal bg-secondary-container'
                      : 'border-outline/40 bg-surface-container'
                  }`}
                >
                  {val}
                </div>
                <span className="text-xs font-mono text-on-surface-variant font-medium">idx {idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      <StepExplanationCard
        stepNumber={left + (3 - right) + 1}
        totalSteps={4}
        title={`Pointer Evaluation at left=${left}, right=${right}`}
        whatHappens={actionText}
        whyRationale={rationaleText}
        variableStates={{
          "left": left,
          "right": right,
          "arr[left]": arr[left],
          "arr[right]": arr[right],
          "current_sum": sum,
          "target": target,
        }}
        codeSnippet="if current_sum == target: return [left, right]\nelif current_sum < target: left += 1\nelse: right -= 1"
        timeSpaceImpact="Time: O(N) two-pointer scan | Space: O(1) pointers"
      />
    </div>
  );
};

/* ========================================================================= */
/* 10. GENERIC ALGORITHM FLOW PIPELINE                                       */
/* ========================================================================= */
const GenericFlowDiagram: React.FC<{ problem: Problem }> = ({ problem }) => {
  return (
    <div className="space-y-6">
      <div className="py-5 px-5 bg-cream-paper rounded-xl border border-dashed border-outline/40 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="p-4 bg-surface border-[1.5px] border-charcoal rounded-xl shadow-sm space-y-1">
            <span className="text-xs font-mono font-bold text-sky-sticker uppercase block">
              01. Input Domain
            </span>
            <p className="text-xs md:text-sm font-mono text-on-surface line-clamp-3">
              {problem.examples && problem.examples[0] ? problem.examples[0].input : 'Parameters & raw bounds'}
            </p>
          </div>

          <div className="p-4 bg-secondary-container border-[1.5px] border-charcoal rounded-xl shadow-sm space-y-1">
            <span className="text-xs font-mono font-bold text-marker-orange uppercase block">
              02. Core Invariant
            </span>
            <p className="text-xs md:text-sm font-sans text-cocoa-ink line-clamp-3 leading-relaxed">
              {problem.keyInsight || problem.intuition || 'Maintain optimum state in-place with O(1) auxiliary overhead.'}
            </p>
          </div>

          <div className="p-4 bg-primary-fixed border-[1.5px] border-charcoal rounded-xl shadow-sm space-y-1">
            <span className="text-xs font-mono font-bold text-burnt-sienna uppercase block">
              03. Expected Complexity
            </span>
            <div className="text-xs md:text-sm font-mono font-bold text-cocoa-ink">
              <div>Time: {problem.expectedComplexities?.time || 'O(N)'}</div>
              <div>Space: {problem.expectedComplexities?.space || 'O(1)'}</div>
            </div>
          </div>
        </div>
      </div>

      <StepExplanationCard
        stepNumber={1}
        totalSteps={3}
        title="Algorithmic Invariant & Complexity Guarantee"
        whatHappens={`Executes optimal state transitions for "${problem.title}".`}
        whyRationale={problem.keyInsight || problem.intuition || "Maintains core algorithmic invariants for optimal time and space boundaries."}
        variableStates={{
          "difficulty": problem.difficulty,
          "expected_time": problem.expectedComplexities?.time || "O(N)",
          "expected_space": problem.expectedComplexities?.space || "O(1)",
        }}
        timeSpaceImpact={`Target Complexity: Time ${problem.expectedComplexities?.time || 'O(N)'}, Space ${problem.expectedComplexities?.space || 'O(1)'}`}
      />
    </div>
  );
};
