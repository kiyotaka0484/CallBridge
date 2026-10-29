import React, { useState } from 'react';
import { Difficulty, GameSettings } from '../game/types';
import { resetGameData, saveSettings } from '../game/storage';
import { soundManager } from '../game/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);
  const [resetConfirm, setResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveSettings(localSettings);
    soundManager.setEnabled(localSettings.soundEnabled);
    onUpdateSettings(localSettings);
    onClose();
  };

  const handleResetData = () => {
    resetGameData();
    setResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 flex flex-col p-5 sm:p-6 gap-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Game Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* Player Name */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Player Name
            </label>
            <input
              type="text"
              maxLength={16}
              value={localSettings.playerName}
              onChange={e =>
                setLocalSettings({ ...localSettings, playerName: e.target.value || 'Player' })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>

          {/* AI Difficulty */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">
              AI Opponents Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, difficulty: level })}
                  className={`py-2 rounded-xl font-semibold capitalize transition-all cursor-pointer ${
                    localSettings.difficulty === level
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {localSettings.difficulty === 'easy' && 'Easy: Relaxed AI, makes casual bids and simple card moves.'}
              {localSettings.difficulty === 'medium' && 'Medium: Balanced play, follows suit smartly and aims for bid.'}
              {localSettings.difficulty === 'hard' && 'Hard: Strategic AI, evaluates trumps, protects bids, and counts cards.'}
            </p>
          </div>

          {/* Animation Speed */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">
              Gameplay Speed
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'fast', 'instant'] as const).map(speed => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, animationSpeed: speed })}
                  className={`py-2 rounded-xl font-semibold capitalize transition-all cursor-pointer ${
                    localSettings.animationSpeed === speed
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          {/* Audio & Visual Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Sound Effects (Web Audio)</span>
              <input
                type="checkbox"
                checked={localSettings.soundEnabled}
                onChange={e =>
                  setLocalSettings({ ...localSettings, soundEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Card Animations &amp; Glows</span>
              <input
                type="checkbox"
                checked={localSettings.cardAnimations}
                onChange={e =>
                  setLocalSettings({ ...localSettings, cardAnimations: e.target.checked })
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Reset Danger Zone */}
          <div className="pt-2 border-t border-slate-800">
            {!resetConfirm ? (
              <button
                type="button"
                onClick={() => setResetConfirm(true)}
                className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer"
              >
                Reset stats and saved data
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-300">Are you sure?</span>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs rounded font-bold cursor-pointer"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setResetConfirm(false)}
                  className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs sm:text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
