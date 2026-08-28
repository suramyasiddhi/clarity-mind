package com.clarityminds.backend.game.entity;

import com.clarityminds.backend.game.enums.GameCategory;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private GameCategory category;

    @Column(length = 50)
    private String icon = "Zap";

    @Column(length = 20)
    private String color = "#06b6d4";

    @Column(name = "min_level")
    private int minLevel = 1;

    @Column(name = "display_order")
    private int displayOrder = 1;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Game() {}

    public Game(String code, String name, String description, GameCategory category) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.category = category;
        this.active = true;
    }

    public Game(String code, String name, String description, GameCategory category, String icon, String color, int minLevel, int displayOrder) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.category = category;
        this.icon = icon;
        this.color = color;
        this.minLevel = minLevel;
        this.displayOrder = displayOrder;
        this.active = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return name; }
    public void setTitle(String title) { this.name = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public GameCategory getCategory() { return category; }
    public void setCategory(GameCategory category) { this.category = category; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public int getMinLevel() { return minLevel; }
    public void setMinLevel(int minLevel) { this.minLevel = minLevel; }

    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }

    public boolean isActive() { return active; }
    public boolean getIsActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
