import { createSignal, onMount, onCleanup, Show, For } from 'solid-js';
import { ReactionEngine } from './reactionEngine';
import { Zap, AlertTriangle, Target, Timer } from 'lucide-solid';

export default function ReactionGame(props) {
  const [engineState, setEngineState] = createSignal(null);
  const [feedback, setFeedback] = createSignal('');
  let engine = null;

  onMount(() => {
    engine = new ReactionEngine(props.config || {});
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

  const handleArenaClick = (e) => {
    if (!engine) return;
    engine.handleCanvasClick(false, false);
  };

  const handleTargetClick = (e) => {
    e.stopPropagation();
    if (!engine) return;
    engine.handleCanvasClick(true, false);
  };

  const handleDistractorClick = (e) => {
    e.stopPropagation();
    if (!engine) return;
    engine.handleCanvasClick(false, true);
  };

  return (
    <div class="flex flex-col h-full w-full max-w-4xl mx-auto select-none">
      {/* Game HUD */}
      <div class="flex items-center justify-between px-6 py-4 glass-panel rounded-2xl mb-4 shadow-lg">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap size={20} />
          </div>
          <div>
            <h3 class="font-bold text-white text-sm">Quick Tap (Reaction)</h3>
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
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Avg Speed</span>
            <span class="text-sm font-bold text-emerald-400 font-mono">
              {engineState()?.reactionTimes?.length > 0
                ? Math.round(engineState().reactionTimes.reduce((a, b) => a + b, 0) / engineState().reactionTimes.length)
                : 0} ms
            </span>
          </div>

          <div class="text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Accuracy</span>
            <span class="text-sm font-bold text-violet-400 font-mono">
              {engineState()?.correctClicks || 0} hits
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Arena */}
      <div
        onClick={handleArenaClick}
        class="relative flex-1 min-h-[440px] glass-panel rounded-3xl overflow-hidden border border-slate-700/50 flex items-center justify-center cursor-crosshair bg-slate-950/80 transition-all"
        classList={{
          'ring-2 ring-red-500/40 bg-red-950/20': engineState()?.state === 'FALSE_ACTIVE',
          'ring-2 ring-cyan-500/40 bg-cyan-950/10': engineState()?.state === 'TARGET_ACTIVE',
        }}
      >
        {/* Ambient Grid overlay */}
        <div class="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

        {/* State Indicators & Instructions */}
        <Show when={engineState()?.state === 'WAITING'}>
          <div class="text-center animate-pulse pointer-events-none z-10">
            <div class="inline-flex items-center justify-center p-4 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 mb-3 shadow-xl">
              <Timer size={36} class="animate-spin" />
            </div>
            <h2 class="text-xl font-bold text-slate-200 tracking-wide">WAIT FOR TARGET...</h2>
            <p class="text-xs text-slate-400 mt-1">Do not tap before the cyan target appears!</p>
          </div>
        </Show>

        <Show when={engineState()?.state === 'ROUND_FINISH'}>
          <div class="text-center pointer-events-none z-10 animate-bounce">
            <h2 class="text-2xl font-black text-white px-6 py-2 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-2xl">
              {feedback()}
            </h2>
          </div>
        </Show>

        {/* Real Active Target */}
        <Show when={engineState()?.state === 'TARGET_ACTIVE'}>
          <button
            onClick={handleTargetClick}
            style={{
              left: `${engineState()?.targetPosition.x}%`,
              top: `${engineState()?.targetPosition.y}%`,
              width: `${engineState()?.targetSize}px`,
              height: `${engineState()?.targetSize}px`,
              transform: 'translate(-50%, -50%)',
            }}
            class="absolute rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-teal-300 border-2 border-white shadow-[0_0_35px_rgba(6,182,212,0.8)] cursor-pointer active:scale-95 transition-transform flex items-center justify-center group z-20 animate-scale"
          >
            <div class="w-1/3 h-1/3 rounded-full bg-white animate-ping opacity-75" />
          </button>
        </Show>

        {/* False Warning Target (In higher levels) */}
        <Show when={engineState()?.state === 'FALSE_ACTIVE'}>
          <button
            onClick={handleTargetClick}
            style={{
              left: `${engineState()?.targetPosition.x}%`,
              top: `${engineState()?.targetPosition.y}%`,
              width: `${engineState()?.targetSize}px`,
              height: `${engineState()?.targetSize}px`,
              transform: 'translate(-50%, -50%)',
            }}
            class="absolute rounded-full bg-gradient-to-tr from-red-600 to-rose-400 border-2 border-white shadow-[0_0_35px_rgba(239,68,68,0.8)] cursor-pointer flex items-center justify-center z-20"
          >
            <AlertTriangle size={24} class="text-white animate-pulse" />
          </button>
        </Show>

        {/* Distractor Elements */}
        <For each={engineState()?.distractors || []}>
          {(dist) => (
            <div
              onClick={handleDistractorClick}
              style={{
                left: `${dist.x}%`,
                top: `${dist.y}%`,
                width: `${dist.size}px`,
                height: `${dist.size}px`,
                transform: 'translate(-50%, -50%)',
                'background-color': dist.color,
              }}
              class="absolute rounded-full opacity-40 hover:opacity-60 transition-opacity border border-slate-600/50 cursor-pointer pointer-events-auto"
            />
          )}
        </For>
      </div>

      {/* Footer Instructions */}
      <div class="mt-4 flex items-center justify-between text-xs text-slate-400 px-4">
        <span>💡 Tap the <strong>Cyan target</strong> as quickly as possible when it appears.</span>
        <span>Avoid tapping during the wait phase or tapping red warnings.</span>
      </div>
    </div>
  );
}

