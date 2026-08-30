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

const SPECIALIZED: Record<string, React.FC<{ problem: Problem }>> = {
  'set matrix zeroes': MatrixVisualizer,
  'sort colors': SortColorsVisualizer,
  'maximum subarray': KadaneVisualizer,
  'best time to buy and sell stock': KadaneVisualizer,
  'maximum product subarray': KadaneVisualizer,
  'reverse linked list': LinkedListVisualizer,
  'middle of the linked list': LinkedListVisualizer,
  'merge two sorted lists': LinkedListVisualizer,
  'remove nth node from end of list': LinkedListVisualizer,
  'add two numbers': LinkedListVisualizer,
  'delete node in a linked list': LinkedListVisualizer,
  'intersection of two linked lists': LinkedListVisualizer,
  'linked list cycle': LinkedListVisualizer,
  'reverse nodes in k-group': LinkedListVisualizer,
  'palindrome linked list': LinkedListVisualizer,
  'linked list cycle ii': LinkedListVisualizer,
  'flatten a multilevel doubly linked list': LinkedListVisualizer,
  'rotate list': LinkedListVisualizer,
  'copy list with random pointer': LinkedListVisualizer,
  'binary tree inorder traversal': TreeVisualizer,
  'binary tree preorder traversal': TreeVisualizer,
  'binary tree postorder traversal': TreeVisualizer,
  'binary tree inorder traversal (morris traversal)': TreeVisualizer,
  'binary tree preorder traversal (morris traversal)': TreeVisualizer,
  'binary tree right side view': TreeVisualizer,
  'bottom view of binary tree': TreeVisualizer,
  'top view of binary tree': TreeVisualizer,
  'preorder, postorder and inorder traversal of binary tree': TreeVisualizer,
  'vertical order traversal of a binary tree': TreeVisualizer,
  'print root to leaf paths in binary tree': TreeVisualizer,
  'maximum width of binary tree': TreeVisualizer,
  'binary tree level order traversal': TreeVisualizer,
  'maximum depth of binary tree': TreeVisualizer,
  'diameter of binary tree': TreeVisualizer,
  'balanced binary tree': TreeVisualizer,
  'lowest common ancestor of a binary tree': TreeVisualizer,
  'same tree': TreeVisualizer,
  'binary tree zigzag level order traversal': TreeVisualizer,
  'boundary of binary tree': TreeVisualizer,
  'binary tree maximum path sum': TreeVisualizer,
  'construct binary tree from preorder and inorder traversal': TreeVisualizer,
  'construct binary tree from inorder and postorder traversal': TreeVisualizer,
  'symmetric tree': TreeVisualizer,
  'flatten binary tree to linked list': TreeVisualizer,
  'children sum property in binary tree': TreeVisualizer,
  'climbing stairs': DPStepVisualizer,
  'house robber': DPStepVisualizer,
  '0/1 knapsack problem': DPStepVisualizer,
  'longest common subsequence': DPStepVisualizer,
  'longest increasing subsequence': DPStepVisualizer,
  'edit distance': DPStepVisualizer,
  'matrix chain multiplication': DPStepVisualizer,
  'palindrome partitioning': DPStepVisualizer,
  'rod cutting': DPStepVisualizer,
  'egg dropping problem': DPStepVisualizer,
  'word break': DPStepVisualizer,
  'longest palindromic subsequence': DPStepVisualizer,
  'burst balloons': DPStepVisualizer,
  'dungeon game': DPStepVisualizer,
  'unique paths': DPStepVisualizer,
  'n meetings in one room': GreedyVisualizer,
  'minimum number of platforms required for a railway station': GreedyVisualizer,
  'job sequencing problem': GreedyVisualizer,
  'fractional knapsack': GreedyVisualizer,
  'minimum coins (coin change)': GreedyVisualizer,
  'assign cookies': GreedyVisualizer,
  'clone graph': GraphVisualizer,
  'flood fill': GraphVisualizer,
  'number of islands': GraphVisualizer,
  'number of distinct islands': GraphVisualizer,
  'bfs of graph': GraphVisualizer,
  'detect cycle in directed graph': GraphVisualizer,
  'detect cycle in undirected graph': GraphVisualizer,
  'topological sort': GraphVisualizer,
  'course schedule': GraphVisualizer,
  'shortest path in undirected graph': GraphVisualizer,
  'word ladder': GraphVisualizer,
  'word ladder ii': GraphVisualizer,
  'network delay time': GraphVisualizer,
  'shortest path in a binary matrix': GraphVisualizer,
  'path with minimum effort': GraphVisualizer,
  'cheapest flights within k stops': GraphVisualizer,
  'bellman-ford algorithm': GraphVisualizer,
  'implement trie (prefix tree)': TrieVisualizer,
  'implement trie ii': TrieVisualizer,
  'longest common prefix': TrieVisualizer,
  'complete string': TrieVisualizer,
  'number of distinct substrings in a string': TrieVisualizer,
  'search suggestions system': TrieVisualizer,
  'palindrome pairs': TrieVisualizer,
  'permutations': BacktrackingVisualizer,
  'n-queens': BacktrackingVisualizer,
  'sudoku solver': BacktrackingVisualizer,
  'm-coloring problem': BacktrackingVisualizer,
  'rat in a maze': BacktrackingVisualizer,
  'word break - print all possible ways': BacktrackingVisualizer,
  'combination sum': BacktrackingVisualizer,
  'combination sum ii': BacktrackingVisualizer,
  'subsets': BacktrackingVisualizer,
  'subsets ii': BacktrackingVisualizer,
  'permutation sequence': BacktrackingVisualizer,
  'implement max heap': HeapVisualizer,
  'kth largest element in an array': HeapVisualizer,
  'maximum sum combinations': HeapVisualizer,
  'find median from data stream': HeapVisualizer,
  'merge k sorted arrays': HeapVisualizer,
  'top k frequent elements': HeapVisualizer,
  'reverse words in a string': StringVisualizer,
  'longest palindromic substring': StringVisualizer,
  'roman to integer': StringVisualizer,
  'string to integer (atoi)': StringVisualizer,
  'rabin-karp algorithm (pattern searching)': StringVisualizer,
  'z-function (gfg - hard)': StringVisualizer,
  'find the index of the first occurrence in a string': StringVisualizer,
  'minimum insertions to make string palindrome': StringVisualizer,
  'valid anagram': StringVisualizer,
  'count and say': StringVisualizer,
  'compare version numbers': StringVisualizer,
  'nth root of an integer': BinarySearchVisualizer,
  'matrix median': BinarySearchVisualizer,
  'single element in sorted array': BinarySearchVisualizer,
  'search in rotated sorted array': BinarySearchVisualizer,
  'median of two sorted arrays': BinarySearchVisualizer,
  'kth element of two sorted arrays': BinarySearchVisualizer,
  'allocate minimum number of pages': BinarySearchVisualizer,
  'aggressive cows': BinarySearchVisualizer,
};

