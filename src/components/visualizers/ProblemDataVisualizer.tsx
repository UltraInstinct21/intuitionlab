import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Code, Lightbulb, Zap, Clock, Layers, ChevronDown, ChevronUp, Play, Pause, CheckCircle2, ArrowRight } from 'lucide-react';
import { Problem } from '@/types/problem';
import gsap from 'gsap';

interface Props { problem: Problem; }

function parseApproachSteps(overview?: string): { title: string; detail: string; codeHint: string }[] {
  if (!overview) return [];
  const raw = overview.replace(/\*\*/g, '').trim();
  const blocks = raw.split(/\n\n+/).filter(b => b.trim());
  const steps: { title: string; detail: string; codeHint: string }[] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const m = line.match(/^(?:\d+[\.\)]\s*|step\s*\d+[:\s-]+\s*|phase\s*\d+[:\s-]+\s*|•\s*|[-*]\s*)(.+)/i);
      if (m) {
        const rawTitle = m[1].trim();
        const colonIdx = rawTitle.indexOf(':');
        const dashIdx = rawTitle.indexOf(' — ');
        const sepIdx = colonIdx > 0 && colonIdx < 60 ? colonIdx : dashIdx > 0 ? dashIdx : -1;
        if (sepIdx > 0) {
          steps.push({ title: rawTitle.substring(0, sepIdx).trim(), detail: rawTitle.substring(sepIdx + 1).trim(), codeHint: '' });
        } else {
          steps.push({ title: rawTitle, detail: '', codeHint: '' });
        }
      } else if (steps.length > 0 && !steps[steps.length - 1].detail) {
        steps[steps.length - 1].detail = line;
      } else if (steps.length > 0) {
        steps[steps.length - 1].detail += (steps[steps.length - 1].detail ? ' ' : '') + line;
      }
    }
  }
  return steps;
}

function parseCodeToLines(code?: string): { line: string; indent: number; isDef: boolean; isReturn: boolean; isComment: boolean; isIf: boolean; isLoop: boolean }[] {
  if (!code) return [];
  return code.split('\n').filter(l => l.trim()).map(l => {
    const trimmed = l.trim();
    const indent = l.length - l.trimStart().length;
    return {
      line: trimmed,
      indent,
      isDef: trimmed.startsWith('def ') || trimmed.startsWith('function ') || trimmed.startsWith('class '),
      isReturn: trimmed.startsWith('return'),
      isComment: trimmed.startsWith('#') || trimmed.startsWith('//'),
      isIf: trimmed.startsWith('if ') || trimmed.startsWith('elif ') || trimmed.startsWith('else'),
      isLoop: trimmed.startsWith('for ') || trimmed.startsWith('while '),
    };
  });
}

function extractVarsFromCode(code?: string): Record<string, string> {
  if (!code) return {};
  const vars: Record<string, string> = {};
  const assignMatches = code.matchAll(/(\w+)\s*=\s*([^=\n]+)/g);
  for (const m of assignMatches) {
    const name = m[1].trim();
    const val = m[2].trim();
    if (!['self', 'None', 'True', 'False', 'result', 'ans'].includes(name) && name.length < 20) {
      vars[name] = val.length > 30 ? val.substring(0, 30) + '...' : val;
    }
  }
  return vars;
}

