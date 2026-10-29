import { Card, PlayedCard, Suit } from './types';
import { GAME_RULES } from './config';

/**
 * Validates whether a specific bid is legal for a given player based on GAME_RULES.
 */
export function isBidLegal(
  bid: number,
  playerIndex: number,
  existingBids: (number | null)[],
  config = GAME_RULES
): { legal: boolean; reason?: string } {
  if (bid < config.MIN_BID || bid > config.MAX_BID) {
    return {
      legal: false,
      reason: `Bid must be between ${config.MIN_BID} and ${config.MAX_BID}.`,
    };
  }

  // Check sum constraints if enabled and this is the last bidder (player index 3)
  const isLastPlayer = playerIndex === config.PLAYER_COUNT - 1;
  const knownBidsSum = existingBids
    .slice(0, playerIndex)
    .filter((b): b is number => b !== null)
    .reduce((acc, curr) => acc + curr, 0);

  if (isLastPlayer) {
    const totalWithThisBid = knownBidsSum + bid;

    if (config.BID_SUM_RULE === 'cannot_equal_13' && totalWithThisBid === config.MAX_TOTAL_BID) {
      return {
        legal: false,
        reason: `Rule restriction: Total bids cannot equal exactly ${config.MAX_TOTAL_BID}. Please choose another bid.`,
      };
    }

    if (config.BID_SUM_RULE === 'must_equal_13') {
      const requiredBid = config.MAX_TOTAL_BID - knownBidsSum;
      if (requiredBid >= config.MIN_BID && requiredBid <= config.MAX_BID) {
        if (bid !== requiredBid) {
          return {
            legal: false,
            reason: `Rule restriction: Total bids must equal ${config.MAX_TOTAL_BID}. Required bid is ${requiredBid}.`,
          };
        }
      }
      // If sum cannot possibly equal 13 due to earlier bids, allow any valid bid (1-13)
    }
  }

  return { legal: true };
}

/**
 * Returns list of legal cards a player is allowed to play from their hand.
 */
export function getLegalMoves(
  hand: Card[],
  ledSuit: Suit | null,
  mustFollowSuit = GAME_RULES.MUST_FOLLOW_SUIT
): Card[] {
  if (hand.length === 0) return [];
  if (!ledSuit || !mustFollowSuit) return [...hand];

  const cardsOfLedSuit = hand.filter(c => c.suit === ledSuit);
  if (cardsOfLedSuit.length > 0) {
    return cardsOfLedSuit;
  }

  // Player has no cards of the led suit; can play any card in their hand!
  return [...hand];
}

/**
 * Validates if playing a specific card is legal. Provides clear beginner-friendly explanations.
 */
export function isCardLegal(
  card: Card,
  hand: Card[],
  ledSuit: Suit | null
): { legal: boolean; reason?: string } {
  const isCardInHand = hand.some(c => c.id === card.id);
  if (!isCardInHand) {
    return { legal: false, reason: "That card is not in your hand." };
  }

  if (!ledSuit) {
    return { legal: true };
  }

  const hasLedSuit = hand.some(c => c.suit === ledSuit);
  if (hasLedSuit && card.suit !== ledSuit) {
    const capitalizedSuit = ledSuit.charAt(0).toUpperCase() + ledSuit.slice(1);
    return {
      legal: false,
      reason: `You must follow ${capitalizedSuit} because you hold ${capitalizedSuit} cards.`,
    };
  }

  return { legal: true };
}

/**
 * Determines the winning card and player of a trick.
 * 
 * Rules:
 * 1. If any Trump cards were played: the highest Trump card wins.
 * 2. If NO Trump cards were played: the highest card of the led suit wins.
 * 3. Any off-suit card (not led suit and not Trump) CANNOT win the trick,
 *    regardless of how high its rank is (e.g. an off-suit Ace will lose).
 */
export function determineTrickWinner(
  trick: PlayedCard[],
  ledSuit: Suit,
  trumpSuit: Suit = GAME_RULES.TRUMP_SUIT
): PlayedCard {
  if (trick.length === 0) {
    throw new Error('Cannot determine winner of an empty trick');
  }

  // Check if any card played is of the Trump suit
  const trumpCards = trick.filter(p => p.card.suit === trumpSuit);

  if (trumpCards.length > 0) {
    // Highest Trump card wins
    return trumpCards.reduce((highest, current) =>
      current.card.value > highest.card.value ? current : highest
    );
  }

  // No trump played -> highest card of the led suit wins
  const ledSuitCards = trick.filter(p => p.card.suit === ledSuit);

  if (ledSuitCards.length > 0) {
    return ledSuitCards.reduce((highest, current) =>
      current.card.value > highest.card.value ? current : highest
    );
  }

  // Fallback (e.g. if somehow no cards matched led suit, which only happens if led trick was empty)
  return trick[0];
}

/**
 * Calculates a player's round score based on their bid and tricks won.
 * Standard CallBridge rules:
 * - Won >= Bid: Made bid! Score = Bid + (TricksWon - Bid) * 0.1
 * - Won < Bid: Failed bid! Score = -Bid
 */
export function calculateRoundScore(
  bid: number,
  tricksWon: number,
  config = GAME_RULES
): {
  score: number;
  status: 'made' | 'exceeded' | 'failed';
  diff: number;
} {
  const diff = tricksWon - bid;

  if (tricksWon >= bid) {
    const extraTricks = tricksWon - bid;
    const score = Number(
      (bid * config.POINTS_PER_BID + extraTricks * config.BONUS_PER_OVERTRICK).toFixed(1)
    );
    return {
      score,
      status: extraTricks > 0 ? 'exceeded' : 'made',
      diff,
    };
  }

  const score = -Number((bid * config.PENALTY_MULTIPLIER).toFixed(1));
  return {
    score,
    status: 'failed',
    diff,
  };
}
