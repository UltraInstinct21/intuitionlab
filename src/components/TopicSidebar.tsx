import React, { useState, useEffect, useRef } from 'react';
import { Topic, Problem } from '@/types/problem';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  CheckCircle2,
  Bookmark,
  ChevronDown,
  ChevronRight,
  BookOpen,
  X,
} from 'lucide-react';

interface TopicSidebarProps {
  topics: Topic[];
  problems: Problem[];
  currentProblemId: string;
  onSelectProblem: (problemId: string) => void;
  solvedProblemIds: string[];
  bookmarkedProblemIds: string[];
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const TopicSidebar: React.FC<TopicSidebarProps> = ({
  topics,
  problems,
  currentProblemId,
  onSelectProblem,
  solvedProblemIds,
  bookmarkedProblemIds,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [filterMode, setFilterMode] = useState<'all' | 'solved' | 'bookmarked'>('all');

  // Auto-expand the topic corresponding to the active currentProblemId
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(() => {
    const activeTopicId =
      problems.find(p => p.id === currentProblemId)?.topicFolder ||
      currentProblemId?.split('/')[0] ||
      '01_Arrays';
    return { [activeTopicId]: true };
  });

  // Whenever currentProblemId changes, keep the active topic expanded & scroll into view
  useEffect(() => {
    if (currentProblemId) {
      const activeProblem = problems.find(p => p.id === currentProblemId);
      const activeTopicId = activeProblem?.topicFolder || currentProblemId.split('/')[0];

      if (activeTopicId) {
        setExpandedTopics(prev => ({
          ...prev,
          [activeTopicId]: true,
        }));
      }

      // Smooth scroll active problem into sidebar view
      const timer = setTimeout(() => {
        const activeElem = document.getElementById(`sidebar-problem-${currentProblemId}`);
        if (activeElem) {
          activeElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentProblemId, problems]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const totalProblemsCount = problems.length;
  const totalSolvedCount = solvedProblemIds.length;
  const progressPercent = Math.round((totalSolvedCount / (totalProblemsCount || 1)) * 100);

  // Filter problems by search & difficulty
  const isProblemMatching = (p: { title: string; number: number | null; difficulty: string; tags: string[]; id: string }) => {
    if (filterMode === 'solved' && !solvedProblemIds.includes(p.id)) return false;
    if (filterMode === 'bookmarked' && !bookmarkedProblemIds.includes(p.id)) return false;
    if (selectedDifficulty !== 'All' && p.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const matchesTitle = p.title.toLowerCase().includes(q);
    const matchesNum = p.number ? p.number.toString().includes(q) : false;
    const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));

    return matchesTitle || matchesNum || matchesTags;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col h-full w-[85vw] max-w-xs sm:w-80 lg:w-88 bg-surface-container-low border-r border-charcoal/30 shadow-[2px_0_0_0_rgba(23,23,23,0.06)] transition-transform duration-300 ease-in-out shrink-0 overflow-hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Top Header */}
        <div className="p-3.5 sm:p-4 border-b border-outline/30 bg-dew-drop">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary-container flex items-center justify-center border-[1.5px] border-charcoal shadow-xs">
                <BookOpen className="w-4 h-4 text-on-primary-container" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold lowercase text-charcoal tracking-tight">
                notebook topics
              </h2>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-md text-on-surface-variant hover:bg-surface-container-high md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-on-surface-variant font-medium">Sheet Mastery</span>
              <span className="font-bold text-charcoal">
                {totalSolvedCount} / {totalProblemsCount} ({progressPercent}%)
              </span>
            </div>
            <div className="h-2 w-full bg-surface-container-high rounded overflow-hidden border border-outline/30">
              <div
                className="h-full bg-marker-orange rounded transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-3 border-b border-outline/30 bg-surface space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search problems, #number, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs font-mono rounded-md border border-outline/40 bg-dew-drop text-charcoal placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-on-surface-variant hover:text-charcoal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {['All', 'Easy', 'Med', 'Hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d === 'Med' ? 'Medium' : d)}
                  className={`px-2.5 py-1 rounded-md font-mono text-xs font-semibold transition-all lowercase ${
                    (selectedDifficulty === d || (d === 'Med' && selectedDifficulty === 'Medium'))
                      ? 'bg-primary-container text-on-primary-container border-[1.5px] border-charcoal shadow-xs font-bold'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-dew-drop'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterMode(filterMode === 'solved' ? 'all' : 'solved')}
                className={`p-1.5 rounded-md transition-all ${
                  filterMode === 'solved'
                    ? 'bg-sprout-sticker text-white border-[1.5px] border-charcoal shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                title="Filter Solved"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFilterMode(filterMode === 'bookmarked' ? 'all' : 'bookmarked')}
                className={`p-1.5 rounded-md transition-all ${
                  filterMode === 'bookmarked'
                    ? 'bg-marker-orange text-white border-[1.5px] border-charcoal shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                title="Filter Bookmarked"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Topics & Problems List */}
        <div id="sidebar-scroll-container" className="flex-1 overflow-y-auto p-2.5 space-y-2 notebook-ruled-bg">
          {topics.map(topic => {
            const matchingProblems = topic.problems.filter(isProblemMatching);
            if (searchQuery && matchingProblems.length === 0) return null;

            const isExpanded = expandedTopics[topic.id] ?? false;
            const topicSolvedCount = topic.problems.filter(p => solvedProblemIds.includes(p.id)).length;

            return (
              <div
                key={topic.id}
                id={`sidebar-topic-${topic.id}`}
                className="rounded-lg border-[1.5px] border-outline/50 bg-surface/95 overflow-hidden shadow-xs"
              >
                {/* Topic Header Accordion Button */}
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-dew-drop transition-colors select-none"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-marker-orange shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-on-surface-variant shrink-0" />
                    )}
                    <span className="font-display font-bold text-sm lowercase truncate text-charcoal">
                      {topic.index}. {topic.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    <span className="text-[11px] font-mono font-medium text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md border border-outline/20">
                      {topicSolvedCount}/{topic.count}
                    </span>
                  </div>
                </button>

                {/* Topic Problem Items */}
                {isExpanded && (
                  <div className="px-2.5 pb-2.5 pt-1 border-t border-outline/20 space-y-1">
                    {matchingProblems.map(p => {
                      const isSelected = p.id === currentProblemId;
                      const isSolved = solvedProblemIds.includes(p.id);
                      const isBookmarked = bookmarkedProblemIds.includes(p.id);

                      return (
                        <button
                          key={p.id}
                          id={`sidebar-problem-${p.id}`}
                          onClick={() => {
                            onSelectProblem(p.id);
                            onCloseMobile();
                          }}
                          className={`w-full px-3 py-2 rounded-md flex items-center justify-between text-left transition-all text-xs md:text-sm font-sans ${
                            isSelected
                              ? 'bg-secondary-container text-on-secondary-container font-bold border-[1.5px] border-charcoal shadow-hard scale-[1.01]'
                              : 'hover:bg-dew-drop text-charcoal'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono text-[11px] text-on-surface-variant shrink-0 font-medium">
                              {p.number ? `#${p.number}` : '•'}
                            </span>
                            <span className="truncate lowercase">{p.title}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            {isBookmarked && (
                              <Bookmark className="w-3 h-3 text-marker-orange fill-marker-orange" />
                            )}
                            {isSolved && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-sprout-sticker" />
                            )}
                            <Badge
                              variant={
                                p.difficulty.toLowerCase() === 'easy'
                                  ? 'easy'
                                  : p.difficulty.toLowerCase() === 'medium'
                                  ? 'medium'
                                  : 'hard'
                              }
                              className="text-[9px] px-1.5 py-0 h-4 uppercase font-mono"
                            >
                              {p.difficulty[0]}
                            </Badge>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
