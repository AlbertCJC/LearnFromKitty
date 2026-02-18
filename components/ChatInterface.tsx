import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { ChatMessage } from './ChatMessage';
import { SendIcon } from './icons/SendIcon';
import { CatIcon } from './icons/CatIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

interface ChatInterfaceProps {
    messages: ChatMessageType[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    onPersonaSettingsClick: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = 
    ({ messages, onSendMessage, isLoading, onPersonaSettingsClick }) => {
        const [input, setInput] = React.useState('');
        const messagesEndRef = React.useRef<HTMLDivElement>(null);

        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        };

        React.useEffect(scrollToBottom, [messages]);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (input.trim() && !isLoading) {
                onSendMessage(input);
                setInput('');
            }
        };

        return (
            <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-900/50 min-h-0">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                     {isLoading && (
                        <div className="flex items-start gap-3">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                                 <CatIcon className="w-5 h-5 text-rose-500 animate-pulse" />
                             </div>
                             <div className="max-w-xl p-3 rounded-xl bg-slate-100 dark:bg-slate-700">
                                 <div className="flex items-center justify-center gap-1">
                                    <span className="h-2 w-2 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-rose-400 rounded-full animate-bounce"></span>
                                </div>
                             </div>
                        </div>
                     )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={onPersonaSettingsClick}
                          className="flex-shrink-0 w-10 h-10 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 flex items-center justify-center"
                          aria-label="Set AI Persona"
                        >
                           <UserCircleIcon className="w-6 h-6"/>
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question about your materials..."
                            className="flex-1 w-full px-4 py-2 bg-white text-slate-800 placeholder-slate-400 border border-slate-300 rounded-full focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="flex-shrink-0 w-10 h-10 bg-rose-600 text-white rounded-full hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors dark:disabled:bg-slate-600 flex items-center justify-center"
                            aria-label="Send message"
                        >
                           <SendIcon className="w-5 h-5"/>
                        </button>
                    </form>
                </div>
            </>
        );
    };