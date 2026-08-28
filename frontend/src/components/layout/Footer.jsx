import { Brain, Heart } from 'lucide-solid';

export default function Footer() {
  return (
    <footer class="border-t border-slate-900 bg-slate-950/60 py-8 px-6 mt-auto text-xs text-slate-500">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <Brain size={16} class="text-cyan-500/80" />
          <span class="font-mono font-semibold text-slate-400">Clarity Minds Platform</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div class="flex items-center gap-1">
          Built for Cognitive Health & Adaptive Brain Performance
        </div>
      </div>
    </footer>
  );
}

