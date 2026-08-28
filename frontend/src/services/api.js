// Unified API client with automatic JWT bearer handling
const API_BASE = '/api/v1';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('clarity_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);

    // If unauthorized, clear token and notify
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('clarity_token');
      localStorage.removeItem('clarity_user');
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `HTTP error ${response.status}`;
      throw new Error(errorMsg);
    }

    return data?.data !== undefined ? data.data : data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

