package com.clarityminds.backend.game.dto;

import com.clarityminds.backend.game.entity.GameLevel;
import com.fasterxml.jackson.databind.ObjectMapper;

public class GameLevelResponse {
    private Long id;
    private Long gameId;
    private int levelNumber;
    private String difficulty;
    private Object configuration;
    private int xpReward;
    private boolean active;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public GameLevelResponse() {
    }

    public static GameLevelResponse fromEntity(GameLevel level) {
        GameLevelResponse response = new GameLevelResponse();
        response.setId(level.getId());
        response.setGameId(level.getGame().getId());
        response.setLevelNumber(level.getLevelNumber());
        response.setDifficulty(level.getDifficulty().name());
        response.setXpReward(level.getXpReward());
        response.setActive(level.isActive());

        try {
            if (level.getConfiguration() != null && !level.getConfiguration().isBlank()) {
                response.setConfiguration(objectMapper.readTree(level.getConfiguration()));
            }
        } catch (Exception e) {
            response.setConfiguration(level.getConfiguration());
        }

        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public int getLevelNumber() {
        return levelNumber;
    }

    public void setLevelNumber(int levelNumber) {
        this.levelNumber = levelNumber;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Object getConfiguration() {
        return configuration;
    }

    public void setConfiguration(Object configuration) {
        this.configuration = configuration;
    }

    public int getXpReward() {
        return xpReward;
    }

    public void setXpReward(int xpReward) {
        this.xpReward = xpReward;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

