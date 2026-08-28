export class AttentionEngine {
  constructor(config = {}) {
    this.gridSize = config.gridSize || 4; // 3 to 7
    this.targetCount = config.targetCount || 2;
    this.distractorCount = config.distractorCount || 10;
    this.timeLimit = config.timeLimit || 10;
    this.similarDistractors = !!config.similarDistractors;

    this.roundCount = 3;
    this.currentRound = 0;
    this.correctClicks = 0;
    this.incorrectClicks = 0;
    this.missedTargets = 0;
    this.targetsFound = 0;
    this.totalTargetsSpawned = 0;

    this.state = 'IDLE'; // IDLE, ACTIVE, ROUND_FINISH, GAME_OVER
    this.currentRule = null;
    this.gridCells = [];
    this.timeRemaining = this.timeLimit;
    this.timerInterval = null;
    this.responseTimes = [];
    this.roundStartTime = null;
    this.gameStartTime = null;

    this.onStateChange = null;

    this.shapes = ['circle', 'square', 'diamond', 'triangle', 'star'];
    this.colors = [
      { name: 'Red', hex: '#ef4444', ring: 'ring-red-500' },
      { name: 'Cyan', hex: '#06b6d4', ring: 'ring-cyan-500' },
      { name: 'Emerald', hex: '#10b981', ring: 'ring-emerald-500' },
      { name: 'Amber', hex: '#f59e0b', ring: 'ring-amber-500' },
      { name: 'Violet', hex: '#8b5cf6', ring: 'ring-violet-500' },
    ];
  }

  start(onStateChange) {
    this.onStateChange = onStateChange;
    this.currentRound = 0;
    this.correctClicks = 0;
    this.incorrectClicks = 0;
    this.missedTargets = 0;
    this.targetsFound = 0;
    this.totalTargetsSpawned = 0;
    this.responseTimes = [];
    this.gameStartTime = performance.now();

    this.startRound();
  }

  startRound() {
    if (this.currentRound >= this.roundCount) {
      this.finishGame();
      return;
    }

    this.currentRound++;
    this.timeRemaining = this.timeLimit;

    // Pick target rule
    const targetShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
    const targetColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.currentRule = { shape: targetShape, color: targetColor };

    // Build grid cells
    const totalCells = this.gridSize * this.gridSize;
    const cells = [];

    // Select random indices for targets
    const targetIndices = new Set();
    while (targetIndices.size < Math.min(this.targetCount, totalCells)) {
      targetIndices.add(Math.floor(Math.random() * totalCells));
    }

    this.totalTargetsSpawned += targetIndices.size;

    for (let i = 0; i < totalCells; i++) {
      if (targetIndices.has(i)) {
        cells.push({
          id: i,
          isTarget: true,
          shape: targetShape,
          color: targetColor,
          clicked: false,
          error: false,
        });
      } else {
        // Generate distractor
        let distShape, distColor;
        if (this.similarDistractors) {
          // Same shape different color OR same color different shape
          if (Math.random() > 0.5) {
            distShape = targetShape;
            const otherColors = this.colors.filter((c) => c.name !== targetColor.name);
            distColor = otherColors[Math.floor(Math.random() * otherColors.length)];
          } else {
            const otherShapes = this.shapes.filter((s) => s !== targetShape);
            distShape = otherShapes[Math.floor(Math.random() * otherShapes.length)];
            distColor = targetColor;
          }
        } else {
          const otherColors = this.colors.filter((c) => c.name !== targetColor.name);
          const otherShapes = this.shapes.filter((s) => s !== targetShape);
          distShape = otherShapes[Math.floor(Math.random() * otherShapes.length)];
          distColor = otherColors[Math.floor(Math.random() * otherColors.length)];
        }

        cells.push({
          id: i,
          isTarget: false,
          shape: distShape,
          color: distColor,
          clicked: false,
          error: false,
        });
      }
    }

    this.gridCells = cells;
    this.state = 'ACTIVE';
    this.roundStartTime = performance.now();

    if (this.onStateChange) this.onStateChange(this.getSnapshot());

    // Timer countdown
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeRemaining = Math.max(0, Math.round((this.timeRemaining - 0.1) * 10) / 10);
      if (this.onStateChange) this.onStateChange(this.getSnapshot());

      if (this.timeRemaining <= 0) {
        this.handleTimeExpired();
      }
    }, 100);
  }

  handleCellClick(cellId) {
    if (this.state !== 'ACTIVE') return;

    const cell = this.gridCells.find((c) => c.id === cellId);
    if (!cell || cell.clicked || cell.error) return;

    if (cell.isTarget) {
      cell.clicked = true;
      this.correctClicks++;
      this.targetsFound++;
      const timeTaken = performance.now() - this.roundStartTime;
      this.responseTimes.push(timeTaken);

      // Check if all targets in round found
      const remainingTargets = this.gridCells.filter((c) => c.isTarget && !c.clicked).length;
      if (remainingTargets === 0) {
        clearInterval(this.timerInterval);
        this.state = 'ROUND_FINISH';
        if (this.onStateChange) {
          this.onStateChange({
            ...this.getSnapshot(),
            feedback: 'ALL TARGETS FOUND! 🎯',
          });
        }
        setTimeout(() => this.startRound(), 900);
      } else {
        if (this.onStateChange) this.onStateChange(this.getSnapshot());
      }
    } else {
      // Distractor hit
      cell.error = true;
      this.incorrectClicks++;
      if (this.onStateChange) {
        this.onStateChange({
          ...this.getSnapshot(),
          feedback: 'WRONG TARGET!',
        });
      }
    }
  }

  handleTimeExpired() {
    clearInterval(this.timerInterval);
    const unclickedTargets = this.gridCells.filter((c) => c.isTarget && !c.clicked).length;
    this.missedTargets += unclickedTargets;

    this.state = 'ROUND_FINISH';
    if (this.onStateChange) {
      this.onStateChange({
        ...this.getSnapshot(),
        feedback: 'TIME UP!',
      });
    }
    setTimeout(() => this.startRound(), 1000);
  }

  finishGame() {
    clearInterval(this.timerInterval);
    this.state = 'GAME_OVER';

    const totalClicks = this.correctClicks + this.incorrectClicks + this.missedTargets;
    const accuracy = totalClicks > 0
      ? Math.round((this.correctClicks / totalClicks) * 1000) / 10
      : 0;

    const avgResponseTime = this.responseTimes.length > 0
      ? Math.round(this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length)
      : 0;

    const baseScore = this.targetsFound * 250;
    const penalty = this.incorrectClicks * 50;
    const score = Math.max(50, Math.round((baseScore - penalty) * (accuracy / 100)));

    const totalTimeSeconds = Math.round(((performance.now() - this.gameStartTime) / 1000) * 10) / 10;

    const summary = {
      score,
      accuracy,
      completionTime: totalTimeSeconds,
      metrics: {
        correctClicks: this.correctClicks,
        incorrectClicks: this.incorrectClicks,
        missedTargets: this.missedTargets,
        targetsFound: this.targetsFound,
        averageResponseTime: avgResponseTime,
      },
    };

    if (this.onStateChange) this.onStateChange({ ...this.getSnapshot(), summary });
  }

  destroy() {
    clearInterval(this.timerInterval);
  }

  getSnapshot() {
    return {
      state: this.state,
      currentRound: this.currentRound,
      roundCount: this.roundCount,
      gridSize: this.gridSize,
      gridCells: [...this.gridCells],
      currentRule: this.currentRule,
      timeRemaining: this.timeRemaining,
      timeLimit: this.timeLimit,
      correctClicks: this.correctClicks,
      targetsFound: this.targetsFound,
    };
  }
}

