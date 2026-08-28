package com.clarityminds.backend.game.dto;

import jakarta.validation.constraints.NotNull;

public class StartSessionRequest {

    @NotNull(message = "gameId is required")
    private Long gameId;

    private Long levelId;
    private Integer levelNumber;

    public StartSessionRequest() {
    }

    public StartSessionRequest(Long gameId, Long levelId) {
        this.gameId = gameId;
        this.levelId = levelId;
    }

    public StartSessionRequest(Long gameId, Integer levelNumber) {
        this.gameId = gameId;
        this.levelNumber = levelNumber;
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

    public Integer getLevelNumber() {
        return levelNumber;
    }

    public void setLevelNumber(Integer levelNumber) {
        this.levelNumber = levelNumber;
    }
}
