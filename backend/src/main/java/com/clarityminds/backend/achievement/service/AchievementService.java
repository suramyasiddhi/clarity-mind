package com.clarityminds.backend.achievement.service;

import com.clarityminds.backend.achievement.dto.AchievementResponse;
import com.clarityminds.backend.achievement.entity.Achievement;
import com.clarityminds.backend.achievement.entity.UserAchievement;
import com.clarityminds.backend.achievement.repository.AchievementRepository;
import com.clarityminds.backend.achievement.repository.UserAchievementRepository;
import com.clarityminds.backend.progress.entity.PlayerGameProgress;
import com.clarityminds.backend.progress.entity.PlayerStats;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    public AchievementService(AchievementRepository achievementRepository,
            UserAchievementRepository userAchievementRepository) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
    }

    @Transactional(readOnly = true)
    public List<AchievementResponse> getUserAchievements(Long userId) {
        List<Achievement> allAchievements = achievementRepository.findAll();
        List<UserAchievement> unlocked = userAchievementRepository.findByUserIdOrderByUnlockedAtDesc(userId);

        Map<Long, UserAchievement> unlockedMap = unlocked.stream()
                .collect(Collectors.toMap(ua -> ua.getAchievement().getId(), ua -> ua, (a, b) -> a));

        return allAchievements.stream()
                .map(a -> {
                    UserAchievement ua = unlockedMap.get(a.getId());
                    return AchievementResponse.fromEntity(a, ua != null, ua != null ? ua.getUnlockedAt() : null);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void checkAndUnlockAchievements(Long userId, PlayerStats stats, PlayerGameProgress progress, Long gameId,
            int levelNumber) {
        // Achievement: First Step (first game played)
        if (progress.getTotalCompleted() >= 1) {
            unlockAchievement(userId, "FIRST_GAME");
        }

        // Achievement: Level 5 Reached in Player Level
        if (stats.getLevel() >= 5) {
            unlockAchievement(userId, "LEVEL_5");
        }

        // Achievement: Master level (Completed level 10)
        if (levelNumber >= 10) {
            unlockAchievement(userId, "LEVEL_10_MASTER");
        }

        // Achievement: 3-Day Streak
        if (stats.getCurrentStreak() >= 3) {
            unlockAchievement(userId, "STREAK_3");
        }

        // Achievement: 7-Day Streak
        if (stats.getCurrentStreak() >= 7) {
            unlockAchievement(userId, "STREAK_7");
        }
    }

    private void unlockAchievement(Long userId, String code) {
        achievementRepository.findByCode(code).ifPresent(achievement -> {
            if (!userAchievementRepository.existsByUserIdAndAchievementId(userId, achievement.getId())) {
                UserAchievement userAchievement = new UserAchievement(userId, achievement);
                userAchievementRepository.save(userAchievement);
            }
        });
    }
}
