import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';

interface ControlsProps {
  step: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onAutoPlay?: () => void;
  isPlaying?: boolean;
  nextLabel?: string;
  prevLabel?: string;
  resetLabel?: string;
  isStart?: boolean;
  isEnd?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  step,
  totalSteps,
  onPrev,
  onNext,
  onReset,
  onAutoPlay,
  isPlaying,
  nextLabel,
  prevLabel,
  resetLabel,
  isStart,
  isEnd,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-dew-drop p-3.5 rounded-xl border border-outline/30">
      <div className="flex items-center gap-2 flex-wrap">
        {onAutoPlay && (
          <Button
            size="sm"
            variant="primary"
            onClick={onAutoPlay}
            className="flex items-center gap-1.5 text-xs h-8 px-3"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'pause' : 'auto play'}</span>
          </Button>
        )}
        <Button
          size="sm"
          variant="default"
          onClick={onPrev}
          disabled={isStart ?? step === 0}
          className="h-8 px-2.5 text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          {prevLabel && <span className="ml-1">{prevLabel}</span>}
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={onNext}
          disabled={isEnd ?? step === totalSteps - 1}
          className="h-8 px-3 text-xs"
        >
          <span>{nextLabel ?? 'next'}</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onReset} className="h-8">
          {resetLabel ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>{resetLabel}</span>
            </>
          ) : (
            <RotateCcw className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
      <span className="text-xs font-mono font-bold text-on-surface-variant">
        step {step + 1} / {totalSteps}
      </span>
    </div>
  );
};