const BST_TITLES = new Set([
  'search in a binary search tree', 'validate binary search tree',
  'lowest common ancestor of a binary search tree', 'inorder successor in bst',
  'floor in a bst', 'ceil in a bst', 'two sum iv - input is a bst',
  'kth smallest element in a bst', 'construct bst from given keys',
  'construct binary search tree from preorder traversal', 'binary search tree iterator',
  'largest bst', 'serialize and deserialize binary tree',
  'populating next right pointers in each node', 'pair sum in bst',
  'binary tree to bst', 'bst to balanced bst', 'kth largest element in bst',
  'find a pair with a given sum in bst',
  'kth smallest and largest element in bst',
]);

const STACK_TITLES = new Set([
  'valid parentheses', 'next greater element i', 'next smaller element',
  'largest rectangle in histogram', 'sliding window maximum', 'min stack',
  'rotten oranges', 'online stock span', 'maximum of minimums for every window size',
  'the celebrity problem', 'implement stack using arrays', 'implement queue using arrays',
  'implement stack using queues', 'implement queue using stacks', 'sort a stack',
]);

const ARRAY_TITLES = new Set([
  'pascal\'s triangle', 'next permutation', 'rotate image', 'merge intervals',
  'merge sorted array', 'find the duplicate number', 'find the repeating and missing number',
  'inversion of array', 'search a 2d matrix', 'pow(x, n)', 'majority element',
  'majority element ii', 'reverse pairs', 'two sum', '4sum',
  'longest consecutive sequence', 'largest subarray with k sum',
  'count subarrays with given xor k', 'longest substring without repeating characters',
  '3sum', 'trapping rain water', 'remove duplicates from sorted array',
  'max consecutive ones',
]);

