import React, { useState, useEffect } from 'react';
import { Problem, ProblemApproach } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { Check, Copy, Clock, HardDrive, Terminal } from 'lucide-react';
import { renderInlineMarkdown } from '@/components/FormattedText';

interface CodeViewerProps {
  problem: Problem;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ problem }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'cpp'>('python');
  const [selectedApproachIndex, setSelectedApproachIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // When problem changes, auto-select the optimal / highest approach index
  useEffect(() => {
    if (problem.approaches && problem.approaches.length > 0) {
      setSelectedApproachIndex(problem.approaches.length - 1);
    } else {
      setSelectedApproachIndex(0);
    }
  }, [problem.id, problem.approaches.length]);

  const currentApproach: ProblemApproach | undefined =
    problem.approaches[selectedApproachIndex] || problem.approaches[0];

  const currentCode =
    selectedLanguage === 'python'
      ? currentApproach?.pythonCode || '# Python code available under other approach tab'
      : currentApproach?.cppCode || '// C++ code available under other approach tab';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = currentCode.split('\n');

  return (
    <div className="flex flex-col rounded-xl border-[1.5px] border-charcoal bg-inverse-surface text-inverse-on-surface shadow-hard-lg overflow-hidden w-full">
      {/* Top Header: Approaches Tabs & Language Switcher */}
      <div className="bg-[#1c1917] border-b border-charcoal/80 p-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Approach Selector Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {problem.approaches.map((app, idx) => {
            const isSelected = idx === selectedApproachIndex;
            return (
              <button
                key={idx}
                onClick={() => setSelectedApproachIndex(idx)}
                className={`px-3.5 py-1.5 text-xs md:text-sm font-bold rounded-pill transition-all lowercase ${
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
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-[#292524] rounded-pill p-1 border border-charcoal">
            <button
              onClick={() => setSelectedLanguage('python')}
              className={`px-3.5 py-1 text-xs md:text-sm font-bold rounded-pill transition-all lowercase ${
                selectedLanguage === 'python'
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-[#a8a29e] hover:text-white'
              }`}
            >
              python 3
            </button>
            <button
              onClick={() => setSelectedLanguage('cpp')}
              className={`px-3.5 py-1 text-xs md:text-sm font-bold rounded-pill transition-all lowercase ${
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
            className="h-9 px-3.5 bg-[#292524] border border-charcoal text-inverse-on-surface hover:bg-[#3d3835] rounded-pill text-xs md:text-sm font-bold flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-sprout-sticker" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'copied!' : 'copy code'}</span>
          </Button>
        </div>
      </div>

      {/* Complexity & Metadata Bar */}
      {currentApproach && (
        <div className="bg-[#24201e] px-4 py-2.5 border-b border-charcoal/60 flex flex-wrap items-center justify-between text-xs md:text-sm gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#feddbe]">
              <Clock className="w-4 h-4 text-marker-orange" />
              <span className="font-mono font-bold">Time: {currentApproach.timeComplexity || 'O(N)'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#feddbe]">
              <HardDrive className="w-4 h-4 text-sky-sticker" />
              <span className="font-mono font-bold">Space: {currentApproach.spaceComplexity || 'O(1)'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#a8a29e]">
            <Terminal className="w-3.5 h-3.5 text-marker-orange" />
            <span>{selectedLanguage === 'python' ? 'Python 3.11+' : 'C++20 std::vector'}</span>
          </div>
        </div>
      )}

      {/* Code Area with Line Numbers */}
      <div className="relative p-4 md:p-6 font-mono text-sm md:text-base leading-relaxed overflow-x-auto min-h-[450px] max-h-[700px]">
        <div className="flex gap-4">
          {/* Line Numbers Column */}
          <div className="select-none text-right text-xs md:text-sm text-[#78716c] pr-3 border-r border-[#44403c] font-mono shrink-0">
            {lines.map((_, i) => (
              <div key={i} className="leading-relaxed">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Actual Code Column */}
          <pre className="text-[#f5ebe0] overflow-x-auto flex-1 font-mono leading-relaxed">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>

      {/* Approach Detailed Explanation */}
      {currentApproach?.description && (
        <div className="bg-[#1c1917] p-4 md:p-5 border-t border-charcoal text-xs md:text-sm text-[#d5bdaf] space-y-1.5">
          <span className="font-bold text-marker-orange block font-mono text-xs uppercase tracking-wider">
            💡 Approach Strategy:
          </span>
          <p className="font-sans leading-relaxed text-sm md:text-base text-[#e6ccb2]">
            {renderInlineMarkdown(currentApproach.description)}
          </p>
        </div>
      )}
    </div>
  );
};
