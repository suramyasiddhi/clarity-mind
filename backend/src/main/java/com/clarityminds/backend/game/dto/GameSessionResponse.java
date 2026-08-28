package com.clarityminds.backend.game.dto;

import com.clarityminds.backend.game.entity.GameSession;
import java.time.LocalDateTime;

public class GameSessionResponse {
    private Long sessionId;
    private Long gameId;
    private Long levelId;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public GameSessionResponse() {
    }

    public static GameSessionResponse fromEntity(GameSession session) {
        GameSessionResponse response = new GameSessionResponse();
        response.setSessionId(session.getId());
        response.setGameId(session.getGameId());
        response.setLevelId(session.getLevelId());
        response.setStatus(session.getStatus().name());
        response.setStartedAt(session.getStartedAt());
        response.setCompletedAt(session.getCompletedAt());
        return response;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}

