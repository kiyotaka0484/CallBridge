import React from 'react';
import { CardView } from './CardView';
import { Card } from '../game/types';
import { SuitIcon } from './SuitIcon';

interface HomePageProps {
  onStartGame: () => void;
  onOpenTutorial: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  difficulty: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartGame,
  onOpenTutorial,
  onOpenLeaderboard,
  onOpenSettings,
  difficulty,
}) => {
  // Decorative showcase cards
  const demoCards: Card[] = [
    { id: 'trumps-A', suit: 'trumps', rank: 'A', value: 14 },
    { id: 'biscuit-K', suit: 'biscuit', rank: 'K', value: 13 },
    { id: 'love-Q', suit: 'love', rank: 'Q', value: 12 },
    { id: 'leaves-J', suit: 'leaves', rank: 'J', value: 11 },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center text-slate-100 bg-radial from-slate-900 via-slate-950 to-black overflow-hidden select-none px-4 py-8">
      {/* Background ambient felt table lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="z-10 flex items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          Classic 4-Player Card Game
        </span>
      </div>

      {/* Hero Section */}
      <div className="z-10 flex flex-col items-center text-center max-w-2xl my-auto">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white drop-shadow-md">
          CallBridge
        </h1>
        <p className="text-lg sm:text-2xl font-serif italic text-amber-300 mt-2">
          &ldquo;Call your hand. Master the trick.&rdquo;
        </p>

        <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-lg leading-relaxed">
          Challenge three AI opponents in the strategic card game of CallBridge.
          Bid your contract, respect suit following, and unleash Trumps to conquer the table.
        </p>

        {/* Decorative Fan of Cards */}
        <div className="my-8 flex justify-center items-center -space-x-6 sm:-space-x-8">
          {demoCards.map((card, index) => {
            const rotations = ['-rotate-12', '-rotate-4', 'rotate-4', 'rotate-12'];
            return (
              <div
                key={card.id}
                className={`transform ${rotations[index]} hover:z-20 hover:-translate-y-4 transition-all duration-300 shadow-2xl`}
              >
                <CardView card={card} size="lg" />
              </div>
            );
          })}
        </div>

        {/* Four suits preview */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 mb-8 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-xs text-black font-bold bg-white px-2.5 py-1 rounded-full shadow-xs">
            <SuitIcon suit="trumps" className="w-4 h-4 text-black" />
            <span>Trumps (Black ♠)</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold bg-red-50 border border-red-200 px-2.5 py-1 rounded-full shadow-xs">
            <SuitIcon suit="biscuit" className="w-4 h-4 text-red-600" />
            <span>Biscuit (Red ♦)</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold bg-red-50 border border-red-200 px-2.5 py-1 rounded-full shadow-xs">
            <SuitIcon suit="love" className="w-4 h-4 text-red-600" />
            <span>Love (Red ♥)</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5 text-xs text-black font-bold bg-white px-2.5 py-1 rounded-full shadow-xs">
            <SuitIcon suit="leaves" className="w-4 h-4 text-black" />
            <span>Leaves (Black ♣)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onStartGame}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Play Now</span>
            <span className="text-xs opacity-75 font-mono">({difficulty.toUpperCase()} AI)</span>
          </button>

          <button
            type="button"
            onClick={onOpenTutorial}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>📖</span>
            <span>How to Play</span>
          </button>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>🏆</span> Leaderboard &amp; Stats
          </button>
          <span className="text-slate-700">·</span>
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>⚙️</span> Settings
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="z-10 text-center text-xs text-slate-500 flex flex-col items-center gap-1">
        <p>1 Human vs 3 Intelligent Computer Opponents · 52 Cards · 13 Tricks</p>
      </footer>
    </div>
  );
};
