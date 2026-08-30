import React, { useState } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

interface TreeNode {
  id: number;
  val: number | string;
  x: number;
  y: number;
  left?: number;
  right?: number;
  highlight?: 'active' | 'success' | 'danger' | 'visited';
}

interface TreeStep {
  title: string;
  whatHappens: string;
  whyRationale: string;
  activeNodeId?: number;
  highlightedIds?: number[];
  customValues?: Record<number, string | number>;
  states: Record<string, string | number | boolean | undefined>;
  codeSnippet: string;
  impact?: string;
}

function buildTreeSteps(problem?: Problem): { nodes: TreeNode[]; steps: TreeStep[] } {
  const t = (problem?.title || '').toLowerCase();

  // Base sample tree:
  //         1 (160, 30)
  //        / \
  //   2(90,90) 3(230,90)
  //   /   \
  // 4(50,150) 5(130,150)
  const defaultNodes: TreeNode[] = [
    { id: 1, val: 1, x: 160, y: 30, left: 2, right: 3 },
    { id: 2, val: 2, x: 90, y: 90, left: 4, right: 5 },
    { id: 3, val: 3, x: 230, y: 90 },
    { id: 4, val: 4, x: 50, y: 150 },
    { id: 5, val: 5, x: 130, y: 150 },
  ];

  // 1. Maximum Depth of Binary Tree
  if (t.includes('depth') || t.includes('height')) {
    return {
      nodes: defaultNodes,
      steps: [
        {
          title: 'Start at Root Node(1)',
          whatHappens: 'Call maxDepth(root = 1). Must recursively find left and right subtree depths.',
          whyRationale: 'maxDepth(node) = 1 + max(maxDepth(node.left), maxDepth(node.right)). Base case: null returns 0.',
          activeNodeId: 1,
          states: { node: 1, leftDepth: 'calculating...', rightDepth: 'calculating...' },
          codeSnippet: 'def maxDepth(node):\n    if not node: return 0\n    return 1 + max(maxDepth(node.left), maxDepth(node.right))',
          impact: 'Time: O(N) | Space: O(H)',
        },
        {
          title: 'Compute Leaf Depths (Nodes 4 & 5)',
          whatHappens: 'Nodes 4 and 5 have null children → depth = 1 + max(0, 0) = 1.',
          whyRationale: 'Leaf nodes have height 1 above null baseline.',
          activeNodeId: 4,
          highlightedIds: [4, 5],
          customValues: { 4: 'd=1', 5: 'd=1' },
          states: { 'depth(4)': 1, 'depth(5)': 1 },
          codeSnippet: 'left = maxDepth(node.left) # 0\nright = maxDepth(node.right) # 0\nreturn 1 + max(0, 0) # 1',
        },
        {
          title: 'Compute Left Subtree Depth (Node 2)',
          whatHappens: 'Node 2 depth = 1 + max(depth(4), depth(5)) = 1 + max(1, 1) = 2.',
          whyRationale: 'Left branch height is 2.',
          activeNodeId: 2,
          highlightedIds: [2, 4, 5],
          customValues: { 2: 'd=2', 4: 'd=1', 5: 'd=1' },
          states: { 'depth(2)': 2 },
          codeSnippet: 'return 1 + max(1, 1) # returns 2 to parent',
        },
        {
          title: 'Compute Right Subtree Depth (Node 3)',
          whatHappens: 'Node 3 is a leaf → depth = 1 + max(0, 0) = 1.',
          whyRationale: 'Right branch height is 1.',
          activeNodeId: 3,
          highlightedIds: [3],
          customValues: { 3: 'd=1', 2: 'd=2' },
          states: { 'depth(3)': 1, 'depth(2)': 2 },
          codeSnippet: 'right_depth = maxDepth(node.right) # 1',
        },
        {
          title: 'Root Returns Max Depth = 3',
          whatHappens: 'Root depth = 1 + max(depth(2), depth(3)) = 1 + max(2, 1) = 3.',
          whyRationale: 'The longest path from root to leaf is 1 -> 2 -> 4 (length 3).',
          activeNodeId: 1,
          highlightedIds: [1, 2, 4],
          customValues: { 1: 'd=3 [MAX]' },
          states: { maxDepth: 3, longestPath: '1 -> 2 -> 4' },
          codeSnippet: 'return 1 + max(left, right) # returns 3',
        },
      ],
    };
  }

  // 2. Diameter of Binary Tree
  if (t.includes('diameter')) {
    return {
      nodes: defaultNodes,
      steps: [
        {
          title: 'Initialize Diameter Max = 0',
          whatHappens: 'At each node, diameter through node = left_height + right_height.',
          whyRationale: 'Global diameter is the maximum path between any two nodes in the tree.',
          activeNodeId: 1,
          states: { maxDiameter: 0 },
          codeSnippet: 'diameter = 0\ndef height(node):\n    nonlocal diameter',
          impact: 'Time: O(N) | Space: O(H)',
        },
        {
          title: 'Check Node 2: Left=1, Right=1',
          whatHappens: 'Node 2 has left height 1 (Node 4) and right height 1 (Node 5). Path = 1 + 1 = 2.',
          whyRationale: 'Diameter passing through Node 2 is 2 (path: 4 -> 2 -> 5). Max diameter updated to 2.',
          activeNodeId: 2,
          highlightedIds: [4, 2, 5],
          customValues: { 2: 'diam=2' },
          states: { node: 2, leftH: 1, rightH: 1, localDiam: 2, maxDiam: 2 },
          codeSnippet: 'diameter = max(diameter, left_h + right_h) # 2',
        },
        {
          title: 'Check Root Node 1: Left=2, Right=1',
          whatHappens: 'Node 1 has left height 2 (Node 2) and right height 1 (Node 3). Path = 2 + 1 = 3.',
          whyRationale: 'Longest path: 4 -> 2 -> 1 -> 3 (3 edges). Max diameter updated to 3.',
          activeNodeId: 1,
          highlightedIds: [4, 2, 1, 3],
          customValues: { 1: 'diam=3 [MAX]' },
          states: { node: 1, leftH: 2, rightH: 1, localDiam: 3, maxDiam: 3 },
          codeSnippet: 'diameter = max(diameter, left_h + right_h) # 3\nreturn diameter',
        },
      ],
    };
  }

  // 3. Lowest Common Ancestor (LCA)
  if (t.includes('lowest common ancestor') || t.includes('lca')) {
    return {
      nodes: defaultNodes,
      steps: [
        {
          title: 'Find LCA of Target p=4 and q=5',
          whatHappens: 'Call lca(root = 1, p = 4, q = 5). Traverse down left and right subtrees.',
          whyRationale: 'If node is p or q, return node. If both left and right return non-null, this node is the LCA.',
          activeNodeId: 1,
          states: { p: 4, q: 5, checking: 'Node(1)' },
          codeSnippet: 'if not root or root == p or root == q:\n    return root',
          impact: 'Time: O(N) | Space: O(H)',
        },
        {
          title: 'Node 2 Finds p=4 on Left, q=5 on Right',
          whatHappens: 'lca(node.left) returns Node(4). lca(node.right) returns Node(5).',
          whyRationale: 'Both subtrees returned targets, so Node 2 is their fork point (LCA)!',
          activeNodeId: 2,
          highlightedIds: [2, 4, 5],
          customValues: { 2: 'LCA' },
          states: { leftResult: 'Node(4)', rightResult: 'Node(5)', LCA: 'Node(2)' },
          codeSnippet: 'if left and right:\n    return root # Node 2 is the LCA',
        },
        {
          title: 'Propagate LCA Up to Root',
          whatHappens: 'Root receives Node(2) from left and null from right (Node 3 has neither). Returns Node(2).',
          whyRationale: 'Result correctly identifies Node 2 as the Lowest Common Ancestor.',
          activeNodeId: 1,
          highlightedIds: [1, 2],
          states: { finalLCA: 'Node(2)' },
          codeSnippet: 'return left if left else right',
        },
      ],
    };
  }

  // 4. Default: Standard Inorder / Traversal Tree
  return {
    nodes: defaultNodes,
    steps: [
      {
        title: 'Step 1: Visit Leftmost Leaf (Node 4)',
        whatHappens: 'Traverse left all the way: 1 -> 2 -> 4. Visit Node 4.',
        whyRationale: 'Inorder explores Left subtree first before visiting parent.',
        activeNodeId: 4,
        highlightedIds: [4],
        states: { visited: '[4]', callStack: '[1, 2, 4]' },
        codeSnippet: 'inorder(node.left)\nresult.append(node.val) # 4',
        impact: 'Time: O(N) | Space: O(H)',
      },
      {
        title: 'Step 2: Backtrack & Visit Parent (Node 2)',
        whatHappens: 'Left child finished. Visit Node 2.',
        whyRationale: 'After left is complete, visit the root/parent.',
        activeNodeId: 2,
        highlightedIds: [4, 2],
        states: { visited: '[4, 2]', callStack: '[1, 2]' },
        codeSnippet: 'result.append(node.val) # 2\ninorder(node.right)',
      },
      {
        title: 'Step 3: Visit Right Child (Node 5)',
        whatHappens: 'Visit Node 5. Left subtree of root (1) is now fully processed.',
        whyRationale: 'Complete right child of Node 2.',
        activeNodeId: 5,
        highlightedIds: [4, 2, 5],
        states: { visited: '[4, 2, 5]', callStack: '[1]' },
        codeSnippet: 'result.append(node.val) # 5',
      },
      {
        title: 'Step 4: Visit Root (Node 1)',
        whatHappens: 'Visit root Node 1.',
        whyRationale: 'Left subtree complete, now process root.',
        activeNodeId: 1,
        highlightedIds: [4, 2, 5, 1],
        states: { visited: '[4, 2, 5, 1]', callStack: '[1]' },
        codeSnippet: 'result.append(node.val) # 1',
      },
      {
        title: 'Step 5: Visit Right Subtree (Node 3)',
        whatHappens: 'Visit Node 3. Inorder traversal complete: [4, 2, 5, 1, 3].',
        whyRationale: 'All nodes visited in Left -> Root -> Right sequence.',
        activeNodeId: 3,
        highlightedIds: [4, 2, 5, 1, 3],
        states: { visited: '[4, 2, 5, 1, 3]', traversalComplete: true },
        codeSnippet: 'inorder(node.right) # 3\nreturn result',
      },
    ],
  };
}

