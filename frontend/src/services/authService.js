import { apiRequest } from './api';

export const authService = {
  async register(username, email, password, displayName) {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, displayName }),
    });
  },

  async login(username, password) {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async refreshToken() {
    return await apiRequest('/auth/refresh', {
      method: 'POST',
    });
  },

  async getProfile() {
    return await apiRequest('/users/me');
  },

  async updateProfile(displayName, email) {
    return await apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ displayName, email }),
    });
  },
};

