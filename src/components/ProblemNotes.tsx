import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, Check, Save, Cloud, HardDrive, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ProblemNotesProps {
  problemId: string;
}

const MAX_NOTE_LENGTH = 250;

export const ProblemNotes: React.FC<ProblemNotesProps> = ({ problemId }) => {
  const { user, isConfigured } = useAuth();
  const [note, setNote] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadNote = async () => {
      // Check local storage first
      const localSaved =
        localStorage.getItem(`intuitionlab_notes_${problemId}`) ||
        localStorage.getItem(`superr_notes_${problemId}`);

      if (user && isConfigured) {
        try {
          const { data } = await supabase
            .from('problem_notes')
            .select('content')
            .eq('user_id', user.id)
            .eq('problem_id', problemId)
            .maybeSingle();

          if (isMounted && data?.content !== undefined) {
            setNote(data.content);
            return;
          }
        } catch (err) {
          console.warn('Could not fetch cloud note:', err);
        }
      }

      if (isMounted) {
        setNote(localSaved || '');
      }
    };

    loadNote();
    setIsSaved(false);

    return () => {
      isMounted = false;
    };
  }, [problemId, user, isConfigured]);

  const handleSave = async () => {
    setLoading(true);
    // Always persist to localStorage
    localStorage.setItem(`intuitionlab_notes_${problemId}`, note);

    // If logged in, sync to Supabase
    if (user && isConfigured) {
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

  const charsCount = note.length;
  const charsLeft = MAX_NOTE_LENGTH - charsCount;
  const isNearLimit = charsCount >= 220 && charsCount < MAX_NOTE_LENGTH;
  const isAtLimit = charsCount >= MAX_NOTE_LENGTH;

  return (
    <div className="rounded-xl border-[1.5px] border-charcoal bg-surface p-6 shadow-hard space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <PenLine className="w-5 h-5 text-marker-orange" />
          <h3 className="font-display text-lg sm:text-xl font-bold lowercase text-charcoal">
            personal notes & scratchpad
          </h3>
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-pill bg-dew-drop border border-outline/30 text-on-surface-variant font-bold">
            {user ? <Cloud className="w-3 h-3 text-sprout-sticker" /> : <HardDrive className="w-3 h-3 text-on-surface-variant" />}
            {user ? 'cloud sync' : 'local scratchpad'}
          </span>
        </div>

        <div className="flex items-center gap-3">
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

          <Button
            size="sm"
            variant="primary"
            onClick={handleSave}
            disabled={loading}
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
        onChange={e => {
          setNote(e.target.value.slice(0, MAX_NOTE_LENGTH));
          setIsSaved(false);
        }}
        placeholder="Record your key insight, edge cases, or interview mnemonic here (max 250 characters)..."
        className="w-full p-4 rounded-lg bg-dew-drop border border-outline/40 text-sm md:text-base font-mono text-charcoal placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary resize-y leading-relaxed"
      />

      {!user && (
        <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant bg-cream-paper p-2.5 rounded-lg border border-outline/20">
          <AlertCircle className="w-3.5 h-3.5 text-marker-orange flex-shrink-0" />
          <span>
            Sign in to sync your 250-char notes across devices securely with Supabase.
          </span>
        </div>
      )}
    </div>
  );
};
