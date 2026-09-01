import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithPassword: (email: string, password: string, username?: string) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (username: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  const fetchProfile = async (userId: string, email: string) => {
    try {
      if (!isConfigured) {
        setProfile({
          id: userId,
          email,
          username: email.split('@')[0],
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Could not fetch user profile:', error.message);
        return;
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        const newProfile: UserProfile = {
          id: userId,
          email,
          username: email.split('@')[0],
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await supabase.from('profiles').insert(newProfile);
        setProfile(newProfile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session: Session | null) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email || '');
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signInWithPassword = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!isConfigured) {
      const mockUser = { id: 'mock-user-id', email: cleanEmail } as User;
      setUser(mockUser);
      setProfile({
        id: 'mock-user-id',
        email: cleanEmail,
        username: cleanEmail.split('@')[0],
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        return {
          error: 'Email not confirmed yet. In Supabase Dashboard ➔ Authentication ➔ Providers ➔ Email, disable "Confirm email" or confirm your account in the SQL Editor.',
        };
      }
      return { error: error.message };
    }

    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id, data.user.email || '');
    }

    return { error: null };
  };

  const signUpWithPassword = async (email: string, password: string, username?: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!isConfigured) {
      const mockUser = { id: 'mock-user-id', email: cleanEmail } as User;
      setUser(mockUser);
      setProfile({
        id: 'mock-user-id',
        email: cleanEmail,
        username: username || cleanEmail.split('@')[0],
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { error: null };
    }

    // Step 1: Pre-check if an account with this email already exists in profiles
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingProfile) {
        return {
          error: 'An account with this email address already exists. Please sign in instead.',
        };
      }
    } catch {
      // Continue to Supabase Auth check if profiles query fails
    }

    // Step 2: Attempt Supabase Signup
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          username: username || cleanEmail.split('@')[0],
        },
      },
    });

    if (error) {
      if (
        error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already in use')
      ) {
        return {
          error: 'An account with this email address already exists. Please sign in instead.',
        };
      }
      return { error: error.message };
    }

    // Supabase identity detection: When user already exists, Supabase returns identities: []
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return {
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    // If session is present, user is logged in automatically (Confirm email is disabled)
    if (data.session && data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id, data.user.email || '');
      return { error: null, needsEmailConfirmation: false };
    }

    // If user is created but no session, Supabase has "Confirm email" enabled
    return { error: null, needsEmailConfirmation: true };
  };

  const signOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (username: string) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isConfigured) {
      if (profile) setProfile({ ...profile, username });
      return { error: null };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ username, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) return { error: error.message };

    if (profile) {
      setProfile({ ...profile, username });
    }

    return { error: null };
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email || '');
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        isConfigured,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
