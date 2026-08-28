import { createContext, useContext, createSignal, createEffect } from 'solid-js';
import { progressService } from '../services/progressService';
import { useAuth } from './AuthContext';

const PlayerContext = createContext();

export function PlayerProvider(props) {
  const auth = useAuth();

  const [stats, setStats] = createSignal(null);
  const [gameProgress, setGameProgress] = createSignal([]);
  const [achievements, setAchievements] = createSignal([]);
  const [recentResults, setRecentResults] = createSignal([]);
  const [loading, setLoading] = createSignal(false);

  const refreshPlayerData = async () => {
    if (!auth.isAuthenticated()) {
      setStats(null);
      setGameProgress([]);
      setAchievements([]);
      setRecentResults([]);
      return;
    }

    setLoading(true);
    try {
      const [statsData, progressData, achData, resultsData] = await Promise.all([
        progressService.getStats().catch(() => null),
        progressService.getGameProgress().catch(() => []),
        progressService.getAchievements().catch(() => []),
        progressService.getRecentResults(10).catch(() => [])
      ]);

      if (statsData) setStats(statsData);
      if (progressData) setGameProgress(progressData);
      if (achData) setAchievements(achData);
      if (resultsData) setRecentResults(resultsData);
    } catch (err) {
      console.error('Error loading player data:', err);
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    if (auth.user()) {
      refreshPlayerData();
    }
  });

  return (
    <PlayerContext.Provider
      value={{
        stats,
        gameProgress,
        achievements,
        recentResults,
        loading,
        refreshPlayerData
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
}

