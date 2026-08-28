import { apiRequest } from './api';

export const authService = {
  async register(username, email, password, displayName) {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, displayName }),
    });

    if (res?.token) {
      localStorage.setItem('clarity_token', res.token);
    }
    if (res?.user) {
      localStorage.setItem('clarity_user', JSON.stringify(res.user));
    }
    return res;
  },

  async login(username, password) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (res?.token) {
      localStorage.setItem('clarity_token', res.token);
    }
    if (res?.user) {
      localStorage.setItem('clarity_user', JSON.stringify(res.user));
    }
    return res;
  },

  logout() {
    localStorage.removeItem('clarity_token');
    localStorage.removeItem('clarity_user');
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('clarity_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('clarity_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('clarity_token');
  },

  async getProfile() {
    const profile = await apiRequest('/users/me');
    if (profile) {
      localStorage.setItem('clarity_user', JSON.stringify(profile));
    }
    return profile;
  },

  async updateProfile(payloadOrDisplayName, possibleEmail) {
    let bodyObj = {};
    if (typeof payloadOrDisplayName === 'object' && payloadOrDisplayName !== null) {
      bodyObj = payloadOrDisplayName;
    } else {
      bodyObj = {
        displayName: payloadOrDisplayName,
        email: possibleEmail
      };
    }

    const updated = await apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(bodyObj),
    });

    if (updated) {
      localStorage.setItem('clarity_user', JSON.stringify(updated));
    }
    return updated;
  },
};
