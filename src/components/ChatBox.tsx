import React, { useState } from 'react';
import { ChatMessage, PlayerPosition } from '../game/types';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_PHRASES = [
  'Good game!',
  'Nice move!',
  'Interesting!',
  'Well played!',
  "Let's go!",
  'Oops!',
];

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  isOpen,
  onClose,
}) => {
  const [customText, setCustomText] = useState('');

  if (!isOpen) return null;

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customText.trim()) {
      onSendMessage(customText.trim());
      setCustomText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-end p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-80 max-w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 mt-12 sm:mt-0">
        {/* Header */}
        <div className="p-3 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">💬</span>
            <span className="text-xs font-bold text-slate-100">Table Chat</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Messages list */}
        <div className="h-44 overflow-y-auto p-3 space-y-2 text-xs flex flex-col-reverse bg-slate-950/40">
          {messages.map(msg => {
            const isMe = msg.senderPosition === ('bottom' as PlayerPosition);
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 px-1 font-mono">
                  {msg.senderName}
                </span>
                <div
                  className={`px-3 py-1.5 rounded-xl max-w-[85%] break-words ${
                    isMe
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick preset phrases */}
        <div className="p-2 border-t border-slate-800 bg-slate-900/90 flex flex-wrap gap-1.5">
          {QUICK_PHRASES.map(phrase => (
            <button
              key={phrase}
              type="button"
              onClick={() => onSendMessage(phrase)}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 px-2 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              {phrase}
            </button>
          ))}
        </div>

        {/* Input field */}
        <form
          onSubmit={handleSendCustom}
          className="p-2 bg-slate-950 border-t border-slate-800 flex gap-1.5"
        >
          <input
            type="text"
            placeholder="Say something..."
            maxLength={60}
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            className="flex-1 bg-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
