import React, { useState } from 'react';
import { Problem, ProblemApproach } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { Check, Copy, Clock, HardDrive, Terminal } from 'lucide-react';
import { renderInlineMarkdown } from '@/components/FormattedText';

interface CodeViewerProps {
  problem: Problem;
  selectedApproachIndex?: number;
  onSelectApproach?: (index: number) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  problem,
  selectedApproachIndex: externalApproachIndex,
  onSelectApproach,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'cpp'>('python');
  const [internalApproachIndex, setInternalApproachIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedApproachIndex =
    externalApproachIndex !== undefined ? externalApproachIndex : internalApproachIndex;

  const handleSelectApproach = (idx: number) => {
    if (onSelectApproach) {
      onSelectApproach(idx);
    } else {
      setInternalApproachIndex(idx);
    }
  };

  const currentApproach: ProblemApproach | undefined =
    problem.approaches[selectedApproachIndex] || problem.approaches[0];

  const rawCode =
    selectedLanguage === 'python'
      ? currentApproach?.pythonCode || '# Python code available under other approach tab'
      : currentApproach?.cppCode || '// C++ code available under other approach tab';

  // Normalize line endings and split cleanly into vertical lines
  const normalizedCode = rawCode.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedCode.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(normalizedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col rounded-xl border-[1.5px] border-charcoal bg-inverse-surface text-inverse-on-surface shadow-hard-lg overflow-hidden w-full">
      {/* Top Header: Approaches Tabs & Language Switcher */}
      <div className="bg-[#1c1917] border-b border-charcoal/80 p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Approach Selector Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {problem.approaches.map((app, idx) => {
            const isSelected = idx === selectedApproachIndex;
            return (
              <button
                key={idx}
                onClick={() => handleSelectApproach(idx)}
                className={`px-3 py-1.5 text-xs md:text-sm font-bold rounded-md transition-all lowercase ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container border-[1.5px] border-charcoal shadow-sm scale-105'
                    : 'bg-[#2b2725] text-[#d6ccc2] hover:bg-[#383330] border border-transparent'
                }`}
              >
                {app.name || `Approach ${idx + 1}`}
              </button>
            );
          })}
        </div>

        {/* Language Tabs & Copy Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <div className="flex items-center bg-[#292524] rounded-lg p-1 border border-charcoal">
            <button
              onClick={() => setSelectedLanguage('python')}
              className={`px-3 py-1 text-xs md:text-sm font-bold rounded-md transition-all lowercase ${
                selectedLanguage === 'python'
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-[#a8a29e] hover:text-white'
              }`}
            >
              python 3
            </button>
            <button
              onClick={() => setSelectedLanguage('cpp')}
              className={`px-3 py-1 text-xs md:text-sm font-bold rounded-md transition-all lowercase ${
                selectedLanguage === 'cpp'
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-[#a8a29e] hover:text-white'
              }`}
            >
              c++
            </button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-9 px-3 bg-[#292524] border border-charcoal text-inverse-on-surface hover:bg-[#3d3835] rounded-md text-xs md:text-sm font-bold flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-sprout-sticker" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'copied!' : 'copy code'}</span>
          </Button>
        </div>
      </div>

      {/* Code Header Info: Approach Description & Complexities */}
      {currentApproach && (
        <div className="bg-[#24201e] px-4 py-3 border-b border-charcoal/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs md:text-sm">
          <div className="text-[#e7e5e4] font-sans font-medium">
            <strong className="text-marker-orange uppercase font-mono tracking-wider mr-2 text-xs">
              {currentApproach.name}:
            </strong>
            <span>{renderInlineMarkdown(currentApproach.description)}</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-[#d6ccc2] flex-shrink-0">
            <span className="flex items-center gap-1 bg-[#1c1917] px-2.5 py-1 rounded border border-charcoal">
              <Clock className="w-3.5 h-3.5 text-marker-orange" />
              <span>Time: <strong className="text-white">{currentApproach.timeComplexity}</strong></span>
            </span>
            <span className="flex items-center gap-1 bg-[#1c1917] px-2.5 py-1 rounded border border-charcoal">
              <HardDrive className="w-3.5 h-3.5 text-sky-sticker" />
              <span>Space: <strong className="text-white">{currentApproach.spaceComplexity}</strong></span>
            </span>
          </div>
        </div>
      )}

      {/* Clean Top-to-Bottom Vertical Code Display */}
      <div className="relative font-mono text-xs md:text-sm overflow-x-auto p-4 max-h-[600px] overflow-y-auto leading-relaxed selection:bg-marker-orange selection:text-white">
        <div className="flex flex-col min-w-full">
          {lines.map((line, lineIndex) => (
            <div
              key={lineIndex}
              className="flex items-start hover:bg-white/[0.04] transition-colors py-0.5 group w-full"
            >
              <span className="w-10 pr-4 select-none text-right text-[#78716c] text-xs opacity-60 group-hover:opacity-100 flex-shrink-0">
                {lineIndex + 1}
              </span>
              <span className="text-[#f5f5f4] whitespace-pre font-mono flex-1">
                {line || ' '}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Code Footer: Solution info */}
      <div className="bg-[#1c1917] px-4 py-2 border-t border-charcoal/80 flex items-center justify-between text-[11px] font-mono text-[#a8a29e]">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-marker-orange" />
          <span>interview-ready canonical solution • {selectedLanguage.toUpperCase()}</span>
        </div>
        <span>{lines.length} lines</span>
      </div>
    </div>
  );
};
