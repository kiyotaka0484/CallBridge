import React from 'react';
import { Card, ChatMessage, GamePhase, GameSettings, PlayedCard, Player, Suit } from '../game/types';
import { PlayerSpot } from './PlayerSpot';
import { PlayerHand } from './PlayerHand';
import { TrickArea } from './TrickArea';
import { BiddingModal } from './BiddingModal';
import { RoundEndModal } from './RoundEndModal';
import { ChatBox } from './ChatBox';

interface GameTableProps {
  players: Player[];
  currentPlayerIndex: number;
  currentTrick: PlayedCard[];
  ledSuit: Suit | null;
  trumpSuit: Suit;
  trickWinnerCard: Card | null;
  winnerPlayerName: string | null;
  trickNumber: number;
  roundNumber: number;
  totalRounds: number;
  phase: GamePhase;
  isAiThinking: boolean;
  settings: GameSettings;
  messages: ChatMessage[];
  isChatOpen: boolean;
  onCloseChat: () => void;
  onSendMessage: (text: string) => void;
  onHumanPlayCard: (card: Card) => void;
  onHumanPlaceBid: (bid: number) => void;
  onReadyToBid?: () => void;
  onNextRound: () => void;
  onNewGame: () => void;
  onIllegalMoveAttempt: (reason: string) => void;
}

export const GameTable: React.FC<GameTableProps> = ({
  players,
  currentPlayerIndex,
  currentTrick,
  ledSuit,
  trumpSuit,
  trickWinnerCard,
  winnerPlayerName,
  trickNumber,
  roundNumber,
  totalRounds,
  phase,
  isAiThinking,
  settings,
  messages,
  isChatOpen,
  onCloseChat,
  onSendMessage,
  onHumanPlayCard,
  onHumanPlaceBid,
  onReadyToBid,
  onNextRound,
  onNewGame,
  onIllegalMoveAttempt,
}) => {
  const humanPlayer = players[0]; // bottom
  const aiLeft = players[1];     // left
  const aiTop = players[2];      // top
  const aiRight = players[3];    // right

  const isHumanTurn = currentPlayerIndex === 0 && phase === 'playing';

  const isBiddingActive =
    phase === 'inspecting' ||
    phase === 'human_bidding' ||
    phase === 'ai_bidding' ||
    phase === 'bidding_complete' ||
    phase === 'bidding';

  return (
    <div className="relative flex-1 w-full h-[calc(100dvh-48px)] sm:h-[calc(100vh-48px)] max-h-[calc(100dvh-48px)] min-h-0 flex flex-col justify-between items-center bg-radial from-emerald-950 via-slate-950 to-black overflow-hidden select-none p-1 sm:p-3">
      {/* Table Green Felt Border */}
      <div className="absolute inset-1 sm:inset-4 rounded-3xl border border-emerald-900/40 bg-gradient-to-b from-emerald-950/60 via-slate-900/50 to-emerald-950/60 shadow-2xl pointer-events-none" />

      {/* Top Player (AI 2 - Zara) */}
      <div className="z-20 w-full flex justify-center pt-0.5 sm:pt-1">
        <PlayerSpot
          player={aiTop}
          position="top"
          isCurrentTurn={currentPlayerIndex === 2 && phase === 'playing'}
          isAiThinking={currentPlayerIndex === 2 && isAiThinking}
        />
      </div>

      {/* Middle Section: Left AI, Center (Trick Area or Bidding Panel), Right AI */}
      <div className="z-20 w-full max-w-4xl flex items-center justify-between px-1 sm:px-4 my-auto gap-1">
        {/* Left Player (AI 1 - Vikram) */}
        <div className={`shrink-0 ${isBiddingActive ? 'hidden sm:block' : 'block'}`}>
          <PlayerSpot
            player={aiLeft}
            position="left"
            isCurrentTurn={currentPlayerIndex === 1 && phase === 'playing'}
            isAiThinking={currentPlayerIndex === 1 && isAiThinking}
          />
        </div>

        {/* Center Arena: Bidding Panel during bidding, TrickArea during play */}
        <div className="flex justify-center items-center my-auto flex-1 w-full max-w-md px-1">
          {isBiddingActive ? (
            <BiddingModal
              players={players}
              phase={phase}
              currentPlayerIndex={currentPlayerIndex}
              onPlaceBid={onHumanPlaceBid}
              humanIndex={0}
              onReadyToBid={onReadyToBid}
            />
          ) : (
            <TrickArea
              currentTrick={currentTrick}
              ledSuit={ledSuit}
              trickWinnerCard={trickWinnerCard}
              winnerPlayerName={winnerPlayerName}
              trickNumber={trickNumber}
            />
          )}
        </div>

        {/* Right Player (AI 3 - Leo) */}
        <div className={`shrink-0 ${isBiddingActive ? 'hidden sm:block' : 'block'}`}>
          <PlayerSpot
            player={aiRight}
            position="right"
            isCurrentTurn={currentPlayerIndex === 3 && phase === 'playing'}
            isAiThinking={currentPlayerIndex === 3 && isAiThinking}
          />
        </div>
      </div>

      {/* Bottom Section: Human Status Strip & 13-Card Hand */}
      <div className="z-20 w-full max-w-3xl flex flex-col items-center pb-1">
        {/* Human player status strip */}
        <div className="flex items-center gap-2 sm:gap-4 bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-full backdrop-blur-md mb-1 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{humanPlayer.avatar}</span>
            <span className="font-bold text-white truncate max-w-[80px]">
              {settings.playerName || 'You'}
            </span>
          </div>

          <span className="text-slate-600">·</span>
          <div className="text-slate-300 font-mono">
            Bid:{' '}
            <strong className="text-amber-400 font-bold">
              {humanPlayer.bid !== null ? humanPlayer.bid : '—'}
            </strong>
          </div>

          <span className="text-slate-600">·</span>
          <div className="text-slate-300 font-mono">
            Won:{' '}
            <strong className="text-emerald-400 font-bold">
              {humanPlayer.tricksWon}
            </strong>
          </div>

          <span className="text-slate-600">·</span>
          <div className="text-slate-300 font-mono">
            Score:{' '}
            <strong className="text-amber-300 font-bold">
              {humanPlayer.totalScore.toFixed(1)}
            </strong>
          </div>
        </div>

        {/* Human Hand (13 cards, completely visible on mobile!) */}
        <PlayerHand
          hand={humanPlayer.hand}
          isMyTurn={isHumanTurn}
          ledSuit={ledSuit}
          onCardClick={onHumanPlayCard}
          onIllegalMoveAttempt={onIllegalMoveAttempt}
          isBiddingPhase={isBiddingActive}
        />
      </div>

      {/* Round End Results Modal */}
      {phase === 'round_end' && (
        <RoundEndModal
          players={players}
          roundNumber={roundNumber}
          totalRounds={totalRounds}
          onNextRound={onNextRound}
          onNewGame={onNewGame}
        />
      )}

      {/* Quick Chat Drawer (Non-intrusive) */}
      <ChatBox
        messages={messages}
        onSendMessage={onSendMessage}
        isOpen={isChatOpen}
        onClose={onCloseChat}
      />
    </div>
  );
};
