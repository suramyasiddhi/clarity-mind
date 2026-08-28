package com.clarityminds.backend.achievement.controller;

import com.clarityminds.backend.achievement.dto.AchievementResponse;
import com.clarityminds.backend.achievement.service.AchievementService;
import com.clarityminds.backend.common.response.ApiResponse;
import com.clarityminds.backend.user.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/achievements", "/api/v1/users/me/achievements"})
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AchievementResponse>>> getMyAchievements(
            @AuthenticationPrincipal User user) {
        List<AchievementResponse> achievements = achievementService.getUserAchievements(user.getId());
        return ResponseEntity.ok(ApiResponse.success(achievements));
    }
}
