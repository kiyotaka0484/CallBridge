import React from 'react';
import { GameStats } from '../game/types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null;

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 flex flex-col p-5 sm:p-6 gap-5 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🏆</span> Player Statistics &amp; Records
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Saved locally on your browser.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Highlight Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
              Rounds Played
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              {stats.gamesPlayed}
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
              Round Win Rate
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              {winRate}%
            </span>
            <span className="text-[10px] text-slate-400">
              ({stats.gamesWon} won)
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
              Best Round Score
            </span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">
              {stats.bestScore > 0 ? `+${stats.bestScore.toFixed(1)}` : stats.bestScore.toFixed(1)}
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
              Total Tricks Won
            </span>
            <span className="text-2xl font-black text-blue-400 mt-1 block">
              {stats.totalTricksWon}
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
              Highest Bid
            </span>
            <span className="text-2xl font-black text-purple-400 mt-1 block">
              {stats.highestBid || '—'}
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
              Highest Made Bid
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              {stats.highestBidMade || '—'}
            </span>
          </div>
        </div>

        {/* Recent round history */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Recent Round History
          </h3>
          <div className="overflow-y-auto border border-slate-800 rounded-xl bg-slate-950/40 p-2 text-xs space-y-1.5 flex-1 max-h-48">
            {stats.recentRounds.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                No matches played yet. Start a game to record your records!
              </div>
            ) : (
              stats.recentRounds.map((match, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono">{match.date}</span>
                    <span className="text-slate-300 font-medium">
                      Winner: <strong className="text-amber-400">{match.winner}</strong>
                    </span>
                  </div>
                  <div className="font-mono font-bold text-emerald-400">
                    {match.playerScore >= 0 ? `+${match.playerScore.toFixed(1)}` : match.playerScore.toFixed(1)} pts
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
