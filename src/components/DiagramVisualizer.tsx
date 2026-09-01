import React, { useRef, useEffect } from 'react';
import { Problem } from '@/types/problem';
import { Badge } from '@/components/ui/badge';
import gsap from 'gsap';
import { getProblemVisualization } from '@/data/visualizations';
import {
  MatrixVisualizer,
  LinkedListVisualizer,
  TreeVisualizer,
  GraphVisualizer,
  TrieVisualizer,
  BacktrackingVisualizer,
  GreedyVisualizer,
  StringVisualizer,
  BinarySearchVisualizer,
  HeapVisualizer,
  ArrayStepVisualizer,
  StackStepVisualizer,
  DPStepVisualizer,
} from './visualizers';

interface DiagramVisualizerProps {
  problem: Problem;
  selectedApproachIndex?: number;
  onSelectApproach?: (index: number) => void;
}

const LABELS: Record<string, string> = {
  matrix: '2D Matrix Transformation Model',
  linked_list: 'Linked List Dynamic Pointer Model',
  bst: 'Binary Search Tree Dynamic Model',
  tree: 'Binary Tree Structural Model',
  graph: 'Graph Traversal & Shortest Path Model',
  trie: 'Trie Prefix Tree Model',
  backtracking: 'Backtracking Decision Tree Model',
  greedy: 'Greedy Chronological Choice Model',
  heap: 'Priority Queue / Heap Model',
  binary_search: 'Binary Search Interval Elimination',
  string: 'String Matching & Two-Pointer Model',
  stack: 'Monotonic Stack / Queue LIFO Model',
  dp: 'Dynamic Programming Table Model',
  array: 'Array Step-by-Step Model',
};

export const DiagramVisualizer: React.FC<DiagramVisualizerProps> = ({
  problem,
  selectedApproachIndex = 0,
  onSelectApproach,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const customViz = getProblemVisualization(problem.id, selectedApproachIndex);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [problem.id, selectedApproachIndex]);

  const vizType = customViz?.type || 'array';
  const currentApproach = problem.approaches?.[selectedApproachIndex] || problem.approaches?.[0];

  const renderVisualizer = () => {
    const vizKey = `${problem.id}-app-${selectedApproachIndex}`;

    if (customViz) {
      switch (customViz.type) {
        case 'matrix':
          return <MatrixVisualizer key={vizKey} problem={problem} customData={customViz} />;
        case 'linked_list':
          return <LinkedListVisualizer key={vizKey} problem={problem} customData={customViz} />;
        case 'tree':
        case 'bst':
          return <TreeVisualizer key={vizKey} problem={problem} customData={customViz} />;
        case 'graph':
          return <GraphVisualizer key={vizKey} problem={problem} customData={customViz} />;
        case 'dp':
          return <DPStepVisualizer key={vizKey} problem={problem} customData={customViz} />;
        case 'stack':
          return <StackStepVisualizer key={vizKey} problem={problem} customData={customViz} />;
        case 'binary_search':
          return <BinarySearchVisualizer key={vizKey} problem={problem} customData={customViz} />;
        case 'backtracking':
          return <BacktrackingVisualizer key={vizKey} problem={problem} customData={customViz} />;
        case 'greedy':
          return <GreedyVisualizer key={vizKey} problem={problem} customData={customViz} />;
        case 'heap':
          return <HeapVisualizer key={vizKey} problem={problem} customData={customViz} />;
        case 'string':
          return <StringVisualizer key={vizKey} problem={problem} customData={customViz} />;
        case 'trie':
          return <TrieVisualizer key={vizKey} problem={problem} customData={customViz} />;
        case 'array':
        default:
          return <ArrayStepVisualizer key={vizKey} problem={problem} customData={customViz} />;
      }
    }

    // Default fallback
    return <ArrayStepVisualizer key={vizKey} problem={problem} />;
  };

  return (
    <div
      ref={containerRef}
      className="rounded-xl border-[1.5px] border-charcoal bg-surface p-5 sm:p-7 shadow-hard-lg relative overflow-hidden space-y-6"
    >
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline/30 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container text-sm font-bold border-[1.5px] border-charcoal shadow-xs">
            ✦
          </span>
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold lowercase text-charcoal tracking-tight">
              interactive step-by-step visualizer
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant font-sans">
              step through each iteration with granular state explanations, variable states, and code mappings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentApproach && (
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cream-paper border border-charcoal/30 text-charcoal shadow-xs">
              {currentApproach.timeComplexity}
            </span>
          )}
          <Badge variant="medium" className="text-xs font-mono hidden sm:inline-flex">
            {LABELS[vizType] || 'visual model'}
          </Badge>
        </div>
      </div>

      {/* Approach Selector Switcher (if problem has multiple approaches) */}
      {problem.approaches && problem.approaches.length > 1 && onSelectApproach && (
        <div className="flex items-center gap-2 flex-wrap bg-dew-drop p-2.5 rounded-xl border border-outline/30">
          <span className="text-xs font-mono font-bold text-on-surface-variant px-1">
            Selected Solution Model:
          </span>
          {problem.approaches.map((app, idx) => {
            const isSelected = idx === selectedApproachIndex;
            return (
              <button
                key={idx}
                onClick={() => onSelectApproach(idx)}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-pill transition-all lowercase ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container border-[1.5px] border-charcoal shadow-sm scale-105'
                    : 'bg-surface text-charcoal hover:bg-surface-container-high border border-outline/40'
                }`}
              >
                {app.name || `Solution ${idx + 1}`}
              </button>
            );
          })}
        </div>
      )}

      {renderVisualizer()}
    </div>
  );
};