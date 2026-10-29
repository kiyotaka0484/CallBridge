import React from 'react';
import { Card, PlayedCard, PlayerPosition, Suit } from '../game/types';
import { CardView } from './CardView';
import { SuitIcon } from './SuitIcon';
import { SUIT_INFO } from '../game/config';

interface TrickAreaProps {
  currentTrick: PlayedCard[];
  ledSuit: Suit | null;
  trickWinnerCard: Card | null;
  winnerPlayerName: string | null;
  trickNumber: number;
}

export const TrickArea: React.FC<TrickAreaProps> = ({
  currentTrick,
  ledSuit,
  trickWinnerCard,
  winnerPlayerName,
  trickNumber,
}) => {
  // Find played card by position
  const getCardAtPosition = (pos: PlayerPosition): PlayedCard | undefined => {
    return currentTrick.find(p => p.playerPosition === pos);
  };

  const topCard = getCardAtPosition('top');
  const leftCard = getCardAtPosition('left');
  const rightCard = getCardAtPosition('right');
  const bottomCard = getCardAtPosition('bottom');

  return (
    <div className="relative w-44 h-44 xs:w-48 xs:h-48 sm:w-60 sm:h-60 md:w-68 md:h-68 rounded-full border border-emerald-500/20 bg-emerald-950/30 flex items-center justify-center select-none shadow-inner shrink-0">
      {/* Decorative inner felt line */}
      <div className="absolute inset-2 sm:inset-4 rounded-full border border-dashed border-emerald-500/20 pointer-events-none" />

      {/* Led suit & Trick info badge */}
      <div className="absolute z-10 flex flex-col items-center pointer-events-none">
        {ledSuit ? (
          <div className="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-900/95 border border-slate-700 shadow-md backdrop-blur-xs text-[11px] sm:text-xs font-semibold text-slate-100">
            <span className="text-slate-400">Led:</span>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded font-bold shadow-xs ${
                SUIT_INFO[ledSuit].color === 'red'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-white text-black border border-slate-300'
              }`}
            >
              <SuitIcon
                suit={ledSuit}
                className={`w-3.5 h-3.5 ${
                  SUIT_INFO[ledSuit].color === 'red' ? 'text-red-600' : 'text-black'
                }`}
              />
              <span>
                {SUIT_INFO[ledSuit].name} ({SUIT_INFO[ledSuit].symbol})
              </span>
            </span>
          </div>
        ) : (
          <div className="text-[10px] sm:text-xs font-bold text-emerald-400/80 uppercase tracking-widest font-mono">
            Trick {trickNumber} / 13
          </div>
        )}

        {/* Winner announcement flash when trick finishes */}
        {winnerPlayerName && (
          <div className="mt-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] sm:text-xs shadow-xl animate-bounce">
            {winnerPlayerName} wins!
          </div>
        )}
      </div>

      {/* Top Player Card (AI 2 - Zara) */}
      <div className="absolute top-1 sm:top-2 z-20 flex flex-col items-center">
        {topCard ? (
          <CardView
            card={topCard.card}
            size="sm"
            isWinning={trickWinnerCard?.id === topCard.card.id}
          />
        ) : (
          <div className="w-10 h-15 sm:w-12 sm:h-18 rounded border border-dashed border-slate-700/50 flex items-center justify-center opacity-25 text-[10px] text-slate-400">
            Top
          </div>
        )}
      </div>

      {/* Left Player Card (AI 1 - Vikram) */}
      <div className="absolute left-1 sm:left-2 z-20 flex items-center">
        {leftCard ? (
          <CardView
            card={leftCard.card}
            size="sm"
            isWinning={trickWinnerCard?.id === leftCard.card.id}
          />
        ) : (
          <div className="w-10 h-15 sm:w-12 sm:h-18 rounded border border-dashed border-slate-700/50 flex items-center justify-center opacity-25 text-[10px] text-slate-400">
            Left
          </div>
        )}
      </div>

      {/* Right Player Card (AI 3 - Leo) */}
      <div className="absolute right-1 sm:right-2 z-20 flex items-center">
        {rightCard ? (
          <CardView
            card={rightCard.card}
            size="sm"
            isWinning={trickWinnerCard?.id === rightCard.card.id}
          />
        ) : (
          <div className="w-10 h-15 sm:w-12 sm:h-18 rounded border border-dashed border-slate-700/50 flex items-center justify-center opacity-25 text-[10px] text-slate-400">
            Right
          </div>
        )}
      </div>

      {/* Bottom Player Card (Human - You) */}
      <div className="absolute bottom-1 sm:bottom-2 z-20 flex flex-col items-center">
        {bottomCard ? (
          <CardView
            card={bottomCard.card}
            size="sm"
            isWinning={trickWinnerCard?.id === bottomCard.card.id}
          />
        ) : (
          <div className="w-10 h-15 sm:w-12 sm:h-18 rounded border border-dashed border-slate-700/50 flex items-center justify-center opacity-25 text-[10px] text-slate-400">
            You
          </div>
        )}
      </div>
    </div>
  );
};
