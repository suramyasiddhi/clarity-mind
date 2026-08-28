package com.clarityminds.backend.progress.dto;

import java.time.LocalDate;

public class PlayerStatsResponse {
    private Long userId;
    private String username;
    private String displayName;
    private Integer totalXp;
    private Integer level;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer gamesPlayed;
    private LocalDate lastPlayedDate;

    public PlayerStatsResponse() {
    }

    public PlayerStatsResponse(Long userId, String username, String displayName, Integer totalXp, Integer level,
            Integer currentStreak, Integer longestStreak, Integer gamesPlayed, LocalDate lastPlayedDate) {
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;
        this.totalXp = totalXp;
        this.level = level;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.gamesPlayed = gamesPlayed;
        this.lastPlayedDate = lastPlayedDate;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Integer getTotalXp() {
        return totalXp;
    }

    public void setTotalXp(Integer totalXp) {
        this.totalXp = totalXp;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Integer getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(Integer longestStreak) {
        this.longestStreak = longestStreak;
    }

    public Integer getGamesPlayed() {
        return gamesPlayed;
    }

    public void setGamesPlayed(Integer gamesPlayed) {
        this.gamesPlayed = gamesPlayed;
    }

    public LocalDate getLastPlayedDate() {
        return lastPlayedDate;
    }

    public void setLastPlayedDate(LocalDate lastPlayedDate) {
        this.lastPlayedDate = lastPlayedDate;
    }
}
