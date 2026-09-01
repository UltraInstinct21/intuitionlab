import React, { useState, useEffect, useMemo } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { GraphVisualizationData, GraphStep, GraphNodeVisual } from '@/types/visualization';

interface GraphVisualizerProps {
  problem: Problem;
  customData?: GraphVisualizationData;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultNodes: GraphNodeVisual[] = [
    { id: 0, label: '0', x: 60, y: 50 },
    { id: 1, label: '1', x: 160, y: 50 },
    { id: 2, label: '2', x: 260, y: 50 },
    { id: 3, label: '3', x: 110, y: 150 },
    { id: 4, label: '4', x: 210, y: 150 },
  ];

  const defaultEdges: [number | string, number | string, string?][] = [
    [0, 1], [0, 3], [1, 2], [1, 4], [3, 4], [4, 2]
  ];

  const defaultSteps: GraphStep[] = [
    {
      title: 'Initialize Graph State',
      whatHappens: 'Process graph vertices and edges.',
      whyRationale: 'Build adjacency list and visited tracker.',
      nodes: defaultNodes,
      edges: defaultEdges,
      states: { V: 5, E: 6 },
      codeSnippet: 'adj = defaultdict(list)\nfor u, v in edges: adj[u].append(v)',
      impact: 'Time: O(V + E) | Space: O(V)',
    }
  ];

  const steps: GraphStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
  const cur = steps[step] || steps[0];

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [problem.id, customData]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const nodes = cur.nodes || defaultNodes;
  const edges = cur.edges || defaultEdges;

  // Dynamically compute bounding box with generous padding so graph never clips
  const viewBox = useMemo(() => {
    if (!nodes || nodes.length === 0) return '0 0 360 220';
    const padding = 42;
    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const minX = Math.min(...xs) - padding;
    const maxX = Math.max(...xs) + padding;
    const minY = Math.min(...ys) - padding;
    const maxY = Math.max(...ys) + padding;

    const width = Math.max(maxX - minX, 300);
    const height = Math.max(maxY - minY, 180);

    return `${minX} ${minY} ${width} ${height}`;
  }, [nodes]);

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
          <Button size="sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)} className="h-8 px-2.5 text-xs">
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setStep(0); setIsPlaying(false); }} className="h-8"><RotateCcw className="w-3.5 h-3.5" /></Button>
        </div>
        <div className="text-xs md:text-sm font-mono flex items-center gap-3">
          <span className="text-marker-orange font-bold">step {step + 1} of {steps.length}</span>
          {cur.queueOrStack && cur.queueOrStack.length > 0 && (
            <span className="text-sky-sticker font-bold">queue: [{cur.queueOrStack.join(', ')}]</span>
          )}
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center justify-center overflow-hidden w-full select-none">
        <div className="w-full max-w-[560px] min-h-[220px] max-h-[380px] flex items-center justify-center">
          <svg viewBox={viewBox} className="w-full h-auto max-h-[360px] drop-shadow-sm" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="graphNodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* Edges */}
            {edges.map(([fromId, toId, label], idx) => {
              const fromNode = nodes.find(n => n.id === fromId || String(n.id) === String(fromId));
              const toNode = nodes.find(n => n.id === toId || String(n.id) === String(toId));
              if (!fromNode || !toNode) return null;

              const isPath = cur.activePath && (
                (cur.activePath.includes(fromId) && cur.activePath.includes(toId)) ||
                (cur.activePath.map(String).includes(String(fromId)) && cur.activePath.map(String).includes(String(toId)))
              );

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isPath ? '#ff6f1e' : '#9ca3af'}
                    strokeWidth={isPath ? 3.5 : 2}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  {label && (
                    <g transform={`translate(${(fromNode.x + toNode.x) / 2}, ${(fromNode.y + toNode.y) / 2})`}>
                      <rect x="-16" y="-9" width="32" height="18" rx="4" fill="#fdfbf9" stroke="#bebcbb" strokeWidth="1" />
                      <text x="0" y="3.5" fontSize="9" textAnchor="middle" fill="#ff6f1e" fontWeight="bold" fontFamily="monospace">
                        {label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const isActive = cur.activeNodeId === node.id || String(cur.activeNodeId) === String(node.id);
              const isVisited = (cur.visitedIds && (cur.visitedIds.includes(node.id) || cur.visitedIds.map(String).includes(String(node.id)))) || node.status === 'visited';
              const isTarget = node.status === 'target' || node.status === 'success';

              let fill = '#fdfbf9';
              let stroke = '#171717';
              let textColor = '#171717';

              if (isActive) {
                fill = '#fed7aa';
                stroke = '#ff6f1e';
                textColor = '#9a3412';
              } else if (isTarget) {
                fill = '#dcfce7';
                stroke = '#22c55e';
                textColor = '#166534';
              } else if (isVisited) {
                fill = '#e0e7ff';
                stroke = '#6366f1';
                textColor = '#3730a3';
              }

              const labelStr = String(node.label || node.id);
              const radius = Math.max(19, labelStr.length * 4.5 + 7);
              const fontSize = labelStr.length > 5 ? 8 : labelStr.length > 3 ? 10 : 11;

              return (
                <g key={`node-${node.id}`} className="transition-all duration-300" filter="url(#graphNodeShadow)">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="2.5"
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fontSize={fontSize}
                    fontWeight="bold"
                    fontFamily="monospace"
                    fill={textColor}
                  >
                    {labelStr}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <StepCard
        stepNumber={step + 1}
        totalSteps={steps.length}
        title={cur.title}
        whatHappens={cur.whatHappens}
        whyRationale={cur.whyRationale}
        variableStates={cur.states || {}}
        codeSnippet={cur.codeSnippet}
        timeSpaceImpact={cur.impact || 'Time: O(V + E) | Space: O(V)'}
      />
    </div>
  );
};