export const ProblemDataVisualizer: React.FC<Props> = ({ problem }) => {
  const [step, setStep] = useState(0);
  const [view, setView] = useState<'walkthrough' | 'code' | 'intuition' | 'examples'>('walkthrough');
  const [showAllCode, setShowAllCode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = useMemo(() => parseApproachSteps(problem.approachOverview), [problem.approachOverview]);
  const bestApproach = problem.approaches?.[problem.approaches.length - 1] || problem.approaches?.[0];
  const codeLines = useMemo(() => parseCodeToLines(bestApproach?.pythonCode), [bestApproach]);
  const vars = useMemo(() => extractVarsFromCode(bestApproach?.pythonCode), [bestApproach]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && steps.length > 0) {
      timer = setInterval(() => {
        setStep(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0.8 }, { opacity: 1, duration: 0.2 });
    }
  }, [step, view]);

  const difficultyColor: Record<string, string> = {
    Easy: 'bg-[#22c55e]/15 text-[#15803d] border-[#22c55e]',
    Medium: 'bg-[#f59e0b]/15 text-[#b45309] border-[#f59e0b]',
    Hard: 'bg-[#ef4444]/15 text-[#dc2626] border-[#ef4444]',
  };

  const totalSteps = Math.max(steps.length, 1);
  const currentStep = steps[step];

  const codeHighlights = useMemo(() => {
    if (!currentStep || !bestApproach?.pythonCode) return [];
    const code = bestApproach.pythonCode;
    const keywords = currentStep.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const lines = code.split('\n');
    const highlights: number[] = [];
    lines.forEach((line, i) => {
      const low = line.toLowerCase();
      if (keywords.some(kw => low.includes(kw))) highlights.push(i);
    });
    return highlights.slice(0, 3);
  }, [currentStep, bestApproach]);

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Difficulty + Tags */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
        <span className={`px-2 py-0.5 rounded-pill border font-bold ${difficultyColor[problem.difficulty] || ''}`}>{problem.difficulty}</span>
        {problem.tags.slice(0, 5).map(t => (
          <span key={t} className="px-2 py-0.5 rounded-pill bg-surface-container-high text-on-surface-variant border border-outline/30">{t}</span>
        ))}
        {bestApproach && (
          <span className="ml-auto text-on-surface-variant hidden sm:inline">
            <Clock className="w-3 h-3 inline mr-1" />{bestApproach.timeComplexity}
          </span>
        )}
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-1 bg-dew-drop p-1 rounded-xl border border-outline/30">
        {([
          ['walkthrough', 'walkthrough', Layers],
          ['code', 'solution', Code],
          ['intuition', 'intuition', Lightbulb],
          ['examples', 'examples', Zap],
        ] as const).map(([key, label, Icon]) => (
          <button key={key} onClick={() => setView(key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex-1 justify-center ${
              view === key ? 'bg-primary-container text-on-primary-container border border-charcoal shadow-xs' : 'text-on-surface-variant hover:bg-cream-paper'
            }`}>
            <Icon className="w-3.5 h-3.5" /><span>{label}</span>
          </button>
        ))}
      </div>

      {/* WALKTHROUGH VIEW */}
      {view === 'walkthrough' && (
        <div className="space-y-4">
          {steps.length > 0 ? (
            <>
              {/* Step Dots */}
              <div className="flex items-center gap-1 flex-wrap">
                {steps.map((s, i) => (
                  <button key={i} onClick={() => { setStep(i); setIsPlaying(false); }}
                    className={`w-8 h-8 rounded-full text-xs font-mono font-bold transition-all flex items-center justify-center ${
                      step === i ? 'bg-primary-container text-on-primary-container border-2 border-charcoal shadow-xs scale-110'
                      : i < step ? 'bg-sprout-sticker/20 text-[#15803d] border border-sprout-sticker/40'
                      : 'bg-surface text-on-surface-variant border border-outline/30 hover:bg-cream-paper'
                    }`}>
                    {i < step ? '✓' : i + 1}
                  </button>
                ))}
              </div>

              {/* Step Card */}
              <div className="rounded-xl border-[1.5px] border-charcoal bg-dew-drop p-5 shadow-hard space-y-4" key={`step-${step}`}>
                <div className="flex items-center justify-between border-b border-outline/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary-container text-on-primary-container text-xs font-mono font-bold px-2.5 py-0.5 rounded-pill border border-charcoal">
                      step {step + 1} / {totalSteps}
                    </span>
                    <span className="font-display font-bold text-sm sm:text-base text-charcoal lowercase">
                      {currentStep?.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)} className="h-7 px-2">
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </Button>
                    <Button size="sm" variant="default" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="h-7 px-2 text-xs">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => setStep(Math.min(totalSteps - 1, step + 1))} disabled={step >= totalSteps - 1} className="h-7 px-2 text-xs">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {currentStep?.detail && (
                  <div className="bg-cream-paper p-3 rounded-lg border border-outline/30">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-sky-sticker uppercase tracking-wider mb-1.5">
                      <Layers className="w-3 h-3" /> what happens
                    </span>
                    <p className="text-sm font-sans text-cocoa-ink leading-relaxed font-medium">{currentStep.detail}</p>
                  </div>
                )}

                {currentStep && (
                  <div className="bg-cream-paper p-3 rounded-lg border border-outline/30">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-marker-orange uppercase tracking-wider mb-1.5">
                      <Lightbulb className="w-3 h-3" /> why this works
                    </span>
                    <p className="text-sm font-sans text-cocoa-ink leading-relaxed">{problem.keyInsight || problem.intuition || 'This step maintains the algorithmic invariant.'}</p>
                  </div>
                )}

                {/* Inline Code */}
                {codeHighlights.length > 0 && bestApproach?.pythonCode && (
                  <div className="pt-2 border-t border-outline/20">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-on-surface-variant mb-1.5">
                      <Code className="w-3 h-3 text-marker-orange" /> related code
                    </span>
                    <pre className="p-3 rounded-lg bg-inverse-surface text-inverse-on-surface font-mono text-xs overflow-x-auto border border-charcoal max-h-40 overflow-y-auto">
                      <code>{bestApproach.pythonCode.split('\n').slice(
                        Math.max(0, codeHighlights[0] - 1),
                        Math.min(bestApproach.pythonCode.split('\n').length, codeHighlights[codeHighlights.length - 1] + 2)
                      ).join('\n')}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-surface-container-high rounded-full h-1.5 border border-outline/20">
                <div className="bg-primary-container h-full rounded-full transition-all duration-500"
                  style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
              </div>
            </>
          ) : (
            <div className="rounded-xl border-[1.5px] border-charcoal bg-dew-drop p-5 shadow-hard space-y-4">
              <div className="bg-cream-paper p-4 rounded-lg border border-outline/30">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-sticker uppercase tracking-wider mb-2">
                  <Layers className="w-3.5 h-3.5" /> approach overview
                </span>
                <p className="text-sm font-sans text-cocoa-ink leading-relaxed whitespace-pre-wrap">{problem.approachOverview}</p>
              </div>
              <div className="bg-cream-paper p-4 rounded-lg border border-outline/30">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-marker-orange uppercase tracking-wider mb-2">
                  <Lightbulb className="w-3.5 h-3.5" /> intuition
                </span>
                <p className="text-sm font-sans text-cocoa-ink leading-relaxed">{problem.intuition}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CODE VIEW */}
      {view === 'code' && bestApproach && (
        <div className="space-y-3">
          {/* Complexity badges */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-pill bg-[#22c55e]/15 text-[#15803d] border border-[#22c55e] font-bold">
              <Clock className="w-3 h-3 inline mr-1" />{bestApproach.timeComplexity}
            </span>
            <span className="px-2.5 py-1 rounded-pill bg-[#f59e0b]/15 text-[#b45309] border border-[#f59e0b] font-bold">
              Space: {bestApproach.spaceComplexity}
            </span>
          </div>

          {/* Approach tabs */}
          {problem.approaches.length > 1 && (
            <div className="flex items-center gap-1 flex-wrap">
              {problem.approaches.map((a, i) => (
                <span key={i} className={`text-[10px] font-mono px-2 py-0.5 rounded-pill border ${
                  i === problem.approaches.length - 1 ? 'bg-primary-container border-charcoal font-bold' : 'bg-surface-container-high border-outline/30 text-on-surface-variant'
                }`}>{a.name}</span>
              ))}
            </div>
          )}

          {/* Code block */}
          <div className="rounded-xl border-[1.5px] border-charcoal bg-inverse-surface p-4 shadow-hard overflow-x-auto">
            <pre className="text-xs font-mono text-inverse-on-surface leading-relaxed whitespace-pre">
              <code>{codeLines.map((cl, i) => (
                <div key={i} className={`flex ${codeHighlights.includes(i) ? 'bg-[#ff6f1e]/20 -mx-4 px-4 border-l-2 border-[#ff6f1e]' : ''}`}>
                  <span className="text-inverse-on-surface/30 w-8 text-right mr-3 select-none flex-shrink-0">{i + 1}</span>
                  <span>{'  '.repeat(cl.indent)}{cl.line}</span>
                </div>
              ))}</code>
            </pre>
          </div>
        </div>
      )}

      {/* INTUITION VIEW */}
      {view === 'intuition' && (
        <div className="space-y-3">
          {problem.keyInsight && (
            <div className="rounded-xl border-[1.5px] border-charcoal bg-primary-fixed/30 p-5 shadow-sm space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-burnt-sienna uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5" /> key insight
              </span>
              <p className="text-sm font-sans text-cocoa-ink leading-relaxed font-medium">{problem.keyInsight}</p>
            </div>
          )}
          <div className="rounded-xl border-[1.5px] border-charcoal bg-dew-drop p-5 shadow-hard space-y-2">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-sticker uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" /> intuition
            </span>
            <p className="text-sm font-sans text-cocoa-ink leading-relaxed">{problem.intuition}</p>
          </div>
          {/* Approach cards */}
          {problem.approaches.map((a, i) => (
            <div key={i} className="rounded-xl border-[1.5px] border-charcoal bg-surface p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-charcoal">{a.name}</span>
                <span className="text-[10px] font-mono text-on-surface-variant">{a.timeComplexity}</span>
              </div>
              <p className="text-xs font-sans text-on-surface leading-relaxed">{a.description}</p>
            </div>
          ))}
          {problem.constraints.length > 0 && (
            <div className="rounded-xl border-[1.5px] border-charcoal bg-surface p-4 shadow-sm space-y-2">
              <span className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">constraints</span>
              <ul className="text-xs font-mono text-on-surface space-y-1">
                {problem.constraints.map((c, i) => <li key={i}>• {c}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* EXAMPLES VIEW */}
      {view === 'examples' && (
        <div className="space-y-3">
          {problem.examples.map((ex, i) => (
            <div key={i} className="rounded-xl border-[1.5px] border-charcoal bg-dew-drop p-5 shadow-hard space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-marker-orange">example {i + 1}</span>
                {ex.explanation && <span className="text-[10px] font-mono text-on-surface-variant">has explanation</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-inverse-surface text-inverse-on-surface p-3 rounded-lg">
                  <span className="text-[10px] font-mono font-bold text-inverse-on-surface/50 block mb-1">input</span>
                  <code className="text-xs font-mono whitespace-pre-wrap break-all">{ex.input}</code>
                </div>
                <div className="bg-surface-container-high p-3 rounded-lg border border-outline/30">
                  <span className="text-[10px] font-mono font-bold text-on-surface-variant block mb-1">output</span>
                  <code className="text-xs font-mono break-all">{ex.output}</code>
                </div>
              </div>
              {ex.explanation && (
                <div className="bg-cream-paper p-3 rounded-lg border border-outline/30">
                  <span className="text-[10px] font-mono font-bold text-sky-sticker uppercase block mb-1">explanation</span>
                  <p className="text-xs font-sans text-on-surface leading-relaxed">{ex.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};