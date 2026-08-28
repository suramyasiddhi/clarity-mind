package com.clarityminds.backend.game.repository;

import com.clarityminds.backend.game.entity.GameLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameLevelRepository extends JpaRepository<GameLevel, Long> {
    List<GameLevel> findByGameIdAndActiveTrueOrderByLevelNumberAsc(Long gameId);
    Optional<GameLevel> findByGameIdAndLevelNumberAndActiveTrue(Long gameId, int levelNumber);
    Optional<GameLevel> findByIdAndGameId(Long id, Long gameId);
}

