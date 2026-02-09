import { useState, useEffect } from 'react';

const GAME_PROGRESS_KEY = 'valentine_game_progress';

type GameId = 'match-pairs' | 'heart-click' | 'love-word' | 'cupid-aim' | 'sweet-sort';

interface GameProgress {
  completedGames: GameId[];
}

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>({ completedGames: [] });

  useEffect(() => {
    const stored = sessionStorage.getItem(GAME_PROGRESS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProgress(parsed);
      } catch (e) {
        console.error('Failed to parse game progress:', e);
      }
    }
  }, []);

  const markGameComplete = (gameId: GameId) => {
    setProgress((prev) => {
      if (prev.completedGames.includes(gameId)) {
        return prev;
      }
      const newProgress = {
        completedGames: [...prev.completedGames, gameId],
      };
      sessionStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const isGameComplete = (gameId: GameId) => {
    return progress.completedGames.includes(gameId);
  };

  const resetProgress = () => {
    sessionStorage.removeItem(GAME_PROGRESS_KEY);
    setProgress({ completedGames: [] });
  };

  return {
    completedGames: progress.completedGames,
    totalCompleted: progress.completedGames.length,
    markGameComplete,
    isGameComplete,
    resetProgress,
  };
}
