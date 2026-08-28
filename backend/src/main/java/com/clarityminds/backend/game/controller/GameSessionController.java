package com.clarityminds.backend.game.controller;

import com.clarityminds.backend.common.response.ApiResponse;
import com.clarityminds.backend.game.dto.CompleteSessionRequest;
import com.clarityminds.backend.game.dto.GameResultResponse;
import com.clarityminds.backend.game.dto.GameSessionResponse;
import com.clarityminds.backend.game.dto.StartSessionRequest;
import com.clarityminds.backend.game.service.GameSessionService;
import com.clarityminds.backend.user.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/game-sessions")
public class GameSessionController {

    private final GameSessionService gameSessionService;

    public GameSessionController(GameSessionService gameSessionService) {
        this.gameSessionService = gameSessionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GameSessionResponse>> startSession(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody StartSessionRequest request) {
        GameSessionResponse session = gameSessionService.startGameSession(user.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Session started", session), HttpStatus.CREATED);
    }

    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<ApiResponse<GameResultResponse>> completeSession(
            @AuthenticationPrincipal User user,
            @PathVariable Long sessionId,
            @Valid @RequestBody CompleteSessionRequest request) {
        GameResultResponse result = gameSessionService.completeGameSession(user.getId(), sessionId, request);
        return ResponseEntity.ok(ApiResponse.success("Session completed", result));
    }

    @PostMapping("/{sessionId}/abandon")
    public ResponseEntity<ApiResponse<GameSessionResponse>> abandonSession(
            @AuthenticationPrincipal User user,
            @PathVariable Long sessionId) {
        GameSessionResponse session = gameSessionService.abandonGameSession(user.getId(), sessionId);
        return ResponseEntity.ok(ApiResponse.success("Session abandoned", session));
    }
}

