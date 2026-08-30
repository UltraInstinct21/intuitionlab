import React, { useRef, useEffect } from 'react';
import { Problem } from '@/types/problem';
import { Badge } from '@/components/ui/badge';
import gsap from 'gsap';
import {
  MatrixVisualizer,
  SortColorsVisualizer,
  KadaneVisualizer,
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
  BSTStepVisualizer,
  DPStepVisualizer,
} from './visualizers';

interface DiagramVisualizerProps {
  problem: Problem;
}

const LABELS: Record<string, string> = {
  matrix: '2D Matrix In-Place Transformation',
  sort_colors: 'Dutch National Flag 3-Pointer',
  kadane: "Kadane's Sliding Window State",
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
  dp: 'Dynamic Programming 2D Table Model',
  array: 'Array Step-by-Step Model',
};

function getVisualType(problem: Problem): { type: string; viz: React.FC<{ problem: Problem }> } {
  const t = (problem.title || '').toLowerCase();
  const folder = (problem.topicFolder || '').toLowerCase();
  const topic = (problem.topicTitle || '').toLowerCase();
  const tags = (problem.tags || []).join(' ').toLowerCase();

  // 1. Matrix problems
  if (t === 'set matrix zeroes' || t.includes('rotate image') || t.includes('search a 2d matrix')) {
    return { type: 'matrix', viz: MatrixVisualizer };
  }

  // 2. Sort Colors
  if (t.includes('sort colors') || t.includes('dutch national flag')) {
    return { type: 'sort_colors', viz: SortColorsVisualizer };
  }

  // 3. Kadane / Stock / Subarray
  if (t.includes('maximum subarray') || t.includes('best time to buy') || t.includes('maximum product subarray')) {
    return { type: 'kadane', viz: KadaneVisualizer };
  }

  // 4. Linked List & Cache
  if (folder.includes('linked_list') || t.includes('linked list') || t.includes('reverse nodes in k') || t.includes('lru cache') || t.includes('lfu cache') || t.includes('add two numbers') || t.includes('merge two sorted lists') || t.includes('intersection of two')) {
    return { type: 'linked_list', viz: LinkedListVisualizer };
  }

  // 5. BST
  if (folder.includes('binary_search_tree') || folder.includes('bst') || t.includes('bst') || tags.includes('bst') || topic.includes('binary search tree')) {
    return { type: 'bst', viz: BSTStepVisualizer };
  }

  // 6. Binary Tree
  if (folder.includes('binary_tree') || folder.includes('tree') || t.includes('binary tree') || t.includes('symmetric tree') || t.includes('diameter of') || t.includes('lowest common ancestor') || t.includes('max depth') || t.includes('traversal')) {
    return { type: 'tree', viz: TreeVisualizer };
  }

  // 7. Graph
  if (folder.includes('graph') || t.includes('graph') || t.includes('dijkstra') || t.includes('topological') || t.includes('course schedule') || t.includes('number of islands') || t.includes('word ladder') || t.includes('network delay') || t.includes('flood fill') || t.includes('bellman')) {
    return { type: 'graph', viz: GraphVisualizer };
  }

  // 8. Trie
  if (folder.includes('trie') || t.includes('trie') || t.includes('prefix') || t.includes('longest common prefix')) {
    return { type: 'trie', viz: TrieVisualizer };
  }

  // 9. Backtracking / Recursion
  if (folder.includes('recursion') || folder.includes('backtrack') || t.includes('n-queens') || t.includes('sudoku') || t.includes('subset') || t.includes('combination') || t.includes('permutation') || t.includes('rat in a maze') || t.includes('m-coloring')) {
    return { type: 'backtracking', viz: BacktrackingVisualizer };
  }

  // 10. Greedy
  if (folder.includes('greedy') || t.includes('meeting') || t.includes('platform') || t.includes('knapsack') && t.includes('fractional') || t.includes('job sequencing') || t.includes('assign cookies')) {
    return { type: 'greedy', viz: GreedyVisualizer };
  }

  // 11. Heaps
  if (folder.includes('heap') || t.includes('heap') || t.includes('median from data') || t.includes('kth largest element in an array') || t.includes('frequent elements') || t.includes('merge k sorted')) {
    return { type: 'heap', viz: HeapVisualizer };
  }

  // 12. Binary Search
  if (folder.includes('binary_search') || t.includes('binary search') || t.includes('rotated sorted') || t.includes('single element in sorted') || t.includes('median of two sorted') || t.includes('nth root') || t.includes('allocate minimum') || t.includes('aggressive cows') || t.includes('matrix median')) {
    return { type: 'binary_search', viz: BinarySearchVisualizer };
  }

  // 13. Strings
  if (folder.includes('string') || t.includes('palindrome') || t.includes('anagram') || t.includes('roman') || t.includes('atoi') || t.includes('rabin-karp') || t.includes('z-function') || t.includes('longest common substring')) {
    return { type: 'string', viz: StringVisualizer };
  }

  // 14. Stack & Queue
  if (folder.includes('stack') || folder.includes('queue') || t.includes('stack') || t.includes('queue') || t.includes('parenthes') || t.includes('histogram') || t.includes('sliding window') || t.includes('celebrity') || t.includes('rotten orange') || t.includes('stock span')) {
    return { type: 'stack', viz: StackStepVisualizer };
  }

  // 15. DP
  if (folder.includes('dp') || folder.includes('dynamic') || t.includes('knapsack') || t.includes('subsequence') || t.includes('climbing stairs') || t.includes('house robber') || t.includes('edit distance') || t.includes('matrix chain') || t.includes('rod cutting') || t.includes('egg drop') || t.includes('burst balloon') || t.includes('dungeon') || t.includes('unique paths')) {
    return { type: 'dp', viz: DPStepVisualizer };
  }

  // 16. Arrays
  return { type: 'array', viz: ArrayStepVisualizer };
}

export const DiagramVisualizer: React.FC<DiagramVisualizerProps> = ({ problem }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { type, viz: Viz } = getVisualType(problem);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    }
  }, [problem.id]);

  return (
    <div ref={containerRef} className="rounded-xl border-[1.5px] border-charcoal bg-surface p-5 sm:p-7 shadow-hard-lg relative overflow-hidden space-y-6">
      <div className="flex items-center justify-between border-b border-outline/30 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container text-sm font-bold border-[1.5px] border-charcoal shadow-xs">✦</span>
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold lowercase text-charcoal tracking-tight">interactive step-by-step visualizer</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant font-sans">step through each iteration with granular state explanations and code mappings.</p>
          </div>
        </div>
        <Badge variant="medium" className="text-xs font-mono hidden sm:inline-flex">{LABELS[type] || 'visual model'}</Badge>
      </div>
      <Viz key={problem.id} problem={problem} />
    </div>
  );
};