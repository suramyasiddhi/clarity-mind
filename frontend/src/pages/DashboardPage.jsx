import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { A } from '@solidjs/router';
import { Show, For } from 'solid-js';
import { Zap, Brain, Eye, Flame, Trophy, Award, ChevronRight, Activity, Play } from 'lucide-solid';

export default function DashboardPage() {
  const auth = useAuth();
  const player = usePlayer();

  const getGameIcon = (code) => {
    if (code?.includes('REACTION')) return <Zap size={22} class="text-cyan-400" />;
    if (code?.includes('MEMORY')) return <Brain size={22} class="text-violet-400" />;
    return <Eye size={22} class="text-amber-400" />;
  };

  const getGameBorderColor = (code) => {
    if (code?.includes('REACTION')) return 'border-cyan-500/30 hover:border-cyan-400';
    if (code?.includes('MEMORY')) return 'border-violet-500/30 hover:border-violet-400';
    return 'border-amber-500/30 hover:border-amber-400';
  };

  const xpProgressPercent = () => {
    const stats = player.stats();
    if (!stats) return 0;
    const currentTotal = stats.totalXp || 0;
    const nextTarget = (Math.floor(currentTotal / 100) + 1) * 100;
    const currentBase = Math.floor(currentTotal / 100) * 100;

    const diff = nextTarget - currentBase;
    if (diff <= 0) return 100;
    const progress = Math.max(0, currentTotal - currentBase);
    return Math.min(100, Math.round((progress / diff) * 100));
  };

  return (
    <div class="space-y-8 py-8 px-6 max-w-7xl mx-auto">
      {/* Welcome Banner & Level Overview */}
      <div class="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden shadow-xl">
        <div class="absolute -right-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl sm:text-3xl font-black text-white">
                Welcome back, {auth.user()?.displayName || 'Player'}
              </h1>
              <span class="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                Level {player.stats()?.level || 1}
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">
              Here is your daily cognitive performance & progression report.
            </p>
          </div>

          <div class="flex items-center gap-4 w-full md:w-auto">
            {/* Streak Card */}
            <div class="flex-1 md:flex-none glass-card rounded-2xl px-5 py-3.5 border border-amber-500/30 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame size={22} class="animate-pulse fill-amber-400/30" />
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Streak</span>
                <span class="text-base font-extrabold text-amber-400 font-mono">
                  {player.stats()?.currentStreak || 0} Days
                </span>
              </div>
            </div>

            {/* Total XP Card */}
            <div class="flex-1 md:flex-none glass-card rounded-2xl px-5 py-3.5 border border-cyan-500/30 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Trophy size={22} />
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Total XP</span>
                <span class="text-base font-extrabold text-cyan-300 font-mono">
                  {player.stats()?.totalXp || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div class="mt-6 pt-6 border-t border-slate-800/80">
          <div class="flex items-center justify-between text-xs font-semibold mb-2">
            <span class="text-slate-400 flex items-center gap-2">
              Level {player.stats()?.level || 1} Progress
            </span>
            <span class="text-cyan-400 font-mono">
              {player.stats()?.totalXp || 0} XP ({xpProgressPercent()}%)
            </span>
          </div>
          <div class="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-700/80">
            <div
              style={{ width: `${xpProgressPercent()}%` }}
              class="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)] transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* 3 Game Modules Section */}
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <Activity size={18} class="text-cyan-400" /> Cognitive Training Modules
          </h2>
          <A href="/games" class="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            View All Levels <ChevronRight size={14} />
          </A>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <For each={player.gameProgress()}>
            {(prog) => {
              const currentLvl = prog.highestUnlockedLevel || prog.currentLevel || 1;
              const title = prog.gameTitle || prog.gameName || 'Training Module';
              return (
                <div class={`glass-card rounded-3xl p-6 border ${getGameBorderColor(prog.gameCode)} flex flex-col justify-between`}>
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div class="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center">
                        {getGameIcon(prog.gameCode)}
                      </div>
                      <span class="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold font-mono text-cyan-300">
                        Level {currentLvl} / 10
                      </span>
                    </div>

                    <h3 class="text-lg font-bold text-white mb-1">{title}</h3>
                    <p class="text-xs text-slate-400 line-clamp-2 mb-4">
                      {prog.gameCode?.includes('REACTION') && 'Improve motor reflex and visual stimulus latency.'}
                      {prog.gameCode?.includes('MEMORY') && 'Enhance working memory retention & reverse reproduction.'}
                      {prog.gameCode?.includes('ATTENTION') && 'Sharpen target identification speed in high distractor matrix.'}
                    </p>

                    <div class="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs mb-6">
                      <div>
                        <span class="text-[10px] text-slate-500 font-bold block uppercase">Best Score</span>
                        <span class="font-bold text-white font-mono">{prog.bestScore || 0} pts</span>
                      </div>
                      <div>
                        <span class="text-[10px] text-slate-500 font-bold block uppercase">Attempts</span>
                        <span class="font-bold text-white font-mono">{prog.totalAttempts || prog.totalCompleted || 0} sessions</span>
                      </div>
                    </div>
                  </div>

                  <A
                    href={`/games/${prog.gameId}`}
                    class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <Play size={14} fill="currentColor" /> Play Level {currentLvl}
                  </A>
                </div>
              );
            }}
          </For>
        </div>
      </section>

      {/* Two Column Layout: Recent Activity & Achievements */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Results */}
        <section class="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Activity size={16} class="text-cyan-400" /> Recent Session Results
            </h3>

            <Show
              when={player.recentResults().length > 0}
              fallback={
                <div class="py-12 text-center text-xs text-slate-500">
                  No sessions recorded yet. Complete a training game to see your logs!
                </div>
              }
            >
              <div class="space-y-2.5">
                <For each={player.recentResults().slice(0, 5)}>
                  {(res) => (
                    <div class="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition-colors">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-cyan-400 text-xs font-mono">
                          +{res.xpEarned}
                        </div>
                        <div>
                          <span class="font-bold text-slate-200 block">
                            {res.gameTitle || 'Game'} — Score: {res.score} pts
                          </span>
                          <span class="text-[11px] text-slate-500 font-mono">
                            {res.accuracy}% accuracy · {res.durationSeconds || res.completionTime || 0}s
                          </span>
                        </div>
                      </div>

                      <span class="text-[10px] text-slate-500 font-mono">
                        {res.createdAt ? new Date(res.createdAt).toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </section>

        {/* Achievements Preview */}
        <section class="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Award size={16} class="text-amber-400" /> Neuro Badges & Milestones
            </h3>

            <div class="grid grid-cols-2 gap-3">
              <For each={player.achievements()}>
                {(ach) => (
                  <div
                    class="p-3.5 rounded-2xl border transition-all"
                    classList={{
                      'bg-amber-500/10 border-amber-500/30 text-white': ach.unlocked,
                      'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60': !ach.unlocked,
                    }}
                  >
                    <div class="flex items-center gap-2 mb-1.5">
                      <Award size={16} class={ach.unlocked ? 'text-amber-400' : 'text-slate-600'} />
                      <span class="font-bold text-xs leading-tight">{ach.title}</span>
                    </div>
                    <p class="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                )}
              </For>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
