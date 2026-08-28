package com.clarityminds.backend.progress.service;

import com.clarityminds.backend.common.exception.ResourceNotFoundException;
import com.clarityminds.backend.game.dto.GameResultResponse;
import com.clarityminds.backend.game.entity.Game;
import com.clarityminds.backend.game.entity.GameResult;
import com.clarityminds.backend.game.repository.GameRepository;
import com.clarityminds.backend.game.repository.GameResultRepository;
import com.clarityminds.backend.progress.dto.PlayerGameProgressResponse;
import com.clarityminds.backend.progress.dto.PlayerStatsResponse;
import com.clarityminds.backend.progress.entity.PlayerGameProgress;
import com.clarityminds.backend.progress.entity.PlayerStats;
import com.clarityminds.backend.progress.repository.PlayerGameProgressRepository;
import com.clarityminds.backend.progress.repository.PlayerStatsRepository;
import com.clarityminds.backend.user.entity.User;
import com.clarityminds.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressService {

        private final UserRepository userRepository;
        private final PlayerStatsRepository statsRepository;
        private final PlayerGameProgressRepository progressRepository;
        private final GameRepository gameRepository;
        private final GameResultRepository resultRepository;

        public ProgressService(UserRepository userRepository,
                        PlayerStatsRepository statsRepository,
                        PlayerGameProgressRepository progressRepository,
                        GameRepository gameRepository,
                        GameResultRepository resultRepository) {
                this.userRepository = userRepository;
                this.statsRepository = statsRepository;
                this.progressRepository = progressRepository;
                this.gameRepository = gameRepository;
                this.resultRepository = resultRepository;
        }

        public PlayerStatsResponse getPlayerStats(String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

                PlayerStats stats = statsRepository.findByUserId(user.getId())
                                .orElseGet(() -> statsRepository.save(new PlayerStats(user)));

                return new PlayerStatsResponse(
                                user.getId(),
                                user.getUsername(),
                                user.getDisplayName(),
                                stats.getTotalXp(),
                                stats.getLevel(),
                                stats.getCurrentStreak(),
                                stats.getLongestStreak(),
                                stats.getGamesPlayed(),
                                stats.getLastPlayedDate());
        }

        public List<PlayerGameProgressResponse> getGameProgress(String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

                List<Game> games = gameRepository.findByActiveTrueOrderByDisplayOrderAsc();
                List<PlayerGameProgress> progressList = progressRepository.findByUserId(user.getId());

                List<PlayerGameProgressResponse> responses = new ArrayList<>();
                for (Game game : games) {
                        PlayerGameProgress progress = progressList.stream()
                                        .filter(p -> p.getGameId().equals(game.getId()))
                                        .findFirst()
                                        .orElse(null);

                        responses.add(new PlayerGameProgressResponse(
                                        game.getId(),
                                        game.getCode(),
                                        game.getTitle(),
                                        game.getCategory().name(),
                                        progress != null ? progress.getHighestUnlockedLevel() : 1,
                                        progress != null ? progress.getBestScore() : 0,
                                        progress != null ? progress.getBestAccuracy() : 0.0,
                                        progress != null ? progress.getTotalAttempts() : 0));
                }

                return responses;
        }

        public List<GameResultResponse> getRecentResults(String username, int limit) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

                List<GameResult> results = resultRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

                return results.stream()
                                .limit(limit)
                                .map(GameResultResponse::fromEntity)
                                .collect(Collectors.toList());
        }
}
