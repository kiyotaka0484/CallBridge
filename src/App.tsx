/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Card,
  ChatMessage,
  GamePhase,
  GameSettings,
  GameStats,
  PlayedCard,
  Player,
} from './game/types';
import { GAME_RULES } from './game/config';
import { createDeck, dealHands, shuffleDeck } from './game/deck';
import { calculateRoundScore, determineTrickWinner, isBidLegal, isCardLegal } from './game/rules';
import { calculateBid, chooseCard } from './game/ai';
import { soundManager } from './game/audio';
import {
  loadSettings,
  loadStats,
  recordMatchResult,
  saveSettings,
} from './game/storage';
import { HomePage } from './components/HomePage';
import { GameHeader } from './components/GameHeader';
import { GameTable } from './components/GameTable';
import { TutorialModal } from './components/TutorialModal';
import { SettingsModal } from './components/SettingsModal';
import { LeaderboardModal } from './components/LeaderboardModal';

const INITIAL_PLAYERS: Player[] = [
  {
    id: 'player-0',
    name: 'You',
    position: 'bottom',
    isHuman: true,
    avatar: '🤠',
    hand: [],
    bid: null,
    tricksWon: 0,
    roundScore: 0,
    totalScore: 0,
  },
  {
    id: 'player-1',
    name: 'Vikram',
    position: 'left',
    isHuman: false,
    avatar: '🎩',
    hand: [],
    bid: null,
    tricksWon: 0,
    roundScore: 0,
    totalScore: 0,
  },
  {
    id: 'player-2',
    name: 'Zara',
    position: 'top',
    isHuman: false,
    avatar: '👑',
    hand: [],
    bid: null,
    tricksWon: 0,
    roundScore: 0,
    totalScore: 0,
  },
  {
    id: 'player-3',
    name: 'Leo',
    position: 'right',
    isHuman: false,
    avatar: '🦁',
    hand: [],
    bid: null,
    tricksWon: 0,
    roundScore: 0,
    totalScore: 0,
  },
];

