package com.clarityminds.backend.progress.repository;

import com.clarityminds.backend.progress.entity.PlayerGameProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerGameProgressRepository extends JpaRepository<PlayerGameProgress, Long> {
    List<PlayerGameProgress> findByUserId(Long userId);

    Optional<PlayerGameProgress> findByUserIdAndGameId(Long userId, Long gameId);
}
