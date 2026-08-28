package com.clarityminds.backend;

import com.clarityminds.backend.achievement.service.AchievementService;
import com.clarityminds.backend.game.dto.CompleteSessionRequest;
import com.clarityminds.backend.game.dto.GameResultResponse;
import com.clarityminds.backend.game.dto.GameSessionResponse;
import com.clarityminds.backend.game.dto.StartSessionRequest;
import com.clarityminds.backend.game.entity.*;
import com.clarityminds.backend.game.enums.DifficultyLevel;
import com.clarityminds.backend.game.enums.GameCategory;
import com.clarityminds.backend.game.enums.SessionStatus;
import com.clarityminds.backend.game.repository.GameLevelRepository;
import com.clarityminds.backend.game.repository.GameRepository;
import com.clarityminds.backend.game.repository.GameResultRepository;
import com.clarityminds.backend.game.repository.GameSessionRepository;
import com.clarityminds.backend.game.service.GameSessionService;
import com.clarityminds.backend.progress.entity.PlayerGameProgress;
import com.clarityminds.backend.progress.entity.PlayerStats;
import com.clarityminds.backend.progress.repository.PlayerGameProgressRepository;
import com.clarityminds.backend.progress.repository.PlayerStatsRepository;
import com.clarityminds.backend.user.entity.Role;
import com.clarityminds.backend.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GameSessionServiceTest {

    @Mock
    private GameSessionRepository sessionRepository;
    @Mock
    private GameResultRepository resultRepository;
    @Mock
    private GameRepository gameRepository;
    @Mock
    private GameLevelRepository levelRepository;
    @Mock
    private PlayerStatsRepository statsRepository;
    @Mock
    private PlayerGameProgressRepository progressRepository;
    @Mock
    private AchievementService achievementService;

    @InjectMocks
    private GameSessionService gameSessionService;

    private User testUser;
    private Game testGame;
    private GameLevel testLevel;
    private GameSession testSession;

    @BeforeEach
    void setUp() {
        testUser = new User("testuser", "test@example.com", "hash", "Test User", Role.ROLE_USER);
        testUser.setId(1L);

        testGame = new Game("REACTION_QUICK_TAP", "Quick Tap", "Reaction game", GameCategory.REACTION, "Zap", "#06b6d4",
                1, 1);
        testGame.setId(10L);

        testLevel = new GameLevel(testGame, 1, DifficultyLevel.EASY, "{}", 50);
        testLevel.setId(100L);

        testSession = new GameSession(1L, 10L, 100L);
        testSession.setId(500L);
    }

    @Test
    void testStartSession() {
        StartSessionRequest req = new StartSessionRequest(10L, 100L);

        when(gameRepository.findById(10L)).thenReturn(Optional.of(testGame));
        when(levelRepository.findByIdAndGameId(100L, 10L)).thenReturn(Optional.of(testLevel));
        when(sessionRepository.save(any(GameSession.class))).thenReturn(testSession);

        GameSessionResponse res = gameSessionService.startGameSession(1L, req);

        assertNotNull(res);
        assertEquals(500L, res.getSessionId());
        assertEquals(10L, res.getGameId());
        assertEquals(100L, res.getLevelId());
    }

    @Test
    void testCompleteSession() {
        CompleteSessionRequest req = new CompleteSessionRequest(
                100, 95.0, 3.5, Map.of("reactionTime", 250));

        PlayerStats stats = new PlayerStats(1L);
        stats.setId(1L);

        PlayerGameProgress progress = new PlayerGameProgress(1L, 10L);
        progress.setId(1L);

        when(sessionRepository.findById(500L)).thenReturn(Optional.of(testSession));
        when(levelRepository.findById(100L)).thenReturn(Optional.of(testLevel));
        when(resultRepository.save(any(GameResult.class))).thenAnswer(i -> {
            GameResult r = i.getArgument(0);
            r.setId(999L);
            return r;
        });
        when(statsRepository.findByUserId(1L)).thenReturn(Optional.of(stats));
        when(progressRepository.findByUserIdAndGameId(1L, 10L)).thenReturn(Optional.of(progress));

        GameResultResponse res = gameSessionService.completeGameSession(1L, 500L, req);

        assertNotNull(res);
        assertTrue(res.getXpEarned() > 0);
        assertEquals(SessionStatus.COMPLETED, testSession.getStatus());
    }
}
