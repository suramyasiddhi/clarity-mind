package com.clarityminds.backend.progress.repository;

import com.clarityminds.backend.progress.entity.PlayerStats;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerStatsRepository extends JpaRepository<PlayerStats, Long> {
    Optional<PlayerStats> findByUserId(Long userId);

    @Query("SELECT ps FROM PlayerStats ps ORDER BY ps.totalXp DESC")
    List<PlayerStats> findTopPlayers(Pageable pageable);
}
