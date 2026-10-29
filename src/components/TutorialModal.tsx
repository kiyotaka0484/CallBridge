import React, { useState } from 'react';
import { CardView } from './CardView';
import { Card } from '../game/types';
import { SuitIcon } from './SuitIcon';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'suits' | 'examples' | 'scoring'>('overview');

  if (!isOpen) return null;

  // Example cards
  const biscuit10: Card = { id: 'biscuit-10', suit: 'biscuit', rank: '10', value: 10 };
  const biscuitK: Card = { id: 'biscuit-K', suit: 'biscuit', rank: 'K', value: 13 };
  const trump3: Card = { id: 'trumps-3', suit: 'trumps', rank: '3', value: 3 };
  const trumpA: Card = { id: 'trumps-A', suit: 'trumps', rank: 'A', value: 14 };
  const loveA: Card = { id: 'love-A', suit: 'love', rank: 'A', value: 14 };
  const leavesQ: Card = { id: 'leaves-Q', suit: 'leaves', rank: 'Q', value: 12 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>📖</span> How to Play CallBridge
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Rules, Trump hierarchy, suit-following, and scoring guide.
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

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 px-4 bg-slate-950/40 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Flow
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('suits')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'suits'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Suits & Trumps
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('examples')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'examples'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Examples
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scoring')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'scoring'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Scoring & Tips
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl">
                <h3 className="font-bold text-white text-base mb-1.5">What is CallBridge?</h3>
                <p>
                  CallBridge is a classic 4-player trick-taking game played with 52 cards. Each player is dealt 13 cards.
                  Before playing, each player calls (bids) the number of tricks they think they can win.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-amber-400 font-bold block text-sm">1. Deal & Bid</span>
                  <span className="text-slate-400 text-xs">Each player receives 13 cards and calls 1 to 13 tricks.</span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-amber-400 font-bold block text-sm">2. Play 13 Tricks</span>
                  <span className="text-slate-400 text-xs">Lead a card, follow suit, or play Trump to take the trick.</span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-amber-400 font-bold block text-sm">3. Score & Advance</span>
                  <span className="text-slate-400 text-xs">Make your bid to win points. Failing deducts your bid!</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suits' && (
            <div className="space-y-4">
              <p>The 52-card deck consists of four distinct suits:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-300 p-3.5 rounded-xl flex items-center gap-3 text-black">
                  <SuitIcon suit="trumps" className="w-8 h-8 text-black" />
                  <div>
                    <h4 className="font-black text-black text-sm">Trumps (Black ♠) ★ Supreme Trump</h4>
                    <p className="text-xs text-slate-800">
                      The permanent black Trump suit. Any Trump card beats non-trump cards!
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-center gap-3 text-red-600">
                  <SuitIcon suit="biscuit" className="w-8 h-8 text-red-600" />
                  <div>
                    <h4 className="font-black text-red-600 text-sm">Biscuit (Red ♦ Diamond)</h4>
                    <p className="text-xs text-slate-800">
                      Red suit. Follow suit when led.
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-center gap-3 text-red-600">
                  <SuitIcon suit="love" className="w-8 h-8 text-red-600" />
                  <div>
                    <h4 className="font-black text-red-600 text-sm">Love (Red ♥ Heart)</h4>
                    <p className="text-xs text-slate-800">
                      Red suit. Follow suit when led.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-300 p-3.5 rounded-xl flex items-center gap-3 text-black">
                  <SuitIcon suit="leaves" className="w-8 h-8 text-black" />
                  <div>
                    <h4 className="font-black text-black text-sm">Leaves (Black ♣ Leaf/Club)</h4>
                    <p className="text-xs text-slate-800">
                      Black suit. Follow suit when led.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                  Card Ranks (Low to High):
                </h4>
                <p className="font-mono text-amber-400 text-sm">
                  2 &lt; 3 &lt; 4 &lt; 5 &lt; 6 &lt; 7 &lt; 8 &lt; 9 &lt; 10 &lt; J &lt; Q &lt; K &lt; A
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Trump A is the most powerful card in the game.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-4">
              {/* Example 1 */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm">
                    Example 1: Following Suit (Mandatory)
                  </h4>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md font-mono">
                    Rule 1
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  Player 1 leads with <strong>Biscuit 10</strong>. If Player 2 holds any Biscuit cards, Player 2 <em>MUST</em> play a Biscuit card.
                </p>
                <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg">
                  <CardView card={biscuit10} size="sm" />
                  <span className="text-xs text-slate-400 font-bold">Led</span>
                  <span className="text-slate-600">→</span>
                  <CardView card={biscuitK} size="sm" isWinning />
                  <span className="text-xs text-emerald-400 font-semibold">
                    Legal &amp; Beats 10 (Higher rank of led suit wins!)
                  </span>
                </div>
              </div>

              {/* Example 2 */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm">
                    Example 2: No Matching Suit (Void in Led Suit)
                  </h4>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md font-mono">
                    Rule 2
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-2">
                  Player 1 leads with Biscuit. Player 2 has <em>no Biscuit cards</em>. Player 2 may now play <strong>any suit</strong>: Trump, Love, or Leaves!
                </p>
              </div>

              {/* Example 3 */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm">
                    Example 3: Trump Beats Non-Trump &amp; Trump Hierarchy
                  </h4>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md font-mono">
                    Rule 3
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  Biscuit 10 is led. Player 2 plays <strong>Trump 3</strong>. Player 3 plays <strong>Trump A</strong>.
                  Trump beats Biscuit, and <strong>Trump A beats Trump 3</strong>!
                </p>
                <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg overflow-x-auto">
                  <CardView card={biscuit10} size="sm" />
                  <span className="text-slate-600">vs</span>
                  <CardView card={trump3} size="sm" />
                  <span className="text-slate-600">vs</span>
                  <CardView card={trumpA} size="sm" isWinning />
                  <span className="text-xs text-amber-400 font-bold ml-2">
                    Winner: Trump A!
                  </span>
                </div>
              </div>

              {/* Example 4 */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-sm">
                    Example 4: Off-Suit Ace Does NOT Win!
                  </h4>
                  <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md font-mono">
                    Important!
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  Player 1 leads <strong>Biscuit 10</strong>. Player 2 has no Biscuit and plays <strong>Love A</strong>.
                  Even though Love A is an Ace, it is an <em>off-suit card</em> and does NOT beat Biscuit 10!
                </p>
                <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg">
                  <CardView card={biscuit10} size="sm" isWinning />
                  <span className="text-xs text-emerald-400 font-bold">Wins! (Led suit)</span>
                  <span className="text-slate-600">vs</span>
                  <CardView card={loveA} size="sm" disabled />
                  <span className="text-xs text-rose-400 font-semibold">
                    Off-suit Ace loses to led suit!
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scoring' && (
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70">
                <h4 className="font-bold text-white text-sm mb-2">Round Score Calculation</h4>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓ Made Bid:</span>
                    <span>If you bid 4 and win 4 tricks, you earn <strong>+4.0 points</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">★ Overtricks:</span>
                    <span>If you bid 4 and win 5 tricks, you get <strong>+4.1 points</strong> (+0.1 bonus per extra trick).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✗ Failed Bid:</span>
                    <span>If you bid 4 and only win 3 tricks, you lose <strong>-4.0 points</strong>! Always protect your bid!</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70">
                <h4 className="font-bold text-amber-400 text-sm mb-1.5">Pro Strategy Tips</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  <li>Count your Aces and high Trumps when bidding. Do not overcall.</li>
                  <li>Save your Trumps to trump opponents&apos; winning Aces when you are out of that suit.</li>
                  <li>If you already reached your bid, slough your cards carefully to prevent unnecessary risks.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950/40">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            Got it, Let&apos;s Play!
          </button>
        </div>
      </div>
    </div>
  );
};
