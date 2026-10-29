import { Card, Difficulty, PlayedCard, Suit } from './types';
import { GAME_RULES } from './config';
import { determineTrickWinner, getLegalMoves, isBidLegal } from './rules';

/**
 * Evaluates hand strength to estimate trick-taking potential.
 * Evaluates:
 * - High cards (Aces, Kings, Queens)
 * - Trump count and high Trump cards
 * - Short suits (singletons, voids) which allow trumping early
 */
export function calculateHandStrength(
  hand: Card[],
  trumpSuit: Suit = GAME_RULES.TRUMP_SUIT
): number {
  let estimatedTricks = 0;

  // Group by suit
  const suitCounts: Record<Suit, number> = {
    trumps: 0,
    biscuit: 0,
    love: 0,
    leaves: 0,
  };
  const suitCards: Record<Suit, Card[]> = {
    trumps: [],
    biscuit: [],
    love: [],
    leaves: [],
  };

  for (const card of hand) {
    suitCounts[card.suit]++;
    suitCards[card.suit].push(card);
  }

  // 1. High card points in non-trump suits
  (['biscuit', 'love', 'leaves'] as Suit[]).forEach(suit => {
    const cards = suitCards[suit];
    const hasAce = cards.some(c => c.rank === 'A');
    const hasKing = cards.some(c => c.rank === 'K');
    const hasQueen = cards.some(c => c.rank === 'Q');
    const count = cards.length;

    // Ace is almost always 1 trick
    if (hasAce) estimatedTricks += 1.0;

    // King is ~0.7 trick if guarded (count >= 2)
    if (hasKing && count >= 2) {
      estimatedTricks += 0.7;
    } else if (hasKing && count === 1) {
      estimatedTricks += 0.4;
    }

    // Queen is ~0.4 trick if guarded by 2+ cards
    if (hasQueen && count >= 3) {
      estimatedTricks += 0.4;
    }
  });

  // 2. Trump suit evaluation (Trumps are supreme)
  const trumpCards = suitCards[trumpSuit];
  const trumpCount = trumpCards.length;

  for (const card of trumpCards) {
    if (card.rank === 'A') estimatedTricks += 1.1;
    else if (card.rank === 'K') estimatedTricks += 0.9;
    else if (card.rank === 'Q') estimatedTricks += 0.7;
    else if (card.rank === 'J') estimatedTricks += 0.5;
    else if (card.rank === '10') estimatedTricks += 0.3;
  }

  // Bonus for trump length (ability to ruff other suits)
  if (trumpCount >= 4) {
    estimatedTricks += (trumpCount - 3) * 0.4;
  }

  // 3. Short suit bonus (voids and singletons allow ruffing if we hold trumps)
  if (trumpCount > 0) {
    (['biscuit', 'love', 'leaves'] as Suit[]).forEach(suit => {
      if (suitCounts[suit] === 0) {
        estimatedTricks += Math.min(1.0, trumpCount * 0.3);
      } else if (suitCounts[suit] === 1) {
        estimatedTricks += Math.min(0.5, trumpCount * 0.2);
      }
    });
  }

  return Math.max(1, Math.min(13, Math.round(estimatedTricks)));
}

/**
 * Calculates a player's bid depending on AI difficulty and existing bids.
 */
export function calculateBid(
  hand: Card[],
  difficulty: Difficulty,
  existingBids: (number | null)[],
  playerIndex: number
): number {
  const baseStrength = calculateHandStrength(hand);
  let targetBid = baseStrength;

  if (difficulty === 'easy') {
    // Easy AI adds random noise (-1, 0, +1) and might slightly under/overbid
    const jitter = Math.floor(Math.random() * 3) - 1;
    targetBid = Math.max(1, Math.min(10, baseStrength + jitter));
  } else if (difficulty === 'medium') {
    // Medium AI sticks close to realistic evaluation
    targetBid = Math.max(1, Math.min(12, baseStrength));
  } else {
    // Hard AI considers position and conservative buffer to avoid failing
    targetBid = Math.max(1, Math.min(13, baseStrength));
  }

  // Ensure bid meets game rule validity (e.g. BID_SUM_RULE constraints)
  let candidate = targetBid;
  const legalCheck = isBidLegal(candidate, playerIndex, existingBids);

  if (legalCheck.legal) {
    return candidate;
  }

  // If illegal due to sum restriction, find nearest legal bid
  for (let offset = 1; offset <= 13; offset++) {
    if (candidate + offset <= 13 && isBidLegal(candidate + offset, playerIndex, existingBids).legal) {
      return candidate + offset;
    }
    if (candidate - offset >= 1 && isBidLegal(candidate - offset, playerIndex, existingBids).legal) {
      return candidate - offset;
    }
  }

  // Exhaustive fallback: find any legal bid between 1 and 13
  for (let b = 1; b <= 13; b++) {
    if (isBidLegal(b, playerIndex, existingBids).legal) {
      return b;
    }
  }

  return Math.max(1, Math.min(13, candidate));
}

