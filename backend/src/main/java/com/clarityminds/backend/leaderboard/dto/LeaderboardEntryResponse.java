package com.clarityminds.backend.leaderboard.dto;

public class LeaderboardEntryResponse {
    private int rank;
    private Long userId;
    private String username;
    private String displayName;
    private int totalXp;
    private int level;
    private int streak;

    public LeaderboardEntryResponse() {
    }

    public LeaderboardEntryResponse(int rank, Long userId, String username, String displayName, int totalXp, int level,
            int streak) {
        this.rank = rank;
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;
        this.totalXp = totalXp;
        this.level = level;
        this.streak = streak;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
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

    public int getTotalXp() {
        return totalXp;
    }

    public void setTotalXp(int totalXp) {
        this.totalXp = totalXp;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getStreak() {
        return streak;
    }

    public void setStreak(int streak) {
        this.streak = streak;
    }
}
