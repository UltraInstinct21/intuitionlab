import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, Check, Save, Cloud, Lock, User, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ProblemNotesProps {
  problemId: string;
  onOpenAuthModal?: () => void;
}

const MAX_NOTE_LENGTH = 250;

export const ProblemNotes: React.FC<ProblemNotesProps> = ({ problemId, onOpenAuthModal }) => {
  const { user, isConfigured } = useAuth();
  const [note, setNote] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadNote = async () => {
      if (!user) {
        setNote('');
        return;
      }

      setIsFetching(true);
      if (isConfigured) {
        try {
          const { data } = await supabase
            .from('problem_notes')
            .select('content')
            .eq('user_id', user.id)
            .eq('problem_id', problemId)
            .maybeSingle();

          if (isMounted) {
            setNote(data?.content || '');
          }
        } catch (err) {
          console.warn('Could not fetch cloud note:', err);
        }
      }
      if (isMounted) {
        setIsFetching(false);
      }
    };

    loadNote();
    setIsSaved(false);

    return () => {
      isMounted = false;
    };
  }, [problemId, user, isConfigured]);

  const handleSave = async () => {
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    setLoading(true);
    if (isConfigured) {
      try {
        await supabase.from('problem_notes').upsert(
          {
            user_id: user.id,
            problem_id: problemId,
            content: note.slice(0, MAX_NOTE_LENGTH),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,problem_id' }
        );
      } catch (err) {
        console.error('Failed to sync note to Supabase:', err);
      }
    }

    setLoading(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);
    if (isConfigured) {
      try {
        await supabase
          .from('problem_notes')
          .delete()
          .eq('user_id', user.id)
          .eq('problem_id', problemId);
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
    setNote('');
    setLoading(false);
  };

  const charsCount = note.length;
  const isNearLimit = charsCount >= 220 && charsCount < MAX_NOTE_LENGTH;
  const isAtLimit = charsCount >= MAX_NOTE_LENGTH;

  // If user is not logged in, lock notes behind Sign In CTA
  if (!user) {
    return (
      <div className="rounded-2xl border-[1.5px] border-charcoal bg-surface p-6 shadow-hard space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PenLine className="w-5 h-5 text-marker-orange" />
            <h3 className="font-display text-lg sm:text-xl font-bold lowercase text-charcoal">
              personal notes & scratchpad
            </h3>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-pill bg-dew-drop border border-outline/30 text-on-surface-variant font-bold">
            <Lock className="w-3 h-3 text-marker-orange" />
            <span>sign in required</span>
          </span>
        </div>

        <div className="p-6 rounded-xl bg-dew-drop border border-dashed border-charcoal/40 text-center space-y-3.5">
          <div className="w-11 h-11 rounded-full bg-primary-container border border-charcoal flex items-center justify-center mx-auto text-on-primary-container shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-base font-bold text-charcoal">Cloud Synced Notes (Limit 250 Chars)</h4>
            <p className="text-xs font-mono text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Personal notes are saved securely in your private cloud account. Please sign in to write and access your notes for this problem.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={onOpenAuthModal}
            className="h-9 px-4 text-xs font-mono font-bold flex items-center gap-1.5 mx-auto shadow-hard"
          >
            <User className="w-3.5 h-3.5" />
            <span>sign in to access notes</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-[1.5px] border-charcoal bg-surface p-6 shadow-hard space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <PenLine className="w-5 h-5 text-marker-orange" />
          <h3 className="font-display text-lg sm:text-xl font-bold lowercase text-charcoal">
            personal notes & scratchpad
          </h3>
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-pill bg-dew-drop border border-outline/30 text-on-surface-variant font-bold">
            <Cloud className="w-3 h-3 text-sprout-sticker" />
            <span>cloud synced</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* 250 Character Countdown Badge */}
          <div
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded-pill border transition-all ${
              isAtLimit
                ? 'bg-red-100 text-red-700 border-red-400 font-black animate-pulse'
                : isNearLimit
                ? 'bg-amber-100 text-amber-800 border-amber-400'
                : 'bg-dew-drop text-charcoal border-outline/30'
            }`}
          >
            <span>{charsCount} / {MAX_NOTE_LENGTH} chars</span>
            {isAtLimit && <span className="ml-1 text-[10px]">(limit reached)</span>}
          </div>

          {note && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-1.5 rounded-lg border border-outline/30 text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <Button
            size="sm"
            variant="primary"
            onClick={handleSave}
            disabled={loading || isFetching}
            className="h-8 px-3 text-xs md:text-sm flex items-center gap-1.5"
          >
            {isSaved ? <Check className="w-4 h-4 text-sprout-sticker" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'saved!' : 'save note'}</span>
          </Button>
        </div>
      </div>

      <textarea
        rows={4}
        maxLength={MAX_NOTE_LENGTH}
        value={note}
        disabled={isFetching}
        onChange={e => {
          setNote(e.target.value.slice(0, MAX_NOTE_LENGTH));
          setIsSaved(false);
        }}
        placeholder={isFetching ? 'Loading note from cloud...' : 'Write your core intuition, edge cases, or interview tips here (max 250 characters)...'}
        className="w-full p-4 rounded-lg bg-dew-drop border border-outline/40 text-sm md:text-base font-mono text-charcoal placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary resize-y leading-relaxed"
      />
    </div>
  );
};