export const TreeVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const { nodes, steps } = buildTreeSteps(problem);
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

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40">
        <svg viewBox="0 0 320 200" className="w-80 h-52 overflow-visible">
          {nodes.map(n => {
            const leftNode = n.left ? nodes.find(o => o.id === n.left) : null;
            const rightNode = n.right ? nodes.find(o => o.id === n.right) : null;
            return (
              <React.Fragment key={n.id}>
                {leftNode && <line x1={n.x} y1={n.y} x2={leftNode.x} y2={leftNode.y} stroke="#171717" strokeWidth="2.5" />}
                {rightNode && <line x1={n.x} y1={n.y} x2={rightNode.x} y2={rightNode.y} stroke="#171717" strokeWidth="2.5" />}
              </React.Fragment>
            );
          })}
          {nodes.map(n => {
            const isActive = cur.activeNodeId === n.id;
            const isHighlighted = cur.highlightedIds?.includes(n.id);
            const displayVal = cur.customValues?.[n.id] ?? n.val;

            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="20"
                  fill={isActive ? '#ff6f1e' : isHighlighted ? '#feddbe' : '#fdfbf9'}
                  stroke="#171717"
                  strokeWidth="2.5"
                />
                <text
                  x={n.x}
                  y={n.y + 5}
                  textAnchor="middle"
                  fill={isActive ? '#ffffff' : '#171717'}
                  fontFamily="Geist Mono"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {displayVal}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <StepCard
        stepNumber={step + 1}
        totalSteps={steps.length}
        title={cur.title}
        whatHappens={cur.whatHappens}
        whyRationale={cur.whyRationale}
        variableStates={cur.states}
        codeSnippet={cur.codeSnippet}
        timeSpaceImpact={cur.impact || 'Time: O(N) | Space: O(H)'}
      />
    </div>
  );
};