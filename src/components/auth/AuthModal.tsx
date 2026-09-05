import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isGoogleEnabled } from '@/lib/api';
import { X, Lock, Mail, User as UserIcon, Sparkles, AlertCircle, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'signin',
}) => {
  const { signInWithPassword, signInWithGoogle, signUpWithPassword, isConfigured } = useAuth();
  const [googleAvailable, setGoogleAvailable] = useState(false);

  // Show the Google button only when the backend has OAuth configured
  useEffect(() => {
    if (isOpen) {
      isGoogleEnabled().then(setGoogleAvailable);
    }
  }, [isOpen]);
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailHelpNeeded, setEmailHelpNeeded] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setEmailHelpNeeded(false);
    setLoading(true);

    try {
      if (tab === 'signin') {
        const res = await signInWithPassword(email, password);
        if (res.error) {
          setError(res.error);
          if (res.error.toLowerCase().includes('email not confirmed')) {
            setEmailHelpNeeded(true);
          }
        } else {
          onClose();
        }
      } else if (tab === 'signup') {
        const res = await signUpWithPassword(email, password, username);
        if (res.error) {
          setError(res.error);
        } else if (res.needsEmailConfirmation) {
          setSuccessMessage('Account created! Email verification is required by your Supabase settings.');
          setEmailHelpNeeded(true);
        } else {
          setSuccessMessage('Account created and signed in successfully!');
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-cream-paper border-2 border-charcoal rounded-2xl shadow-hard-lg overflow-hidden select-none">
        {/* Header Ribbon */}
        <div className="bg-dew-drop border-b border-charcoal/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container border border-charcoal flex items-center justify-center text-on-primary-container shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-charcoal lowercase">
                {tab === 'signin' ? 'sign in to intuitionlab' : tab === 'signup' ? 'create an account' : 'reset password'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-surface border border-charcoal/40 flex items-center justify-center text-charcoal hover:bg-surface-container-high transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-charcoal/30 bg-surface-container-high/30">
          <button
            onClick={() => { setTab('signin'); setError(null); setEmailHelpNeeded(false); }}
            className={`flex-1 py-2.5 text-xs font-mono font-bold transition-all text-center ${
              tab === 'signin'
                ? 'bg-cream-paper border-b-2 border-marker-orange text-marker-orange'
                : 'text-on-surface-variant hover:text-charcoal'
            }`}
          >
            sign in
          </button>
          <button
            onClick={() => { setTab('signup'); setError(null); setEmailHelpNeeded(false); }}
            className={`flex-1 py-2.5 text-xs font-mono font-bold transition-all text-center ${
              tab === 'signup'
                ? 'bg-cream-paper border-b-2 border-marker-orange text-marker-orange'
                : 'text-on-surface-variant hover:text-charcoal'
            }`}
          >
            create account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {!isConfigured && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Dev Mode Active:</strong> Supabase keys not set in <code>.env</code> yet. Entering any email will sign you in as an admin for local testing.
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-2.5 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5 text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {emailHelpNeeded && (
            <div className="bg-dew-drop border border-charcoal/30 rounded-xl p-3 text-xs font-mono text-charcoal space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-marker-orange">
                <HelpCircle className="w-4 h-4" />
                <span>Not receiving confirmation email?</span>
              </div>
              <p className="text-[11px] text-cocoa-ink leading-relaxed">
                By default, Supabase requires email verification before login. To sign in immediately:
              </p>
              <div className="bg-cream-paper p-2 rounded border border-outline/30 text-[10px] text-cocoa-ink space-y-1">
                <div>1. In <strong>Supabase Dashboard</strong> ➔ <strong>Authentication</strong> ➔ <strong>Providers</strong> ➔ <strong>Email</strong>:</div>
                <div className="text-marker-orange font-bold font-mono">Toggle OFF "Confirm email" ➔ Click Save</div>
              </div>
              <p className="text-[10px] text-on-surface-variant">
                Or run in Supabase SQL Editor: <code className="bg-surface px-1 py-0.5 rounded text-marker-orange">UPDATE auth.users SET email_confirmed_at = now();</code>
              </p>
            </div>
          )}

          {tab === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-charcoal block">username</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. algo_master"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-charcoal/50 bg-surface focus:outline-none focus:ring-2 focus:ring-marker-orange/40"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-charcoal block">email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-charcoal/50 bg-surface focus:outline-none focus:ring-2 focus:ring-marker-orange/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-charcoal block">password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-charcoal/50 bg-surface focus:outline-none focus:ring-2 focus:ring-marker-orange/40"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-2 bg-marker-orange hover:bg-[#e05a10] text-white font-mono font-bold text-xs rounded-xl shadow-hard transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>processing...</span>
            ) : (
              <>
                <span>{tab === 'signin' ? 'sign in' : 'create account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          {googleAvailable && (
            <>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-charcoal/20" />
                <span className="text-[10px] font-mono font-bold text-on-surface-variant">or</span>
                <div className="flex-1 h-px bg-charcoal/20" />
              </div>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full h-10 bg-surface border border-charcoal/50 hover:bg-surface-container-high font-mono font-bold text-xs text-charcoal rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
                </svg>
                <span>continue with google</span>
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
