import React, { useState } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';

interface GraphStep {
  title: string;
  whatHappens: string;
  whyRationale: string;
  activeNodeId?: number;
  visitedIds?: number[];
  states: Record<string, string | number | boolean | undefined>;
  codeSnippet: string;
  impact?: string;
}

function buildGraphSteps(problem?: Problem): { nodes: { id: number; label: string; x: number; y: number }[]; edges: [number, number, string?][]; steps: GraphStep[] } {
  const t = (problem?.title || '').toLowerCase();

  // 1. Topological Sort / Course Schedule
  if (t.includes('topological') || t.includes('course schedule')) {
    const nodes = [
      { id: 0, label: '0', x: 60, y: 50 },
      { id: 1, label: '1', x: 160, y: 50 },
      { id: 2, label: '2', x: 260, y: 50 },
      { id: 3, label: '3', x: 110, y: 150 },
      { id: 4, label: '4', x: 210, y: 150 },
    ];
    const edges: [number, number, string?][] = [
      [0, 1], [0, 3], [1, 2], [1, 4], [3, 4], [4, 2]
    ];
    return {
      nodes,
      edges,
      steps: [
        {
          title: 'Compute In-Degrees (Kahn Algorithm)',
          whatHappens: 'In-degrees: inDegree[0]=0, inDegree[1]=1, inDegree[2]=2, inDegree[3]=1, inDegree[4]=2.',
          whyRationale: 'Courses with inDegree=0 have zero prerequisites and can be taken first.',
          activeNodeId: 0,
          states: { inDegrees: '{0:0, 1:1, 2:2, 3:1, 4:2}', queue: '[0]' },
          codeSnippet: 'in_degree = [0] * V\nfor u, v in prerequisites: in_degree[v] += 1\nqueue = deque([i for i in range(V) if in_degree[i] == 0])',
          impact: 'Time: O(V + E) | Space: O(V)',
        },
        {
          title: 'Process Node 0 (in-degree 0)',
          whatHappens: 'Pop 0 from queue. Add to topoOrder. Decrement inDegree of neighbors 1 and 3.',
          whyRationale: 'Taking course 0 unlocks prerequisites for course 1 (now in-deg 0) and 3 (now in-deg 0).',
          activeNodeId: 0,
          visitedIds: [0],
          states: { topoOrder: '[0]', queue: '[1, 3]', 'inDegree[1]': 0, 'inDegree[3]': 0 },
          codeSnippet: 'node = queue.popleft()\nfor neighbor in adj[node]:\n    in_degree[neighbor] -= 1\n    if in_degree[neighbor] == 0: queue.append(neighbor)',
        },
        {
          title: 'Process Node 1 & Node 3',
          whatHappens: 'Process 1 and 3. inDegree of 4 becomes 0 → Push 4 into queue.',
          whyRationale: 'All prerequisites for 4 are fulfilled.',
          activeNodeId: 1,
          visitedIds: [0, 1, 3],
          states: { topoOrder: '[0, 1, 3]', queue: '[4]', 'inDegree[4]': 0 },
          codeSnippet: 'topo_order.append(node)',
        },
        {
          title: 'Complete Topological Sort',
          whatHappens: 'Process 4 then 2. Final ordering: [0, 1, 3, 4, 2].',
          whyRationale: 'All courses processed without encountering a cycle (len(topo) == V).',
          activeNodeId: 2,
          visitedIds: [0, 1, 3, 4, 2],
          states: { finalOrder: '[0, 1, 3, 4, 2]', canFinishAllCourses: true },
          codeSnippet: 'return len(topo_order) == numCourses',
        },
      ],
    };
  }

  // 2. Dijkstra's Algorithm / Shortest Path
  if (t.includes('dijkstra') || t.includes('shortest path') || t.includes('network delay')) {
    const nodes = [
      { id: 0, label: '0 (src)', x: 60, y: 100 },
      { id: 1, label: '1', x: 160, y: 40 },
      { id: 2, label: '2', x: 160, y: 160 },
      { id: 3, label: '3', x: 260, y: 100 },
    ];
    const edges: [number, number, string?][] = [
      [0, 1, 'w=4'], [0, 2, 'w=1'], [2, 1, 'w=2'], [1, 3, 'w=1'], [2, 3, 'w=5']
    ];
    return {
      nodes,
      edges,
      steps: [
        {
          title: 'Initialize Distances: dist[0]=0, others=INF',
          whatHappens: 'Source node 0 initialized with distance 0. Push (dist=0, node=0) to min-heap.',
          whyRationale: 'Min-heap ensures we always process the currently closest unvisited node first.',
          activeNodeId: 0,
          states: { 'dist[0]': 0, 'dist[1]': '∞', 'dist[2]': '∞', 'dist[3]': '∞', minHeap: '[(0, 0)]' },
          codeSnippet: 'dist = [float("inf")] * V\ndist[src] = 0\nheap = [(0, src)]',
          impact: 'Time: O(E log V) | Space: O(V + E)',
        },
        {
          title: 'Relax Edge 0 → 2 (cost 1)',
          whatHappens: 'Pop (0, 0). Relax 0->2 (dist=1 < INF) and 0->1 (dist=4 < INF).',
          whyRationale: 'Shortest tentative distance to node 2 is 1.',
          activeNodeId: 2,
          visitedIds: [0, 2],
          states: { 'dist[2]': 1, 'dist[1]': 4, minHeap: '[(1, 2), (4, 1)]' },
          codeSnippet: 'if d + weight < dist[neighbor]:\n    dist[neighbor] = d + weight\n    heappush(heap, (dist[neighbor], neighbor))',
        },
        {
          title: 'Relax Edge 2 → 1 (New dist = 1 + 2 = 3)',
          whatHappens: 'Pop (1, 2). Relax 2->1: 1 + 2 = 3 < 4! Update dist[1]=3.',
          whyRationale: 'Going via node 2 (0->2->1) is cheaper than direct edge 0->1.',
          activeNodeId: 1,
          visitedIds: [0, 2, 1],
          states: { 'dist[1]': '3 (improved)', 'dist[3]': 6, minHeap: '[(3, 1), (6, 3)]' },
          codeSnippet: 'dist[1] = min(4, 1 + 2) # Updated to 3',
        },
        {
          title: 'Relax Edge 1 → 3 (Final dist = 3 + 1 = 4)',
          whatHappens: 'Pop (3, 1). Relax 1->3: 3 + 1 = 4 < 6. Shortest path to 3 is 4 (path: 0 -> 2 -> 1 -> 3).',
          whyRationale: 'All shortest paths finalized.',
          activeNodeId: 3,
          visitedIds: [0, 2, 1, 3],
          states: { finalDistances: '{0:0, 1:3, 2:1, 3:4}', shortestTo3: 4 },
          codeSnippet: 'return dist',
        },
      ],
    };
  }

  // 3. Default: BFS / DFS Exploration
  const nodes = [
    { id: 0, label: '0', x: 160, y: 30 },
    { id: 1, label: '1', x: 80, y: 100 },
    { id: 2, label: '2', x: 240, y: 100 },
    { id: 3, label: '3', x: 40, y: 170 },
    { id: 4, label: '4', x: 120, y: 170 },
    { id: 5, label: '5', x: 280, y: 170 },
  ];
  const edges: [number, number, string?][] = [
    [0, 1], [0, 2], [1, 3], [1, 4], [2, 5]
  ];

  return {
    nodes,
    edges,
    steps: [
      {
        title: 'Start at Source Node 0',
        whatHappens: 'Initialize visited array and push start node 0 to queue.',
        whyRationale: 'Graph exploration begins by visiting the root / source component.',
        activeNodeId: 0,
        visitedIds: [0],
        states: { visited: '[0]', queue: '[0]' },
        codeSnippet: 'visited = {start}\nqueue = deque([start])',
        impact: 'Time: O(V + E) | Space: O(V)',
      },
      {
        title: 'Level 1: Explore Neighbors 1 & 2',
        whatHappens: 'Pop 0. Discover immediate neighbors 1 and 2.',
        whyRationale: 'Breadth-First Search visits all vertices at current depth distance 1.',
        activeNodeId: 1,
        visitedIds: [0, 1, 2],
        states: { visited: '[0, 1, 2]', queue: '[1, 2]' },
        codeSnippet: 'for neighbor in adj[node]:\n    if neighbor not in visited:\n        visited.add(neighbor)\n        queue.append(neighbor)',
      },
      {
        title: 'Level 2: Explore Leaf Vertices 3, 4, 5',
        whatHappens: 'Pop 1 → Add 3, 4. Pop 2 → Add 5.',
        whyRationale: 'Distance 2 frontier reached. All reachable vertices explored.',
        activeNodeId: 3,
        visitedIds: [0, 1, 2, 3, 4, 5],
        states: { visited: '[0, 1, 2, 3, 4, 5]', explorationComplete: true },
        codeSnippet: 'return visited_order',
      },
    ],
  };
}

