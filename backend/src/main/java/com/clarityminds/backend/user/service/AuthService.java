package com.clarityminds.backend.user.service;

import com.clarityminds.backend.config.JwtTokenProvider;
import com.clarityminds.backend.progress.entity.PlayerStats;
import com.clarityminds.backend.progress.repository.PlayerStatsRepository;
import com.clarityminds.backend.user.dto.AuthRequest;
import com.clarityminds.backend.user.dto.AuthResponse;
import com.clarityminds.backend.user.dto.RegisterRequest;
import com.clarityminds.backend.user.entity.Role;
import com.clarityminds.backend.user.entity.User;
import com.clarityminds.backend.user.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PlayerStatsRepository playerStatsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthService(UserRepository userRepository,
            PlayerStatsRepository playerStatsRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            UserService userService) {
        this.userRepository = userRepository;
        this.playerStatsRepository = playerStatsRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        String displayName = (request.getDisplayName() != null && !request.getDisplayName().isBlank())
                ? request.getDisplayName()
                : request.getUsername();

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                displayName,
                Role.ROLE_USER);

        User savedUser = userRepository.save(user);

        // Initialize PlayerStats for new user
        PlayerStats stats = new PlayerStats(savedUser);
        playerStatsRepository.save(stats);

        String token = jwtTokenProvider.generateToken(savedUser.getUsername(), savedUser.getRole().name());
        return new AuthResponse(token, userService.toDto(savedUser));
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, userService.toDto(user));
    }
}
