import { A } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';
import { Zap, Brain, Eye, Flame, Trophy, ShieldCheck, ArrowRight } from 'lucide-solid';

export default function HomePage() {
  const auth = useAuth();

  return (
    <div class="space-y-24 py-12 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section class="text-center relative pt-8 pb-16">
        <div class="absolute inset-0 bg-radial-gradient from-cyan-500/10 via-transparent to-transparent -z-10 blur-3xl pointer-events-none" />

        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <Brain size={14} /> Cognitive Training & Rehabilitation Support
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-none">
          Train Your Brain With{' '}
          <span class="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Precision & Flow
          </span>
        </h1>

        <p class="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed">
          Targeted micro-games designed to enhance reaction speed, working memory, and sustained visual attention with frame-accurate mechanics and adaptive level progression.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          {auth.isAuthenticated() ? (
            <A
              href="/dashboard"
              class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
            >
              Go to Dashboard <ArrowRight size={18} />
            </A>
          ) : (
            <>
              <A
                href="/register"
                class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
              >
                Start Training Free <ArrowRight size={18} />
              </A>
              <A
                href="/login"
                class="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel text-slate-200 hover:text-white hover:bg-slate-800/80 font-bold text-sm flex items-center justify-center border border-slate-700 transition-all hover:scale-105"
              >
                Sign In (Demo Account)
              </A>
            </>
          )}
        </div>
      </section>

      {/* 3 Core Cognitive Pillars */}
      <section class="space-y-8">
        <div class="text-center">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Three Core Cognitive Domains</h2>
          <p class="text-sm text-slate-400 mt-2">10 progressively tuned levels per game designed for mental agility.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reaction */}
          <div class="glass-card rounded-3xl p-8 border border-cyan-500/20 relative group hover:border-cyan-500/50">
            <div class="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Zap size={28} />
            </div>
            <span class="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block mb-1">
              Domain 01
            </span>
            <h3 class="text-xl font-bold text-white mb-2">Quick Tap (Reaction)</h3>
            <p class="text-xs text-slate-400 leading-relaxed mb-6">
              Measure raw neuromuscular response time to randomized visual triggers while inhibiting impulses to false warning stimuli.
            </p>
            <div class="flex items-center justify-between text-xs font-mono text-cyan-300/80 pt-4 border-t border-slate-800">
              <span>10 Scaled Levels</span>
              <span>Microsecond Accuracy</span>
            </div>
          </div>

          {/* Memory */}
          <div class="glass-card rounded-3xl p-8 border border-violet-500/20 relative group hover:border-violet-500/50">
            <div class="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">
              <Brain size={28} />
            </div>
            <span class="text-[10px] font-mono font-bold uppercase tracking-widest text-violet-400 block mb-1">
              Domain 02
            </span>
            <h3 class="text-xl font-bold text-white mb-2">Sequence Recall (Memory)</h3>
            <p class="text-xs text-slate-400 leading-relaxed mb-6">
              Strengthen working memory capacity and visual-spatial recall by observing, retaining, and reproducing expanding symbol sequences.
            </p>
            <div class="flex items-center justify-between text-xs font-mono text-violet-300/80 pt-4 border-t border-slate-800">
              <span>Up to 8 Symbols</span>
              <span>Reverse Recall Mode</span>
            </div>
          </div>

          {/* Attention */}
          <div class="glass-card rounded-3xl p-8 border border-amber-500/20 relative group hover:border-amber-500/50">
            <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <Eye size={28} />
            </div>
            <span class="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block mb-1">
              Domain 03
            </span>
            <h3 class="text-xl font-bold text-white mb-2">Target Focus (Attention)</h3>
            <p class="text-xs text-slate-400 leading-relaxed mb-6">
              Hone selective visual focus, speed, and noise filtration by identifying target shapes and colors amidst dense distracting grids.
            </p>
            <div class="flex items-center justify-between text-xs font-mono text-amber-300/80 pt-4 border-t border-slate-800">
              <span>3x3 to 7x7 Grids</span>
              <span>Adaptive Distractors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Highlights */}
      <section class="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Flame size={24} />
            </div>
            <h4 class="text-base font-bold text-white">Daily Streak Engine</h4>
            <p class="text-xs text-slate-400 mt-1 max-w-xs">Build neuro-plasticity habits with consecutive daily training streaks.</p>
          </div>

          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Trophy size={24} />
            </div>
            <h4 class="text-base font-bold text-white">Authoritative XP & Levels</h4>
            <p class="text-xs text-slate-400 mt-1 max-w-xs">Backend-verified performance grading, XP rewards, and level-ups.</p>
          </div>

          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h4 class="text-base font-bold text-white">Non-Diagnostic Platform</h4>
            <p class="text-xs text-slate-400 mt-1 max-w-xs">Dedicated to cognitive enhancement, mental sharpness, and rehabilitation support.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

