import { A } from '@solidjs/router';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import { Brain, Flame, Trophy, User, LogOut, Gamepad2, LayoutDashboard } from 'lucide-solid';
import { Show } from 'solid-js';

export default function Navbar() {
  const auth = useAuth();
  const player = usePlayer();

  return (
    <nav class="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 py-3.5 transition-all">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <A href="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
            <div class="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Brain size={22} class="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div class="flex flex-col">
            <span class="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              CLARITY<span class="text-cyan-400">MINDS</span>
            </span>
            <span class="text-[10px] tracking-widest uppercase font-mono text-cyan-500/80 -mt-1 font-semibold">
              Cognitive Engine
            </span>
          </div>
        </A>

        {/* Links */}
        <div class="flex items-center gap-1 sm:gap-4">
          <Show when={auth.isAuthenticated()}>
            <A
              href="/dashboard"
              activeClass="text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
              class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent transition-all flex items-center gap-2"
            >
              <LayoutDashboard size={16} /> <span class="hidden sm:inline">Dashboard</span>
            </A>
            <A
              href="/games"
              activeClass="text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
              class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent transition-all flex items-center gap-2"
            >
              <Gamepad2 size={16} /> <span class="hidden sm:inline">Games</span>
            </A>
            <A
              href="/leaderboard"
              activeClass="text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
              class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent transition-all flex items-center gap-2"
            >
              <Trophy size={16} /> <span class="hidden sm:inline">Ranks</span>
            </A>

            {/* Streak & XP Badge */}
            <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
              <span class="flex items-center gap-1 text-amber-400 font-bold">
                <Flame size={14} class="fill-amber-400/20" /> {player.stats()?.currentStreak || 0}d
              </span>
              <span class="text-slate-600">|</span>
              <span class="text-cyan-300 font-bold">
                {player.stats()?.totalXp || 0} XP
              </span>
            </div>

            {/* User Profile / Logout */}
            <A
              href="/profile"
              class="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-all"
            >
              <div class="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono">
                {auth.user()?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <span class="hidden sm:inline font-semibold">{auth.user()?.displayName}</span>
            </A>

            <button
              onClick={() => auth.logout()}
              class="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </Show>

          <Show when={!auth.isAuthenticated()}>
            <A
              href="/login"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
            >
              Log In
            </A>
            <A
              href="/register"
              class="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all"
            >
              Get Started
            </A>
          </Show>
        </div>
      </div>
    </nav>
  );
}

