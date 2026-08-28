package com.clarityminds.backend.user.controller;

import com.clarityminds.backend.common.response.ApiResponse;
import com.clarityminds.backend.user.dto.UpdateProfileRequest;
import com.clarityminds.backend.user.dto.UserDto;
import com.clarityminds.backend.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(Authentication authentication) {
        UserDto userDto = userService.getUserProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(userDto, "Profile retrieved"));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateCurrentUser(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserDto userDto = userService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(userDto, "Profile updated successfully"));
    }
}
