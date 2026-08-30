import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';

interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null; }

function buildBST(values: (number | null)[]): TreeNode | null {
  if (!values.length || values[0] === null) return null;
  const root: TreeNode = { val: values[0]!, left: null, right: null };
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length && i < values.length) {
    const node = queue.shift()!;
    if (i < values.length && values[i] !== null) { node.left = { val: values[i]!, left: null, right: null }; queue.push(node.left); }
    i++;
    if (i < values.length && values[i] !== null) { node.right = { val: values[i]!, left: null, right: null }; queue.push(node.right); }
    i++;
  }
  return root;
}

function inorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...inorder(root.left), root.val, ...inorder(root.right)];
}

interface Step {
  title: string;
  whatHappens: string;
  whyRationale: string;
  codeLine: string;
  highlightNodes: Set<number>;
  pathNodes: Set<number>;
  currentNode: number | null;
  result?: string;
  treeValues: (number | null)[];
}

function buildBSTSteps(problem: Problem): Step[] {
  const t = problem.title.toLowerCase();
  const steps: Step[] = [];

  const defaultVals: (number | null)[] = [8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13];
  const vals = problem.examples?.[0]?.input?.match(/\[([\d,\snull]+)\]/)?.[1]?.split(',').map(v => v.trim() === 'null' ? null : parseInt(v.trim())).filter(v => v === null || !isNaN(v)) || defaultVals;
  const tree = buildBST(vals);

  if (t.includes('search in a binary search tree')) {
    const target = 6;
    let node = tree;
    const path: number[] = [];
    while (node) {
      path.push(node.val);
      if (target === node.val) break;
      node = target < node.val ? node.left : node.right!;
    }
    steps.push({ title: 'Start at root', whatHappens: `BST root = ${vals[0]}. Compare target ${target} with current.`, whyRationale: 'BST property: left < root < right. Eliminate half each comparison.', codeLine: `while node:\n    if ${target} == node.val: return node`, highlightNodes: new Set([vals[0]!]), pathNodes: new Set(), currentNode: vals[0]!, treeValues: vals });
    for (let i = 0; i < path.length; i++) {
      const curr = path[i];
      const found = target === curr;
      const dir = i < path.length - 1 ? (target < curr ? 'left' : 'right') : '';
      steps.push({
        title: found ? `Found ${target}!` : `${target} ${target < curr ? '<' : '>'} ${curr}, go ${dir}`,
        whatHappens: found ? `arr[mid] == ${target}. Found at this node!` : `${target} ${target < curr ? '<' : '>'} ${curr}. Move ${dir}.`,
        whyRationale: found ? 'Exact match found in BST.' : 'BST property allows us to eliminate the other subtree entirely.',
        codeLine: found ? `return node` : `node = node.${dir}`,
        highlightNodes: new Set(path.slice(0, i + 1)),
        pathNodes: new Set(path.slice(0, i)),
        currentNode: curr,
        result: found ? `Found at depth ${i}` : undefined,
        treeValues: vals,
      });
    }
    return steps;
  }

  if (t.includes('validate binary search tree')) {
    steps.push({ title: 'Check BST property recursively', whatHappens: `For each node, verify: left subtree max < node < right subtree min.`, whyRationale: 'BST invariant: every node in left subtree must be smaller, every node in right must be larger.', codeLine: 'def validate(node, lo, hi):\n    if not node: return True\n    if node.val <= lo or node.val >= hi: return False', highlightNodes: new Set([vals[0]!]), pathNodes: new Set(), currentNode: vals[0]!, treeValues: vals });
    steps.push({ title: 'Inorder traversal must be sorted', whatHappens: `Inorder: [${inorder(tree!).join(', ')}]. Check if strictly increasing.`, whyRationale: 'If inorder is strictly increasing, BST property holds for all nodes.', codeLine: 'inorder = []\ndef dfs(node):\n    if node: dfs(node.left); inorder.append(node.val); dfs(node.right)', highlightNodes: new Set(inorder(tree!)), pathNodes: new Set(), currentNode: null, treeValues: vals });
    steps.push({ title: 'Valid BST confirmed', whatHappens: `All nodes satisfy BST property. Inorder [${inorder(tree!).join(', ')}] is strictly increasing.`, whyRationale: 'No violations found. This is a valid BST.', codeLine: 'return True', highlightNodes: new Set(inorder(tree!)), pathNodes: new Set(), currentNode: null, result: 'Valid BST', treeValues: vals });
    return steps;
  }

  if (t.includes('kth smallest')) {
    const sorted = inorder(tree!);
    steps.push({ title: 'Inorder traversal yields sorted order', whatHappens: `BST inorder gives sorted array. Kth smallest = sorted[k-1].`, whyRationale: 'Inorder traversal of BST visits nodes in ascending order.', codeLine: 'def inorder(node):\n    if not node: return []\n    return inorder(node.left) + [node.val] + inorder(node.right)', highlightNodes: new Set(sorted.slice(0, 3)), pathNodes: new Set(), currentNode: null, treeValues: vals });
    steps.push({ title: 'Kth smallest element', whatHappens: `Sorted: [${sorted.join(', ')}]. 3rd smallest = ${sorted[2]}.`, whyRationale: 'After full inorder, index k-1 gives the kth smallest.', codeLine: 'return sorted[k-1]', highlightNodes: new Set(sorted.slice(0, 3)), pathNodes: new Set(), currentNode: sorted[2], result: `3rd smallest = ${sorted[2]}`, treeValues: vals });
    return steps;
  }

  if (t.includes('floor') || t.includes('ceil')) {
    const isFloor = t.includes('floor');
    const target = 5;
    steps.push({ title: `${isFloor ? 'Floor' : 'Ceil'} of ${target}`, whatHappens: `Find ${isFloor ? 'largest' : 'smallest'} value ${isFloor ? '≤' : '≥'} ${target} in BST.`, whyRationale: `BST search: go ${isFloor ? 'right' : 'left'} when possible to find closer ${isFloor ? 'smaller' : 'larger'} value.`, codeLine: `def ${isFloor ? 'floor' : 'ceil'}(node, target):\n    result = ${isFloor ? '-inf' : 'inf'}\n    while node:\n        if node.val ${isFloor ? '<=' : '>='} target:\n            result = node.val\n            node = node.${isFloor ? 'right' : 'left'}\n        else:\n            node = node.${isFloor ? 'left' : 'right'}\n    return result`, highlightNodes: new Set([vals[0]!]), pathNodes: new Set(), currentNode: vals[0]!, treeValues: vals });
    steps.push({ title: `Result: ${isFloor ? 4 : 6}`, whatHappens: `Traversed BST. ${isFloor ? 'Floor' : 'Ceil'} of ${target} = ${isFloor ? 4 : 6}.`, whyRationale: `${isFloor ? '4 is the largest value ≤ 5' : '6 is the smallest value ≥ 5'} in the tree.`, codeLine: 'return result', highlightNodes: new Set([vals[0]!]), pathNodes: new Set(), currentNode: isFloor ? 4 : 6, result: `${isFloor ? 'floor' : 'ceil'} = ${isFloor ? 4 : 6}`, treeValues: vals });
    return steps;
  }

  if (t.includes('lowest common ancestor') || t.includes('lca')) {
    steps.push({ title: 'LCA in BST', whatHappens: 'LCA is the deepest node where both p and q are in different subtrees (or one is the node itself).', whyRationale: 'BST property: if both values < root, LCA is in left subtree. If both > root, right. Otherwise root is LCA.', codeLine: 'def lca(root, p, q):\n    while root:\n        if p < root.val and q < root.val:\n            root = root.left\n        elif p > root.val and q > root.val:\n            root = root.right\n        else:\n            return root', highlightNodes: new Set([vals[0]!]), pathNodes: new Set(), currentNode: vals[0]!, treeValues: vals });
    steps.push({ title: 'Found LCA', whatHappens: 'The split point where p and q diverge is the LCA.', whyRationale: 'First node where the paths to p and q diverge.', codeLine: 'return root', highlightNodes: new Set([vals[0]!]), pathNodes: new Set(), currentNode: vals[1], result: `LCA = ${vals[1]}`, treeValues: vals });
    return steps;
  }

  if (t.includes('inorder successor')) {
    steps.push({ title: 'Find inorder successor', whatHappens: 'Successor = next larger element. If node has right child, successor = leftmost of right subtree.', whyRationale: 'Inorder successor is the smallest element greater than current.', codeLine: 'def inorderSuccessor(root, p):\n    successor = None\n    while root:\n        if p.val < root.val:\n            successor = root\n            root = root.left\n        else:\n            root = root.right\n    return successor', highlightNodes: new Set([vals[0]!]), pathNodes: new Set(), currentNode: vals[0]!, treeValues: vals });
    steps.push({ title: 'Successor found', whatHappens: `The inorder successor is the next node in sorted order.`, whyRationale: 'Tracked the last node where we went left — that\'s the successor.', codeLine: 'return successor', highlightNodes: new Set(), pathNodes: new Set(), currentNode: null, result: 'successor found', treeValues: vals });
    return steps;
  }

  // Default BST step
  steps.push({ title: problem.approaches?.[0]?.name || 'BST Operation', whatHappens: problem.approachOverview?.split('\n')[0]?.replace(/\*\*/g, '') || `BST with values [${vals.filter(v => v !== null).join(', ')}]`, whyRationale: problem.keyInsight || 'BST property enables O(log N) operations.', codeLine: problem.approaches?.[problem.approaches.length - 1]?.pythonCode?.split('\n').slice(0, 3).join('\n') || '', highlightNodes: new Set([vals[0]!]), pathNodes: new Set(), currentNode: vals[0]!, treeValues: vals });
  return steps;
}

