import { createSignal, onMount, For } from 'solid-js';
import { gameService } from '../services/gameService';
import { usePlayer } from '../context/PlayerContext';
import { A } from '@solidjs/router';
import { Zap, Brain, Eye, Sparkles, Trophy, ChevronRight, Play } from 'lucide-solid';

export default function GamesPage() {
  const [games, setGames] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const player = usePlayer();

  onMount(async () => {
    try {
      const data = await gameService.getAllGames();
      setGames(data || []);
    } catch (err) {
      console.error('Failed to load games:', err);
    } finally {
      setLoading(false);
    }
  });

  const getGameIcon = (category) => {
    switch (category) {
      case 'REACTION':
        return <Zap size={28} class="text-cyan-400" />;
      case 'MEMORY':
        return <Brain size={28} class="text-violet-400" />;
      case 'ATTENTION':
      default:
        return <Eye size={28} class="text-amber-400" />;
    }
  };

  const getGameProgress = (gameId) => {
    return player.gameProgress().find((p) => p.gameId === gameId);
  };

  return (
    <div class="space-y-8 py-8 px-6 max-w-7xl mx-auto">
      <div class="text-center max-w-2xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles size={14} /> Cognitive Catalog
        </div>
        <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Training Modules</h1>
        <p class="text-xs sm:text-sm text-slate-400 mt-2">
          Choose a domain to start calibrated cognitive training across 10 progressive difficulty tiers.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <For each={games()}>
          {(game) => {
            const prog = () => getGameProgress(game.id);
            return (
              <div class="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all hover:scale-[1.01] shadow-xl">
                <div>
                  <div class="flex items-center justify-between mb-6">
                    <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg">
                      {getGameIcon(game.category)}
                    </div>
                    <span class="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                      LVL {prog()?.currentLevel || 1} / 10
                    </span>
                  </div>

                  <span class="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block mb-1">
                    Category: {game.category}
                  </span>
                  <h3 class="text-2xl font-bold text-white mb-2">{game.name}</h3>
                  <p class="text-xs text-slate-400 leading-relaxed mb-6">
                    {game.description}
                  </p>

                  <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 mb-8 text-xs">
                    <div class="flex justify-between text-slate-300">
                      <span class="text-slate-500">Highest Level Unlocked:</span>
                      <span class="font-bold font-mono text-cyan-400">Level {prog()?.highestLevel || 1}</span>
                    </div>
                    <div class="flex justify-between text-slate-300">
                      <span class="text-slate-500">Personal Best Score:</span>
                      <span class="font-bold font-mono text-amber-400">{prog()?.bestScore || 0} pts</span>
                    </div>
                    <div class="flex justify-between text-slate-300">
                      <span class="text-slate-500">Total Attempts:</span>
                      <span class="font-bold font-mono text-slate-300">{prog()?.totalAttempts || 0}</span>
                    </div>
                  </div>
                </div>

                <A
                  href={`/games/${game.id}`}
                  class="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  <Play size={16} fill="currentColor" /> Select Level & Train
                </A>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}

