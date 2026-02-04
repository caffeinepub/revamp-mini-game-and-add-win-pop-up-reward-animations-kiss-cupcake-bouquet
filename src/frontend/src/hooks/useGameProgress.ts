import { useState, useEffect } from 'react';

const GAME_PROGRESS_KEY = 'valentine_game_progress';

export function useGameProgress() {
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(GAME_PROGRESS_KEY);
    if (stored === 'won') {
      setHasWon(true);
    }
  }, []);

  const markAsWon = () => {
    sessionStorage.setItem(GAME_PROGRESS_KEY, 'won');
    setHasWon(true);
  };

  const resetGame = () => {
    sessionStorage.removeItem(GAME_PROGRESS_KEY);
    setHasWon(false);
  };

  return {
    hasWon,
    markAsWon,
    resetGame,
  };
}
