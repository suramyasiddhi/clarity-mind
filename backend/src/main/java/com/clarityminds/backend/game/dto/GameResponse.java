package com.clarityminds.backend.game.dto;

import com.clarityminds.backend.game.entity.Game;

public class GameResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private String category;
    private boolean active;

    public GameResponse() {
    }

    public static GameResponse fromEntity(Game game) {
        GameResponse response = new GameResponse();
        response.setId(game.getId());
        response.setCode(game.getCode());
        response.setName(game.getName());
        response.setDescription(game.getDescription());
        response.setCategory(game.getCategory().name());
        response.setActive(game.isActive());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

