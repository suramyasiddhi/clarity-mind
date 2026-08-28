export class MemoryEngine {
  constructor(config = {}) {
    this.sequenceLength = config.sequenceLength || 4;
    this.displayDuration = config.displayDuration || 700;
    this.delayBeforeInput = config.delayBeforeInput || 600;
    this.numberOfSymbols = config.numberOfSymbols || 4;
    this.reverseMode = !!config.reverseMode;

    this.symbols = [
      { id: 0, label: 'Cyan', color: '#06b6d4', glow: 'rgba(6,182,212,0.8)', bgClass: 'bg-cyan-500' },
      { id: 1, label: 'Emerald', color: '#10b981', glow: 'rgba(16,185,129,0.8)', bgClass: 'bg-emerald-500' },
      { id: 2, label: 'Rose', color: '#f43f5e', glow: 'rgba(244,63,94,0.8)', bgClass: 'bg-rose-500' },
      { id: 3, label: 'Amber', color: '#f59e0b', glow: 'rgba(245,158,11,0.8)', bgClass: 'bg-amber-500' },
      { id: 4, label: 'Violet', color: '#8b5cf6', glow: 'rgba(139,92,246,0.8)', bgClass: 'bg-violet-500' },
      { id: 5, label: 'Sky', color: '#38bdf8', glow: 'rgba(56,189,248,0.8)', bgClass: 'bg-sky-500' },
    ].slice(0, this.numberOfSymbols);

    this.state = 'IDLE'; // IDLE, WATCH_SEQUENCE, WAIT_INPUT, PLAYER_INPUT, FEEDBACK, GAME_OVER
    this.sequence = [];
    this.playerInput = [];
    this.activeHighlightIndex = null;
    this.currentPlaybackStep = -1;

    this.roundCount = 3; // 3 sequence rounds per level
    this.currentRound = 0;
    this.correctRounds = 0;
    this.totalResponseTimes = [];
    this.inputStartTime = null;
    this.gameStartTime = null;

    this.playbackTimer = null;
    this.onStateChange = null;
  }

  start(onStateChange) {
    this.onStateChange = onStateChange;
    this.currentRound = 0;
    this.correctRounds = 0;
    this.totalResponseTimes = [];
    this.gameStartTime = performance.now();

    this.startRound();
  }

  startRound() {
    if (this.currentRound >= this.roundCount) {
      this.finishGame();
      return;
    }

    this.currentRound++;
    this.playerInput = [];
    this.sequence = [];

    // Generate random sequence
    for (let i = 0; i < this.sequenceLength; i++) {
      const randomSymbol = Math.floor(Math.random() * this.numberOfSymbols);
      this.sequence.push(randomSymbol);
    }

    this.state = 'WATCH_SEQUENCE';
    this.currentPlaybackStep = -1;
    this.activeHighlightIndex = null;
    if (this.onStateChange) this.onStateChange(this.getSnapshot());

    // Begin sequence playback after short pause
    setTimeout(() => {
      this.playSequenceStep(0);
    }, 800);
  }

  playSequenceStep(index) {
    if (index >= this.sequence.length) {
      this.state = 'WAIT_INPUT';
      this.activeHighlightIndex = null;
      if (this.onStateChange) this.onStateChange(this.getSnapshot());

      setTimeout(() => {
        this.state = 'PLAYER_INPUT';
        this.inputStartTime = performance.now();
        if (this.onStateChange) this.onStateChange(this.getSnapshot());
      }, this.delayBeforeInput);
      return;
    }

    this.currentPlaybackStep = index;
    this.activeHighlightIndex = this.sequence[index];
    if (this.onStateChange) this.onStateChange(this.getSnapshot());

    setTimeout(() => {
      this.activeHighlightIndex = null;
      if (this.onStateChange) this.onStateChange(this.getSnapshot());

      // Interval before next symbol
      const interval = Math.max(150, Math.floor(this.displayDuration * 0.35));
      setTimeout(() => {
        this.playSequenceStep(index + 1);
      }, interval);
    }, this.displayDuration);
  }

  handlePadClick(symbolId) {
    if (this.state !== 'PLAYER_INPUT') return;

    this.playerInput.push(symbolId);
    const expectedSequence = this.reverseMode ? [...this.sequence].reverse() : this.sequence;
    const currentIndex = this.playerInput.length - 1;

    // Flash clicked pad
    this.activeHighlightIndex = symbolId;
    setTimeout(() => {
      this.activeHighlightIndex = null;
      if (this.onStateChange) this.onStateChange(this.getSnapshot());
    }, 200);

    if (this.onStateChange) this.onStateChange(this.getSnapshot());

    // Check if input is correct so far
    if (this.playerInput[currentIndex] !== expectedSequence[currentIndex]) {
      // Mistake made
      this.state = 'FEEDBACK';
      const roundTime = performance.now() - this.inputStartTime;
      this.totalResponseTimes.push(roundTime);

      if (this.onStateChange) {
        this.onStateChange({
          ...this.getSnapshot(),
          feedback: 'SEQUENCE MISMATCH!',
          isCorrect: false,
        });
      }

      setTimeout(() => this.startRound(), 1200);
      return;
    }

    // Check if completed whole sequence
    if (this.playerInput.length === expectedSequence.length) {
      this.correctRounds++;
      this.state = 'FEEDBACK';
      const roundTime = performance.now() - this.inputStartTime;
      this.totalResponseTimes.push(roundTime);

      if (this.onStateChange) {
        this.onStateChange({
          ...this.getSnapshot(),
          feedback: 'PERFECT RECALL! ⭐',
          isCorrect: true,
        });
      }

      setTimeout(() => this.startRound(), 1000);
    }
  }

  finishGame() {
    this.state = 'GAME_OVER';

    const accuracy = Math.round((this.correctRounds / this.roundCount) * 1000) / 10;
    const avgResponseTime = this.totalResponseTimes.length > 0
      ? Math.round(this.totalResponseTimes.reduce((a, b) => a + b, 0) / this.totalResponseTimes.length)
      : 0;

    const baseScore = this.correctRounds * 300;
    const speedBonus = Math.max(0, Math.round((10000 - avgResponseTime) / 50));
    const score = Math.round((baseScore + speedBonus) * (accuracy / 100));

    const totalTimeSeconds = Math.round(((performance.now() - this.gameStartTime) / 1000) * 10) / 10;

    const summary = {
      score: Math.max(50, score),
      accuracy,
      completionTime: totalTimeSeconds,
      metrics: {
        sequenceLength: this.sequenceLength,
        correctSequences: this.correctRounds,
        incorrectSequences: this.roundCount - this.correctRounds,
        averageResponseTime: avgResponseTime,
        reverseMode: this.reverseMode,
      },
    };

    if (this.onStateChange) this.onStateChange({ ...this.getSnapshot(), summary });
  }

  destroy() {
    clearTimeout(this.playbackTimer);
  }

  getSnapshot() {
    return {
      state: this.state,
      symbols: this.symbols,
      sequenceLength: this.sequenceLength,
      currentRound: this.currentRound,
      roundCount: this.roundCount,
      correctRounds: this.correctRounds,
      activeHighlightIndex: this.activeHighlightIndex,
      playerInputLength: this.playerInput.length,
      reverseMode: this.reverseMode,
    };
  }
}

