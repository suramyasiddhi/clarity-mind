import { createContext, useContext, createSignal, onMount } from 'solid-js';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider(props) {
  const [user, setUser] = createSignal(authService.getCurrentUser());
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    if (authService.isAuthenticated()) {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (err) {
        console.error('Failed to restore session:', err);
        authService.logout();
        setUser(null);
      }
    }
    setLoading(false);
  });

  const login = async (username, password) => {
    const res = await authService.login(username, password);
    setUser(res.user);
    return res;
  };

  const register = async (username, email, password, displayName) => {
    const res = await authService.register(username, email, password, displayName);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (displayName, email) => {
    const res = await authService.updateProfile({ displayName, email });
    setUser(res);
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: () => !!user()
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

