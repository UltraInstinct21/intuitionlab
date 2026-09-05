import React, { useState } from 'react';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import {
  Menu,
  Shuffle,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Keyboard,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Shield,
  User,
  LogOut,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface HeaderProps {
  problem: Problem;
  onOpenMobileSidebar: () => void;
  onPrevProblem: () => void;
  onNextProblem: () => void;
  onRandomProblem: () => void;
  onNavigateHome?: () => void;
  onOpenAuthModal?: () => void;
  onOpenAdminModal?: () => void;
  isSolved: boolean;
  isBookmarked: boolean;
  onToggleSolved: () => void;
  onToggleBookmarked: () => void;
  currentIndex: number;
  totalProblems: number;
}

export const Header: React.FC<HeaderProps> = ({
  problem,
  onOpenMobileSidebar,
  onPrevProblem,
  onNextProblem,
  onRandomProblem,
  onNavigateHome,
  onOpenAuthModal,
  onOpenAdminModal,
  isSolved,
  isBookmarked,
  onToggleSolved,
  onToggleBookmarked,
  currentIndex,
  totalProblems,
}) => {
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const { user, profile, isAdmin, signOut } = useAuth();

  const handleSolvedClick = () => {
    onToggleSolved();
    if (!isSolved) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.2 },
        colors: ['#ff6f1e', '#22c55e', '#3b82f6', '#ff66cf', '#2b1a07'],
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b border-charcoal/30 bg-surface/95 px-2.5 sm:px-4 md:px-8 backdrop-blur-xs transition-all w-full max-w-full overflow-x-hidden">
        {/* Left Side: Mobile Menu, Brand Logo, Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-1.5 rounded-md border border-charcoal bg-dew-drop text-charcoal shadow-xs active:scale-95 flex-shrink-0"
            aria-label="Toggle Topic Navigation"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div
            className="flex items-center gap-2 group cursor-pointer flex-shrink-0"
            onClick={onNavigateHome || onRandomProblem}
            title="Return to Home Landing Page"
          >
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-primary-container text-on-primary-container font-extrabold text-xs sm:text-sm border border-charcoal shadow-sm group-hover:rotate-12 transition-transform duration-300">
              <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-on-primary-container" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg font-extrabold lowercase leading-tight text-charcoal tracking-tight">
                intuition<span className="text-marker-orange">lab.</span>
              </span>
              <span className="text-[9px] font-mono text-on-surface-variant hidden sm:inline-block">
                sde sheet ({currentIndex + 1}/{totalProblems})
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-on-surface-variant pl-3 border-l border-outline/30 min-w-0">
            <span className="bg-dew-drop px-2 py-0.5 rounded-md border border-outline/30 flex-shrink-0">
              {problem.topicTitle}
            </span>
            <span>/</span>
            <span className="text-charcoal font-semibold truncate max-w-xs">
              {problem.title}
            </span>
          </div>
        </div>

        {/* Right Side: Quick Action Toolbar & Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Admin Panel Button (Exclusive to Admin Users) */}
          {isAdmin && (
            <Button
              size="sm"
              variant="default"
              onClick={onOpenAdminModal}
              className="h-8 px-2 sm:px-2.5 bg-dew-drop border-2 border-marker-orange text-marker-orange hover:bg-primary-fixed-dim font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs rounded-md"
              title="Open Superadmin Panel"
            >
              <Shield className="w-3.5 h-3.5 fill-marker-orange/20" />
              <span className="hidden sm:inline">admin panel</span>
            </Button>
          )}

          {/* Quick Prev / Next Buttons */}
          <div className="hidden sm:flex items-center border border-charcoal/40 rounded-md bg-dew-drop p-0.5">
            <button
              onClick={onPrevProblem}
              className="p-1 text-charcoal hover:bg-cream-paper rounded transition-all"
              title="Previous Problem (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-on-surface-variant font-bold">
              {currentIndex + 1}
            </span>
            <button
              onClick={onNextProblem}
              className="p-1 text-charcoal hover:bg-cream-paper rounded transition-all"
              title="Next Problem (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Random Problem Button */}
          <Button
            size="sm"
            variant="default"
            onClick={onRandomProblem}
            className="h-8 px-2.5 text-xs rounded-md items-center gap-1.5 hidden md:inline-flex"
            title="Surprise me with a random problem"
          >
            <Shuffle className="w-3.5 h-3.5 text-marker-orange" />
            <span>random</span>
          </Button>

          {/* Bookmark Button */}
          <button
            onClick={onToggleBookmarked}
            className={`p-1.5 sm:p-2 rounded-md border transition-all active:scale-95 ${
              isBookmarked
                ? 'bg-marker-orange text-white border-charcoal shadow-sm'
                : 'border-charcoal/40 bg-dew-drop text-charcoal hover:bg-cream-paper'
            }`}
            title="Bookmark Problem"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
          </button>

          {/* Solved Toggle Button */}
          <Button
            size="sm"
            variant={isSolved ? 'primary' : 'default'}
            onClick={handleSolvedClick}
            className="h-8 px-2 sm:px-3 text-xs flex items-center gap-1.5 rounded-md"
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isSolved ? 'text-white' : 'text-sprout-sticker'}`} />
            <span className="hidden xs:inline">{isSolved ? 'solved!' : 'mark solved'}</span>
          </Button>

          {/* LeetCode Direct Link */}
          <a
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-2 sm:px-2.5 flex items-center gap-1 rounded-md border border-charcoal bg-dew-drop text-charcoal text-xs font-mono font-bold hover:bg-primary-fixed-dim transition-all shadow-xs"
            title="Open on LeetCode"
          >
            <span className="hidden sm:inline">leetcode</span>
            <ExternalLink className="w-3 h-3 text-marker-orange" />
          </a>

          {/* Auth Button: Profile or Sign In */}
          {user ? (
            <div className="flex items-center gap-1 bg-dew-drop p-0.5 rounded-md border border-charcoal">
              <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 text-charcoal truncate max-w-[80px] sm:max-w-[100px]">
                {profile?.username || user.email?.split('@')[0]}
              </span>
              <button
                onClick={signOut}
                className="p-1 text-on-surface-variant hover:text-red-600 rounded transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="default"
              onClick={onOpenAuthModal}
              className="h-8 px-2 sm:px-2.5 text-xs font-mono font-bold flex items-center gap-1 bg-surface border border-charcoal text-charcoal hover:bg-dew-drop rounded-md"
            >
              <User className="w-3.5 h-3.5 text-marker-orange" />
              <span className="hidden xs:inline">sign in</span>
            </Button>
          )}

          {/* Shortcuts Info Dialog Trigger */}
          <button
            onClick={() => setShowShortcuts(true)}
            className="p-1.5 text-on-surface-variant hover:text-charcoal hover:bg-dew-drop rounded-md transition-colors hidden md:inline-flex"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-marker-orange" />
              <span>notebook keyboard shortcuts</span>
            </DialogTitle>
            <DialogDescription>
              Navigate the SDE Sheet smoothly using your keyboard.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 py-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded-md bg-dew-drop border border-outline/30">
              <span>Next Problem</span>
              <kbd className="px-2 py-0.5 rounded bg-cream-paper border border-charcoal font-bold">→</kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-md bg-dew-drop border border-outline/30">
              <span>Previous Problem</span>
              <kbd className="px-2 py-0.5 rounded bg-cream-paper border border-charcoal font-bold">←</kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-md bg-dew-drop border border-outline/30">
              <span>Mark Solved</span>
              <kbd className="px-2 py-0.5 rounded bg-cream-paper border border-charcoal font-bold">S</kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-md bg-dew-drop border border-outline/30">
              <span>Bookmark</span>
              <kbd className="px-2 py-0.5 rounded bg-cream-paper border border-charcoal font-bold">B</kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-md bg-dew-drop border border-outline/30">
              <span>Random Problem</span>
              <kbd className="px-2 py-0.5 rounded bg-cream-paper border border-charcoal font-bold">R</kbd>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