export default function App() {
  // Screen state: landing vs card table
  const [screen, setScreen] = useState<'home' | 'game'>('home');

  // Persistence
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [stats, setStats] = useState<GameStats>(() => loadStats());

  // Game state
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [trickNumber, setTrickNumber] = useState<number>(1);
  const [phase, setPhase] = useState<GamePhase>('welcome');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [roundLeaderIndex, setRoundLeaderIndex] = useState<number>(0);
  const [currentTrick, setCurrentTrick] = useState<PlayedCard[]>([]);
  const [ledSuit, setLedSuit] = useState<PlayedCard['card']['suit'] | null>(null);
  const [trickWinnerCard, setTrickWinnerCard] = useState<Card | null>(null);
  const [winnerPlayerName, setWinnerPlayerName] = useState<string | null>(null);
  const [cardsPlayedHistory, setCardsPlayedHistory] = useState<Card[]>([]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Turn lock & active timer registry to prevent race conditions and stale timers
  const isProcessingTurnRef = useRef<boolean>(false);
  const activeTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scheduleTimer = useCallback((fn: () => void, delayMs: number) => {
    const timer = setTimeout(() => {
      activeTimersRef.current = activeTimersRef.current.filter(t => t !== timer);
      fn();
    }, delayMs);
    activeTimersRef.current.push(timer);
    return timer;
  }, []);

  const clearAllTimers = useCallback(() => {
    activeTimersRef.current.forEach(t => clearTimeout(t));
    activeTimersRef.current = [];
  }, []);

  // Clean up all timers when component unmounts
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  // Modals & Chat
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      senderName: 'Dealer',
      senderPosition: 'top',
      text: 'Welcome to the CallBridge table! Best of luck.',
      timestamp: Date.now(),
      isSystem: true,
    },
  ]);

  // Keep a ref to state to avoid stale closures in timeouts
  const stateRef = useRef({
    players,
    phase,
    currentPlayerIndex,
    currentTrick,
    ledSuit,
    trickNumber,
    roundNumber,
    roundLeaderIndex,
    settings,
    cardsPlayedHistory,
  });

  useEffect(() => {
    stateRef.current = {
      players,
      phase,
      currentPlayerIndex,
      currentTrick,
      ledSuit,
      trickNumber,
      roundNumber,
      roundLeaderIndex,
      settings,
      cardsPlayedHistory,
    };
  }, [
    players,
    phase,
    currentPlayerIndex,
    currentTrick,
    ledSuit,
    trickNumber,
    roundNumber,
    roundLeaderIndex,
    settings,
    cardsPlayedHistory,
  ]);

  // Synchronize audio setting
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Toast notifier
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Chat message dispatcher
  const handleSendMessage = useCallback(
    (text: string) => {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderName: settings.playerName || 'You',
        senderPosition: 'bottom',
        text,
        timestamp: Date.now(),
      };
      setMessages(prev => [newMsg, ...prev]);

      // Contextual AI reaction
      scheduleTimer(() => {
        const aiReplies: Record<string, string[]> = {
          'Good game!': ['Well played!', 'Thanks, you too!', 'A great battle!'],
          'Nice move!': ['Thanks!', 'Calculated risk!', 'Nicely spotted!'],
          'Interesting!': ['Card games never get old.', 'Watch this next one.'],
          'Well played!': ['Thank you!', 'Appreciate it!'],
          "Let's go!": ['Game on!', 'Bring it on!', 'Let the trumps fly!'],
          'Oops!': ['Happens to the best of us.', 'Stay sharp!'],
        };
        const replyPool = aiReplies[text] || ['Indeed!'];
        const randomReply = replyPool[Math.floor(Math.random() * replyPool.length)];
        const randomAi = players[1 + Math.floor(Math.random() * 3)];

        setMessages(prev => [
          {
            id: `msg-reply-${Date.now()}`,
            senderName: randomAi.name,
            senderPosition: randomAi.position,
            text: randomReply,
            timestamp: Date.now(),
          },
          ...prev,
        ]);
      }, 1000);
    },
    [players, scheduleTimer, settings.playerName]
  );

  /**
   * Sequence Step 1, 2, 3, 4:
   * Start round, shuffle 52 cards, deal 13 cards each, display human's complete hand.
   */
  const startNewRound = useCallback(
    (nextRoundNum: number, resetMatchScores: boolean = false) => {
      clearAllTimers();
      isProcessingTurnRef.current = false;
      setIsAiThinking(false);

      const deck = createDeck();
      const shuffled = shuffleDeck(deck);
      const dealtHands = dealHands(shuffled);

      soundManager.playDeal();

      setPlayers(prev =>
        prev.map((player, idx) => ({
          ...player,
          hand: dealtHands[idx],
          bid: null,
          tricksWon: 0,
          roundScore: 0,
          totalScore: resetMatchScores ? 0 : player.totalScore,
        }))
      );

      setRoundNumber(nextRoundNum);
      setTrickNumber(1);
      setCurrentTrick([]);
      setLedSuit(null);
      setTrickWinnerCard(null);
      setWinnerPlayerName(null);
      setCardsPlayedHistory([]);

      // Leader rotates each round
      const nextLeader = (nextRoundNum - 1) % GAME_RULES.PLAYER_COUNT;
      setRoundLeaderIndex(nextLeader);

      // Sequence Step 5: Let human inspect cards first
      setPhase('inspecting');
    },
    [clearAllTimers]
  );

  /**
   * Start completely fresh game from Round 1
   */
  const handleStartGame = useCallback(() => {
    clearAllTimers();
    setScreen('game');
    startNewRound(1, true);
  }, [clearAllTimers, startNewRound]);

  /**
   * Sequence Step 6: Show bidding interface when player is ready
   */
  const handleReadyToBid = useCallback(() => {
    if (stateRef.current.phase !== 'inspecting') return;
    setPhase('human_bidding');
  }, []);

  /**
   * Sequence Step 7: Accept the human player's bid
   * Strictly enforces: no double-submission, rejects invalid bids, sets ai_bidding
   */
  const handleHumanPlaceBid = useCallback((bid: number) => {
    if (stateRef.current.phase !== 'human_bidding') return;
    const humanPlayer = stateRef.current.players[0];
    if (humanPlayer.bid !== null) return; // Prevent double-submission

    const existingBids = stateRef.current.players.map(p => p.bid);
    const check = isBidLegal(bid, 0, existingBids);
    if (!check.legal) {
      soundManager.playError();
      showToast(check.reason || 'Invalid bid!');
      return;
    }

    soundManager.playBid();

    setPlayers(prev =>
      prev.map((p, idx) => (idx === 0 ? { ...p, bid } : p))
    );

    // Sequence Step 8: Collect the three AI players' bids in sequence
    setPhase('ai_bidding');
    setCurrentPlayerIndex(1); // Start AI 1 (Vikram)
  }, [showToast]);

  /**
   * Sequence Step 8: AI Bidding execution loop
   */
  useEffect(() => {
    if (phase !== 'ai_bidding') return;
    if (currentPlayerIndex === 0) return; // Human already bid

    const speed = settings.animationSpeed;
    const delay = GAME_RULES.TIMINGS[speed].aiBiddingDelay;

    setIsAiThinking(true);
    const timer = scheduleTimer(() => {
      const currPlayers = stateRef.current.players;
      const aiPlayer = currPlayers[currentPlayerIndex];
      const existingBids = currPlayers.map(p => p.bid);

      const aiBid = calculateBid(
        aiPlayer.hand,
        settings.difficulty,
        existingBids,
        currentPlayerIndex
      );

      soundManager.playBid();

      setPlayers(prev =>
        prev.map((p, idx) => (idx === currentPlayerIndex ? { ...p, bid: aiBid } : p))
      );
      setIsAiThinking(false);

      if (currentPlayerIndex < 3) {
        // Next AI bidder (Vikram -> Zara -> Leo)
        setCurrentPlayerIndex(currentPlayerIndex + 1);
      } else {
        // Sequence Step 9: All 4 bids collected! Display completed bidding results
        setPhase('bidding_complete');

        // Sequence Step 10: Begin the first trick after a brief pause
        const transitionDelay = speed === 'instant' ? 400 : 1600;
        scheduleTimer(() => {
          // Verify all 4 players have their bid recorded before starting play
          const allBidsRecorded = stateRef.current.players.every(p => p.bid !== null);
          if (allBidsRecorded) {
            setPhase('playing');
            setCurrentPlayerIndex(stateRef.current.roundLeaderIndex);
          }
        }, transitionDelay);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [phase, currentPlayerIndex, scheduleTimer, settings.animationSpeed, settings.difficulty]);

  /**
   * Core Trick Play Action
   */
  const playCard = useCallback(
    (playerIdx: number, card: Card) => {
      if (isProcessingTurnRef.current) return;
      isProcessingTurnRef.current = true;

      soundManager.playCardPlay();

      const player = stateRef.current.players[playerIdx];
      const playedCardItem: PlayedCard = {
        card,
        playerId: player.id,
        playerPosition: player.position,
        playerName: player.name,
      };

      // Remove card from player's hand exactly once
      setPlayers(prev =>
        prev.map((p, idx) =>
          idx === playerIdx
            ? { ...p, hand: p.hand.filter(c => c.id !== card.id) }
            : p
        )
      );

      // Track played cards history
      setCardsPlayedHistory(prev => [...prev, card]);

      // If leading card of the trick, set the led suit
      const isLead = stateRef.current.currentTrick.length === 0;
      const currentLedSuit = isLead ? card.suit : stateRef.current.ledSuit;
      if (isLead) {
        setLedSuit(card.suit);
      }

      const updatedTrick = [...stateRef.current.currentTrick, playedCardItem];
      setCurrentTrick(updatedTrick);

      // Check if trick completed (4 cards played)
      if (updatedTrick.length === GAME_RULES.PLAYER_COUNT) {
        setPhase('trick_completed');

        // Determine trick winner according to CallBridge rules:
        // Highest Trump > highest of led suit > off-suit cannot win
        const winningPlayedCard = determineTrickWinner(
          updatedTrick,
          currentLedSuit!,
          GAME_RULES.TRUMP_SUIT
        );

        setTrickWinnerCard(winningPlayedCard.card);
        setWinnerPlayerName(winningPlayedCard.playerName);

        soundManager.playTrickWin();

        const winnerIdx = stateRef.current.players.findIndex(
          p => p.id === winningPlayedCard.playerId
        );

        const speed = stateRef.current.settings.animationSpeed;
        const clearDelay = GAME_RULES.TIMINGS[speed].trickClearDelay;

        // Schedule trick clearing and next trick / round completion
        scheduleTimer(() => {
          // Increment winner's trick count
          setPlayers(prev =>
            prev.map((p, idx) =>
              idx === winnerIdx ? { ...p, tricksWon: p.tricksWon + 1 } : p
            )
          );

          // Clear center trick area
          setCurrentTrick([]);
          setLedSuit(null);
          setTrickWinnerCard(null);
          setWinnerPlayerName(null);

          const nextTrickNum = stateRef.current.trickNumber + 1;

          if (nextTrickNum > GAME_RULES.TRICKS_PER_ROUND) {
            // Round Complete (All 13 tricks played!)
            const finalPlayers = stateRef.current.players.map((p, idx) => {
              const won = idx === winnerIdx ? p.tricksWon + 1 : p.tricksWon;
              const bid = p.bid ?? 1;
              const { score } = calculateRoundScore(bid, won);
              return {
                ...p,
                tricksWon: won,
                roundScore: score,
                totalScore: Number((p.totalScore + score).toFixed(1)),
              };
            });

            setPlayers(finalPlayers);
            setPhase('round_end');
            soundManager.playRoundWin();

            // Record round results in localStorage accurately
            const human = finalPlayers[0];
            const sortedByRound = [...finalPlayers].sort(
              (a, b) => b.roundScore - a.roundScore
            );
            const roundWinner = sortedByRound[0];
            const isRoundTie =
              sortedByRound[1] &&
              sortedByRound[0].roundScore === sortedByRound[1].roundScore;
            const roundWinnerName = isRoundTie
              ? `${sortedByRound[0].name} & ${sortedByRound[1].name} (Tie)`
              : roundWinner.name;
            const didHumanWinRound = human.roundScore === roundWinner.roundScore;

            const humanBid = human.bid ?? 1;
            const didHumanMakeBid = human.tricksWon >= humanBid;

            const updatedStats = recordMatchResult(
              didHumanWinRound,
              human.roundScore,
              humanBid,
              didHumanMakeBid,
              human.tricksWon,
              stateRef.current.roundNumber,
              roundWinnerName
            );
            setStats(updatedStats);
            isProcessingTurnRef.current = false;
          } else {
            // Winner of previous trick leads next trick!
            setTrickNumber(nextTrickNum);
            setCurrentPlayerIndex(winnerIdx);
            setPhase('playing');
            isProcessingTurnRef.current = false;
          }
        }, clearDelay);
      } else {
        // Advance turn to next clockwise player
        const nextPlayer = (playerIdx + 1) % GAME_RULES.PLAYER_COUNT;
        setCurrentPlayerIndex(nextPlayer);
        isProcessingTurnRef.current = false;
      }
    },
    [scheduleTimer]
  );

  /**
   * Human plays card handler
   */
  const handleHumanPlayCard = useCallback(
    (card: Card) => {
      if (phase !== 'playing' || currentPlayerIndex !== 0) return;
      if (isProcessingTurnRef.current) return;

      const humanHand = players[0].hand;
      const check = isCardLegal(card, humanHand, ledSuit);
      if (!check.legal) {
        soundManager.playError();
        showToast(check.reason || 'Illegal card play!');
        return;
      }

      playCard(0, card);
    },
    [phase, currentPlayerIndex, players, ledSuit, playCard, showToast]
  );

  /**
   * AI playing turn loop
   */
  useEffect(() => {
    if (phase !== 'playing') return;
    if (currentPlayerIndex === 0) return; // Human turn
    if (isProcessingTurnRef.current) return;

    const speed = settings.animationSpeed;
    const delay = GAME_RULES.TIMINGS[speed].aiTurnDelay;

    setIsAiThinking(true);
    const timer = scheduleTimer(() => {
      const currPlayers = stateRef.current.players;
      const aiPlayer = currPlayers[currentPlayerIndex];

      if (!aiPlayer || aiPlayer.hand.length === 0) {
        setIsAiThinking(false);
        return;
      }

      const card = chooseCard(
        aiPlayer.hand,
        stateRef.current.currentTrick,
        stateRef.current.ledSuit,
        settings.difficulty,
        aiPlayer.tricksWon,
        aiPlayer.bid ?? 1,
        stateRef.current.cardsPlayedHistory
      );

      setIsAiThinking(false);
      playCard(currentPlayerIndex, card);
    }, delay);

    return () => clearTimeout(timer);
  }, [
    phase,
    currentPlayerIndex,
    scheduleTimer,
    settings.animationSpeed,
    settings.difficulty,
    playCard,
  ]);

  /**
   * Next round progression
   */
  const handleNextRound = () => {
    startNewRound(roundNumber + 1, false);
  };

  /**
   * Audio toggle
   */
  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    const updated = { ...settings, soundEnabled: nextVal };
    setSettings(updated);
    saveSettings(updated);
    soundManager.setEnabled(nextVal);
  };

  /**
   * Return to menu safely
   */
  const handleExitGame = useCallback(() => {
    clearAllTimers();
    isProcessingTurnRef.current = false;
    setIsAiThinking(false);
    setScreen('home');
  }, [clearAllTimers]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {screen === 'home' ? (
        <HomePage
          onStartGame={handleStartGame}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          difficulty={settings.difficulty}
        />
      ) : (
        <div className="flex-1 flex flex-col h-screen h-dvh overflow-hidden">
          {/* Top Bar Header */}
          <GameHeader
            roundNumber={roundNumber}
            totalRounds={GAME_RULES.TOTAL_ROUNDS_PER_MATCH}
            trickNumber={trickNumber}
            trumpSuit={GAME_RULES.TRUMP_SUIT}
            settings={settings}
            onToggleSound={handleToggleSound}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            onExitGame={handleExitGame}
            toastMessage={toastMessage}
          />

          {/* Main Card Game Room Table */}
          <GameTable
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            currentTrick={currentTrick}
            ledSuit={ledSuit}
            trumpSuit={GAME_RULES.TRUMP_SUIT}
            trickWinnerCard={trickWinnerCard}
            winnerPlayerName={winnerPlayerName}
            trickNumber={trickNumber}
            roundNumber={roundNumber}
            totalRounds={GAME_RULES.TOTAL_ROUNDS_PER_MATCH}
            phase={phase}
            isAiThinking={isAiThinking}
            settings={settings}
            messages={messages}
            isChatOpen={isChatOpen}
            onCloseChat={() => setIsChatOpen(false)}
            onSendMessage={handleSendMessage}
            onHumanPlayCard={handleHumanPlayCard}
            onHumanPlaceBid={handleHumanPlaceBid}
            onReadyToBid={handleReadyToBid}
            onNextRound={handleNextRound}
            onNewGame={handleStartGame}
            onIllegalMoveAttempt={reason => {
              soundManager.playError();
              showToast(reason);
            }}
          />
        </div>
      )}

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        stats={stats}
      />
    </div>
  );
}
