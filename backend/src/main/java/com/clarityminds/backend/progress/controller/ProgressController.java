package com.clarityminds.backend.progress.controller;

import com.clarityminds.backend.common.response.ApiResponse;
import com.clarityminds.backend.game.dto.GameResultResponse;
import com.clarityminds.backend.progress.dto.PlayerGameProgressResponse;
import com.clarityminds.backend.progress.dto.PlayerStatsResponse;
import com.clarityminds.backend.progress.service.ProgressService;
import com.clarityminds.backend.user.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/progress", "/api/v1/users/me"})
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping({"/stats", "/progress"})
    public ResponseEntity<ApiResponse<PlayerStatsResponse>> getPlayerStats(@AuthenticationPrincipal User user) {
        PlayerStatsResponse stats = progressService.getPlayerStats(user.getUsername());
        return ResponseEntity.ok(ApiResponse.success(stats, "Player stats retrieved"));
    }

    @GetMapping({"/games", "/game-progress"})
    public ResponseEntity<ApiResponse<List<PlayerGameProgressResponse>>> getGameProgress(@AuthenticationPrincipal User user) {
        List<PlayerGameProgressResponse> progress = progressService.getGameProgress(user.getUsername());
        return ResponseEntity.ok(ApiResponse.success(progress, "Game progress retrieved"));
    }

    @GetMapping({"/recent-results", "/results"})
    public ResponseEntity<ApiResponse<List<GameResultResponse>>> getRecentResults(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "10") int limit) {
        List<GameResultResponse> results = progressService.getRecentResults(user.getUsername(), limit);
        return ResponseEntity.ok(ApiResponse.success(results, "Recent results retrieved"));
    }
}
