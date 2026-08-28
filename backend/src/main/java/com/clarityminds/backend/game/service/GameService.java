package com.clarityminds.backend.game.service;

import com.clarityminds.backend.common.exception.ResourceNotFoundException;
import com.clarityminds.backend.game.dto.GameLevelResponse;
import com.clarityminds.backend.game.dto.GameResponse;
import com.clarityminds.backend.game.entity.Game;
import com.clarityminds.backend.game.entity.GameLevel;
import com.clarityminds.backend.game.repository.GameLevelRepository;
import com.clarityminds.backend.game.repository.GameRepository;
import com.clarityminds.backend.progress.entity.PlayerGameProgress;
import com.clarityminds.backend.progress.repository.PlayerGameProgressRepository;
import com.clarityminds.backend.user.entity.User;
import com.clarityminds.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final GameRepository gameRepository;
    private final GameLevelRepository gameLevelRepository;
    private final UserRepository userRepository;
    private final PlayerGameProgressRepository progressRepository;

    public GameService(GameRepository gameRepository,
            GameLevelRepository gameLevelRepository,
            UserRepository userRepository,
            PlayerGameProgressRepository progressRepository) {
        this.gameRepository = gameRepository;
        this.gameLevelRepository = gameLevelRepository;
        this.userRepository = userRepository;
        this.progressRepository = progressRepository;
    }

    public List<GameResponse> getAllGames() {
        return gameRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(GameResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public GameResponse getGameById(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found: " + id));
        return GameResponse.fromEntity(game);
    }

    public List<GameLevelResponse> getGameLevels(Long gameId) {
        List<GameLevel> levels = gameLevelRepository.findByGameIdOrderByLevelNumberAsc(gameId);
        return levels.stream()
                .map(GameLevelResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<GameLevelResponse> getGameLevels(Long gameId, String username) {
        return getGameLevels(gameId);
    }

    public GameLevelResponse getGameLevel(Long gameId, Integer levelNumber) {
        GameLevel level = gameLevelRepository.findByGameIdAndLevelNumber(gameId, levelNumber)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Level " + levelNumber + " not found for game: " + gameId));

        return GameLevelResponse.fromEntity(level);
    }
}
