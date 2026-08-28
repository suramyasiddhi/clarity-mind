import { createSignal, onMount, For, Show } from 'solid-js';
import { progressService } from '../services/progressService';
import { Trophy, Medal, Flame, Sparkles } from 'lucide-solid';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    try {
      const data = await progressService.getLeaderboard(25);
      setLeaderboard(data || []);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  });

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div class="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-xs font-mono shadow-[0_0_12px_rgba(245,158,11,0.5)]">
            1
          </div>
        );
      case 2:
        return (
          <div class="w-8 h-8 rounded-full bg-slate-300/20 text-slate-300 border border-slate-400/40 flex items-center justify-center font-black text-xs font-mono">
            2
          </div>
        );
      case 3:
        return (
          <div class="w-8 h-8 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 flex items-center justify-center font-black text-xs font-mono">
            3
          </div>
        );
      default:
        return (
          <div class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs font-mono">
            {rank}
          </div>
        );
    }
  };

  return (
    <div class="space-y-8 py-8 px-6 max-w-4xl mx-auto">
      <div class="text-center max-w-xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Trophy size={14} /> Global Rankings
        </div>
        <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Cognitive Leaderboard</h1>
        <p class="text-xs sm:text-sm text-slate-400 mt-2">
          Top performers ranked by authoritative experience points and training consistency.
        </p>
      </div>

      <div class="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <Show
          when={!loading()}
          fallback={<div class="py-12 text-center text-xs text-slate-400 font-mono">Loading rankings...</div>}
        >
          <div class="space-y-3">
            <For each={leaderboard()}>
              {(entry) => (
                <div
                  class="p-4 rounded-2xl border flex items-center justify-between transition-all"
                  classList={{
                    'bg-amber-500/5 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]': entry.rank === 1,
                    'bg-slate-900/60 border-slate-800/80 hover:border-slate-700': entry.rank > 1,
                  }}
                >
                  <div class="flex items-center gap-4">
                    {getRankBadge(entry.rank)}
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-white text-sm">{entry.displayName}</span>
                        <span class="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold font-mono">
                          LVL {entry.level}
                        </span>
                      </div>
                      <span class="text-[11px] text-slate-500 font-mono">@{entry.username}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-6">
                    <div class="text-right">
                      <span class="text-[10px] text-slate-500 uppercase font-bold block">Streak</span>
                      <span class="text-xs font-bold text-amber-400 flex items-center gap-1 font-mono justify-end">
                        <Flame size={12} class="fill-amber-400/30" /> {entry.streak}d
                      </span>
                    </div>

                    <div class="text-right min-w-[70px]">
                      <span class="text-[10px] text-slate-500 uppercase font-bold block">Total XP</span>
                      <span class="text-sm font-extrabold text-cyan-300 font-mono">
                        {entry.totalXp}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}

