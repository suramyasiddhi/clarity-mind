package com.clarityminds.backend.game.dto;

import com.clarityminds.backend.game.entity.GameResult;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;

public class GameResultResponse {
    private Long id;
    private Long sessionId;
    private Long userId;
    private Long gameId;
    private Long levelId;
    private int score;
    private int xpEarned;
    private double accuracy;
    private double completionTime;
    private Object metrics;
    private boolean levelUp;
    private int newPlayerLevel;
    private int currentStreak;
    private boolean nextLevelUnlocked;
    private LocalDateTime createdAt;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public GameResultResponse() {
    }

    public static GameResultResponse fromEntity(GameResult result) {
        GameResultResponse response = new GameResultResponse();
        response.setId(result.getId());
        response.setSessionId(result.getSessionId());
        response.setUserId(result.getUserId());
        response.setGameId(result.getGameId());
        response.setLevelId(result.getLevelId());
        response.setScore(result.getScore());
        response.setXpEarned(result.getXpEarned());
        response.setAccuracy(result.getAccuracy());
        response.setCompletionTime(result.getCompletionTime());
        response.setCreatedAt(result.getCreatedAt());

        try {
            if (result.getMetricsJson() != null && !result.getMetricsJson().isBlank()) {
                response.setMetrics(objectMapper.readTree(result.getMetricsJson()));
            }
        } catch (Exception e) {
            response.setMetrics(result.getMetricsJson());
        }

        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
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

    public Long getLevelId() {
        return levelId;
    }

    public void setLevelId(Long levelId) {
        this.levelId = levelId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getXpEarned() {
        return xpEarned;
    }

    public void setXpEarned(int xpEarned) {
        this.xpEarned = xpEarned;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public double getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(double completionTime) {
        this.completionTime = completionTime;
    }

    public Object getMetrics() {
        return metrics;
    }

    public void setMetrics(Object metrics) {
        this.metrics = metrics;
    }

    public boolean isLevelUp() {
        return levelUp;
    }

    public void setLevelUp(boolean levelUp) {
        this.levelUp = levelUp;
    }

    public int getNewPlayerLevel() {
        return newPlayerLevel;
    }

    public void setNewPlayerLevel(int newPlayerLevel) {
        this.newPlayerLevel = newPlayerLevel;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public boolean isNextLevelUnlocked() {
        return nextLevelUnlocked;
    }

    public void setNextLevelUnlocked(boolean nextLevelUnlocked) {
        this.nextLevelUnlocked = nextLevelUnlocked;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

