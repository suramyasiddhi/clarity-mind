package com.clarityminds.backend.achievement.dto;

import com.clarityminds.backend.achievement.entity.Achievement;
import java.time.LocalDateTime;

public class AchievementResponse {
    private Long id;
    private String code;
    private String title;
    private String description;
    private String icon;
    private int xpReward;
    private boolean unlocked;
    private LocalDateTime unlockedAt;

    public AchievementResponse() {
    }

    public static AchievementResponse fromEntity(Achievement achievement, boolean unlocked, LocalDateTime unlockedAt) {
        AchievementResponse response = new AchievementResponse();
        response.setId(achievement.getId());
        response.setCode(achievement.getCode());
        response.setTitle(achievement.getTitle());
        response.setDescription(achievement.getDescription());
        response.setIcon(achievement.getIcon());
        response.setXpReward(achievement.getXpReward());
        response.setUnlocked(unlocked);
        response.setUnlockedAt(unlockedAt);
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public int getXpReward() {
        return xpReward;
    }

    public void setXpReward(int xpReward) {
        this.xpReward = xpReward;
    }

    public boolean isUnlocked() {
        return unlocked;
    }

    public void setUnlocked(boolean unlocked) {
        this.unlocked = unlocked;
    }

    public LocalDateTime getUnlockedAt() {
        return unlockedAt;
    }

    public void setUnlockedAt(LocalDateTime unlockedAt) {
        this.unlockedAt = unlockedAt;
    }
}
