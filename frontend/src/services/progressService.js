import { apiRequest } from './api';

export const progressService = {
  async getMyStats() {
    return await apiRequest('/users/me/progress');
  },

  async getAllGameProgress() {
    return await apiRequest('/users/me/game-progress');
  },

  async getGameProgress(gameId) {
    return await apiRequest(`/users/me/game-progress/${gameId}`);
  },

  async getRecentResults(page = 0, size = 20) {
    return await apiRequest(`/users/me/results?page=${page}&size=${size}`);
  },

  async getGameResults(gameId) {
    return await apiRequest(`/users/me/games/${gameId}/results`);
  },

  async getGamePerformance(gameId) {
    return await apiRequest(`/users/me/games/${gameId}/performance`);
  },

  async getMyAchievements() {
    return await apiRequest('/users/me/achievements');
  },

  async getLeaderboard(limit = 20) {
    return await apiRequest(`/leaderboards?limit=${limit}`);
  },
};