const DP_TITLES = new Set([
  'matrix chain multiplication', 'word break', 'longest palindromic subsequence',
  'burst balloons', 'dungeon game',
]);

const LABELS: Record<string, string> = {
  specialized: 'interactive visualization',
  array_step: 'array step-by-step',
  stack_step: 'stack/queue step-by-step',
  bst_step: 'bst step-by-step',
  dp_step: 'dp table step-by-step',
};

function getVisualType(problem: Problem): { type: string; viz: React.FC<{ problem: Problem }> } {
  const key = (problem.title || '').toLowerCase();

  if (SPECIALIZED[key]) return { type: 'specialized', viz: SPECIALIZED[key] };
  if (BST_TITLES.has(key)) return { type: 'bst_step', viz: BSTStepVisualizer };
  if (STACK_TITLES.has(key)) return { type: 'stack_step', viz: StackStepVisualizer };
  if (ARRAY_TITLES.has(key)) return { type: 'array_step', viz: ArrayStepVisualizer };
  if (DP_TITLES.has(key)) return { type: 'dp_step', viz: DPStepVisualizer };

  const topic = (problem.topicTitle || '').toLowerCase();
  const tags = (problem.tags || []).join(' ').toLowerCase();

  if (topic.includes('binary search tree') || tags.includes('bst') || tags.includes('binary search tree')) return { type: 'bst_step', viz: BSTStepVisualizer };
  if (topic.includes('stack') || topic.includes('queue') || tags.includes('stack') || tags.includes('queue')) return { type: 'stack_step', viz: StackStepVisualizer };
  if (topic.includes('dynamic')) return { type: 'dp_step', viz: DPStepVisualizer };
  if (topic.includes('array') || tags.includes('array') || tags.includes('two pointer') || tags.includes('sliding window')) return { type: 'array_step', viz: ArrayStepVisualizer };
  if (topic.includes('linked')) return { type: 'specialized', viz: LinkedListVisualizer };
  if (topic.includes('graph')) return { type: 'specialized', viz: GraphVisualizer };
  if (topic.includes('trie')) return { type: 'specialized', viz: TrieVisualizer };
  if (topic.includes('backtrack') || topic.includes('recursion')) return { type: 'specialized', viz: BacktrackingVisualizer };
  if (topic.includes('greedy')) return { type: 'specialized', viz: GreedyVisualizer };
  if (topic.includes('heap')) return { type: 'specialized', viz: HeapVisualizer };
  if (topic.includes('binary search')) return { type: 'specialized', viz: BinarySearchVisualizer };
  if (topic.includes('string')) return { type: 'specialized', viz: StringVisualizer };

  return { type: 'array_step', viz: ArrayStepVisualizer };
}

export const DiagramVisualizer: React.FC<DiagramVisualizerProps> = ({ problem }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { type, viz: Viz } = getVisualType(problem);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
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
        <Badge variant="medium" className="text-xs font-mono hidden sm:inline-flex">{LABELS[type]} visual model</Badge>
      </div>
      <Viz problem={problem} />
    </div>
  );
};