import { createSignal, onMount, Show, For, Switch, Match } from 'solid-js';
import { useParams, useNavigate, A } from '@solidjs/router';
import { gameService } from '../services/gameService';
import { usePlayer } from '../context/PlayerContext';
import ReactionGame from '../games/reaction/ReactionGame';
import MemoryGame from '../games/memory/MemoryGame';
import AttentionGame from '../games/attention/AttentionGame';
import { ArrowLeft, Lock, Play, Trophy, Sparkles, AlertCircle, X } from 'lucide-solid';

export default function GamePage() {
  const params = useParams();
  const navigate = useNavigate();
  const player = usePlayer();

  const [game, setGame] = createSignal(null);
  const [levels, setLevels] = createSignal([]);
  const [selectedLevel, setSelectedLevel] = createSignal(null);
  const [activeSession, setActiveSession] = createSignal(null);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal('');

  const gameId = () => Number(params.id);

  onMount(async () => {
    try {
      const [gameData, levelsData] = await Promise.all([
        gameService.getGameById(gameId()),
        gameService.getGameLevels(gameId()),
      ]);

      setGame(gameData);
      setLevels(levelsData || []);
    } catch (err) {
      setError(err.message || 'Failed to load game');
    } finally {
      setLoading(false);
    }
  });

  const getHighestUnlockedLevel = () => {
    const prog = player.gameProgress().find((p) => p.gameId === gameId());
    return prog ? prog.currentLevel : 1;
  };

  const handleStartGame = async (level) => {
    setError('');
    setSelectedLevel(level);

    try {
      const session = await gameService.startGameSession(gameId(), level.id);
      setActiveSession(session);
      setIsPlaying(true);
    } catch (err) {
      setError(err.message || 'Could not start game session');
    }
  };

  const handleGameComplete = async (rawResult) => {
    if (!activeSession()) return;

    try {
      const completionResult = await gameService.completeGameSession(
        activeSession().sessionId,
        rawResult.score,
        rawResult.accuracy,
        rawResult.completionTime,
        rawResult.metrics
      );

      // Refresh global player state
      await player.refreshPlayerData();

      // Store result and navigate to results screen
      player.setLastGameResult({
        ...completionResult,
        gameName: game()?.name,
        gameId: gameId(),
        levelNumber: selectedLevel()?.levelNumber,
        category: game()?.category,
      });

      navigate('/results');
    } catch (err) {
      console.error('Failed to complete session on backend:', err);
      setError(err.message || 'Failed to submit score');
    }
  };

  const handleAbandon = async () => {
    if (activeSession()) {
      try {
        await gameService.abandonGameSession(activeSession().sessionId);
      } catch (err) {
        console.warn('Abandon error:', err);
      }
    }
    setIsPlaying(false);
    setActiveSession(null);
    setSelectedLevel(null);
  };

  const getDifficultyBadgeColor = (diff) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MEDIUM':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'HARD':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'EXPERT':
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div class="py-6 px-4 sm:px-6 max-w-7xl mx-auto min-h-[80vh] flex flex-col">
      {/* Header bar */}
      <div class="flex items-center justify-between mb-6">
        <Show
          when={isPlaying()}
          fallback={
            <A href="/games" class="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={16} /> Back to Games Catalog
            </A>
          }
        >
          <button
            onClick={handleAbandon}
            class="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <X size={16} /> Quit Session
          </button>
        </Show>
      </div>

      <Show when={error()}>
        <div class="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle size={18} class="shrink-0" />
          <span>{error()}</span>
        </div>
      </Show>

      {/* Main Game Stage OR Level Selection */}
      <Show
        when={isPlaying() && selectedLevel()}
        fallback={
          <div class="space-y-8">
            {/* Game Info Banner */}
            <div class="glass-panel rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
              <div class="max-w-3xl">
                <span class="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-3 inline-block">
                  {game()?.category} Training
                </span>
                <h1 class="text-3xl font-black text-white mt-1">{game()?.name}</h1>
                <p class="text-sm text-slate-400 mt-2 leading-relaxed">{game()?.description}</p>
              </div>
            </div>

            {/* 10 Level Selector Grid */}
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} class="text-cyan-400" /> Select Training Level (1 — 10)
                </h2>
                <span class="text-xs text-slate-400 font-mono">
                  Unlocked: Level {getHighestUnlockedLevel()} / 10
                </span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <For each={levels()}>
                  {(level) => {
                    const isUnlocked = () => level.levelNumber <= getHighestUnlockedLevel();
                    return (
                      <button
                        disabled={!isUnlocked()}
                        onClick={() => handleStartGame(level)}
                        class="p-5 rounded-2xl text-left border flex flex-col justify-between relative overflow-hidden transition-all duration-200 glass-card cursor-pointer disabled:cursor-not-allowed group"
                        classList={{
                          'border-slate-800 bg-slate-900/40 opacity-50': !isUnlocked(),
                          'border-cyan-500/30 hover:border-cyan-400 hover:scale-105 active:scale-95': isUnlocked(),
                        }}
                      >
                        <div class="flex items-center justify-between mb-4">
                          <span class="text-2xl font-black font-mono text-white">
                            0{level.levelNumber}
                          </span>
                          <Show
                            when={isUnlocked()}
                            fallback={<Lock size={16} class="text-slate-600" />}
                          >
                            <Play size={16} class="text-cyan-400 group-hover:scale-125 transition-transform" fill="currentColor" />
                          </Show>
                        </div>

                        <div>
                          <span class={`px-2 py-0.5 rounded-md text-[10px] font-bold border block w-fit mb-2 ${getDifficultyBadgeColor(level.difficulty)}`}>
                            {level.difficulty}
                          </span>
                          <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>Reward</span>
                            <span class="text-amber-400 font-bold">+{level.xpReward} XP</span>
                          </div>
                        </div>
                      </button>
                    );
                  }}
                </For>
              </div>
            </div>
          </div>
        }
      >
        {/* Dynamic Game Component Mounting */}
        <div class="flex-1 flex flex-col">
          <Switch>
            <Match when={game()?.category === 'REACTION'}>
              <ReactionGame
                levelNumber={selectedLevel().levelNumber}
                config={selectedLevel().configuration}
                onComplete={handleGameComplete}
              />
            </Match>
            <Match when={game()?.category === 'MEMORY'}>
              <MemoryGame
                levelNumber={selectedLevel().levelNumber}
                config={selectedLevel().configuration}
                onComplete={handleGameComplete}
              />
            </Match>
            <Match when={game()?.category === 'ATTENTION'}>
              <AttentionGame
                levelNumber={selectedLevel().levelNumber}
                config={selectedLevel().configuration}
                onComplete={handleGameComplete}
              />
            </Match>
          </Switch>
        </div>
      </Show>
    </div>
  );
}

