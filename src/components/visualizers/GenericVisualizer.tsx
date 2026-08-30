import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { StepCard } from './StepCard';
import { Problem } from '@/types/problem';

interface Step { title: string; whatHappens: string; whyRationale: string; variableStates: Record<string, string | number>; codeSnippet: string; }

export const GenericVisualizer: React.FC<{ problem: Problem }> = ({ problem }) => {
  const steps: Step[] = problem.approachOverview
    ? [{ title: 'Intuition', whatHappens: problem.intuition || 'See explanation.', whyRationale: problem.approachOverview, variableStates: {}, codeSnippet: '' }]
    : [{ title: 'No data', whatHappens: 'No approach data available for this problem.', whyRationale: '—', variableStates: {}, codeSnippet: '' }];

  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const reset = () => setCurrentStep(0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="default" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="h-8 px-2.5 text-xs">
            <ChevronLeft className="w-4 h-4" /><span>prev</span>
          </Button>
          <Button size="sm" variant="primary" onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep >= steps.length - 1} className="h-8 px-3 text-xs">
            <span>next</span><ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} className="h-8"><RotateCcw className="w-3.5 h-3.5" /></Button>
        </div>
        <span className="text-xs font-mono font-bold text-on-surface-variant">
          {currentStep + 1} / {steps.length}
        </span>
      </div>

      <StepCard
        stepNumber={currentStep + 1}
        totalSteps={steps.length}
        title={step.title}
        whatHappens={step.whatHappens}
        whyRationale={step.whyRationale}
        variableStates={step.variableStates}
        codeSnippet={step.codeSnippet}
        timeSpaceImpact="See intuition"
      />
    </div>
  );
};