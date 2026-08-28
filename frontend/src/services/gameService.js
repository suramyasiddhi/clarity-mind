import { apiRequest } from './api';

export const gameService = {
  async getAllGames() {
    return await apiRequest('/games');
  },

  async getGameById(gameId) {
    return await apiRequest(`/games/${gameId}`);
  },

  async getGameLevels(gameId) {
    return await apiRequest(`/games/${gameId}/levels`);
  },

  async getGameLevel(gameId, levelNumber) {
    return await apiRequest(`/games/${gameId}/levels/${levelNumber}`);
  },

  async startGameSession(gameId, levelId) {
    return await apiRequest('/game-sessions', {
      method: 'POST',
      body: JSON.stringify({ gameId, levelId }),
    });
  },

  async completeGameSession(sessionId, score, accuracy, completionTime, metrics) {
    return await apiRequest(`/game-sessions/${sessionId}/complete`, {
      method: 'POST',
      body: JSON.stringify({
        score,
        accuracy,
        completionTime,
        metrics,
      }),
    });
  },

  async abandonGameSession(sessionId) {
    return await apiRequest(`/game-sessions/${sessionId}/abandon`, {
      method: 'POST',
    });
  },
};

