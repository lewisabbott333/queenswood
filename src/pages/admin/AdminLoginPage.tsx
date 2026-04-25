import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from '@/components/ui/MaterialIcon';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
      return;
    }

    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gold-600 flex items-center justify-center text-navy-950 font-display text-3xl font-bold mb-5 shadow-lg shadow-gold-600/30">
            Q
          </div>
          <p className="text-slate-500 text-sm uppercase tracking-widest font-medium">
            Admin Panel
          </p>
        </div>

        <div className="bg-navy-900 rounded-2xl p-8 border border-navy-800 shadow-2xl">
          <h1 className="font-display text-2xl text-cream mb-6 text-center">Sign In</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@wearequeenswood.com"
                autoComplete="email"
                required
                className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 text-cream text-sm placeholder-slate-600 focus:outline-none focus:border-gold-600 focus:ring-1 focus:ring-gold-600/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-navy-950 border border-navy-700 rounded-lg px-4 py-3 pr-11 text-cream text-sm placeholder-slate-600 focus:outline-none focus:border-gold-600 focus:ring-1 focus:ring-gold-600/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold-500 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-primary w-full py-3.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-slate-600 text-xs text-center mt-6">
          &copy; 2026 Queenswood Engagement
        </p>
      </div>
    </div>
  );
}
