import React from 'react';
import { Player, PlayerPosition } from '../game/types';

interface PlayerSpotProps {
  player: Player;
  isCurrentTurn: boolean;
  position: PlayerPosition;
  isAiThinking?: boolean;
}

export const PlayerSpot: React.FC<PlayerSpotProps> = ({
  player,
  isCurrentTurn,
  position,
  isAiThinking = false,
}) => {
  const cardCount = player.hand.length;

  const positionClasses = {
    top: 'flex-col items-center',
    left: 'flex-col items-start',
    right: 'flex-col items-end',
    bottom: 'flex-col items-center',
  }[position];

  return (
    <div className={`relative flex ${positionClasses} select-none transition-all duration-200`}>
      {/* Player Card Strip */}
      <div
        className={`relative flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl backdrop-blur-md transition-all duration-200 ${
          isCurrentTurn
            ? 'bg-amber-500/25 ring-2 ring-amber-400 shadow-lg shadow-amber-500/25'
            : 'bg-slate-900/85 border border-slate-700/80 shadow-md'
        }`}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full overflow-hidden border flex items-center justify-center font-bold ${
              isCurrentTurn
                ? 'border-amber-400 bg-amber-950 text-amber-200'
                : 'border-slate-600 bg-slate-800 text-slate-200'
            }`}
          >
            <span className="text-sm sm:text-base">{player.avatar || player.name.charAt(0)}</span>
          </div>

          {/* Turn pulsing dot */}
          {isCurrentTurn && (
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
          )}
        </div>

        {/* Player Name & Bid/Won */}
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-[11px] sm:text-xs font-bold text-white truncate max-w-[60px] sm:max-w-[90px]">
              {player.name}
            </span>
            {isAiThinking && (
              <span className="text-[9px] text-amber-400 animate-pulse font-mono hidden sm:inline">
                thinking...
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-[11px] font-mono">
            <span className="text-slate-300">
              Bid: <strong className="text-amber-400 font-bold">{player.bid !== null ? player.bid : '—'}</strong>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">
              Won: <strong className="text-emerald-400 font-bold">{player.tricksWon}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Mini remaining cards indicator */}
      <div className="flex items-center gap-1 mt-0.5 opacity-80 text-[9px] sm:text-[10px] text-slate-400 font-mono">
        <span>🂠 {cardCount}</span>
      </div>
    </div>
  );
};
