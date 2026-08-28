package com.clarityminds.backend.game.controller;

import com.clarityminds.backend.common.response.ApiResponse;
import com.clarityminds.backend.game.dto.GameLevelResponse;
import com.clarityminds.backend.game.dto.GameResponse;
import com.clarityminds.backend.game.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GameResponse>>> getAllGames() {
        List<GameResponse> games = gameService.getAllGames();
        return ResponseEntity.ok(ApiResponse.success(games));
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<ApiResponse<GameResponse>> getGameById(@PathVariable Long gameId) {
        GameResponse game = gameService.getGameById(gameId);
        return ResponseEntity.ok(ApiResponse.success(game));
    }

    @GetMapping("/{gameId}/levels")
    public ResponseEntity<ApiResponse<List<GameLevelResponse>>> getGameLevels(@PathVariable Long gameId) {
        List<GameLevelResponse> levels = gameService.getGameLevels(gameId);
        return ResponseEntity.ok(ApiResponse.success(levels));
    }

    @GetMapping("/{gameId}/levels/{levelNumber}")
    public ResponseEntity<ApiResponse<GameLevelResponse>> getGameLevel(
            @PathVariable Long gameId,
            @PathVariable int levelNumber) {
        GameLevelResponse level = gameService.getGameLevel(gameId, levelNumber);
        return ResponseEntity.ok(ApiResponse.success(level));
    }
}

