import { Suit } from './types';

/**
 * CallBridge Game Rules and Configurations
 * Change these values here to adjust game mechanics without touching component code.
 */
export const GAME_RULES = {
  // Player & Dealing configuration
  PLAYER_COUNT: 4,
  CARDS_PER_PLAYER: 13,
  TOTAL_CARDS: 52,
  TRICKS_PER_ROUND: 13,

  // Trump suit
  // In CallBridge, "Trumps" is the designated permanent trump suit.
  TRUMP_SUIT: 'trumps' as Suit,
  TRUMP_SUITS_WIN_OVER_NON_TRUMP: true,
  MUST_FOLLOW_SUIT: true,

  // Bidding constraints
  MIN_BID: 1,
  MAX_BID: 13,
  MAX_TOTAL_BID: 13,
  /**
   * BID_SUM_RULE:
   * - 'any': Standard CallBridge, each player bids between MIN_BID and MAX_BID freely.
   * - 'cannot_equal_13': Dealer/Last bidder's bid cannot make total bids equal 13 (so at least one player fails).
   * - 'must_equal_13': Total of all 4 bids must exactly equal 13.
   */
  BID_SUM_RULE: 'any' as 'any' | 'cannot_equal_13' | 'must_equal_13',

  // Scoring configuration
  // Standard CallBridge scoring:
  // - If tricksWon >= bid: score = bid + (tricksWon - bid) * BONUS_PER_OVERTRICK
  // - If tricksWon < bid: score = - (bid * PENALTY_MULTIPLIER)
  POINTS_PER_BID: 1.0,
  BONUS_PER_OVERTRICK: 0.1,
  PENALTY_MULTIPLIER: 1.0,

  // Default number of rounds in a match
  TOTAL_ROUNDS_PER_MATCH: 5,

  // Speed timings in milliseconds (adjusted by user animation speed setting)
  TIMINGS: {
    normal: {
      dealDelay: 100,
      aiBiddingDelay: 700,
      aiTurnDelay: 900,
      trickClearDelay: 1800,
    },
    fast: {
      dealDelay: 40,
      aiBiddingDelay: 350,
      aiTurnDelay: 450,
      trickClearDelay: 1000,
    },
    instant: {
      dealDelay: 0,
      aiBiddingDelay: 100,
      aiTurnDelay: 150,
      trickClearDelay: 400,
    },
  },
};

export const SUIT_INFO: Record<
  Suit,
  {
    name: string;
    color: 'black' | 'red';
    textColor: string;
    hexColor: string;
    bgColor: string;
    symbol: string;
    badgeLabel: string;
    description: string;
  }
> = {
  trumps: {
    name: 'Trumps',
    color: 'black',
    textColor: 'text-black',
    hexColor: '#000000',
    bgColor: 'bg-white border-slate-900 text-black',
    symbol: '♠',
    badgeLabel: 'TRUMP',
    description: 'Black Trump suit. Highest ranking suit; beats any non-Trump card.',
  },
  leaves: {
    name: 'Leaves',
    color: 'black',
    textColor: 'text-black',
    hexColor: '#000000',
    bgColor: 'bg-white border-slate-900 text-black',
    symbol: '♣',
    badgeLabel: 'LEAVES',
    description: 'Black leaf / club suit.',
  },
  biscuit: {
    name: 'Biscuit',
    color: 'red',
    textColor: 'text-red-600',
    hexColor: '#dc2626',
    bgColor: 'bg-red-50 border-red-600 text-red-600',
    symbol: '♦',
    badgeLabel: 'BISCUIT',
    description: 'Red diamond tile suit.',
  },
  love: {
    name: 'Love',
    color: 'red',
    textColor: 'text-red-600',
    hexColor: '#dc2626',
    bgColor: 'bg-red-50 border-red-600 text-red-600',
    symbol: '♥',
    badgeLabel: 'LOVE',
    description: 'Red heart suit.',
  },
};
