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
import { LandingPage } from '@/components/LandingPage';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { AuthModal } from '@/components/auth/AuthModal';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const MainApp: React.FC = () => {
  const problems: Problem[] = problemsData as Problem[];
  const topics: Topic[] = topicsData as Topic[];

  // View state: 'landing' vs 'notebook'
  const [currentView, setCurrentView] = useState<'landing' | 'notebook'>(() => {
    const savedView = localStorage.getItem('intuitionlab_view_mode');
    return (savedView === 'notebook' || savedView === 'landing') ? savedView : 'landing';
  });

  // Selected Problem ID
  const [currentProblemId, setCurrentProblemId] = useState<string>(() => {
    const saved = localStorage.getItem('intuitionlab_current_problem') || localStorage.getItem('superr_current_problem');
    if (saved && problems.some(p => p.id === saved)) {
      return saved;
    }
    return problems[0]?.id || '';
  });

  // Selected Approach Index (synced across diagrams & code viewer)
  const [selectedApproachIndex, setSelectedApproachIndex] = useState<number>(0);

  // Mobile sidebar open state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

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

  // When problem changes, auto-select optimal approach
  useEffect(() => {
    if (currentProblem?.approaches && currentProblem.approaches.length > 0) {
      setSelectedApproachIndex(currentProblem.approaches.length - 1);
    } else {
      setSelectedApproachIndex(0);
    }
  }, [currentProblem?.id, currentProblem?.approaches?.length]);

  // Persist current problem & view mode
  useEffect(() => {
    if (currentProblemId) {
      localStorage.setItem('intuitionlab_current_problem', currentProblemId);
      const mainElem = document.getElementById('main-content-canvas');
      if (mainElem) mainElem.scrollTop = 0;
    }
  }, [currentProblemId]);

  useEffect(() => {
    localStorage.setItem('intuitionlab_view_mode', currentView);
  }, [currentView]);

  const handleSelectProblem = (id: string) => {
    setCurrentProblemId(id);
  };

  const handleOpenNotebook = (problemId?: string) => {
    if (problemId && problems.some(p => p.id === problemId)) {
      setCurrentProblemId(problemId);
    }
    setCurrentView('notebook');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevProblem = useCallback(() => {
    if (prevProblem) {
      setCurrentProblemId(prevProblem.id);
    }
  }, [prevProblem]);

  const handleNextProblem = useCallback(() => {
    if (nextProblem) {
      setCurrentProblemId(nextProblem.id);
    }
  }, [nextProblem]);

  const handleRandomProblem = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * problems.length);
    const randomProblem = problems[randomIndex];
    if (randomProblem) {
      setCurrentProblemId(randomProblem.id);
    }
  }, [problems]);

  const handleToggleSolved = useCallback(() => {
    setSolvedIds(prev => {
      const isCurrentlySolved = prev.includes(currentProblem.id);
      const updated = isCurrentlySolved
        ? prev.filter(id => id !== currentProblem.id)
        : [...prev, currentProblem.id];
      localStorage.setItem('intuitionlab_solved_problems', JSON.stringify(updated));
      return updated;
    });
  }, [currentProblem?.id]);

  const handleToggleBookmarked = useCallback(() => {
    setBookmarkedIds(prev => {
      const isCurrentlyBookmarked = prev.includes(currentProblem.id);
      const updated = isCurrentlyBookmarked
        ? prev.filter(id => id !== currentProblem.id)
        : [...prev, currentProblem.id];
      localStorage.setItem('intuitionlab_bookmarked_problems', JSON.stringify(updated));
      return updated;
    });
  }, [currentProblem?.id]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    if (currentView !== 'notebook') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when inside inputs or textareas
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextProblem();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevProblem();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleToggleSolved();
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        handleToggleBookmarked();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRandomProblem();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, handleNextProblem, handlePrevProblem, handleToggleSolved, handleToggleBookmarked, handleRandomProblem]);

  const isCurrentSolved = solvedIds.includes(currentProblem?.id);
  const isCurrentBookmarked = bookmarkedIds.includes(currentProblem?.id);

  if (currentView === 'landing') {
    return (
      <div className="relative min-h-screen bg-surface selection:bg-marker-orange selection:text-white">
        <PaperShaderBackground />
        <AnnouncementBanner />
        <LandingPage
          problems={problems}
          topics={topics}
          solvedCount={solvedIds.length}
          onOpenNotebook={handleOpenNotebook}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        <AdminDashboard
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-surface selection:bg-marker-orange selection:text-white">
      {/* 3D Paper Shader Background */}
      <PaperShaderBackground />

      {/* Desktop & Mobile Sidebar Navigation */}
      <TopicSidebar
        topics={topics}
        problems={problems}
        currentProblemId={currentProblemId}
        onSelectProblem={handleSelectProblem}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        solvedProblemIds={solvedIds}
        bookmarkedProblemIds={bookmarkedIds}
      />

      {/* Main App Canvas */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Global Announcement Banner */}
        <AnnouncementBanner />

        {/* Sticky Header */}
        <Header
          problem={currentProblem}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onPrevProblem={handlePrevProblem}
          onNextProblem={handleNextProblem}
          onRandomProblem={handleRandomProblem}
          onNavigateHome={handleNavigateHome}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          isSolved={isCurrentSolved}
          isBookmarked={isCurrentBookmarked}
          onToggleSolved={handleToggleSolved}
          onToggleBookmarked={handleToggleBookmarked}
          currentIndex={currentIndex}
          totalProblems={problems.length}
        />

        {/* Scrollable Notebook Workspace */}
        <main
          id="main-content-canvas"
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 space-y-8 scroll-smooth"
        >
          {/* Problem Hero & Metadata */}
          <ProblemHero problem={currentProblem} />

          {/* Dual Column Layout: Interactive Visualizer & Code Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: Step-by-Step Visualizer */}
            <div className="w-full">
              <DiagramVisualizer
                problem={currentProblem}
                selectedApproachIndex={selectedApproachIndex}
                onSelectApproach={setSelectedApproachIndex}
              />
            </div>

            {/* Right: Code Viewer */}
            <div className="w-full">
              <CodeViewer
                problem={currentProblem}
                selectedApproachIndex={selectedApproachIndex}
                onSelectApproach={setSelectedApproachIndex}
              />
            </div>
          </div>

          {/* Test Cases & Constraints */}
          <ProblemExamples problem={currentProblem} />

          {/* Personal Scratchpad & Notes (Strict 250-char max & Supabase Cloud Sync) */}
          <ProblemNotes
            problemId={currentProblem.id}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />

          {/* Bottom Footer Navigation */}
          <FooterNav
            prevProblem={prevProblem}
            nextProblem={nextProblem}
            onPrev={handlePrevProblem}
            onNext={handleNextProblem}
            currentIndex={currentIndex}
            totalProblems={problems.length}
          />
        </main>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <AdminDashboard
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <MainApp />
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
