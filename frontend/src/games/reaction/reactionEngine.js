export class ReactionEngine {
  constructor(config = {}) {
    this.targetSize = config.targetSize || 60;
    this.minDelay = config.minimumDelay || config.minDelayMs || 800;
    this.maxDelay = config.maximumDelay || config.maxDelayMs || 2200;
    this.roundCount = config.roundCount || config.totalRounds || 5;
    this.distractionCount = config.distractionCount || 0;
    this.falseTargetEnabled = Boolean(config.falseTargetEnabled);
    this.timeLimit = config.timeLimit || 25;

    this.currentRound = 0;
    this.correctClicks = 0;
    this.falseStarts = 0;
    this.distractorHits = 0;
    this.reactionTimes = [];
    this.state = 'IDLE'; // IDLE, WAITING, TARGET_ACTIVE, FALSE_ACTIVE, ROUND_FINISH, FINISHED
    this.targetPosition = { x: 50, y: 50 };
    this.distractors = [];
    this.targetSpawnTime = 0;
    this.delayTimer = null;
    this.roundTimer = null;
    this.listener = null;
    this.feedback = '';
  }

  start(listener) {
    this.listener = listener;
    this.currentRound = 0;
    this.correctClicks = 0;
    this.falseStarts = 0;
    this.distractorHits = 0;
    this.reactionTimes = [];
    this.nextRound();
  }

  nextRound() {
    this.clearTimers();
    if (this.currentRound >= this.roundCount) {
      this.finishGame();
      return;
    }

    this.currentRound += 1;
    this.state = 'WAITING';
    this.feedback = '';
    this.distractors = this.generateDistractors();
    this.notify();

    const delay = Math.floor(Math.random() * (this.maxDelay - this.minDelay)) + this.minDelay;

    this.delayTimer = setTimeout(() => {
      this.spawnStimulus();
    }, delay);
  }

  spawnStimulus() {
    const isFalse = this.falseTargetEnabled && Math.random() < 0.25;
    this.state = isFalse ? 'FALSE_ACTIVE' : 'TARGET_ACTIVE';
    this.targetPosition = {
      x: Math.floor(Math.random() * 70) + 15,
      y: Math.floor(Math.random() * 70) + 15,
    };
    this.targetSpawnTime = performance.now();
    this.notify();

    // Auto timeout if not clicked within 2.5 seconds
    this.roundTimer = setTimeout(() => {
      if (this.state === 'TARGET_ACTIVE') {
        this.feedback = 'MISS!';
        this.reactionTimes.push(2500);
        this.state = 'ROUND_FINISH';
        this.notify();
        setTimeout(() => this.nextRound(), 1000);
      } else if (this.state === 'FALSE_ACTIVE') {
        this.feedback = 'NICE DODGE!';
        this.state = 'ROUND_FINISH';
        this.notify();
        setTimeout(() => this.nextRound(), 1000);
      }
    }, 2500);
  }

  handleCanvasClick(isTarget = false, isDistractor = false) {
    if (this.state === 'WAITING') {
      this.clearTimers();
      this.falseStarts += 1;
      this.feedback = 'TOO EARLY! (-50 XP penalty)';
      this.state = 'ROUND_FINISH';
      this.notify();
      setTimeout(() => this.nextRound(), 1200);
      return;
    }

    if (this.state === 'TARGET_ACTIVE') {
      if (isTarget) {
        this.clearTimers();
        const reactionTime = Math.round(performance.now() - this.targetSpawnTime);
        this.reactionTimes.push(reactionTime);
        this.correctClicks += 1;
        this.feedback = `${reactionTime} ms!`;
        this.state = 'ROUND_FINISH';
        this.notify();
        setTimeout(() => this.nextRound(), 1000);
      } else if (isDistractor) {
        this.clearTimers();
        this.distractorHits += 1;
        this.feedback = 'DISTRACTOR HIT!';
        this.state = 'ROUND_FINISH';
        this.notify();
        setTimeout(() => this.nextRound(), 1200);
      }
      return;
    }

    if (this.state === 'FALSE_ACTIVE') {
      if (isTarget) {
        this.clearTimers();
        this.falseStarts += 1;
        this.feedback = 'FALSE TARGET TRIGGERED!';
        this.state = 'ROUND_FINISH';
        this.notify();
        setTimeout(() => this.nextRound(), 1200);
      }
    }
  }

  generateDistractors() {
    const list = [];
    const colors = ['#64748b', '#475569', '#334155', '#1e293b'];
    for (let i = 0; i < this.distractionCount; i++) {
      list.push({
        id: i,
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10,
        size: Math.floor(Math.random() * 20) + 20,
        color: colors[i % colors.length],
      });
    }
    return list;
  }

  finishGame() {
    this.clearTimers();
    this.state = 'FINISHED';

    const avgReactionTime = this.reactionTimes.length > 0
      ? Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length)
      : 0;

    const totalErrors = this.falseStarts + this.distractorHits + (this.roundCount - this.correctClicks);
    const accuracy = Math.max(0, Math.min(100, Math.round((this.correctClicks / this.roundCount) * 100)));
    const score = Math.max(0, Math.round((this.correctClicks * 200) - (this.falseStarts * 50) - (avgReactionTime / 5)));

    const summary = {
      score,
      accuracy,
      completionTime: (avgReactionTime * this.roundCount) / 1000.0,
      metrics: {
        reactionTimes: this.reactionTimes,
        avgReactionTime,
        correctClicks: this.correctClicks,
        falseStarts: this.falseStarts,
        distractorHits: this.distractorHits,
      }
    };

    this.notify(summary);
  }

  notify(summary = null) {
    if (this.listener) {
      this.listener({
        state: this.state,
        currentRound: this.currentRound,
        roundCount: this.roundCount,
        targetSize: this.targetSize,
        targetPosition: this.targetPosition,
        distractors: this.distractors,
        reactionTimes: this.reactionTimes,
        correctClicks: this.correctClicks,
        feedback: this.feedback,
        summary,
      });
    }
  }

  clearTimers() {
    if (this.delayTimer) clearTimeout(this.delayTimer);
    if (this.roundTimer) clearTimeout(this.roundTimer);
  }

  destroy() {
    this.clearTimers();
    this.listener = null;
  }
}

