package com.clarityminds.backend.progress.entity;

import com.clarityminds.backend.user.entity.User;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "player_stats")
public class PlayerStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private Long userId;

    @Column(name = "total_xp", nullable = false)
    private Integer totalXp = 0;

    @Column(nullable = false)
    private Integer level = 1;

    @Column(name = "current_streak", nullable = false)
    private Integer currentStreak = 0;

    @Column(name = "longest_streak", nullable = false)
    private Integer longestStreak = 0;

    @Column(name = "games_played", nullable = false)
    private Integer gamesPlayed = 0;

    @Column(name = "last_played_date")
    private LocalDate lastPlayedDate;

    public PlayerStats() {
    }

    public PlayerStats(Long userId) {
        this.userId = userId;
        this.totalXp = 0;
        this.level = 1;
        this.currentStreak = 0;
        this.longestStreak = 0;
        this.gamesPlayed = 0;
    }

    public PlayerStats(User user) {
        this.userId = user.getId();
        this.totalXp = 0;
        this.level = 1;
        this.currentStreak = 0;
        this.longestStreak = 0;
        this.gamesPlayed = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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