export const GraphVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const { nodes, edges, steps } = buildGraphSteps(problem);
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

      <div className="py-6 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center gap-4">
        <svg viewBox="0 0 320 200" className="w-80 h-52 overflow-visible">
          {edges.map(([u, v, weight], i) => {
            const un = nodes.find(n => n.id === u);
            const vn = nodes.find(n => n.id === v);
            if (!un || !vn) return null;
            const midX = (un.x + vn.x) / 2;
            const midY = (un.y + vn.y) / 2;

            return (
              <React.Fragment key={i}>
                <line x1={un.x} y1={un.y} x2={vn.x} y2={vn.y} stroke="#171717" strokeWidth="2.5" />
                {weight && (
                  <text x={midX} y={midY - 4} textAnchor="middle" fill="#ce500a" fontFamily="Geist Mono" fontSize="10" fontWeight="bold">
                    {weight}
                  </text>
                )}
              </React.Fragment>
            );
          })}
          {nodes.map(n => {
            const isActive = cur.activeNodeId === n.id;
            const isVisited = cur.visitedIds?.includes(n.id);

            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="18"
                  fill={isActive ? '#ff6f1e' : isVisited ? '#feddbe' : '#fdfbf9'}
                  stroke="#171717"
                  strokeWidth="2.5"
                />
                <text
                  x={n.x}
                  y={n.y + 5}
                  textAnchor="middle"
                  fill={isActive ? '#fff' : '#171717'}
                  fontFamily="Geist Mono"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {n.label}
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
        timeSpaceImpact={cur.impact || 'Time: O(V + E) | Space: O(V)'}
      />
    </div>
  );
};