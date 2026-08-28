package com.clarityminds.backend.game.entity;

import com.clarityminds.backend.game.enums.DifficultyLevel;
import jakarta.persistence.*;

@Entity
@Table(name = "game_levels", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"game_id", "levelNumber"})
})
public class GameLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(nullable = false)
    private int levelNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DifficultyLevel difficulty;

    @Column(nullable = false, length = 4000)
    private String configuration;

    @Column(nullable = false)
    private int xpReward;

    @Column(nullable = false)
    private boolean active = true;

    public GameLevel() {
    }

    public GameLevel(Game game, int levelNumber, DifficultyLevel difficulty, String configuration, int xpReward) {
        this.game = game;
        this.levelNumber = levelNumber;
        this.difficulty = difficulty;
        this.configuration = configuration;
        this.xpReward = xpReward;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public int getLevelNumber() {
        return levelNumber;
    }

    public void setLevelNumber(int levelNumber) {
        this.levelNumber = levelNumber;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public String getConfiguration() {
        return configuration;
    }

    public void setConfiguration(String configuration) {
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