/**
 * Easy AI: picks a legal card with low strategic bias.
 */
export function chooseCardEasy(legalMoves: Card[]): Card {
  // Random selection among legal moves
  const index = Math.floor(Math.random() * legalMoves.length);
  return legalMoves[index];
}

/**
 * Medium AI: follows suit with awareness of trick winning.
 */
export function chooseCardMedium(
  legalMoves: Card[],
  trick: PlayedCard[],
  ledSuit: Suit | null,
  tricksWon: number,
  bid: number
): Card {
  // If leading the trick
  if (!ledSuit || trick.length === 0) {
    // If still need tricks, try cashing top Aces/Kings in non-trump
    const aces = legalMoves.filter(c => c.rank === 'A' && c.suit !== GAME_RULES.TRUMP_SUIT);
    if (aces.length > 0 && tricksWon < bid) {
      return aces[0];
    }
    // Otherwise lead a low card
    return legalMoves.reduce((lowest, card) =>
      card.value < lowest.value ? card : lowest
    );
  }

  // Currently winning card in the trick
  const currentWinner = determineTrickWinner(trick, ledSuit);
  const isWinningTrump = currentWinner.card.suit === GAME_RULES.TRUMP_SUIT;

  // Find cards that can beat the current winning card
  const winningMoves = legalMoves.filter(card => {
    // Card is Trump
    if (card.suit === GAME_RULES.TRUMP_SUIT) {
      if (isWinningTrump) {
        return card.value > currentWinner.card.value;
      }
      return true; // Any trump beats non-trump
    }
    // Card is led suit
    if (card.suit === ledSuit && !isWinningTrump) {
      return card.value > currentWinner.card.value;
    }
    return false;
  });

  const needsTricks = tricksWon < bid;

  if (winningMoves.length > 0 && needsTricks) {
    // Play the lowest winning card to conserve high cards
    return winningMoves.reduce((lowest, card) =>
      card.value < lowest.value ? card : lowest
    );
  }

  // Cannot win or don't want to win: play lowest card to discard
  return legalMoves.reduce((lowest, card) =>
    card.value < lowest.value ? card : lowest
  );
}

/**
 * Checks if a card is the highest remaining card ("boss" card) of its suit in the game,
 * based on cards already played and cards held in AI's own hand.
 */
function isBossCard(
  card: Card,
  hand: Card[],
  cardsPlayedHistory: Card[],
  trick: PlayedCard[]
): boolean {
  for (let v = card.value + 1; v <= 14; v++) {
    const higherInHand = hand.some(c => c.suit === card.suit && c.value === v);
    const higherInHistory = cardsPlayedHistory.some(c => c.suit === card.suit && c.value === v);
    const higherInTrick = trick.some(p => p.card.suit === card.suit && p.card.value === v);
    if (!higherInHand && !higherInHistory && !higherInTrick) {
      return false; // Still an unplayed higher card held by opponents
    }
  }
  return true;
}

/**
 * Hard AI: tracks card counts, protects bid, and makes optimal play using card history.
 */
