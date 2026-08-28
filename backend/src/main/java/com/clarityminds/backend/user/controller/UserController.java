package com.clarityminds.backend.user.controller;

import com.clarityminds.backend.common.response.ApiResponse;
import com.clarityminds.backend.user.dto.UpdateProfileRequest;
import com.clarityminds.backend.user.dto.UserDto;
import com.clarityminds.backend.user.entity.User;
import com.clarityminds.backend.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal User user) {
        UserDto userDto = userService.getUserProfile(user.getUsername());
        return ResponseEntity.ok(ApiResponse.success(userDto, "Profile retrieved"));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateCurrentUser(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserDto userDto = userService.updateProfile(user.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(userDto, "Profile updated successfully"));
    }
}
