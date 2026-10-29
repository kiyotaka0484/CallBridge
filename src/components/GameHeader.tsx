import React from 'react';
import { GameSettings, Suit } from '../game/types';
import { SuitIcon } from './SuitIcon';
import { SUIT_INFO } from '../game/config';

interface GameHeaderProps {
  roundNumber: number;
  totalRounds: number;
  trickNumber: number;
  trumpSuit: Suit;
  settings: GameSettings;
  onToggleSound: () => void;
  onOpenTutorial: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  onToggleChat: () => void;
  onExitGame: () => void;
  toastMessage: string | null;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  roundNumber,
  totalRounds,
  trickNumber,
  trumpSuit,
  settings,
  onToggleSound,
  onOpenTutorial,
  onOpenLeaderboard,
  onOpenSettings,
  onToggleChat,
  onExitGame,
  toastMessage,
}) => {
  return (
    <header className="relative w-full z-30 select-none">
      {/* Main Top Bar */}
      <div className="flex items-center justify-between px-2 py-1.5 sm:px-5 sm:py-2.5 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
        {/* Left: Brand & Round / Trick counter */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onExitGame}
            className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors cursor-pointer group"
            title="Return to Menu"
          >
            <span className="text-amber-400 font-black text-base sm:text-lg tracking-tight group-hover:underline">
              CallBridge
            </span>
          </button>

          <span className="text-slate-600 hidden xs:inline" aria-hidden="true">
            |
          </span>

          {/* Round & Trick Counters */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span className="text-slate-300">
              R <strong className="text-white">{roundNumber}</strong>/{totalRounds}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">
              Trick <strong className="text-emerald-400 font-bold">{trickNumber}</strong>/13
            </span>
          </div>
        </div>

        {/* Center: Trump Indicator (Strictly Black Spade on Crisp Light Badge) */}
        <div className="flex items-center gap-1 bg-white text-black border border-slate-300 px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-black shadow-xs">
          <SuitIcon suit={trumpSuit} className="w-3.5 h-3.5 text-black" />
          <span>Trump: {SUIT_INFO[trumpSuit].name} (Black ♠)</span>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Chat Drawer Toggle */}
          <button
            type="button"
            onClick={onToggleChat}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="Open Table Chat"
          >
            💬
          </button>

          {/* Audio toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title={settings.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {settings.soundEnabled ? '🔊' : '🔇'}
          </button>

          {/* Rules / Tutorial */}
          <button
            type="button"
            onClick={onOpenTutorial}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="Rules & Guide"
          >
            📖
          </button>

          {/* Leaderboard */}
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="Player Records"
          >
            🏆
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Floating Warning Toast Notification for illegal moves */}
      {toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div className="px-3 py-1.5 rounded-xl bg-rose-600/95 text-white font-semibold text-xs shadow-2xl border border-rose-400 flex items-center gap-1.5 max-w-[90vw] text-center">
            <span>⚠️</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </header>
  );
};
