import { useState, useEffect, useCallback } from 'react';

export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
}

const STORAGE_KEY = 'chessmic-stats';

function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        wins: parsed.wins || 0,
        losses: parsed.losses || 0,
        draws: parsed.draws || 0,
      };
    }
  } catch {
    // ignore
  }
  return { wins: 0, losses: 0, draws: 0 };
}

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>(loadStats);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  const recordWin = useCallback(() => {
    setStats((s) => ({ ...s, wins: s.wins + 1 }));
  }, []);

  const recordLoss = useCallback(() => {
    setStats((s) => ({ ...s, losses: s.losses + 1 }));
  }, []);

  const recordDraw = useCallback(() => {
    setStats((s) => ({ ...s, draws: s.draws + 1 }));
  }, []);

  return { stats, recordWin, recordLoss, recordDraw };
}
