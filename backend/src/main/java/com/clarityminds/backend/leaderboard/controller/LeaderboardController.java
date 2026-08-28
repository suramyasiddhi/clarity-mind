package com.clarityminds.backend.leaderboard.controller;

import com.clarityminds.backend.common.response.ApiResponse;
import com.clarityminds.backend.leaderboard.dto.LeaderboardEntryResponse;
import com.clarityminds.backend.leaderboard.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leaderboards")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaderboardEntryResponse>>> getLeaderboard(
            @RequestParam(defaultValue = "20") int limit) {
        List<LeaderboardEntryResponse> leaderboard = leaderboardService.getTopPlayers(limit);
        return ResponseEntity.ok(ApiResponse.success(leaderboard, "Leaderboard rankings retrieved"));
    }
}
