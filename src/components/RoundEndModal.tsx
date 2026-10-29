import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../game/types';
import { calculateRoundScore } from '../game/rules';

interface RoundEndModalProps {
  players: Player[];
  roundNumber: number;
  totalRounds: number;
  onNextRound: () => void;
  onNewGame: () => void;
}

export const RoundEndModal: React.FC<RoundEndModalProps> = ({
  players,
  roundNumber,
  totalRounds,
  onNextRound,
  onNewGame,
}) => {
  const isMatchOver = roundNumber >= totalRounds;

  // Determine player results for this round
  const roundResults = players.map(p => {
    const bid = p.bid ?? 1;
    const { score, status, diff } = calculateRoundScore(bid, p.tricksWon);
    return {
      player: p,
      bid,
      tricksWon: p.tricksWon,
      roundScore: score,
      status,
      diff,
      totalScore: p.totalScore,
    };
  });

  // Check if human made their bid
  const humanResult = roundResults.find(r => r.player.isHuman);
  const humanSucceeded = humanResult && humanResult.status !== 'failed';

  useEffect(() => {
    if (humanSucceeded) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  }, [humanSucceeded]);

  // Overall match leader
  const sortedByTotal = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const matchLeader = sortedByTotal[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            {isMatchOver ? 'Match Complete' : `Round ${roundNumber} of ${totalRounds} Completed`}
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            {isMatchOver
              ? `${matchLeader.name} Wins the Match!`
              : humanSucceeded
              ? 'Great Round! You Made Your Bid!'
              : 'Round Summary'}
          </h2>
        </div>

        {/* Scoreboard Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-800/70 text-slate-400 uppercase text-[11px] font-semibold">
              <tr>
                <th className="py-2.5 px-3">Player</th>
                <th className="py-2.5 px-2 text-center">Bid</th>
                <th className="py-2.5 px-2 text-center">Won</th>
                <th className="py-2.5 px-3 text-center">Result</th>
                <th className="py-2.5 px-3 text-right">Round Pts</th>
                <th className="py-2.5 px-3 text-right">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {roundResults.map(({ player, bid, tricksWon, roundScore, status, totalScore }) => {
                const isMade = status === 'made';
                const isExceeded = status === 'exceeded';

                return (
                  <tr
                    key={player.id}
                    className={
                      player.isHuman
                        ? 'bg-amber-500/10 font-medium'
                        : 'hover:bg-slate-800/30'
                    }
                  >
                    <td className="py-3 px-3 flex items-center gap-2">
                      <span>{player.avatar}</span>
                      <span className="font-semibold text-slate-200">
                        {player.name}
                        {player.isHuman && (
                          <span className="ml-1 text-[10px] text-amber-400 font-mono">
                            (You)
                          </span>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center font-mono text-slate-300">
                      {bid}
                    </td>

                    <td className="py-3 px-2 text-center font-mono font-bold text-slate-200">
                      {tricksWon}
                    </td>

                    <td className="py-3 px-3 text-center">
                      {isMade ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                          Made
                        </span>
                      ) : isExceeded ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800/60">
                          Exceeded (+{(tricksWon - bid) * 0.1})
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800/60">
                          Failed (-{bid})
                        </span>
                      )}
                    </td>

                    <td
                      className={`py-3 px-3 text-right font-mono font-bold ${
                        roundScore >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {roundScore > 0 ? `+${roundScore}` : roundScore}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-black text-amber-400">
                      {totalScore.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Scoring Rule Explainer */}
        <p className="text-[11px] text-slate-400 text-center bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
          Scoring Rule: Reach your bid to get positive points (+0.1 for every extra trick). Missing your bid deducts the full bid amount.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onNewGame}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition-colors cursor-pointer"
          >
            New Game
          </button>

          {!isMatchOver ? (
            <button
              type="button"
              onClick={onNextRound}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
            >
              Start Round {roundNumber + 1} →
            </button>
          ) : (
            <button
              type="button"
              onClick={onNewGame}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
