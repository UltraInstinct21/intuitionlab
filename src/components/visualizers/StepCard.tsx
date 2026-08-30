import React from 'react';
import { Info, Layers, Code } from 'lucide-react';

interface StepCardProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  whatHappens: string;
  whyRationale: string;
  variableStates: Record<string, string | number | boolean | undefined>;
  codeSnippet?: string;
  timeSpaceImpact?: string;
}

export const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  totalSteps,
  title,
  whatHappens,
  whyRationale,
  variableStates,
  codeSnippet,
  timeSpaceImpact,
}) => {
  return (
    <div className="rounded-xl border-[1.5px] border-charcoal bg-dew-drop p-4 sm:p-5 shadow-hard space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline/20 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="bg-primary-container text-on-primary-container text-xs font-mono font-bold px-2.5 py-0.5 rounded-pill border border-charcoal">
            step {stepNumber} / {totalSteps}
          </span>
          <span className="font-display font-bold text-sm sm:text-base text-charcoal lowercase">
            {title}
          </span>
        </div>
        {timeSpaceImpact && (
          <span className="text-xs font-mono text-on-surface-variant font-medium bg-cream-paper px-2.5 py-0.5 rounded border border-outline/30">
            {timeSpaceImpact}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div className="space-y-1.5 bg-cream-paper p-3 rounded-lg border border-outline/30">
          <div className="flex items-center gap-1.5 font-bold font-mono text-marker-orange text-xs uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>action in this step:</span>
          </div>
          <p className="font-sans text-cocoa-ink leading-relaxed font-medium">
            {whatHappens}
          </p>
        </div>
        <div className="space-y-1.5 bg-cream-paper p-3 rounded-lg border border-outline/30">
          <div className="flex items-center gap-1.5 font-bold font-mono text-sky-sticker text-xs uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>algorithmic rationale:</span>
          </div>
          <p className="font-sans text-cocoa-ink leading-relaxed font-medium">
            {whyRationale}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-bold font-mono text-charcoal">Live Variables:</span>
        {Object.entries(variableStates)
          .filter(([, val]) => val !== undefined)
          .map(([key, val]) => (
            <span
              key={key}
              className="text-xs font-mono px-2.5 py-1 rounded bg-surface border border-charcoal/40 text-charcoal shadow-xs"
            >
              <strong className="text-marker-orange">{key}</strong> = {String(val)}
            </span>
          ))}
      </div>

      {codeSnippet && (
        <div className="pt-2 border-t border-outline/20">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-on-surface-variant mb-1">
            <Code className="w-3 h-3 text-marker-orange" />
            <span>Executing Code Line:</span>
          </div>
          <pre className="p-2.5 rounded bg-inverse-surface text-inverse-on-surface font-mono text-xs overflow-x-auto border border-charcoal">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
};