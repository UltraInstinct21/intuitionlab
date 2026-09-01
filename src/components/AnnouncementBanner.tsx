import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Megaphone, Sparkles, AlertTriangle, Info, X } from 'lucide-react';

export const AnnouncementBanner: React.FC = () => {
  const { announcement } = useSettings();
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    // If message changes, re-show banner
    setIsDismissed(false);
  }, [announcement.message]);

  if (!announcement.enabled || !announcement.message || isDismissed) {
    return null;
  }

  const isWarning = announcement.type === 'warning';
  const isInfo = announcement.type === 'info';

  return (
    <aside
      aria-label="Global Announcement"
      className={`relative z-50 w-full py-2.5 px-4 text-xs font-mono border-b flex items-center justify-between gap-3 shadow-xs transition-all animate-in slide-in-from-top duration-300 ${
        isWarning
          ? 'bg-amber-100 border-amber-300 text-amber-950'
          : isInfo
          ? 'bg-sky-50 border-sky-300 text-sky-950'
          : 'bg-dew-drop border-charcoal/40 text-charcoal'
      }`}
    >
      <div className="flex items-center gap-2.5 mx-auto max-w-5xl truncate">
        <span
          className={`p-1 rounded-md border flex items-center justify-center flex-shrink-0 shadow-xs ${
            isWarning
              ? 'bg-amber-200 border-amber-400 text-amber-900'
              : isInfo
              ? 'bg-sky-200 border-sky-400 text-sky-900'
              : 'bg-primary-container border-charcoal text-on-primary-container'
          }`}
        >
          {isWarning ? <AlertTriangle className="w-3.5 h-3.5" /> : isInfo ? <Info className="w-3.5 h-3.5" /> : <Megaphone className="w-3.5 h-3.5" />}
        </span>

        <p className="font-medium truncate font-sans text-xs sm:text-sm">
          {announcement.message}
        </p>
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        className="p-1 rounded-full hover:bg-black/5 text-current/70 hover:text-current transition-colors flex-shrink-0"
        title="Dismiss announcement"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
