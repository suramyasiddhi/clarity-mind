import { createSignal, Show } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';
import { Brain, Lock, User, AlertCircle, ArrowRight, Sparkles } from 'lucide-solid';

export default function LoginPage() {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username() || !password()) {
      setError('Please fill in both fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await auth.login(username(), password());
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    setUsername('demo');
    setPassword('password123');
  };

  return (
    <div class="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative">
        <div class="text-center mb-8">
          <div class="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4">
            <Brain size={28} />
          </div>
          <h2 class="text-2xl font-black text-white">Welcome Back</h2>
          <p class="text-xs text-slate-400 mt-1">Sign in to resume your cognitive training journey</p>
        </div>

        <Show when={error()}>
          <div class="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle size={18} class="shrink-0" />
            <span>{error()}</span>
          </div>
        </Show>

        <form onSubmit={handleLogin} class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Username or Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User size={16} />
              </div>
              <input
                type="text"
                value={username()}
                onInput={(e) => setUsername(e.currentTarget.value)}
                placeholder="Enter username or email"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock size={16} />
              </div>
              <input
                type="password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="••••••••"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting()}
            class="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting() ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Account Button */}
        <div class="mt-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={fillDemoAccount}
            class="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles size={14} /> Quick Demo Fill (demo / password123)
          </button>
        </div>

        <div class="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <A href="/register" class="text-cyan-400 hover:text-cyan-300 font-bold">
            Create Account
          </A>
        </div>
      </div>
    </div>
  );
}

