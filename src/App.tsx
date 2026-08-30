import React, { useState, useEffect, useCallback } from 'react';
import problemsData from '@/data/problems.json';
import topicsData from '@/data/topics.json';
import { Problem, Topic } from '@/types/problem';
import { PaperShaderBackground } from '@/components/PaperShaderBackground';
import { TopicSidebar } from '@/components/TopicSidebar';
import { Header } from '@/components/Header';
import { ProblemHero } from '@/components/ProblemHero';
import { DiagramVisualizer } from '@/components/DiagramVisualizer';
import { CodeViewer } from '@/components/CodeViewer';
import { ProblemExamples } from '@/components/ProblemExamples';
import { ProblemNotes } from '@/components/ProblemNotes';
import { FooterNav } from '@/components/FooterNav';

export const App: React.FC = () => {
  const problems: Problem[] = problemsData as Problem[];
  const topics: Topic[] = topicsData as Topic[];

  // Selected Problem ID
  const [currentProblemId, setCurrentProblemId] = useState<string>(() => {
    const saved = localStorage.getItem('intuitionlab_current_problem') || localStorage.getItem('superr_current_problem');
    if (saved && problems.some(p => p.id === saved)) {
      return saved;
    }
    return problems[0]?.id || '';
  });

  // Mobile sidebar open state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Solved & Bookmarked sets stored in localStorage
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('intuitionlab_solved_problems') || localStorage.getItem('superr_solved_problems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('intuitionlab_bookmarked_problems') || localStorage.getItem('superr_bookmarked_problems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current problem index
  const currentIndex = problems.findIndex(p => p.id === currentProblemId);
  const currentProblem = problems[currentIndex] || problems[0];
  const prevProblem = currentIndex > 0 ? problems[currentIndex - 1] : undefined;
  const nextProblem = currentIndex < problems.length - 1 ? problems[currentIndex + 1] : undefined;

  // Persist current problem
  useEffect(() => {
    if (currentProblemId) {
      localStorage.setItem('intuitionlab_current_problem', currentProblemId);
      const mainElem = document.getElementById('main-content-canvas');
      if (mainElem) mainElem.scrollTop = 0;
    }
  }, [currentProblemId]);

  const handleSelectProblem = (id: string) => {
    setCurrentProblemId(id);
  };

  const handlePrev = useCallback(() => {
    if (prevProblem) {
      setCurrentProblemId(prevProblem.id);
    }
  }, [prevProblem]);

  const handleNext = useCallback(() => {
    if (nextProblem) {
      setCurrentProblemId(nextProblem.id);
    }
  }, [nextProblem]);

  const handleRandom = useCallback(() => {
    const randomIdx = Math.floor(Math.random() * problems.length);
    setCurrentProblemId(problems[randomIdx].id);
  }, [problems]);

  const handleToggleSolved = useCallback(() => {
    setSolvedIds(prev => {
      const next = prev.includes(currentProblem.id)
        ? prev.filter(id => id !== currentProblem.id)
        : [...prev, currentProblem.id];
      localStorage.setItem('intuitionlab_solved_problems', JSON.stringify(next));
      return next;
    });
  }, [currentProblem.id]);

  const handleToggleBookmarked = useCallback(() => {
    setBookmarkedIds(prev => {
      const next = prev.includes(currentProblem.id)
        ? prev.filter(id => id !== currentProblem.id)
        : [...prev, currentProblem.id];
      localStorage.setItem('intuitionlab_bookmarked_problems', JSON.stringify(next));
      return next;
    });
  }, [currentProblem.id]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleToggleSolved();
      } else if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleBookmarked();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleRandom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, handleToggleSolved, handleToggleBookmarked, handleRandom]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface text-on-surface">
      {/* Dynamic Tactile Paper WebGL Shader Background */}
      <PaperShaderBackground />

      {/* Topic Browser Sidebar */}
      <TopicSidebar
        topics={topics}
        problems={problems}
        currentProblemId={currentProblemId}
        onSelectProblem={handleSelectProblem}
        solvedProblemIds={solvedIds}
        bookmarkedProblemIds={bookmarkedIds}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Bar */}
        <Header
          problem={currentProblem}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onPrevProblem={handlePrev}
          onNextProblem={handleNext}
          onRandomProblem={handleRandom}
          isSolved={solvedIds.includes(currentProblem.id)}
          isBookmarked={bookmarkedIds.includes(currentProblem.id)}
          onToggleSolved={handleToggleSolved}
          onToggleBookmarked={handleToggleBookmarked}
          currentIndex={currentIndex}
          totalProblems={problems.length}
        />

        {/* Scrollable Problem Content (Expanded to Max Width Available) */}
        <main
          id="main-content-canvas"
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 space-y-8 w-full max-w-[1800px] mx-auto"
        >
          {/* Hero Section */}
          <ProblemHero problem={currentProblem} />

          {/* Interactive Diagrams Section */}
          <DiagramVisualizer problem={currentProblem} />

          {/* Two-Column Grid: Code Editor on Right, Examples & Notes on Left */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Left Column: Examples, Constraints & Notes (6-7 cols on xl) */}
            <div className="xl:col-span-6 2xl:col-span-6 space-y-8">
              <ProblemExamples problem={currentProblem} />
              <ProblemNotes problemId={currentProblem.id} />
            </div>

            {/* Right Column: Code Viewer & Language Switcher (6 cols on xl) */}
            <div className="xl:col-span-6 2xl:col-span-6 sticky top-4">
              <CodeViewer problem={currentProblem} />
            </div>
          </div>
        </main>

        {/* Sticky Bottom Navigation Footer */}
        <FooterNav
          prevProblem={prevProblem}
          nextProblem={nextProblem}
          onPrev={handlePrev}
          onNext={handleNext}
          currentIndex={currentIndex}
          totalProblems={problems.length}
        />
      </div>
    </div>
  );
};

export default App;