function BSTSvg({ node, x, y, dx, highlight, path, current }: { node: TreeNode | null; x: number; y: number; dx: number; highlight: Set<number>; path: Set<number>; current: number | null; }) {
  if (!node) return null;
  const isCurrent = node.val === current;
  const isHighlighted = highlight.has(node.val);
  const isPath = path.has(node.val);
  return (
    <g>
      {node.left && <><line x1={x} y1={y + 18} x2={x - dx} y2={y + 52} stroke={isPath ? '#ff6f1e' : '#171717'} strokeWidth={isPath ? 3 : 2} /><BSTSvg node={node.left} x={x - dx} y={y + 55} dx={dx * 0.55} highlight={highlight} path={path} current={current} /></>}
      {node.right && <><line x1={x} y1={y + 18} x2={x + dx} y2={y + 52} stroke={isPath ? '#ff6f1e' : '#171717'} strokeWidth={isPath ? 3 : 2} /><BSTSvg node={node.right} x={x + dx} y={y + 55} dx={dx * 0.55} highlight={highlight} path={path} current={current} /></>}
      <circle cx={x} cy={y} r="16" fill={isCurrent ? '#ff6f1e' : isHighlighted ? '#feddbe' : '#fdfbf9'} stroke={isCurrent ? '#171717' : '#171717'} strokeWidth="2.5" />
      <text x={x} y={y + 5} textAnchor="middle" fill={isCurrent ? '#fff' : '#171717'} fontFamily="Geist Mono" fontSize="12" fontWeight="bold">{node.val}</text>
    </g>
  );
}

