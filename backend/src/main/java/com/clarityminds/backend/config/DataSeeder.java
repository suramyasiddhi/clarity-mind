package com.clarityminds.backend.config;

import com.clarityminds.backend.achievement.entity.Achievement;
import com.clarityminds.backend.achievement.repository.AchievementRepository;
import com.clarityminds.backend.game.entity.Game;
import com.clarityminds.backend.game.entity.GameLevel;
import com.clarityminds.backend.game.enums.DifficultyLevel;
import com.clarityminds.backend.game.enums.GameCategory;
import com.clarityminds.backend.game.repository.GameLevelRepository;
import com.clarityminds.backend.game.repository.GameRepository;
import com.clarityminds.backend.progress.entity.PlayerGameProgress;
import com.clarityminds.backend.progress.entity.PlayerStats;
import com.clarityminds.backend.progress.repository.PlayerGameProgressRepository;
import com.clarityminds.backend.progress.repository.PlayerStatsRepository;
import com.clarityminds.backend.user.entity.Role;
import com.clarityminds.backend.user.entity.User;
import com.clarityminds.backend.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

        private final GameRepository gameRepository;
        private final GameLevelRepository gameLevelRepository;
        private final AchievementRepository achievementRepository;
        private final UserRepository userRepository;
        private final PlayerStatsRepository playerStatsRepository;
        private final PlayerGameProgressRepository playerGameProgressRepository;
        private final PasswordEncoder passwordEncoder;

        public DataSeeder(GameRepository gameRepository,
                        GameLevelRepository gameLevelRepository,
                        AchievementRepository achievementRepository,
                        UserRepository userRepository,
                        PlayerStatsRepository playerStatsRepository,
                        PlayerGameProgressRepository playerGameProgressRepository,
                        PasswordEncoder passwordEncoder) {
                this.gameRepository = gameRepository;
                this.gameLevelRepository = gameLevelRepository;
                this.achievementRepository = achievementRepository;
                this.userRepository = userRepository;
                this.playerStatsRepository = playerStatsRepository;
                this.playerGameProgressRepository = playerGameProgressRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        @Transactional
        public void run(String... args) {
                seedGamesAndLevels();
                seedAchievements();
                seedDemoUser();
        }

        private void seedGamesAndLevels() {
                if (gameRepository.count() > 0) {
                        return;
                }

                // 1. Quick Tap (Reaction)
                Game reactionGame = new Game(
                                "REACTION_QUICK_TAP",
                                "Quick Tap",
                                "Measure and refine your reaction speed to sudden visual stimulus triggers while filtering out distractors.",
                                GameCategory.REACTION);
                reactionGame = gameRepository.save(reactionGame);

                seedReactionLevels(reactionGame);

                // 2. Sequence Recall (Memory)
                Game memoryGame = new Game(
                                "MEMORY_SEQUENCE",
                                "Sequence Recall",
                                "Strengthen working memory and visual-spatial recall by observing and reproducing expanding symbol sequences.",
                                GameCategory.MEMORY);
                memoryGame = gameRepository.save(memoryGame);

                seedMemoryLevels(memoryGame);

                // 3. Target Focus (Attention)
                Game attentionGame = new Game(
                                "ATTENTION_TARGET",
                                "Target Focus",
                                "Sharpen selective visual attention and processing speed by identifying target items amidst dense distractors.",
                                GameCategory.ATTENTION);
                attentionGame = gameRepository.save(attentionGame);

                seedAttentionLevels(attentionGame);
        }

        private void seedReactionLevels(Game game) {
                int[][] configValues = {
                                // targetSize, minDelay, maxDelay, roundCount, distractors, xp,
                                // difficultyOrdinal
                                { 80, 1200, 2500, 5, 0, 50, 0 },
                                { 75, 1000, 2200, 6, 0, 60, 0 },
                                { 65, 900, 2000, 6, 0, 75, 0 },
                                { 60, 800, 1800, 8, 1, 90, 1 },
                                { 50, 700, 1600, 8, 2, 110, 1 },
                                { 45, 600, 1500, 10, 3, 135, 1 },
                                { 40, 500, 1400, 10, 4, 160, 2 },
                                { 35, 450, 1300, 12, 5, 190, 2 },
                                { 30, 400, 1200, 12, 6, 225, 3 },
                                { 25, 350, 1000, 15, 8, 270, 3 }
                };

                DifficultyLevel[] diffs = { DifficultyLevel.EASY, DifficultyLevel.MEDIUM, DifficultyLevel.HARD,
                                DifficultyLevel.EXPERT };

                for (int i = 0; i < configValues.length; i++) {
                        int[] c = configValues[i];
                        int lvl = i + 1;
                        boolean falseTarget = (lvl >= 4);
                        String json = String.format(
                                        "{\"targetSize\":%d,\"minimumDelay\":%d,\"maximumDelay\":%d,\"roundCount\":%d,\"distractionCount\":%d,\"falseTargetEnabled\":%b,\"timeLimit\":%d}",
                                        c[0], c[1], c[2], c[3], c[4], falseTarget, (30 - lvl));
                        GameLevel level = new GameLevel(game, lvl, diffs[c[6]], json, c[5]);
                        gameLevelRepository.save(level);
                }
        }

        private void seedMemoryLevels(Game game) {
                int[][] configValues = {
                                // seqLength, displayDuration, delayBeforeInput, numSymbols, reverse(0/1), xp,
                                // difficultyOrdinal
                                { 3, 1000, 500, 4, 0, 50, 0 },
                                { 3, 800, 500, 4, 0, 60, 0 },
                                { 4, 800, 500, 4, 0, 75, 0 },
                                { 4, 600, 600, 4, 0, 90, 1 },
                                { 5, 600, 600, 5, 0, 110, 1 },
                                { 5, 500, 700, 5, 0, 135, 1 },
                                { 6, 500, 700, 6, 0, 160, 2 },
                                { 7, 400, 800, 6, 0, 190, 2 },
                                { 8, 350, 800, 6, 0, 225, 3 },
                                { 8, 300, 900, 6, 1, 270, 3 }
                };

                DifficultyLevel[] diffs = { DifficultyLevel.EASY, DifficultyLevel.MEDIUM, DifficultyLevel.HARD,
                                DifficultyLevel.EXPERT };

                for (int i = 0; i < configValues.length; i++) {
                        int[] c = configValues[i];
                        int lvl = i + 1;
                        boolean reverse = (c[4] == 1);
                        String json = String.format(
                                        "{\"sequenceLength\":%d,\"displayDuration\":%d,\"delayBeforeInput\":%d,\"numberOfSymbols\":%d,\"reverseMode\":%b}",
                                        c[0], c[1], c[2], c[3], reverse);
                        GameLevel level = new GameLevel(game, lvl, diffs[c[6]], json, c[5]);
                        gameLevelRepository.save(level);
                }
        }

        private void seedAttentionLevels(Game game) {
                int[][] configValues = {
                                // gridSize, targetCount, distractors, timeLimit, similar(0/1), xp,
                                // difficultyOrdinal
                                { 3, 1, 4, 12, 0, 50, 0 },
                                { 3, 2, 6, 12, 0, 60, 0 },
                                { 4, 2, 10, 10, 0, 75, 0 },
                                { 4, 3, 12, 10, 1, 90, 1 },
                                { 5, 3, 18, 9, 1, 110, 1 },
                                { 5, 4, 20, 8, 1, 135, 1 },
                                { 6, 4, 28, 8, 1, 160, 2 },
                                { 6, 5, 30, 7, 1, 190, 2 },
                                { 7, 5, 40, 7, 1, 225, 3 },
                                { 7, 6, 45, 6, 1, 270, 3 }
                };

                DifficultyLevel[] diffs = { DifficultyLevel.EASY, DifficultyLevel.MEDIUM, DifficultyLevel.HARD,
                                DifficultyLevel.EXPERT };

                for (int i = 0; i < configValues.length; i++) {
                        int[] c = configValues[i];
                        int lvl = i + 1;
                        boolean similar = (c[4] == 1);
                        String json = String.format(
                                        "{\"gridSize\":%d,\"targetCount\":%d,\"distractorCount\":%d,\"timeLimit\":%d,\"similarDistractors\":%b}",
                                        c[0], c[1], c[2], c[3], similar);
                        GameLevel level = new GameLevel(game, lvl, diffs[c[6]], json, c[5]);
                        gameLevelRepository.save(level);
                }
        }

        private void seedAchievements() {
                if (achievementRepository.count() > 0) {
                        return;
                }

                achievementRepository.save(new Achievement("FIRST_GAME", "First Step",
                                "Complete your first cognitive training session", "award", 50));
                achievementRepository
                                .save(new Achievement("STREAK_3", "Focus Momentum", "Maintain a 3-day training streak",
                                                "flame", 100));
                achievementRepository
                                .save(new Achievement("STREAK_7", "Neuro-Discipline",
                                                "Maintain a 7-day training streak", "zap", 250));
                achievementRepository.save(
                                new Achievement("LEVEL_5", "Synaptic Surge", "Reach Player Level 5", "star", 150));
                achievementRepository.save(new Achievement("LEVEL_10_MASTER", "Cognitive Master",
                                "Conquer Level 10 in any training game", "trophy", 500));
        }

        private void seedDemoUser() {
                var existingDemo = userRepository.findByUsername("demo");
                if (existingDemo.isPresent()) {
                        User demo = existingDemo.get();
                        demo.setDisplayName("Suramya Demo");
                        userRepository.save(demo);
                        return;
                }

                User demo = new User();
                demo.setUsername("demo");
                demo.setEmail("demo@clarityminds.com");
                demo.setPasswordHash(passwordEncoder.encode("password123"));
                demo.setDisplayName("Suramya Demo");
                demo.setRole(Role.ROLE_USER);
                demo.setActive(true);
                demo = userRepository.save(demo);

                PlayerStats stats = new PlayerStats(demo.getId());
                stats.setTotalXp(350);
                stats.setLevel(2);
                stats.setCurrentStreak(2);
                stats.setLongestStreak(3);
                playerStatsRepository.save(stats);

                List<Game> games = gameRepository.findAll();
                for (Game game : games) {
                        PlayerGameProgress progress = new PlayerGameProgress(demo.getId(), game.getId());
                        progress.setCurrentLevel(2);
                        progress.setHighestLevel(2);
                        progress.setTotalAttempts(3);
                        progress.setTotalCompleted(2);
                        progress.setBestScore(850);
                        progress.setTotalScore(1600);
                        playerGameProgressRepository.save(progress);
                }
        }
}
