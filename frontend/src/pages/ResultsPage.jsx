import { onMount, Show, For } from 'solid-js';
import { useNavigate, A } from '@solidjs/router';
import { usePlayer } from '../context/PlayerContext';
import confetti from 'canvas-confetti';
import { Trophy, Zap, Flame, RotateCcw, ArrowRight, LayoutDashboard, Sparkles, CheckCircle2 } from 'lucide-solid';

export default function ResultsPage() {
  const player = usePlayer();
  const navigate = useNavigate();

  const result = () => player.lastGameResult();

  onMount(() => {
    if (!result()) {
      navigate('/dashboard');
      return;
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'],
      });
    } catch (e) {
      // ignore
    }
  });

  const getMetricEntries = () => {
    const res = result();
    if (!res || !res.metrics) return [];
    if (typeof res.metrics === 'object') {
      return Object.entries(res.metrics).map(([k, v]) => ({
        key: k.replace(/([A-Z])/g, ' $1').toLowerCase(),
        val: typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v,
      }));
    }
    return [];
  };

  return (
    <div class="py-10 px-4 max-w-2xl mx-auto">
      <div class="glass-panel rounded-3xl p-8 sm:p-10 border border-slate-800 text-center shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div class="absolute inset-0 bg-radial-gradient from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Level up banner if earned */}
        <Show when={result()?.levelUp}>
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs mb-4 animate-bounce">
            <Sparkles size={16} /> LEVEL UP! PLAYER LEVEL {result()?.newPlayerLevel} REACHED
          </div>
        </Show>

        <div class="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
          <Trophy size={32} />
        </div>

        <h1 class="text-3xl font-black text-white">Session Completed!</h1>
        <p class="text-xs text-slate-400 mt-1 font-medium">
          {result()?.gameName || 'Cognitive Training'} · Level {result()?.levelNumber || 1}
        </p>

        {/* Main Stats Grid */}
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
          <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-500 block mb-1">Score</span>
            <span class="text-2xl font-black text-white font-mono">{result()?.score || 0}</span>
          </div>

          <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-500 block mb-1">XP Earned</span>
            <span class="text-2xl font-black text-cyan-400 font-mono">+{result()?.xpEarned || 0}</span>
          </div>

          <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-500 block mb-1">Accuracy</span>
            <span class="text-2xl font-black text-emerald-400 font-mono">{result()?.accuracy || 0}%</span>
          </div>

          <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-500 block mb-1">Duration</span>
            <span class="text-2xl font-black text-amber-400 font-mono">{result()?.completionTime || 0}s</span>
          </div>
        </div>

        {/* Detailed Metrics Panel */}
        <Show when={getMetricEntries().length > 0}>
          <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-8 text-left">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Performance Telemetry
            </h4>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <For each={getMetricEntries()}>
                {(entry) => (
                  <div class="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span class="text-slate-500 capitalize">{entry.key}:</span>
                    <span class="font-bold text-slate-200 font-mono">{entry.val}</span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>

        {/* Action Buttons */}
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <A
            href={result()?.gameId ? `/games/${result().gameId}` : '/games'}
            class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <RotateCcw size={16} /> Play Again
          </A>

          <A
            href="/dashboard"
            class="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-card text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all hover:scale-105"
          >
            <LayoutDashboard size={16} /> Return to Dashboard
          </A>
        </div>
      </div>
    </div>
  );
}

