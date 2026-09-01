import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
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
  const { signInWithPassword, signUpWithPassword, isConfigured } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        const res = await signInWithPassword(email, password);
        if (res.error) {
          setError(res.error);
        } else {
          onClose();
        }
      } else if (tab === 'signup') {
        const res = await signUpWithPassword(email, password, username);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccessMessage(
            isConfigured
              ? 'Account created! Please check your email to confirm your account (or sign in directly).'
              : 'Signed in as Dev User!'
          );
          setTimeout(() => {
            onClose();
          }, 1500);
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
              <p className="text-[11px] font-mono text-on-surface-variant">
                sync notes (250 chars) & track your mastery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface border border-charcoal/40 flex items-center justify-center text-charcoal hover:bg-surface-container-high transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-charcoal/30 bg-surface-container-high/30">
          <button
            onClick={() => { setTab('signin'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-mono font-bold transition-all text-center ${
              tab === 'signin'
                ? 'bg-cream-paper border-b-2 border-marker-orange text-marker-orange'
                : 'text-on-surface-variant hover:text-charcoal'
            }`}
          >
            sign in
          </button>
          <button
            onClick={() => { setTab('signup'); setError(null); }}
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
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5 text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
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
        </form>

        {/* Footer Note */}
        <div className="bg-dew-drop/50 p-3 border-t border-charcoal/20 text-center text-[10px] font-mono text-on-surface-variant">
          Protected with Supabase Auth & JWT token verification.
        </div>
      </div>
    </div>
  );
};
