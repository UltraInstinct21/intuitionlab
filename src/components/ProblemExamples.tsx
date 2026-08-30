import React from 'react';
import { Problem } from '@/types/problem';
import { ListChecks, AlertCircle, Layers } from 'lucide-react';
import { FormattedText, renderInlineMarkdown } from '@/components/FormattedText';

interface ProblemExamplesProps {
  problem: Problem;
}

export const ProblemExamples: React.FC<ProblemExamplesProps> = ({ problem }) => {
  return (
    <div className="space-y-6">
      {/* Examples Block */}
      {problem.examples && problem.examples.length > 0 && (
        <div className="rounded-xl border-[1.5px] border-charcoal bg-surface p-6 shadow-hard space-y-4">
          <h3 className="font-display text-lg sm:text-xl font-bold lowercase text-charcoal flex items-center gap-2.5">
            <ListChecks className="w-5 h-5 text-marker-orange" />
            <span>examples & test cases</span>
          </h3>

          <div className="space-y-4">
            {problem.examples.map((ex, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-outline/40 bg-dew-drop p-4 space-y-2.5 text-xs sm:text-sm font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-marker-orange uppercase text-xs">
                    Example {idx + 1}
                  </span>
                </div>

                {ex.input && (
                  <div>
                    <span className="text-on-surface-variant font-bold block text-xs mb-1">
                      input:
                    </span>
                    <pre className="p-3 rounded-md bg-cream-paper border border-outline/30 overflow-x-auto text-charcoal text-xs sm:text-sm leading-relaxed">
                      {ex.input}
                    </pre>
                  </div>
                )}

                {ex.output && (
                  <div>
                    <span className="text-on-surface-variant font-bold block text-xs mb-1">
                      output:
                    </span>
                    <pre className="p-3 rounded-md bg-cream-paper border border-outline/30 overflow-x-auto text-charcoal font-bold text-xs sm:text-sm leading-relaxed">
                      {ex.output}
                    </pre>
                  </div>
                )}

                {ex.explanation && (
                  <div className="pt-1.5 text-on-surface-variant font-sans text-sm leading-relaxed">
                    <strong className="font-mono text-cocoa-ink font-bold">Explanation: </strong>
                    <span className="text-cocoa-ink">{renderInlineMarkdown(ex.explanation)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints Block */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div className="rounded-xl border-[1.5px] border-charcoal bg-surface p-6 shadow-hard space-y-3.5">
          <h3 className="font-display text-lg sm:text-xl font-bold lowercase text-charcoal flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-marker-orange" />
            <span>constraints & limits</span>
          </h3>

          <ul className="space-y-2 text-sm font-mono text-cocoa-ink">
            {problem.constraints.map((c, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-marker-orange font-bold text-base mt-0.5">•</span>
                <span className="bg-dew-drop px-3 py-1 rounded-md border border-outline/30">
                  {renderInlineMarkdown(c)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* High-level Approach Strategy from MD */}
      {problem.approachOverview && (
        <div className="rounded-xl border-[1.5px] border-charcoal bg-surface p-6 shadow-hard space-y-3.5">
          <h3 className="font-display text-lg sm:text-xl font-bold lowercase text-charcoal flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-marker-orange" />
            <span>step-by-step algorithm approach</span>
          </h3>

          <div className="bg-dew-drop p-4 rounded-lg border border-outline/30">
            <FormattedText
              text={problem.approachOverview}
              className="font-sans text-sm sm:text-base leading-relaxed text-cocoa-ink"
            />
          </div>
        </div>
      )}
    </div>
  );
};
