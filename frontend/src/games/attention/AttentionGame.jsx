import { createSignal, onMount, onCleanup, Show, For } from 'solid-js';
import { AttentionEngine } from './attentionEngine';
import { Target, Clock, Zap, CheckCircle, XCircle } from 'lucide-solid';

export default function AttentionGame(props) {
  const [engineState, setEngineState] = createSignal(null);
  const [feedback, setFeedback] = createSignal('');
  let engine = null;

  onMount(() => {
    engine = new AttentionEngine(props.config || {});
    engine.start((snapshot) => {
      setEngineState(snapshot);
      if (snapshot.feedback) {
        setFeedback(snapshot.feedback);
      }
      if (snapshot.summary) {
        props.onComplete(snapshot.summary);
      }
    });
  });

  onCleanup(() => {
    if (engine) engine.destroy();
  });

  const handleCellClick = (cellId) => {
    if (!engine) return;
    engine.handleCellClick(cellId);
  };

  const getGridColsClass = (gridSize) => {
    switch (gridSize) {
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      case 6: return 'grid-cols-6';
      case 7: return 'grid-cols-7';
      default: return 'grid-cols-4';
    }
  };

  return (
    <div class="flex flex-col h-full w-full max-w-4xl mx-auto select-none">
      {/* HUD Bar */}
      <div class="flex items-center justify-between px-6 py-4 glass-panel rounded-2xl mb-4 shadow-lg">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Target size={20} />
          </div>
          <div>
            <h3 class="font-bold text-white text-sm">Target Focus (Attention)</h3>
            <p class="text-xs text-slate-400">Level {props.levelNumber}</p>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Round</span>
            <span class="text-sm font-bold text-cyan-300 font-mono">
              {engineState()?.currentRound || 0} / {engineState()?.roundCount || 0}
            </span>
          </div>

          <div class="text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Time</span>
            <span class="text-sm font-bold text-amber-400 font-mono flex items-center gap-1">
              <Clock size={14} /> {engineState()?.timeRemaining || 0}s
            </span>
          </div>

          <div class="text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Found</span>
            <span class="text-sm font-bold text-emerald-400 font-mono">
              {engineState()?.targetsFound || 0} targets
            </span>
          </div>
        </div>
      </div>

      {/* Target Rule Banner */}
      <Show when={engineState()?.currentRule}>
        <div class="flex items-center justify-between px-6 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 mb-4 shadow-md">
          <div class="flex items-center gap-3">
            <span class="text-xs uppercase font-bold text-indigo-300">Target Rule:</span>
            <span class="text-sm font-black text-white">
              {engineState()?.currentRule.color.name} {engineState()?.currentRule.shape.toUpperCase()}
            </span>
          </div>
          <div
            style={{ 'background-color': engineState()?.currentRule.color.hex }}
            class="w-6 h-6 rounded-lg shadow-md border border-white/30"
          />
        </div>
      </Show>

      {/* Interactive Grid Arena */}
      <div class="relative flex-1 min-h-[440px] glass-panel rounded-3xl p-6 flex flex-col items-center justify-center border border-slate-700/50 bg-slate-950/80">
        <Show when={feedback()}>
          <div class="absolute top-4 z-20 px-4 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-cyan-300 text-xs font-bold shadow-xl animate-scale">
            {feedback()}
          </div>
        </Show>

        <div class={`grid gap-3 max-w-lg w-full aspect-square ${getGridColsClass(engineState()?.gridSize || 4)}`}>
          <For each={engineState()?.gridCells || []}>
            {(cell) => (
              <button
                onClick={() => handleCellClick(cell.id)}
                disabled={cell.clicked || cell.error || engineState()?.state !== 'ACTIVE'}
                style={{
                  'background-color': cell.clicked ? '#10b98120' : (cell.error ? '#ef444420' : '#1e293b60'),
                  'border-color': cell.clicked ? '#10b981' : (cell.error ? '#ef4444' : cell.color.hex),
                }}
                class="rounded-2xl border-2 flex items-center justify-center transition-all duration-150 cursor-pointer disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-md relative overflow-hidden"
              >
                <div
                  style={{ 'background-color': cell.color.hex }}
                  class="w-8 h-8 rounded-xl opacity-90 flex items-center justify-center text-xs font-bold text-white shadow-sm"
                  classList={{
                    'rounded-full': cell.shape === 'circle',
                    'rotate-45': cell.shape === 'diamond',
                  }}
                >
                  <Show when={cell.clicked}>
                    <CheckCircle size={18} class="text-white" />
                  </Show>
                  <Show when={cell.error}>
                    <XCircle size={18} class="text-white" />
                  </Show>
                </div>
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

