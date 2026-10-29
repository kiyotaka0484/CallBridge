import React from 'react';
import { Suit } from '../game/types';

interface SuitIconProps {
  suit: Suit;
  className?: string;
  overrideColor?: string;
}

export const SuitIcon: React.FC<SuitIconProps> = ({
  suit,
  className = 'w-5 h-5',
  overrideColor,
}) => {
  // Centralized suit colors:
  // - Trumps: black
  // - Leaves: black
  // - Biscuit: red
  // - Love: red
  const defaultColor =
    suit === 'biscuit' || suit === 'love' ? 'text-red-600' : 'text-black';
  const colorClass = overrideColor || defaultColor;

  switch (suit) {
    case 'trumps':
      // Distinct Spade with Crown Base (Black)
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${className} ${colorClass} shrink-0`}
          aria-label="Trumps Suit (Black Spade)"
        >
          <path d="M12 2C9.5 6 6 8.5 6 12.5C6 15 8 16.5 10.5 16.5C11.5 16.5 12 16.1 12 16.1C12 16.1 12.5 16.5 13.5 16.5C16 16.5 18 15 18 12.5C18 8.5 14.5 6 12 2Z" />
          <path d="M11 16H13V22H11Z" />
          <path d="M9 22H15V21C15 20 13.5 19 12 19C10.5 19 9 20 9 21V22Z" />
        </svg>
      );

    case 'biscuit':
      // Distinct Diamond Tile (Red)
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${className} ${colorClass} shrink-0`}
          aria-label="Biscuit Suit (Red Diamond)"
        >
          <polygon points="12,2 21.5,12 12,22 2.5,12" />
        </svg>
      );

    case 'love':
      // Distinct Heart (Red)
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${className} ${colorClass} shrink-0`}
          aria-label="Love Suit (Red Heart)"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );

    case 'leaves':
      // Distinct Trefoil Club / Leaf (Black)
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${className} ${colorClass} shrink-0`}
          aria-label="Leaves Suit (Black Leaf)"
        >
          <circle cx="12" cy="7.5" r="4.5" />
          <circle cx="7.5" cy="14" r="4.5" />
          <circle cx="16.5" cy="14" r="4.5" />
          <path d="M11 14H13V22H11Z" />
          <path d="M8.5 22H15.5V21C15.5 19.8 13.8 18.5 12 18.5C10.2 18.5 8.5 19.8 8.5 21V22Z" />
        </svg>
      );

    default:
      return null;
  }
};
