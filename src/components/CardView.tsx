import React from 'react';
import { Card } from '../game/types';
import { SuitIcon } from './SuitIcon';

interface CardViewProps {
  card?: Card;
  faceDown?: boolean;
  isPlayable?: boolean;
  isSelected?: boolean;
  isWinning?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  badge?: string;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  faceDown = false,
  isPlayable = false,
  isSelected = false,
  isWinning = false,
  disabled = false,
  size = 'md',
  onClick,
  className = '',
  badge,
}) => {
  // Mobile-first responsive dimensions per size
  const sizeClasses = {
    xs: 'w-8 h-12 text-[10px] rounded',
    sm: 'w-10 h-15 sm:w-12 sm:h-18 text-xs rounded-md',
    md: 'w-11 h-17 sm:w-15 sm:h-22 md:w-17 md:h-26 text-xs sm:text-sm rounded-lg',
    lg: 'w-16 h-24 sm:w-20 sm:h-30 md:w-24 md:h-36 text-sm sm:text-base rounded-xl',
  }[size];

  if (faceDown || !card) {
    return (
      <div
        className={`relative select-none transition-transform duration-200 shadow-md ${sizeClasses} ${className}
          bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 border border-amber-500/50 flex items-center justify-center overflow-hidden shrink-0`}
      >
        {/* Geometric card back pattern */}
        <div className="absolute inset-0.5 rounded border border-amber-400/20 flex items-center justify-center bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:6px_6px] opacity-40" />
        <div className="w-5 h-7 rounded border border-amber-400/60 flex items-center justify-center text-amber-400 text-[10px] font-serif font-black">
          ♠
        </div>
      </div>
    );
  }

  // Centralized suit colors:
  // Biscuit & Love = Red; Trumps & Leaves = Black
  const isRed = card.suit === 'biscuit' || card.suit === 'love';
  const isTrump = card.suit === 'trumps';

  const rankTextColor = isRed ? 'text-red-600' : 'text-black';

  const cursorClass =
    isPlayable && !disabled
      ? 'cursor-pointer active:scale-95 hover:-translate-y-3 hover:shadow-xl'
      : onClick && !disabled
      ? 'cursor-pointer active:scale-95'
      : 'cursor-default';

  const playableRing = isPlayable
    ? 'ring-2 ring-emerald-500 shadow-md shadow-emerald-500/30'
    : '';
  const winningRing = isWinning
    ? 'ring-3 ring-amber-400 animate-pulse shadow-xl shadow-amber-500/50 -translate-y-2'
    : '';
  const disabledClass = disabled && !isPlayable ? 'opacity-40 grayscale-30' : '';
  const selectedClass = isSelected
    ? '-translate-y-3.5 ring-2 ring-amber-400 shadow-xl'
    : '';

  return (
    <button
      type="button"
      onClick={disabled && !isPlayable ? undefined : onClick}
      disabled={disabled && !isPlayable && !onClick}
      className={`relative group bg-white text-slate-950 font-sans shadow-md border border-slate-300 transition-all duration-150 select-none flex flex-col justify-between p-0.5 sm:p-1 shrink-0 ${sizeClasses} ${cursorClass} ${playableRing} ${winningRing} ${selectedClass} ${disabledClass} ${className}`}
      aria-label={`${card.rank} of ${card.suit}`}
    >
      {/* Top-Left Rank & Pip (Must be visible in fanned hands) */}
      <div className="flex flex-col items-center leading-none self-start">
        <span
          className={`font-black font-mono tracking-tighter ${rankTextColor} text-[11px] sm:text-xs md:text-sm`}
        >
          {card.rank}
        </span>
        <SuitIcon
          suit={card.suit}
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 mt-0.5"
        />
      </div>

      {/* Center artwork */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <SuitIcon
          suit={card.suit}
          className={`${
            size === 'xs'
              ? 'w-4 h-4'
              : size === 'sm'
              ? 'w-5 h-5 sm:w-6 sm:h-6'
              : size === 'md'
              ? 'w-6 h-6 sm:w-8 sm:h-8'
              : 'w-10 h-10 sm:w-12 sm:h-12'
          }`}
        />
        {isTrump && size !== 'xs' && (
          <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-wider text-white bg-black px-1 rounded-xs mt-0.5">
            TRUMP
          </span>
        )}
      </div>

      {/* Bottom-Right Rank & Pip (Inverted) */}
      <div className="flex flex-col items-center leading-none self-end rotate-180">
        <span
          className={`font-black font-mono tracking-tighter ${rankTextColor} text-[11px] sm:text-xs md:text-sm`}
        >
          {card.rank}
        </span>
        <SuitIcon
          suit={card.suit}
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 mt-0.5"
        />
      </div>

      {/* Optional Badge */}
      {badge && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
          {badge}
        </span>
      )}
    </button>
  );
};
