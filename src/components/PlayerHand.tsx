import React, { useState } from 'react';
import { Card, Suit } from '../game/types';
import { CardView } from './CardView';
import { isCardLegal } from '../game/rules';

interface PlayerHandProps {
  hand: Card[];
  isMyTurn: boolean;
  ledSuit: Suit | null;
  onCardClick: (card: Card) => void;
  onIllegalMoveAttempt: (reason: string) => void;
  isBiddingPhase?: boolean;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  hand,
  isMyTurn,
  ledSuit,
  onCardClick,
  onIllegalMoveAttempt,
  isBiddingPhase = false,
}) => {
  // Mobile tap-to-select support for small touch screens
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleCardClick = (card: Card) => {
    if (isBiddingPhase) {
      // During bidding, tapping a card lets the player inspect it closely
      setSelectedCardId(prev => (prev === card.id ? null : card.id));
      return;
    }

    if (!isMyTurn) {
      setSelectedCardId(prev => (prev === card.id ? null : card.id));
      onIllegalMoveAttempt('Wait for your turn to play!');
      return;
    }

    const check = isCardLegal(card, hand, ledSuit);
    if (!check.legal) {
      setSelectedCardId(card.id);
      onIllegalMoveAttempt(
        check.reason || 'Illegal move! You must follow the led suit if you have one.'
      );
      return;
    }

    // Play card
    setSelectedCardId(null);
    onCardClick(card);
  };

  // Quick suit distribution tally for easy hand inspection
  const suitCounts: Record<Suit, number> = {
    trumps: hand.filter(c => c.suit === 'trumps').length,
    biscuit: hand.filter(c => c.suit === 'biscuit').length,
    love: hand.filter(c => c.suit === 'love').length,
    leaves: hand.filter(c => c.suit === 'leaves').length,
  };

  // Dynamic spacing based on remaining cards in hand
  const spacingClass =
    hand.length > 10
      ? '-space-x-7 xs:-space-x-6 sm:-space-x-5 md:-space-x-4'
      : hand.length > 7
      ? '-space-x-5 xs:-space-x-4 sm:-space-x-3 md:-space-x-2'
      : hand.length > 4
      ? '-space-x-3 xs:-space-x-2 sm:space-x-1'
      : 'space-x-1 sm:space-x-2';

  return (
    <div className="w-full flex flex-col items-center select-none px-1">
      {/* Hand Status & Suit Count Bar */}
      <div className="w-full max-w-lg flex items-center justify-between px-2 mb-1 text-[11px] sm:text-xs">
        {/* Status Prompt */}
        <div>
          {isBiddingPhase ? (
            <span className="text-amber-300 font-semibold bg-slate-900/80 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>♠</span> Inspect your {hand.length} cards to call bid
            </span>
          ) : isMyTurn ? (
            <span className="flex items-center gap-1.5 text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Your Turn: Tap a card to play
            </span>
          ) : (
            <span className="text-slate-400 font-medium bg-slate-900/60 border border-slate-800 px-2.5 py-0.5 rounded-full">
              Waiting for opponents...
            </span>
          )}
        </div>

        {/* Suit Quick Counts (Handy on mobile) */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-full text-slate-200">
          <span className="text-black bg-white px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5 shadow-2xs">
            ♠ {suitCounts.trumps}
          </span>
          <span className="text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5 shadow-2xs">
            ♦ {suitCounts.biscuit}
          </span>
          <span className="text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5 shadow-2xs">
            ♥ {suitCounts.love}
          </span>
          <span className="text-black bg-white px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5 shadow-2xs">
            ♣ {suitCounts.leaves}
          </span>
        </div>
      </div>

      {/* 13-Card Fan: Overlap calibrated so cards never overflow phone screens */}
      <div className="w-full max-w-full flex justify-center items-end py-1 sm:py-2 overflow-x-hidden">
        <div className={`inline-flex items-end ${spacingClass} transition-all duration-150`}>
          {hand.map((card, index) => {
            const isSelected = selectedCardId === card.id;
            const legalCheck = isMyTurn
              ? isCardLegal(card, hand, ledSuit)
              : { legal: false };
            const isPlayable = isMyTurn && legalCheck.legal;

            return (
              <div
                key={card.id}
                className="transform transition-transform duration-150"
                style={{
                  zIndex: isSelected ? 40 : index + 1,
                }}
              >
                <CardView
                  card={card}
                  size="md"
                  isPlayable={isPlayable}
                  isSelected={isSelected}
                  disabled={isMyTurn && !legalCheck.legal}
                  onClick={() => handleCardClick(card)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
