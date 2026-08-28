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

  async startGameSession(gameId, levelIdOrNumber) {
    const payload = typeof gameId === 'object'
      ? gameId
      : (typeof levelIdOrNumber === 'number'
          ? { gameId, levelId: levelIdOrNumber }
          : { gameId, ...levelIdOrNumber });

    return await apiRequest('/game-sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async completeGameSession(sessionId, score, accuracy, completionTime, metrics) {
    let payload = {};
    if (typeof score === 'object' && score !== null) {
      payload = score;
    } else {
      payload = { score, accuracy, completionTime, metrics };
    }

    return await apiRequest(`/game-sessions/${sessionId}/complete`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async abandonGameSession(sessionId) {
    return await apiRequest(`/game-sessions/${sessionId}/abandon`, {
      method: 'POST',
    });
  },
};
