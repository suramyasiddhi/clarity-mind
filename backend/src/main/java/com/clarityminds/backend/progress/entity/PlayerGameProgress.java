package com.clarityminds.backend.progress.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "player_game_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "game_id" })
})
public class PlayerGameProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "game_id", nullable = false)
    private Long gameId;

    @Column(name = "current_level", nullable = false)
    private Integer currentLevel = 1;

    @Column(name = "highest_level", nullable = false)
    private Integer highestLevel = 1;

    @Column(name = "best_score", nullable = false)
    private Integer bestScore = 0;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore = 0;

    @Column(name = "best_accuracy", nullable = false)
    private Double bestAccuracy = 0.0;

    @Column(name = "total_attempts", nullable = false)
    private Integer totalAttempts = 0;

    @Column(name = "total_completed", nullable = false)
    private Integer totalCompleted = 0;

    public PlayerGameProgress() {
    }

    public PlayerGameProgress(Long userId, Long gameId) {
        this.userId = userId;
        this.gameId = gameId;
        this.currentLevel = 1;
        this.highestLevel = 1;
        this.bestScore = 0;
        this.totalScore = 0;
        this.bestAccuracy = 0.0;
        this.totalAttempts = 0;
        this.totalCompleted = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Integer getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(Integer currentLevel) {
        this.currentLevel = currentLevel;
    }

    public Integer getHighestLevel() {
        return highestLevel;
    }

    public void setHighestLevel(Integer highestLevel) {
        this.highestLevel = highestLevel;
    }

    public Integer getHighestUnlockedLevel() {
        return highestLevel;
    }

    public void setHighestUnlockedLevel(Integer highestUnlockedLevel) {
        this.highestLevel = highestUnlockedLevel;
    }

    public Integer getBestScore() {
        return bestScore;
    }

    public void setBestScore(Integer bestScore) {
        this.bestScore = bestScore;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public Double getBestAccuracy() {
        return bestAccuracy;
    }

    public void setBestAccuracy(Double bestAccuracy) {
        this.bestAccuracy = bestAccuracy;
    }

    public Integer getTotalAttempts() {
        return totalAttempts;
    }

    public void setTotalAttempts(Integer totalAttempts) {
        this.totalAttempts = totalAttempts;
    }

    public Integer getTotalCompleted() {
        return totalCompleted;
    }

    public void setTotalCompleted(Integer totalCompleted) {
        this.totalCompleted = totalCompleted;
    }
}