export function chooseCardHard(
  legalMoves: Card[],
  trick: PlayedCard[],
  ledSuit: Suit | null,
  tricksWon: number,
  bid: number,
  cardsPlayedHistory: Card[] = []
): Card {
  const needsTricks = tricksWon < bid;

  // Calculate unobserved trumps from history and current trick
  const trumpsPlayed =
    cardsPlayedHistory.filter(c => c.suit === GAME_RULES.TRUMP_SUIT).length +
    trick.filter(p => p.card.suit === GAME_RULES.TRUMP_SUIT).length;
  const myTrumps = legalMoves.filter(c => c.suit === GAME_RULES.TRUMP_SUIT);
  const outstandingTrumps = Math.max(0, 13 - trumpsPlayed - myTrumps.length);

  // If leading the trick
  if (!ledSuit || trick.length === 0) {
    if (needsTricks) {
      // 1. Look for boss cards in hand (e.g. Aces or promoted Kings/Queens where higher cards already fell)
      const bossNonTrumps = legalMoves.filter(
        c => c.suit !== GAME_RULES.TRUMP_SUIT && isBossCard(c, legalMoves, cardsPlayedHistory, trick)
      );

      // If outstanding trumps are low, leading boss cards wins reliably
      if (bossNonTrumps.length > 0 && outstandingTrumps <= 2) {
        return bossNonTrumps[0];
      }

      // 2. If we hold boss Trump (e.g. Trump A), lead it to draw trumps safely
      const bossTrump = legalMoves.find(
        c => c.suit === GAME_RULES.TRUMP_SUIT && isBossCard(c, legalMoves, cardsPlayedHistory, trick)
      );
      if (bossTrump && myTrumps.length >= 3 && outstandingTrumps > 0) {
        return bossTrump;
      }

      // 3. If any boss card exists, lead it
      if (bossNonTrumps.length > 0) {
        return bossNonTrumps[0];
      }

      // 4. Otherwise, lead lowest card from non-trump suit to establish suit
      const nonTrumps = legalMoves.filter(c => c.suit !== GAME_RULES.TRUMP_SUIT);
      if (nonTrumps.length > 0) {
        return nonTrumps.reduce((lowest, card) => (card.value < lowest.value ? card : lowest));
      }
    } else {
      // Bid is already achieved! Protect bid by playing lowest cards to avoid overtricking
      return legalMoves.reduce((lowest, card) => (card.value < lowest.value ? card : lowest));
    }

    return legalMoves[0];
  }

  // Currently winning card
  const currentWinner = determineTrickWinner(trick, ledSuit);
  const isWinningTrump = currentWinner.card.suit === GAME_RULES.TRUMP_SUIT;

  // Legal moves that can beat current winning card
  const winningMoves = legalMoves.filter(card => {
    if (card.suit === GAME_RULES.TRUMP_SUIT) {
      if (isWinningTrump) {
        return card.value > currentWinner.card.value;
      }
      return true;
    }
    if (card.suit === ledSuit && !isWinningTrump) {
      return card.value > currentWinner.card.value;
    }
    return false;
  });

  const isLastToPlay = trick.length === GAME_RULES.PLAYER_COUNT - 1;

  if (isLastToPlay) {
    if (needsTricks && winningMoves.length > 0) {
      // Guaranteed trick win: play lowest winning move
      return winningMoves.reduce((lowest, card) =>
        card.value < lowest.value ? card : lowest
      );
    }
    // Cannot win or don't need trick: slough lowest
    return legalMoves.reduce((lowest, card) =>
      card.value < lowest.value ? card : lowest
    );
  }

  // Not last to play:
  if (needsTricks && winningMoves.length > 0) {
    // If playing led suit:
    const winningInLed = winningMoves.filter(c => c.suit === ledSuit);
    if (winningInLed.length > 0) {
      // If we hold a boss card in led suit, playing it is very solid
      const bossInLed = winningInLed.find(c => isBossCard(c, legalMoves, cardsPlayedHistory, trick));
      if (bossInLed) return bossInLed;

      // Otherwise play lowest winning
      return winningInLed.reduce((lowest, card) =>
        card.value < lowest.value ? card : lowest
      );
    }

    // If ruffing with Trump (void in led suit):
    const winningTrumps = winningMoves.filter(c => c.suit === GAME_RULES.TRUMP_SUIT);
    if (winningTrumps.length > 0) {
      // Play lowest winning trump to conserve higher ones
      return winningTrumps.reduce((lowest, card) =>
        card.value < lowest.value ? card : lowest
      );
    }
  }

  // Discard lowest non-trump or lowest card
  const nonTrumpDiscards = legalMoves.filter(c => c.suit !== GAME_RULES.TRUMP_SUIT);
  if (nonTrumpDiscards.length > 0) {
    return nonTrumpDiscards.reduce((lowest, card) =>
      card.value < lowest.value ? card : lowest
    );
  }

  return legalMoves.reduce((lowest, card) =>
    card.value < lowest.value ? card : lowest
  );
}

/**
 * Unified AI card chooser delegating by difficulty level.
 */
export function chooseCard(
  hand: Card[],
  trick: PlayedCard[],
  ledSuit: Suit | null,
  difficulty: Difficulty,
  tricksWon: number,
  bid: number,
  cardsPlayedHistory: Card[] = []
): Card {
  const legalMoves = getLegalMoves(hand, ledSuit);
  if (legalMoves.length === 0) {
    throw new Error('No legal moves found for player');
  }
  if (legalMoves.length === 1) {
    return legalMoves[0];
  }

  switch (difficulty) {
    case 'easy':
      return chooseCardEasy(legalMoves);
    case 'hard':
      return chooseCardHard(
        legalMoves,
        trick,
        ledSuit,
        tricksWon,
        bid,
        cardsPlayedHistory
      );
    case 'medium':
    default:
      return chooseCardMedium(legalMoves, trick, ledSuit, tricksWon, bid);
  }
}
