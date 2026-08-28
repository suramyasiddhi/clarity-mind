import { createContext, useContext, createSignal, createEffect, onMount } from 'solid-js';
import { progressService } from '../services/progressService';
import { useAuth } from './AuthContext';

const PlayerContext = createContext();

export function PlayerProvider(props) {
  const auth = useAuth();

  const [stats, setStats] = createSignal(null);
  const [gameProgress, setGameProgress] = createSignal([]);
  const [achievements, setAchievements] = createSignal([]);
  const [recentResults, setRecentResults] = createSignal([]);
  
  // Persist lastGameResult in sessionStorage for reload stability
  const getInitialLastResult = () => {
    try {
      const cached = sessionStorage.getItem('clarity_last_result');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };
  const [lastGameResult, setLastGameResultState] = createSignal(getInitialLastResult());

  const setLastGameResult = (result) => {
    setLastGameResultState(result);
    try {
      if (result) {
        sessionStorage.setItem('clarity_last_result', JSON.stringify(result));
      } else {
        sessionStorage.removeItem('clarity_last_result');
      }
    } catch (e) {
      console.warn('Could not cache last result:', e);
    }
  };

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
        progressService.getStats().catch((err) => {
          console.warn('Stats fetch warning:', err);
          return null;
        }),
        progressService.getGameProgress().catch((err) => {
          console.warn('Game progress fetch warning:', err);
          return [];
        }),
        progressService.getAchievements().catch((err) => {
          console.warn('Achievements fetch warning:', err);
          return [];
        }),
        progressService.getRecentResults(10).catch((err) => {
          console.warn('Recent results fetch warning:', err);
          return [];
        })
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

  onMount(() => {
    if (auth.isAuthenticated()) {
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
        lastGameResult,
        setLastGameResult,
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
