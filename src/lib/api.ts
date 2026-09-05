// Minimal client for the Express backend (auth only — app data lives in Supabase).
// The Google-OAuth app token is stored here; Supabase sessions are untouched.

const getEnvVar = (key: string): string => {
  try {
    return (import.meta as any).env?.[key] || '';
  } catch {
    return '';
  }
};

export const API_URL = getEnvVar('VITE_API_URL') || 'http://localhost:5000';

const TOKEN_KEY = 'intuitionlab_app_token';

export const getAppToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAppToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Private-mode storage — token just won't persist
  }
};

export const clearAppToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
};

export const googleLoginUrl = (next: string = '/'): string =>
  `${API_URL}/api/v1/auth/google?next=${encodeURIComponent(next)}`;

export interface AppTokenUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
  username?: string;
}

// Validate the stored/callback token against the backend. Null = invalid.
export const fetchAuthMe = async (token: string): Promise<AppTokenUser | null> => {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const body = await res.json();
    const user = body?.data?.user;
    if (!user?.id || !user?.email) return null;
    return user as AppTokenUser;
  } catch {
    return null;
  }
};

// Whether the backend has Google OAuth configured (button visibility).
export const isGoogleEnabled = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/status`);
    if (!res.ok) return false;
    const body = await res.json();
    return body?.data?.google === true;
  } catch {
    return false;
  }
};