export const BSTStepVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const steps = buildBSTSteps(problem);
  const s = steps[step] || steps[0];
  const tree = buildBST(s.treeValues);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep(prev => { if (prev >= steps.length - 1) { setIsPlaying(false); return prev; } return prev + 1; });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-1.5 flex-wrap">
          {steps.map((_, i) => (
            <button key={i} onClick={() => { setStep(i); setIsPlaying(false); }}
              className={`w-7 h-7 rounded-full text-[10px] font-mono font-bold transition-all flex items-center justify-center ${
                step === i ? 'bg-primary-container text-on-primary-container border-2 border-charcoal shadow-xs scale-110'
                : i < step ? 'bg-sprout-sticker/20 text-[#15803d] border border-sprout-sticker/40'
                : 'bg-surface text-on-surface-variant border border-outline/30'
              }`}>
              {i < step ? '✓' : i + 1}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)} className="h-7 px-2">
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </Button>
          <Button size="sm" variant="default" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="h-7 px-2 text-xs"><ChevronLeft className="w-3.5 h-3.5" /></Button>
          <Button size="sm" variant="primary" onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step >= steps.length - 1} className="h-7 px-2 text-xs"><ChevronRight className="w-3.5 h-3.5" /></Button>
          <Button size="sm" variant="ghost" onClick={() => { setStep(0); setIsPlaying(false); }} className="h-7"><RotateCcw className="w-3.5 h-3.5" /></Button>
        </div>
      </div>

      <div className="py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        <svg viewBox="0 0 500 200" className="w-[500px] h-52">
          <BSTSvg node={tree} x={250} y={30} dx={110} highlight={s.highlightNodes} path={s.pathNodes} current={s.currentNode} />
        </svg>
        {s.result && (
          <div className="px-4 py-2 rounded-pill bg-sprout-sticker text-white font-mono font-bold text-sm border-2 border-charcoal shadow-md">
            {s.result}
          </div>
        )}
      </div>

      <StepCard
        stepNumber={step + 1} totalSteps={steps.length}
        title={s.title} whatHappens={s.whatHappens} whyRationale={s.whyRationale}
        variableStates={{ current_node: s.currentNode ?? 'null', visited: s.highlightNodes.size, inorder: inorder(tree!).join(', ') }}
        codeSnippet={s.codeLine} timeSpaceImpact={problem.approaches?.[problem.approaches.length - 1]?.timeComplexity || 'O(log N)'}
      />
    </div>
  );
};