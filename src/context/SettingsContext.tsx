import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface AnnouncementSettings {
  enabled: boolean;
  message: string;
  type: 'info' | 'warning' | 'announcement';
}

interface SettingsContextType {
  announcement: AnnouncementSettings;
  maintenanceMode: boolean;
  maxNoteLimit: number;
  loading: boolean;
  updateAnnouncement: (enabled: boolean, message: string, type?: 'info' | 'warning' | 'announcement') => Promise<void>;
  updateMaintenanceMode: (enabled: boolean) => Promise<void>;
  updateMaxNoteLimit: (limit: number) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultAnnouncement: AnnouncementSettings = {
  enabled: true,
  message: '🚀 Welcome to IntuitionLab! Step-by-step visualizers & 250-char cloud notes are live.',
  type: 'announcement',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcement, setAnnouncement] = useState<AnnouncementSettings>(() => {
    try {
      const saved = localStorage.getItem('intuitionlab_announcement');
      return saved ? JSON.parse(saved) : defaultAnnouncement;
    } catch {
      return defaultAnnouncement;
    }
  });

  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('intuitionlab_maintenance') === 'true';
    } catch {
      return false;
    }
  });

  const [maxNoteLimit, setMaxNoteLimit] = useState<number>(250);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (!error && data) {
        data.forEach(item => {
          if (item.key === 'announcement_banner' && item.value) {
            setAnnouncement(item.value);
            localStorage.setItem('intuitionlab_announcement', JSON.stringify(item.value));
          } else if (item.key === 'maintenance_mode' && item.value) {
            setMaintenanceMode(Boolean(item.value.enabled));
            localStorage.setItem('intuitionlab_maintenance', String(Boolean(item.value.enabled)));
          } else if (item.key === 'max_note_length' && item.value) {
            setMaxNoteLimit(item.value.limit || 250);
          }
        });
      }
    } catch (err) {
      console.warn('Could not fetch system settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateAnnouncement = async (
    enabled: boolean,
    message: string,
    type: 'info' | 'warning' | 'announcement' = 'announcement'
  ) => {
    const updated: AnnouncementSettings = { enabled, message, type };
    setAnnouncement(updated);
    localStorage.setItem('intuitionlab_announcement', JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('system_settings')
          .upsert({
            key: 'announcement_banner',
            value: updated,
            updated_at: new Date().toISOString(),
          });
      } catch (err) {
        console.error('Failed to update announcement in Supabase:', err);
      }
    }
  };

  const updateMaintenanceMode = async (enabled: boolean) => {
    setMaintenanceMode(enabled);
    localStorage.setItem('intuitionlab_maintenance', String(enabled));

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('system_settings')
          .upsert({
            key: 'maintenance_mode',
            value: { enabled },
            updated_at: new Date().toISOString(),
          });
      } catch (err) {
        console.error('Failed to update maintenance mode in Supabase:', err);
      }
    }
  };

  const updateMaxNoteLimit = async (limit: number) => {
    setMaxNoteLimit(limit);
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('system_settings')
          .upsert({
            key: 'max_note_length',
            value: { limit },
            updated_at: new Date().toISOString(),
          });
      } catch (err) {
        console.error('Failed to update max note length in Supabase:', err);
      }
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        announcement,
        maintenanceMode,
        maxNoteLimit,
        loading,
        updateAnnouncement,
        updateMaintenanceMode,
        updateMaxNoteLimit,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
