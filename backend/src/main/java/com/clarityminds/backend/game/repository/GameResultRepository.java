package com.clarityminds.backend.game.repository;

import com.clarityminds.backend.game.entity.GameResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameResultRepository extends JpaRepository<GameResult, Long> {
    Optional<GameResult> findBySessionId(Long sessionId);
    Page<GameResult> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<GameResult> findByUserIdAndGameIdOrderByCreatedAtDesc(Long userId, Long gameId);
    List<GameResult> findByUserIdAndGameIdOrderByCreatedAtAsc(Long userId, Long gameId);
}

