import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

export const GraphVisualizer: React.FC = () => {
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  const adj: Record<number, number[]> = {};
  edges.forEach(([u, v]) => { adj[u] = [...(adj[u] || []), v]; adj[v] = [...(adj[v] || []), u]; });

  const nodes = [
    { id: 0, x: 160, y: 30 },
    { id: 1, x: 80, y: 100 },
    { id: 2, x: 240, y: 100 },
    { id: 3, x: 40, y: 170 },
    { id: 4, x: 120, y: 170 },
    { id: 5, x: 280, y: 170 },
  ];

  const bfsOrder = [0, 1, 2, 3, 4, 5];
  const dfsOrder = [0, 1, 3, 4, 2, 5];

  const [traversalType, setTraversalType] = useState<'bfs' | 'dfs'>('bfs');
  const [visitedCount, setVisitedCount] = useState(0);
  const order = traversalType === 'bfs' ? bfsOrder : dfsOrder;

  const reset = () => setVisitedCount(0);
  const step = () => { if (visitedCount < order.length) setVisitedCount(v => v + 1); };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          {(['bfs', 'dfs'] as const).map(t => (
            <Button key={t} size="sm" variant={traversalType === t ? 'primary' : 'outline'}
              onClick={() => { setTraversalType(t); reset(); }} className="text-xs h-8 px-3">{t.toUpperCase()}</Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={step} disabled={visitedCount >= order.length} className="text-xs h-8 px-3">visit next</Button>
          <Button size="sm" variant="ghost" onClick={reset} className="h-8"><RotateCcw className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        <svg viewBox="0 0 320 200" className="w-80 h-52">
          {edges.map(([u, v], i) => {
            const un = nodes[u], vn = nodes[v];
            return <line key={i} x1={un.x} y1={un.y} x2={vn.x} y2={vn.y} stroke="#171717" strokeWidth="2" />;
          })}
          {nodes.map(n => {
            const visitIdx = order.indexOf(n.id);
            const isVisited = visitIdx < visitedCount;
            const isCurrent = visitIdx === visitedCount - 1;
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r="20" fill={isCurrent ? '#ff6f1e' : isVisited ? '#feddbe' : '#fdfbf9'} stroke="#171717" strokeWidth="2.5" />
                <text x={n.x} y={n.y + 6} textAnchor="middle" fill={isCurrent ? '#fff' : '#171717'} fontFamily="Geist Mono" fontSize="15" fontWeight="bold">{n.id}</text>
              </g>
            );
          })}
        </svg>

        <div className="flex items-center gap-2 text-xs font-mono flex-wrap justify-center">
          {order.map((id, i) => (
            <span key={id} className={`px-2.5 py-1 rounded-md border ${i < visitedCount ? 'bg-primary-container border-charcoal font-bold' : 'bg-surface-container-high border-outline/30'}`}>{id}</span>
          ))}
        </div>
      </div>

      <StepCard stepNumber={visitedCount} totalSteps={order.length}
        title={traversalType === 'bfs' ? 'BFS Queue-Based Exploration' : 'DFS Stack-Based Exploration'}
        whatHappens={visitedCount === 0 ? 'Start at node 0.' : `Visit node ${order[visitedCount - 1]}.`}
        whyRationale={traversalType === 'bfs' ? 'BFS explores all neighbors at current depth before moving deeper. Uses a queue.' : 'DFS explores as deep as possible before backtracking. Uses a stack (or recursion).'}
        variableStates={{ type: traversalType.toUpperCase(), visited: `${visitedCount}/${order.length}`, queue_or_stack: order.slice(visitedCount).join(', ') || 'empty' }}
        codeSnippet={traversalType === 'bfs' ? "queue = deque([start])\nwhile queue:\n    node = queue.popleft()\n    for neighbor in adj[node]:\n        if not visited[neighbor]:\n            visited[neighbor] = True\n            queue.append(neighbor)" : "def dfs(node):\n    visited[node] = True\n    for neighbor in adj[node]:\n        if not visited[neighbor]:\n            dfs(neighbor)"}
        timeSpaceImpact="Time: O(V + E) | Space: O(V)"
      />
    </div>
  );
};