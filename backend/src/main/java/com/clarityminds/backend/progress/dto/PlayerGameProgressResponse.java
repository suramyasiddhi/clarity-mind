package com.clarityminds.backend.progress.dto;

public class PlayerGameProgressResponse {
    private Long gameId;
    private String gameCode;
    private String gameTitle;
    private String category;
    private Integer highestUnlockedLevel;
    private Integer bestScore;
    private Double bestAccuracy;
    private Integer totalAttempts;

    public PlayerGameProgressResponse() {
    }

    public PlayerGameProgressResponse(Long gameId, String gameCode, String gameTitle, String category,
            Integer highestUnlockedLevel, Integer bestScore, Double bestAccuracy, Integer totalAttempts) {
        this.gameId = gameId;
        this.gameCode = gameCode;
        this.gameTitle = gameTitle;
        this.category = category;
        this.highestUnlockedLevel = highestUnlockedLevel;
        this.bestScore = bestScore;
        this.bestAccuracy = bestAccuracy;
        this.totalAttempts = totalAttempts;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public String getGameCode() {
        return gameCode;
    }

    public void setGameCode(String gameCode) {
        this.gameCode = gameCode;
    }

    public String getGameTitle() {
        return gameTitle;
    }

    public void setGameTitle(String gameTitle) {
        this.gameTitle = gameTitle;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getHighestUnlockedLevel() {
        return highestUnlockedLevel;
    }

    public void setHighestUnlockedLevel(Integer highestUnlockedLevel) {
        this.highestUnlockedLevel = highestUnlockedLevel;
    }

    public Integer getBestScore() {
        return bestScore;
    }

    public void setBestScore(Integer bestScore) {
        this.bestScore = bestScore;
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
}
