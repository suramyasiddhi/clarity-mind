package com.clarityminds.backend.game.repository;

import com.clarityminds.backend.game.entity.GameSession;
import com.clarityminds.backend.game.enums.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    List<GameSession> findByUserIdOrderByStartedAtDesc(Long userId);

    List<GameSession> findByUserIdAndStatus(Long userId, SessionStatus status);
}
