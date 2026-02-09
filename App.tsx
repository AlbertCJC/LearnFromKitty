
import React, { useState, useCallback } from 'react';
import { MaterialInput } from './components/MaterialInput';
import { ChatInterface } from './components/ChatInterface';
import { CatIcon } from './components/icons/CatIcon';
import type { ChatMessage } from './types';
import { getChatResponse } from './services/cerebrasService';
import { ThemeToggle } from './components/ThemeToggle';

const App: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  const [studyContext, setStudyContext] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleMaterialsSubmit = useCallback((materials: string) => {
    setStudyContext(materials);
    setError(null);
    setIsChatActive(true);
    setMessages([
      { role: 'assistant', content: "Hello! I'm your study kitty. Ask me anything about your materials." }
    ]);
  }, []);
  
  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);
    
    try {
      const assistantResponse = await getChatResponse(studyContext, newMessages);
      setMessages([...newMessages, { role: 'assistant', content: assistantResponse }]);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get a response: ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }

  }, [messages, studyContext]);

  const handleReset = useCallback(() => {
    setIsChatActive(false);
    setStudyContext('');
    setMessages([]);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4 transition-colors">
      <header className="w-full max-w-4xl mx-auto mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CatIcon className="h-8 w-8 text-rose-500" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Learn from Kitty</h1>
        </div>
        <div className="flex items-center gap-4">
          {isChatActive && (
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md text-sm font-medium transition-colors dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              Start Over
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="w-full h-[85vh] max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 border-b border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800 text-sm rounded-t-xl">
            <strong>Error:</strong> {error}
          </div>
        )}
        {isChatActive ? (
            <ChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
            />
        ) : (
            <MaterialInput onSubmit={handleMaterialsSubmit} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
};

export default App;