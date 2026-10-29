export type Suit = 'trumps' | 'biscuit' | 'love' | 'leaves';

export type Rank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number; // 2 to 14
}

export type PlayerPosition = 'bottom' | 'left' | 'top' | 'right';

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  isHuman: boolean;
  avatar: string;
  hand: Card[];
  bid: number | null;
  tricksWon: number;
  roundScore: number;
  totalScore: number;
}

export interface PlayedCard {
  card: Card;
  playerId: string;
  playerPosition: PlayerPosition;
  playerName: string;
}

export type GamePhase =
  | 'welcome'
  | 'inspecting'
  | 'human_bidding'
  | 'ai_bidding'
  | 'bidding_complete'
  | 'bidding'
  | 'playing'
  | 'trick_completed'
  | 'round_end'
  | 'game_over';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type AnimationSpeed = 'normal' | 'fast' | 'instant';

export interface TrickHistoryItem {
  trickNumber: number;
  cards: PlayedCard[];
  ledSuit: Suit;
  winnerId: string;
  winnerName: string;
  winningCard: Card;
}

export interface RoundScoreEntry {
  playerId: string;
  playerName: string;
  bid: number;
  tricksWon: number;
  roundScore: number;
  totalScore: number;
  status: 'made' | 'exceeded' | 'failed';
}

export interface GameSettings {
  difficulty: Difficulty;
  soundEnabled: boolean;
  animationSpeed: AnimationSpeed;
  cardAnimations: boolean;
  playerName: string;
  hasSeenTutorial: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalTricksWon: number;
  highestBid: number;
  highestBidMade: number;
  bestScore: number;
  recentRounds: {
    date: string;
    roundNumber: number;
    playerScore: number;
    winner: string;
  }[];
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderPosition: PlayerPosition;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}
