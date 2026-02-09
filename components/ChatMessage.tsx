
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { CatIcon } from './icons/CatIcon';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}>
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
          <CatIcon className="w-5 h-5 text-rose-500" />
        </div>
      )}
      <div 
        className={`max-w-xl p-3 rounded-xl whitespace-pre-wrap ${isAssistant 
          ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200' 
          : 'bg-rose-500 text-white'}`}
      >
        {message.content}
      </div>
    </div>
  );
};