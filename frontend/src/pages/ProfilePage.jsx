import { createSignal, Show, For } from 'solid-js';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { User, Mail, Award, Flame, Trophy, Check, Sparkles, Shield, Save } from 'lucide-solid';

export default function ProfilePage() {
  const auth = useAuth();
  const player = usePlayer();

  const [displayName, setDisplayName] = createSignal(auth.user()?.displayName || '');
  const [email, setEmail] = createSignal(auth.user()?.email || '');
  const [message, setMessage] = createSignal('');
  const [isSaving, setIsSaving] = createSignal(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSaving(true);
    try {
      await auth.updateProfile(displayName(), email());
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div class="space-y-8 py-8 px-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div class="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div class="flex items-center gap-5">
          <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[2px] shadow-xl shadow-cyan-500/20">
            <div class="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center text-2xl font-black text-cyan-400">
              {auth.user()?.displayName?.[0]?.toUpperCase() || 'P'}
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-black text-white">{auth.user()?.displayName}</h1>
              <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-xs">
                Level {player.stats()?.level || 1}
              </span>
            </div>
            <p class="text-xs text-slate-400 font-mono mt-1">@{auth.user()?.username} · {auth.user()?.email}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-center px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span class="text-[10px] text-slate-500 font-bold uppercase block">Streak</span>
            <span class="text-sm font-extrabold text-amber-400 font-mono">{player.stats()?.currentStreak || 0}d</span>
          </div>
          <div class="text-center px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span class="text-[10px] text-slate-500 font-bold uppercase block">Total XP</span>
            <span class="text-sm font-extrabold text-cyan-300 font-mono">{player.stats()?.totalXp || 0}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Edit Profile Form */}
        <div class="glass-panel rounded-3xl p-6 border border-slate-800 h-fit">
          <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <User size={16} class="text-cyan-400" /> Account Settings
          </h3>

          <Show when={message()}>
            <div class="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
              {message()}
            </div>
          </Show>

          <form onSubmit={handleUpdate} class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName()}
                onInput={(e) => setDisplayName(e.currentTarget.value)}
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving()}
              class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Save size={14} /> Save Profile Changes
            </button>
          </form>
        </div>

        {/* Right: Badges & Achievements (2 cols) */}
        <div class="md:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800">
          <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Award size={16} class="text-amber-400" /> Unlocked Badges & Milestones
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <For each={player.achievements()}>
              {(ach) => (
                <div
                  class="p-4 rounded-2xl border transition-all flex items-start gap-3"
                  classList={{
                    'bg-amber-500/10 border-amber-500/30 text-white': ach.unlocked,
                    'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60': !ach.unlocked,
                  }}
                >
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    classList={{
                      'bg-amber-500/20 text-amber-400': ach.unlocked,
                      'bg-slate-800 text-slate-600': !ach.unlocked,
                    }}
                  >
                    <Award size={20} />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-bold text-xs">{ach.title}</h4>
                      <Show when={ach.unlocked}>
                        <span class="text-[10px] text-amber-400 font-mono">+{ach.xpReward} XP</span>
                      </Show>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
                    <Show when={ach.unlockedAt}>
                      <span class="text-[10px] text-slate-500 font-mono block mt-2">
                        Unlocked: {new Date(ach.unlockedAt).toLocaleDateString()}
                      </span>
                    </Show>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}

