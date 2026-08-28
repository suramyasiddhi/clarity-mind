package com.clarityminds.backend.leaderboard.service;

import com.clarityminds.backend.leaderboard.dto.LeaderboardEntryResponse;
import com.clarityminds.backend.progress.entity.PlayerStats;
import com.clarityminds.backend.progress.repository.PlayerStatsRepository;
import com.clarityminds.backend.user.entity.User;
import com.clarityminds.backend.user.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    private final PlayerStatsRepository statsRepository;
    private final UserRepository userRepository;

    public LeaderboardService(PlayerStatsRepository statsRepository, UserRepository userRepository) {
        this.statsRepository = statsRepository;
        this.userRepository = userRepository;
    }

    public List<LeaderboardEntryResponse> getTopPlayers(int limit) {
        List<PlayerStats> topStats = statsRepository.findTopPlayers(PageRequest.of(0, Math.min(limit, 100)));
        Map<Long, User> usersMap = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        List<LeaderboardEntryResponse> entries = new ArrayList<>();

        int rank = 1;
        for (PlayerStats stats : topStats) {
            User u = usersMap.get(stats.getUserId());
            String username = u != null ? u.getUsername() : "Player " + stats.getUserId();
            String displayName = u != null ? u.getDisplayName() : username;

            entries.add(new LeaderboardEntryResponse(
                    rank++,
                    stats.getUserId(),
                    username,
                    displayName,
                    stats.getTotalXp(),
                    stats.getLevel(),
                    stats.getCurrentStreak()));
        }

        return entries;
    }
}
