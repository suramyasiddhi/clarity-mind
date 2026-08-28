package com.clarityminds.backend.game.service;

import com.clarityminds.backend.achievement.service.AchievementService;
import com.clarityminds.backend.common.exception.InvalidGameStateException;
import com.clarityminds.backend.common.exception.ResourceNotFoundException;
import com.clarityminds.backend.game.dto.CompleteSessionRequest;
import com.clarityminds.backend.game.dto.GameResultResponse;
import com.clarityminds.backend.game.dto.GameSessionResponse;
import com.clarityminds.backend.game.dto.StartSessionRequest;
import com.clarityminds.backend.game.entity.Game;
import com.clarityminds.backend.game.entity.GameLevel;
import com.clarityminds.backend.game.entity.GameResult;
import com.clarityminds.backend.game.entity.GameSession;
import com.clarityminds.backend.game.enums.SessionStatus;
import com.clarityminds.backend.game.repository.GameLevelRepository;
import com.clarityminds.backend.game.repository.GameRepository;
import com.clarityminds.backend.game.repository.GameResultRepository;
import com.clarityminds.backend.game.repository.GameSessionRepository;
import com.clarityminds.backend.progress.entity.PlayerGameProgress;
import com.clarityminds.backend.progress.entity.PlayerStats;
import com.clarityminds.backend.progress.repository.PlayerGameProgressRepository;
import com.clarityminds.backend.progress.repository.PlayerStatsRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class GameSessionService {

    private final GameSessionRepository sessionRepository;
    private final GameResultRepository resultRepository;
    private final GameRepository gameRepository;
    private final GameLevelRepository levelRepository;
    private final PlayerStatsRepository statsRepository;
    private final PlayerGameProgressRepository progressRepository;
    private final AchievementService achievementService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GameSessionService(GameSessionRepository sessionRepository,
            GameResultRepository resultRepository,
            GameRepository gameRepository,
            GameLevelRepository levelRepository,
            PlayerStatsRepository statsRepository,
            PlayerGameProgressRepository progressRepository,
            AchievementService achievementService) {
        this.sessionRepository = sessionRepository;
        this.resultRepository = resultRepository;
        this.gameRepository = gameRepository;
        this.levelRepository = levelRepository;
        this.statsRepository = statsRepository;
        this.progressRepository = progressRepository;
        this.achievementService = achievementService;
    }

    @Transactional
    public GameSessionResponse startGameSession(Long userId, StartSessionRequest request) {
        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new ResourceNotFoundException("Game not found with ID: " + request.getGameId()));

        GameLevel level;
        if (request.getLevelId() != null) {
            level = levelRepository.findByIdAndGameId(request.getLevelId(), game.getId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Level not found with ID: " + request.getLevelId()));
        } else if (request.getLevelNumber() != null) {
            level = levelRepository.findByGameIdAndLevelNumber(game.getId(), request.getLevelNumber())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Level number " + request.getLevelNumber() + " not found for game: " + game.getId()));
        } else {
            throw new IllegalArgumentException("Either levelId or levelNumber must be provided");
        }

        GameSession session = new GameSession(userId, game.getId(), level.getId());
        GameSession saved = sessionRepository.save(session);
        return GameSessionResponse.fromEntity(saved);
    }

    @Transactional
    public GameResultResponse completeGameSession(Long userId, Long sessionId, CompleteSessionRequest request) {
        GameSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + sessionId));

        if (!session.getUserId().equals(userId)) {
            throw new InvalidGameStateException("Session does not belong to the current user");
        }

        if (session.getStatus() != SessionStatus.STARTED) {
            throw new InvalidGameStateException("Session is already finalized with status: " + session.getStatus());
        }

        GameLevel level = levelRepository.findById(session.getLevelId())
                .orElseThrow(() -> new ResourceNotFoundException("Game Level not found: " + session.getLevelId()));

        session.setStatus(SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());
        sessionRepository.save(session);

        // XP Calculation: base level XP * (accuracy / 100) + performance bonuses
        int baseReward = level.getXpReward();
        int earnedXp = (int) Math.round(baseReward * (request.getAccuracy() / 100.0));
        if (request.getAccuracy() >= 95.0) {
            earnedXp += 25; // accuracy bonus
        }
        if (request.getCompletionTime() > 0 && request.getCompletionTime() <= 5.0) {
            earnedXp += 15; // speed bonus
        }

        String metricsJson = null;
        if (request.getMetrics() != null) {
            try {
                metricsJson = objectMapper.writeValueAsString(request.getMetrics());
            } catch (Exception ignored) {
            }
        }

        GameResult result = new GameResult(
                session.getId(),
                userId,
                session.getGameId(),
                session.getLevelId(),
                request.getScore(),
                earnedXp,
                request.getAccuracy(),
                request.getCompletionTime(),
                metricsJson);
        GameResult savedResult = resultRepository.save(result);

        // Update stats
        PlayerStats stats = statsRepository.findByUserId(userId)
                .orElseGet(() -> statsRepository.save(new PlayerStats(userId)));

        int oldLevel = stats.getLevel();
        stats.setTotalXp(stats.getTotalXp() + earnedXp);
        stats.setGamesPlayed(stats.getGamesPlayed() + 1);

        // Streak check
        LocalDate today = LocalDate.now();
        if (stats.getLastPlayedDate() == null) {
            stats.setCurrentStreak(1);
            stats.setLongestStreak(Math.max(1, stats.getLongestStreak()));
        } else {
            long days = Duration.between(stats.getLastPlayedDate().atStartOfDay(), today.atStartOfDay()).toDays();
            if (days == 1) {
                stats.setCurrentStreak(stats.getCurrentStreak() + 1);
                if (stats.getCurrentStreak() > stats.getLongestStreak()) {
                    stats.setLongestStreak(stats.getCurrentStreak());
                }
            } else if (days > 1) {
                stats.setCurrentStreak(1);
            }
        }
        stats.setLastPlayedDate(today);

        // Level formula: level = 1 + floor(totalXp / 100)
        int newLevel = 1 + (stats.getTotalXp() / 100);
        boolean levelUp = newLevel > oldLevel;
        stats.setLevel(newLevel);
        statsRepository.save(stats);

        // Update Game Progress
        PlayerGameProgress progress = progressRepository.findByUserIdAndGameId(userId, session.getGameId())
                .orElseGet(() -> new PlayerGameProgress(userId, session.getGameId()));

        progress.setTotalAttempts(progress.getTotalAttempts() + 1);
        progress.setTotalScore(progress.getTotalScore() + request.getScore());
        if (request.getScore() > progress.getBestScore()) {
            progress.setBestScore(request.getScore());
        }
        if (request.getAccuracy() > progress.getBestAccuracy()) {
            progress.setBestAccuracy(request.getAccuracy());
        }

        boolean nextLevelUnlocked = false;
        boolean passed = request.getAccuracy() >= 70.0;
        if (passed) {
            progress.setTotalCompleted(progress.getTotalCompleted() + 1);
            if (level.getLevelNumber() >= progress.getHighestLevel() && level.getLevelNumber() < 10) {
                progress.setHighestLevel(level.getLevelNumber() + 1);
                progress.setCurrentLevel(level.getLevelNumber() + 1);
                nextLevelUnlocked = true;
            }
        }
        progressRepository.save(progress);

        // Check Achievements
        achievementService.checkAndUnlockAchievements(userId, stats, progress, session.getGameId(),
                level.getLevelNumber());

        GameResultResponse response = GameResultResponse.fromEntity(savedResult);
        response.setLevelUp(levelUp);
        response.setNewPlayerLevel(stats.getLevel());
        response.setCurrentStreak(stats.getCurrentStreak());
        response.setNextLevelUnlocked(nextLevelUnlocked);
        return response;
    }

    @Transactional
    public GameSessionResponse abandonGameSession(Long userId, Long sessionId) {
        GameSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + sessionId));

        if (!session.getUserId().equals(userId)) {
            throw new InvalidGameStateException("Session does not belong to the current user");
        }

        if (session.getStatus() != SessionStatus.STARTED) {
            throw new InvalidGameStateException("Session is already finalized with status: " + session.getStatus());
        }

        session.setStatus(SessionStatus.ABANDONED);
        session.setCompletedAt(LocalDateTime.now());
        GameSession saved = sessionRepository.save(session);
        return GameSessionResponse.fromEntity(saved);
    }
}
