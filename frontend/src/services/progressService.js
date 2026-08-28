import { apiRequest } from './api';

export const progressService = {
  async getStats() {
    return await apiRequest('/progress/stats');
  },

  async getMyStats() {
    return await apiRequest('/progress/stats');
  },

  async getGameProgress(gameId) {
    if (gameId) {
      return await apiRequest(`/progress/games/${gameId}`);
    }
    return await apiRequest('/progress/games');
  },

  async getAllGameProgress() {
    return await apiRequest('/progress/games');
  },

  async getRecentResults(limit = 10) {
    return await apiRequest(`/progress/recent-results?limit=${limit}`);
  },

  async getAchievements() {
    return await apiRequest('/achievements');
  },

  async getMyAchievements() {
    return await apiRequest('/achievements');
  },

  async getLeaderboard(limit = 25) {
    return await apiRequest(`/leaderboards?limit=${limit}`);
  },
};
