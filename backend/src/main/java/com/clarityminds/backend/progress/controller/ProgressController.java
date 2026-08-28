package com.clarityminds.backend.progress.controller;

import com.clarityminds.backend.common.response.ApiResponse;
import com.clarityminds.backend.game.dto.GameResultResponse;
import com.clarityminds.backend.progress.dto.PlayerGameProgressResponse;
import com.clarityminds.backend.progress.dto.PlayerStatsResponse;
import com.clarityminds.backend.progress.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<PlayerStatsResponse>> getPlayerStats(Authentication authentication) {
        PlayerStatsResponse stats = progressService.getPlayerStats(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(stats, "Player stats retrieved"));
    }

    @GetMapping("/games")
    public ResponseEntity<ApiResponse<List<PlayerGameProgressResponse>>> getGameProgress(
            Authentication authentication) {
        List<PlayerGameProgressResponse> progress = progressService.getGameProgress(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(progress, "Game progress retrieved"));
    }

    @GetMapping("/recent-results")
    public ResponseEntity<ApiResponse<List<GameResultResponse>>> getRecentResults(
            Authentication authentication,
            @RequestParam(defaultValue = "10") int limit) {
        List<GameResultResponse> results = progressService.getRecentResults(authentication.getName(), limit);
        return ResponseEntity.ok(ApiResponse.success(results, "Recent results retrieved"));
    }
}
