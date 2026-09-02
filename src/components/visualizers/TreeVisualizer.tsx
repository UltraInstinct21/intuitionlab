import React, { useState, useEffect, useMemo } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import { StepCard } from './StepCard';
import { TreeVisualizationData, TreeStep, TreeNodeVisual } from '@/types/visualization';

interface TreeVisualizerProps {
  problem: Problem;
  customData?: TreeVisualizationData;
}

function parseNodeValue(rawVal: any): { mainVal: string; annotation?: string } {
  if (rawVal === undefined || rawVal === null) return { mainVal: '' };
  const str = String(rawVal).trim();

  // Pattern: "20 (sum=42)", "9 (gain=9)", "3 (Root)", "-10 (path=34)"
  const parenMatch = str.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch && parenMatch[1].trim()) {
    return { mainVal: parenMatch[1].trim(), annotation: parenMatch[2].trim() };
  }

  // Pattern: "20 [OPTIMAL]", "15 [PATH]"
  const bracketMatch = str.match(/^(.*?)\s*\[(.*?)\]$/);
  if (bracketMatch && bracketMatch[1].trim()) {
    return { mainVal: bracketMatch[1].trim(), annotation: bracketMatch[2].trim() };
  }

  // Pattern: "val: label"
  if (str.includes(': ') && !str.startsWith('http')) {
    const parts = str.split(': ');
    if (parts.length === 2 && parts[0].length <= 5) {
      return { mainVal: parts[0].trim(), annotation: parts[1].trim() };
    }
  }

  // If string is long with a space, e.g. "Root 1"
  if (str.length > 6 && str.includes(' ')) {
    const parts = str.split(' ');
    return { mainVal: parts[parts.length - 1], annotation: parts.slice(0, -1).join(' ') };
  }

  return { mainVal: str };
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ problem, customData }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultNodes: TreeNodeVisual[] = [
    { id: 1, val: 1, x: 200, y: 40, leftId: 2, rightId: 3 },
    { id: 2, val: 2, x: 120, y: 110, leftId: 4, rightId: 5 },
    { id: 3, val: 3, x: 280, y: 110 },
    { id: 4, val: 4, x: 70, y: 180 },
    { id: 5, val: 5, x: 170, y: 180 },
  ];

  const defaultEdges: [number | string, number | string, string?][] = [
    [1, 2], [1, 3], [2, 4], [2, 5]
  ];

  const defaultSteps: TreeStep[] = [
    {
      title: 'Initialize Tree Traversal',
      whatHappens: 'Process binary tree rooted at node 1.',
      whyRationale: 'Binary tree structural traversal.',
      nodes: defaultNodes,
      edges: defaultEdges,
      states: { root: 1 },
      codeSnippet: 'def traverse(root):\n    if not root: return',
      impact: 'Time: O(N) | Space: O(H)',
    }
  ];

  const steps: TreeStep[] = customData?.steps && customData.steps.length > 0 ? customData.steps : defaultSteps;
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

  // Dynamically compute bounding box with generous padding so the tree NEVER overflows or clips
  const viewBox = useMemo(() => {
    if (!nodes || nodes.length === 0) return '0 0 400 240';
    const padding = 45;
    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const minX = Math.min(...xs) - padding;
    const maxX = Math.max(...xs) + padding;
    const minY = Math.min(...ys) - padding;
    const maxY = Math.max(...ys) + padding;

    const width = Math.max(maxX - minX, 320);
    const height = Math.max(maxY - minY, 210);

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
          {cur.traversalOrder && cur.traversalOrder.length > 0 && (
            <span className="text-sky-sticker font-bold hidden sm:inline">order: [{cur.traversalOrder.join(', ')}]</span>
          )}
        </div>
      </div>

      <div className="py-6 px-4 bg-cream-paper rounded-xl border border-dashed border-outline/40 flex flex-col items-center justify-center overflow-hidden w-full select-none">
        <div className="w-full max-w-[620px] min-h-[220px] max-h-[380px] flex items-center justify-center">
          <svg
            viewBox={viewBox}
            className="w-full h-auto max-h-[360px] drop-shadow-sm"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* Tree Edges */}
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
                      <text
                        x="0"
                        y="3.5"
                        fontSize="9"
                        textAnchor="middle"
                        fill="#ff6f1e"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Tree Nodes */}
            {nodes.map(node => {
              const isPath = cur.activePath && (cur.activePath.includes(node.id) || cur.activePath.map(String).includes(String(node.id)));
              const status = node.status;

              let fill = '#fdfbf9';
              let stroke = '#171717';
              let textColor = '#171717';

              if (status === 'active' || isPath) {
                fill = '#fed7aa';
                stroke = '#ff6f1e';
                textColor = '#9a3412';
              } else if (status === 'visited' || status === 'matched' || status === 'success') {
                fill = '#dcfce7';
                stroke = '#22c55e';
                textColor = '#166534';
              } else if (status === 'highlight' || status === 'lca') {
                fill = '#e0e7ff';
                stroke = '#6366f1';
                textColor = '#3730a3';
              } else if (status === 'danger') {
                fill = '#fee2e2';
                stroke = '#ef4444';
                textColor = '#991b1b';
              } else if (status === 'null') {
                fill = '#f3f4f6';
                stroke = '#9ca3af';
                textColor = '#9ca3af';
              }

              const { mainVal, annotation } = parseNodeValue(node.val);
              // Fixed, consistent node radius so nodes never balloon in size
              const radius = 18;
              const fontSize = mainVal.length > 4 ? 9 : mainVal.length > 2 ? 10 : 12;

              // Auxiliary annotation badge (e.g. gain=9, sum=42, Root, OPTIMAL)
              const badgeText = annotation || '';
              const badgeWidth = badgeText ? Math.max(26, badgeText.length * 5.2 + 8) : 0;
              const isNearTop = node.y <= 65;
              const badgeY = isNearTop ? node.y + 26 : node.y - 23;

              return (
                <g key={`node-${node.id}`} className="transition-all duration-300">
                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="2.5"
                    filter="url(#nodeShadow)"
                  />
                  {/* Node Value */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fontSize={fontSize}
                    fontWeight="bold"
                    fontFamily="monospace"
                    fill={textColor}
                  >
                    {mainVal}
                  </text>

                  {/* Auxiliary Badge (if present) */}
                  {badgeText && (
                    <g transform={`translate(${node.x}, ${badgeY})`}>
                      <rect
                        x={-badgeWidth / 2}
                        y="-7.5"
                        width={badgeWidth}
                        height="15"
                        rx="4"
                        fill={status === 'matched' || status === 'active' || isPath ? '#ffedd5' : '#f8fafc'}
                        stroke={status === 'matched' || status === 'active' || isPath ? '#ff6f1e' : '#94a3b8'}
                        strokeWidth="1"
                        filter="url(#nodeShadow)"
                      />
                      <text
                        x="0"
                        y="2.5"
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill={status === 'matched' || status === 'active' || isPath ? '#c2410c' : '#475569'}
                      >
                        {badgeText}
                      </text>
                    </g>
                  )}
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
        timeSpaceImpact={cur.impact || 'Time: O(N) | Space: O(H)'}
      />
    </div>
  );
};