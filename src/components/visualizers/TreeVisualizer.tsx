import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

export const TreeVisualizer: React.FC = () => {
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');
  const [visitedStep, setVisitedStep] = useState(0);

  const nodes = [
    { id: 1, val: 1, x: 160, y: 30 },
    { id: 2, val: 2, x: 90, y: 90 },
    { id: 3, val: 3, x: 230, y: 90 },
    { id: 4, val: 4, x: 50, y: 150 },
    { id: 5, val: 5, x: 130, y: 150 },
  ];

  const traversals = { inorder: [4, 2, 5, 1, 3], preorder: [1, 2, 4, 5, 3], postorder: [4, 5, 2, 3, 1] };
  const explanations = {
    inorder: "Left → Root → Right. Produces sorted order on BST.",
    preorder: "Root → Left → Right. Ideal for cloning trees.",
    postorder: "Left → Right → Root. Ideal for bottom-up calculations.",
  };

  const order = traversals[traversalType];
  const currentNodeVal = visitedStep > 0 ? order[visitedStep - 1] : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          {(['inorder', 'preorder', 'postorder'] as const).map(type => (
            <Button key={type} size="sm" variant={traversalType === type ? 'primary' : 'outline'}
              onClick={() => { setTraversalType(type); setVisitedStep(0); }} className="text-xs h-8 px-3">
              {type}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="default" onClick={() => setVisitedStep(Math.max(0, visitedStep - 1))} disabled={visitedStep === 0} className="h-8 px-2.5 text-xs">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="primary" onClick={() => setVisitedStep(Math.min(order.length, visitedStep + 1))} disabled={visitedStep === order.length} className="h-8 px-3 text-xs">
            <span>visit ({visitedStep}/{order.length})</span><ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setVisitedStep(0)} className="h-8"><RotateCcw className="w-3.5 h-3.5" /></Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40">
        <svg viewBox="0 0 320 200" className="w-80 h-52 overflow-visible">
          <line x1="160" y1="30" x2="90" y2="90" stroke="#171717" strokeWidth="2.5" />
          <line x1="160" y1="30" x2="230" y2="90" stroke="#171717" strokeWidth="2.5" />
          <line x1="90" y1="90" x2="50" y2="150" stroke="#171717" strokeWidth="2.5" />
          <line x1="90" y1="90" x2="130" y2="150" stroke="#171717" strokeWidth="2.5" />
          {nodes.map(n => {
            const visitedIdx = order.indexOf(n.val);
            const isVisited = visitedIdx < visitedStep;
            const isCurrent = visitedIdx === visitedStep - 1;
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r="20" fill={isCurrent ? '#ff6f1e' : isVisited ? '#feddbe' : '#fdfbf9'} stroke="#171717" strokeWidth="2.5" />
                <text x={n.x} y={n.y + 6} textAnchor="middle" fill={isCurrent ? '#ffffff' : '#171717'} fontFamily="Geist Mono" fontSize="15" fontWeight="bold">{n.val}</text>
              </g>
            );
          })}
        </svg>

        <div className="flex flex-col gap-2.5 max-w-xs text-xs md:text-sm font-mono">
          <span className="font-bold text-charcoal">{traversalType} sequence:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {order.map((val, idx) => (
              <span key={val} className={`px-3 py-1.5 rounded-md border ${idx < visitedStep ? 'bg-primary-container text-on-primary-container border-charcoal font-bold shadow-sm' : 'bg-surface-container-high text-on-surface-variant border-outline/30'}`}>{val}</span>
            ))}
          </div>
        </div>
      </div>

      <StepCard
        stepNumber={visitedStep} totalSteps={order.length}
        title={currentNodeVal !== null ? `Visited Node ${currentNodeVal}` : "Start"}
        whatHappens={currentNodeVal !== null ? `Visiting Node(${currentNodeVal}) as #${visitedStep}.` : "Starting traversal from root."}
        whyRationale={explanations[traversalType]}
        variableStates={{ type: traversalType, node: currentNodeVal ?? "none", visited: `${visitedStep}/${order.length}` }}
        codeSnippet={traversalType === 'inorder' ? "dfs(node.left)\nresult.append(node.val)\ndfs(node.right)" : traversalType === 'preorder' ? "result.append(node.val)\ndfs(node.left)\ndfs(node.right)" : "dfs(node.left)\ndfs(node.right)\nresult.append(node.val)"}
        timeSpaceImpact="Time: O(N) | Space: O(H)"
      />
    </div>
  );
};