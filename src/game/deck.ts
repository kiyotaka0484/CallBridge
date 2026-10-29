import { Card, Rank, Suit } from './types';
import { GAME_RULES } from './config';

export const SUITS: Suit[] = ['trumps', 'biscuit', 'love', 'leaves'];

export const RANKS: Rank[] = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];

export const RANK_VALUES: Record<Rank, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

/**
 * Creates a brand new 52-card standard CallBridge deck
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value: RANK_VALUES[rank],
      });
    }
  }
  return deck;
}

/**
 * Shuffles an array of cards using the Fisher-Yates algorithm
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Validates that a deck is complete, has 52 cards, and contains no duplicates
 */
export function validateDeck(deck: Card[]): { valid: boolean; error?: string } {
  if (deck.length !== GAME_RULES.TOTAL_CARDS) {
    return {
      valid: false,
      error: `Deck must have exactly ${GAME_RULES.TOTAL_CARDS} cards, found ${deck.length}`,
    };
  }

  const ids = new Set<string>();
  for (const card of deck) {
    if (ids.has(card.id)) {
      return { valid: false, error: `Duplicate card detected: ${card.id}` };
    }
    ids.add(card.id);
  }

  return { valid: true };
}

/**
 * Deals 52 cards evenly among 4 players (13 cards each).
 * Returns hands sorted by suit and rank for optimal player readability.
 */
export function dealHands(shuffledDeck: Card[]): [Card[], Card[], Card[], Card[]] {
  const validation = validateDeck(shuffledDeck);
  if (!validation.valid) {
    throw new Error(`Cannot deal hands: ${validation.error}`);
  }

  const hands: [Card[], Card[], Card[], Card[]] = [[], [], [], []];

  for (let i = 0; i < shuffledDeck.length; i++) {
    hands[i % GAME_RULES.PLAYER_COUNT].push(shuffledDeck[i]);
  }

  // Sort each player's hand: Trumps first, then Biscuit, Love, Leaves, descending by rank
  return hands.map(hand => sortHand(hand)) as [Card[], Card[], Card[], Card[]];
}

/**
 * Sorts cards in a hand by suit order, then high-to-low rank value
 */
export function sortHand(hand: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = {
    trumps: 0,
    biscuit: 1,
    love: 2,
    leaves: 3,
  };

  return [...hand].sort((a, b) => {
    if (a.suit !== b.suit) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return b.value - a.value;
  });
}
