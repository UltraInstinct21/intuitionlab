export type VisualizationType =
  | 'array'
  | 'matrix'
  | 'linked_list'
  | 'tree'
  | 'bst'
  | 'graph'
  | 'dp'
  | 'stack'
  | 'binary_search'
  | 'backtracking'
  | 'greedy'
  | 'heap'
  | 'string'
  | 'trie'
  | 'interval'
  | 'two_pointer'
  | 'sort_colors'
  | 'kadane';

export interface BaseStep {
  title: string;
  whatHappens: string;
  whyRationale: string;
  codeSnippet: string;
  states: Record<string, string | number | boolean | undefined>;
  impact?: string;
}

// 1. Array Step
export interface ArrayPointer {
  idx: number;
  label: string;
  color?: string;
}

export interface ArrayStep extends BaseStep {
  arrayState: (number | string)[];
  pointers: ArrayPointer[];
  highlightRange?: [number, number];
  highlightIndices?: number[];
  result?: string;
}

export interface ArrayVisualizationData {
  type: 'array';
  approachName?: string;
  steps: ArrayStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// 2. Matrix Step
export interface MatrixStep extends BaseStep {
  grid: (number | string)[][];
  highlightCells?: [number, number][];
  activeCell?: [number, number];
  rowLabels?: string[];
  colLabels?: string[];
}

export interface MatrixVisualizationData {
  type: 'matrix';
  approachName?: string;
  steps: MatrixStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// 3. Linked List Step
export interface LinkedListNodeVisual {
  val: string | number;
  label?: string;
  status?: 'default' | 'active' | 'success' | 'danger' | 'muted';
  nextIndex?: number | null;
  randomVal?: string | number | null;
  bottomVal?: string | number | null;
}

export interface LinkedListStep extends BaseStep {
  nodes: LinkedListNodeVisual[];
  pointers: Record<string, string | number | undefined>;
}

export interface LinkedListVisualizationData {
  type: 'linked_list';
  approachName?: string;
  steps: LinkedListStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// 4. Tree / BST Step
export interface TreeNodeVisual {
  id: number | string;
  val: string | number;
  x: number;
  y: number;
  leftId?: number | string | null;
  rightId?: number | string | null;
  status?: 'default' | 'active' | 'visited' | 'highlight' | 'matched' | 'lca' | 'null' | 'success' | 'danger';
}

export interface TreeStep extends BaseStep {
  nodes: TreeNodeVisual[];
  edges: [number | string, number | string, string?][];
  activePath?: (number | string)[];
  traversalOrder?: (string | number)[];
}

export interface TreeVisualizationData {
  type: 'tree' | 'bst';
  approachName?: string;
  steps: TreeStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// 5. Graph Step
export interface GraphNodeVisual {
  id: number | string;
  label: string;
  x: number;
  y: number;
  status?: 'default' | 'active' | 'visited' | 'target' | 'eliminated' | 'success';
}

export interface GraphStep extends BaseStep {
  nodes: GraphNodeVisual[];
  edges: [number | string, number | string, string?][];
  activeNodeId?: number | string;
  visitedIds?: (number | string)[];
  activePath?: (number | string)[];
  queueOrStack?: (string | number)[];
}

export interface GraphVisualizationData {
  type: 'graph';
  approachName?: string;
  steps: GraphStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// 6. DP Step
export interface DPStep extends BaseStep {
  grid: (number | string)[][];
  rowHeaders?: string[];
  colHeaders?: string[];
  highlightCells?: [number, number][];
  activeCell?: [number, number];
  formula?: string;
}

export interface DPVisualizationData {
  type: 'dp';
  approachName?: string;
  steps: DPStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// 7. Stack / Queue Step
export interface StackStep extends BaseStep {
  stack: (string | number)[];
  queue?: (string | number)[];
  currentItem?: string | number;
  action: 'push' | 'pop' | 'peek' | 'match' | 'idle';
  inputRemaining?: (string | number)[];
  result?: string | number | (string | number)[];
}

export interface StackVisualizationData {
  type: 'stack';
  approachName?: string;
  steps: StackStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// 8. Binary Search Step
export interface BinarySearchStep extends BaseStep {
  array: (number | string)[];
  low: number;
  mid: number;
  high: number;
  condition: string;
  eliminatedRange?: [number, number];
  foundIndex?: number;
}

export interface BinarySearchVisualizationData {
  type: 'binary_search';
  approachName?: string;
  steps: BinarySearchStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// 9. Backtracking / Recursion Step
export interface BacktrackingStep extends BaseStep {
  boardState?: (string | number)[][];
  choicePath?: string[];
  currentChoices?: string[];
  activeChoice?: string;
  status: 'explore' | 'backtrack' | 'solution' | 'prune';
  treeNodes?: { id: string; label: string; x: number; y: number; status?: 'active' | 'visited' | 'pruned' | 'solution' }[];
  treeEdges?: [string, string][];
}

export interface BacktrackingVisualizationData {
  type: 'backtracking';
  approachName?: string;
  steps: BacktrackingStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// 10. Greedy Step
export interface GreedyItemVisual {
  id: string | number;
  label: string;
  weight?: string | number;
  value?: string | number;
  ratio?: string | number;
  start?: number;
  end?: number;
  status: 'pending' | 'selected' | 'rejected' | 'current';
}

export interface GreedyStep extends BaseStep {
  items: GreedyItemVisual[];
  currentItemId?: string | number;
  runningMetric?: string;
  result?: string;
}

export interface GreedyVisualizationData {
  type: 'greedy';
  approachName?: string;
  steps: GreedyStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// 11. Heap Step
export interface HeapStep extends BaseStep {
  heapArray: (number | string)[];
  heapTree?: { id: number; val: number | string; left?: number; right?: number }[];
  activeIndices?: number[];
  action: 'insert' | 'extract' | 'sift-up' | 'sift-down' | 'heapify' | 'idle';
  result?: string | number | (string | number)[];
}

export interface HeapVisualizationData {
  type: 'heap';
  approachName?: string;
  steps: HeapStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// 12. String Step
export interface StringStep extends BaseStep {
  chars: string[];
  pointers: { idx: number; label: string; color?: string }[];
  highlightRange?: [number, number];
  window?: [number, number];
  pattern?: string[];
  patternPointers?: { idx: number; label: string; color?: string }[];
  result?: string;
}

export interface StringVisualizationData {
  type: 'string';
  approachName?: string;
  steps: StringStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// 13. Trie Step
export interface TrieNodeInfo {
  id: string;
  char: string;
  isEnd: boolean;
  count?: number;
  prefixCount?: number;
  children: Record<string, string>;
  status?: 'default' | 'active' | 'matched' | 'inserted';
}

export interface TrieStep extends BaseStep {
  nodes: Record<string, TrieNodeInfo>;
  activeNodeId?: string;
  currentWord?: string;
  currentCharIdx?: number;
  result?: string | boolean;
}

export interface TrieVisualizationData {
  type: 'trie';
  approachName?: string;
  steps: TrieStep[];
  approachVisualizations?: Record<number, ProblemVisualization>;
}

// Union of all visualization datasets
export type ProblemVisualization =
  | ArrayVisualizationData
  | MatrixVisualizationData
  | LinkedListVisualizationData
  | TreeVisualizationData
  | GraphVisualizationData
  | DPVisualizationData
  | StackVisualizationData
  | BinarySearchVisualizationData
  | BacktrackingVisualizationData
  | GreedyVisualizationData
  | HeapVisualizationData
  | StringVisualizationData
  | TrieVisualizationData;
