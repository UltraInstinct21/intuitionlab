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
  ProblemDataVisualizer,
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
  'climbing stairs': GreedyVisualizer,
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

const LABELS: Record<string, string> = {
  matrix: 'set matrix zeroes', sort_colors: 'sort colors (dutch flag)', kadane: "kadane's algorithm",
  linked_list: 'linked list', tree: 'binary tree traversal', graph: 'graph traversal',
  trie: 'trie / prefix tree', backtracking: 'backtracking', greedy: 'greedy algorithm',
  heap: 'heap operations', string: 'string matching', binary_search: 'binary search',
  problem_data: 'step-by-step walkthrough',
};

export const DiagramVisualizer: React.FC<DiagramVisualizerProps> = ({ problem }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const key = (problem.title || '').toLowerCase();
  const Spec = SPECIALIZED[key];
  const label = Spec ? (LABELS[Object.entries(SPECIALIZED).find(([k, v]) => v === Spec)?.[0] || ''] || 'specialized') : 'step-by-step walkthrough';

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
        <Badge variant="medium" className="text-xs font-mono hidden sm:inline-flex">{label}</Badge>
      </div>
      {Spec ? <Spec problem={problem} /> : <ProblemDataVisualizer problem={problem} />}
    </div>
  );
};