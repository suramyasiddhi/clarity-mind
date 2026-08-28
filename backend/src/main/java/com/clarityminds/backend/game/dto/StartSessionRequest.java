package com.clarityminds.backend.game.dto;

import jakarta.validation.constraints.NotNull;

public class StartSessionRequest {

    @NotNull(message = "gameId is required")
    private Long gameId;

    @NotNull(message = "levelId is required")
    private Long levelId;

    public StartSessionRequest() {
    }

    public StartSessionRequest(Long gameId, Long levelId) {
        this.gameId = gameId;
        this.levelId = levelId;
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
}

