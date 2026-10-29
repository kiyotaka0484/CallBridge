import React, { useState } from 'react';
import { GamePhase, Player } from '../game/types';
import { isBidLegal } from '../game/rules';
import { calculateHandStrength } from '../game/ai';
import { GAME_RULES } from '../game/config';
import { SuitIcon } from './SuitIcon';

interface BiddingModalProps {
  players: Player[];
  phase: GamePhase;
  currentPlayerIndex: number;
  onPlaceBid: (bid: number) => void;
  humanIndex: number;
  onReadyToBid?: () => void;
}

export const BiddingModal: React.FC<BiddingModalProps> = ({
  players,
  phase,
  currentPlayerIndex,
  onPlaceBid,
  humanIndex,
  onReadyToBid,
}) => {
  const humanPlayer = players[humanIndex];
  const handEstimate = calculateHandStrength(humanPlayer.hand);

  const [selectedBid, setSelectedBid] = useState<number>(handEstimate || 3);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const existingBids = players.map(p => p.bid);

  // Reset selected bid and submission guard when entering inspection or bidding phase
  React.useEffect(() => {
    if (phase === 'inspecting' || phase === 'human_bidding') {
      const estimate = calculateHandStrength(humanPlayer.hand);
      setSelectedBid(estimate || 3);
      setHasSubmitted(false);
    }
  }, [phase, humanPlayer.hand]);

  const isHumanTurn =
    !hasSubmitted &&
    (phase === 'human_bidding' || (phase === 'bidding' && currentPlayerIndex === humanIndex));

  const handleConfirm = () => {
    if (!isHumanTurn || hasSubmitted) return;
    const check = isBidLegal(selectedBid, humanIndex, existingBids);
    if (check.legal) {
      setHasSubmitted(true);
      onPlaceBid(selectedBid);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/95 border border-slate-700/90 rounded-2xl p-3 sm:p-4 shadow-2xl text-slate-100 flex flex-col gap-2.5 backdrop-blur-md animate-fade-in select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {phase === 'inspecting'
              ? 'Card Inspection'
              : phase === 'bidding_complete'
              ? 'Bidding Complete'
              : 'Bidding Phase'}
          </h2>
        </div>

        {/* Trump Suit indicator (Black Spade) */}
        <div className="flex items-center gap-1.5 bg-white text-black px-2 py-0.5 rounded-full text-xs font-black shadow-xs">
          <SuitIcon suit="trumps" className="w-3.5 h-3.5 text-black" />
          <span>Trump: Trumps (Black ♠)</span>
        </div>
      </div>

      {/* 4 Players Bid Summary Row */}
      <div className="grid grid-cols-4 gap-1.5">
        {players.map((player, idx) => {
          const isCurrentBidder =
            (phase === 'human_bidding' && idx === 0) ||
            (phase === 'ai_bidding' && currentPlayerIndex === idx);
          const hasBid = player.bid !== null;

          return (
            <div
              key={player.id}
              className={`p-1.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                isCurrentBidder
                  ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400'
                  : hasBid
                  ? 'border-emerald-500/40 bg-emerald-950/30'
                  : 'border-slate-800 bg-slate-800/40 opacity-70'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs">{player.avatar}</span>
                <span className="text-[11px] font-semibold text-slate-200 truncate max-w-[50px]">
                  {player.name}
                </span>
              </div>

              <div className="mt-1">
                {hasBid ? (
                  <span className="text-xs sm:text-sm font-black font-mono text-emerald-400">
                    Bid: {player.bid}
                  </span>
                ) : isCurrentBidder ? (
                  <span className="text-[10px] text-amber-400 font-mono animate-pulse">
                    Calling...
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">Waiting</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase-specific interactive content */}
      {phase === 'inspecting' ? (
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 flex flex-col items-center text-center gap-2">
          <p className="text-xs text-slate-300">
            Review your 13 cards below. Count your Aces and Trumps (♠) before placing your bid.
          </p>
          <button
            type="button"
            onClick={onReadyToBid}
            className="w-full py-2 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-md cursor-pointer active:scale-95 transition-all"
          >
            Ready to Call Bid →
          </button>
        </div>
      ) : isHumanTurn ? (
        <div className="p-2 sm:p-3 bg-slate-800/70 rounded-xl border border-slate-700/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Select your bid (1 to 13):</span>
            <span className="text-[11px] text-amber-300 font-mono bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded">
              Hand Estimate: ~<strong>{handEstimate}</strong> tricks
            </span>
          </div>

          {/* Touch-friendly 13-bid button grid */}
          <div className="grid grid-cols-7 sm:grid-cols-13 gap-1 py-1">
            {Array.from({ length: 13 }, (_, i) => i + 1).map(num => {
              const check = isBidLegal(num, humanIndex, existingBids);
              const isSelected = selectedBid === num;
              const isDisabled = !check.legal;

              return (
                <button
                  key={num}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => setSelectedBid(num)}
                  className={`h-8 sm:h-9 rounded-lg text-xs sm:text-sm font-black transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-black ring-2 ring-white scale-105 shadow-md'
                      : isDisabled
                      ? 'bg-slate-800 text-slate-600 opacity-30 cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                  title={isDisabled ? check.reason : `Bid ${num}`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/60">
            <div className="text-[11px] text-slate-400 truncate">
              Calling <strong className="text-white text-xs">{selectedBid}</strong> tricks
            </div>

            <button
              type="button"
              disabled={hasSubmitted || !isBidLegal(selectedBid, humanIndex, existingBids).legal}
              onClick={handleConfirm}
              className={`px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all ${
                hasSubmitted || !isBidLegal(selectedBid, humanIndex, existingBids).legal
                  ? 'bg-slate-700 text-slate-500 opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 cursor-pointer active:scale-95'
              }`}
            >
              {hasSubmitted ? 'Bid Placed ✓' : `Confirm Bid: ${selectedBid}`}
            </button>
          </div>
        </div>
      ) : phase === 'ai_bidding' ? (
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 flex items-center justify-center gap-2 text-xs text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>
            {players[currentPlayerIndex]?.name || 'AI'} is calculating hand and bidding...
          </span>
        </div>
      ) : (
        /* Bidding complete */
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center justify-center gap-2 text-xs text-emerald-300 font-bold">
          <span>✓</span>
          <span>
            All bids confirmed! Total calls:{' '}
            {players.reduce((acc, p) => acc + (p.bid || 0), 0)} tricks. Starting Trick 1...
          </span>
        </div>
      )}

      {/* Bidding restriction note */}
      <div className="text-[10px] text-slate-400 text-center flex flex-col gap-0.5">
        <span>
          Rule: Win at least your bid to score points. Missing your bid deducts points!
        </span>
        <span className="text-[9px] text-slate-500 font-mono">
          {GAME_RULES.BID_SUM_RULE === 'any'
            ? 'Bidding Rule: Standard CallBridge (1–13 tricks each; total calls unrestricted)'
            : GAME_RULES.BID_SUM_RULE === 'cannot_equal_13'
            ? 'Bidding Rule: Total calls cannot equal exactly 13'
            : 'Bidding Rule: Total calls must sum to exactly 13'}
        </span>
      </div>
    </div>
  );
};
