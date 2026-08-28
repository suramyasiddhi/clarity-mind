import { createSignal, onMount, onCleanup, Show, For } from 'solid-js';
import { MemoryEngine } from './memoryEngine';
import { Brain, Eye, Sparkles, RefreshCw } from 'lucide-solid';

export default function MemoryGame(props) {
  const [engineState, setEngineState] = createSignal(null);
  const [feedback, setFeedback] = createSignal('');
  const [isCorrectFeedback, setIsCorrectFeedback] = createSignal(true);
  let engine = null;

  onMount(() => {
    engine = new MemoryEngine(props.config || {});
    engine.start((snapshot) => {
      setEngineState(snapshot);
      if (snapshot.feedback) {
        setFeedback(snapshot.feedback);
        setIsCorrectFeedback(snapshot.isCorrect);
      }
      if (snapshot.summary) {
        props.onComplete(snapshot.summary);
      }
    });
  });

  onCleanup(() => {
    if (engine) engine.destroy();
  });

  const handlePadClick = (symbolId) => {
    if (!engine) return;
    engine.handlePadClick(symbolId);
  };

  return (
    <div class="flex flex-col h-full w-full max-w-3xl mx-auto select-none">
      {/* Game HUD */}
      <div class="flex items-center justify-between px-6 py-4 glass-panel rounded-2xl mb-4 shadow-lg">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Brain size={20} />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-white text-sm">Sequence Recall (Memory)</h3>
              <Show when={engineState()?.reverseMode}>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <RefreshCw size={10} class="animate-spin" /> REVERSE MODE
                </span>
              </Show>
            </div>
            <p class="text-xs text-slate-400">Level {props.levelNumber}</p>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Round</span>
            <span class="text-sm font-bold text-violet-300 font-mono">
              {engineState()?.currentRound || 0} / {engineState()?.roundCount || 0}
            </span>
          </div>

          <div class="text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Length</span>
            <span class="text-sm font-bold text-cyan-400 font-mono">
              {engineState()?.sequenceLength || 0} items
            </span>
          </div>

          <div class="text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Correct</span>
            <span class="text-sm font-bold text-emerald-400 font-mono">
              {engineState()?.correctRounds || 0} / {engineState()?.roundCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Main Arena */}
      <div class="relative flex-1 min-h-[440px] glass-panel rounded-3xl p-8 flex flex-col items-center justify-center border border-slate-700/50 bg-slate-950/80">
        <div class="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

        {/* State Banner */}
        <div class="mb-8 text-center z-10">
          <Show when={engineState()?.state === 'WATCH_SEQUENCE'}>
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-semibold animate-pulse">
              <Eye size={16} /> OBSERVE THE SEQUENCE...
            </div>
          </Show>

          <Show when={engineState()?.state === 'WAIT_INPUT'}>
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-semibold">
              <Sparkles size={16} /> GET READY...
            </div>
          </Show>

          <Show when={engineState()?.state === 'PLAYER_INPUT'}>
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold animate-bounce">
              <Brain size={16} /> {engineState()?.reverseMode ? 'REPRODUCE IN REVERSE!' : 'REPRODUCE SEQUENCE!'}
            </div>
            <div class="flex justify-center gap-2 mt-3">
              <For each={Array.from({ length: engineState()?.sequenceLength || 0 })}>
                {(_, idx) => (
                  <div
                    class="w-3 h-3 rounded-full transition-all duration-200"
                    classList={{
                      'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]': idx() < (engineState()?.playerInputLength || 0),
                      'bg-slate-700': idx() >= (engineState()?.playerInputLength || 0),
                    }}
                  />
                )}
              </For>
            </div>
          </Show>

          <Show when={engineState()?.state === 'FEEDBACK'}>
            <div
              class="px-6 py-2 rounded-2xl text-lg font-black tracking-wide border shadow-2xl animate-scale"
              classList={{
                'bg-emerald-950/80 border-emerald-500 text-emerald-300': isCorrectFeedback(),
                'bg-rose-950/80 border-rose-500 text-rose-300': !isCorrectFeedback(),
              }}
            >
              {feedback()}
            </div>
          </Show>
        </div>

        {/* Memory Pads Grid */}
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 z-10 max-w-md w-full">
          <For each={engineState()?.symbols || []}>
            {(sym) => {
              const isLit = () => engineState()?.activeHighlightIndex === sym.id;
              return (
                <button
                  onClick={() => handlePadClick(sym.id)}
                  disabled={engineState()?.state !== 'PLAYER_INPUT'}
                  style={{
                    'border-color': isLit() ? sym.color : 'rgba(255,255,255,0.1)',
                    'box-shadow': isLit() ? `0 0 35px ${sym.glow}` : 'none',
                    'transform': isLit() ? 'scale(1.05)' : 'scale(1)',
                  }}
                  class="aspect-square rounded-2xl sm:rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-150 glass-card cursor-pointer disabled:cursor-not-allowed group border-2"
                >
                  <div
                    style={{ 'background-color': sym.color }}
                    class="w-12 h-12 rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                    classList={{
                      'opacity-100 ring-4 ring-white': isLit(),
                    }}
                  >
                    <div class="w-4 h-4 rounded-full bg-white/40" />
                  </div>
                  <span class="text-xs font-semibold text-slate-300 mt-2">{sym.label}</span>
                </button>
              );
            }}
          </For>
        </div>
      </div>

      {/* Footer Instructions */}
      <div class="mt-4 flex items-center justify-between text-xs text-slate-400 px-4">
        <span>💡 Watch the colored pads illuminate, then tap the pads in the same order.</span>
        <span>{engineState()?.reverseMode ? '⚠️ Reverse Mode: Enter the sequence backwards!' : ''}</span>
      </div>
    </div>
  );
}

