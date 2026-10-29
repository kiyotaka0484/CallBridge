import { GameSettings, GameStats } from './types';

const SETTINGS_KEY = 'callbridge_settings_v1';
const STATS_KEY = 'callbridge_stats_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'medium',
  soundEnabled: true,
  animationSpeed: 'normal',
  cardAnimations: true,
  playerName: 'You',
  hasSeenTutorial: false,
};

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalTricksWon: 0,
  highestBid: 0,
  highestBidMade: 0,
  bestScore: 0,
  recentRounds: [],
};

export function loadSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadStats(): GameStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: GameStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

export function recordMatchResult(
  playerWon: boolean,
  playerScore: number,
  playerBid: number,
  bidMade: boolean,
  tricksWon: number,
  roundNumber: number,
  winnerName: string
): GameStats {
  const current = loadStats();
  const updated: GameStats = {
    ...current,
    gamesPlayed: current.gamesPlayed + 1,
    gamesWon: playerWon ? current.gamesWon + 1 : current.gamesWon,
    totalTricksWon: current.totalTricksWon + tricksWon,
    highestBid: Math.max(current.highestBid, playerBid),
    highestBidMade: bidMade ? Math.max(current.highestBidMade, playerBid) : current.highestBidMade,
    bestScore: Math.max(current.bestScore, playerScore),
    recentRounds: [
      {
        date: new Date().toLocaleDateString(),
        roundNumber,
        playerScore,
        winner: winnerName,
      },
      ...current.recentRounds.slice(0, 9), // keep last 10
    ],
  };

  saveStats(updated);
  return updated;
}

export function resetGameData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(STATS_KEY);
  } catch (e) {
    console.error('Failed to reset game data:', e);
  }
}
