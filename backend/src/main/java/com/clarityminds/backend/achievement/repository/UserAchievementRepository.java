package com.clarityminds.backend.achievement.repository;

import com.clarityminds.backend.achievement.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    List<UserAchievement> findByUserIdOrderByUnlockedAtDesc(Long userId);

    Optional<UserAchievement> findByUserIdAndAchievementId(Long userId, Long achievementId);

    boolean existsByUserIdAndAchievementId(Long userId, Long achievementId);
}
