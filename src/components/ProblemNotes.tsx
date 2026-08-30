import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, Check, Save } from 'lucide-react';

interface ProblemNotesProps {
  problemId: string;
}

export const ProblemNotes: React.FC<ProblemNotesProps> = ({ problemId }) => {
  const [note, setNote] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem(`superr_notes_${problemId}`);
    setNote(saved || '');
    setIsSaved(false);
  }, [problemId]);

  const handleSave = () => {
    localStorage.setItem(`superr_notes_${problemId}`, note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="rounded-xl border-[1.5px] border-charcoal bg-surface p-6 shadow-hard space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg sm:text-xl font-bold lowercase text-charcoal flex items-center gap-2.5">
          <PenLine className="w-5 h-5 text-marker-orange" />
          <span>personal scratchpad & notes</span>
        </h3>

        <Button
          size="sm"
          variant="primary"
          onClick={handleSave}
          className="h-8 px-3 text-xs md:text-sm flex items-center gap-1.5"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'saved' : 'save notes'}</span>
        </Button>
      </div>

      <textarea
        rows={5}
        value={note}
        onChange={e => {
          setNote(e.target.value);
          setIsSaved(false);
        }}
        placeholder="write your edge cases, dry runs, or interview tips here... (auto-saved locally)"
        className="w-full p-4 rounded-lg bg-dew-drop border border-outline/40 text-sm md:text-base font-mono text-charcoal placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary resize-y leading-relaxed"
      />
    </div>
  );
};
