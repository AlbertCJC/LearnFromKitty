
import React, { useState, useCallback, useRef } from 'react';
import { MaterialInput } from './components/MaterialInput';
import { ChatInterface } from './components/ChatInterface';
import { CatIcon } from './components/icons/CatIcon';
import type { ChatMessage } from './types';
import { getChatResponse } from './services/cerebrasService';
import { ThemeToggle } from './components/ThemeToggle';
import { ConfirmModal } from './components/ConfirmModal';
import { PersonaModal } from './components/PersonaModal';
import { saveChatToPdf } from './utils/pdfGenerator';

const App: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  const [studyContext, setStudyContext] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [aiPersona, setAiPersona] = useState<string>('You are a helpful AI study assistant called "Kitty"');
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
      const assistantResponse = await getChatResponse(studyContext, newMessages, aiPersona);
      setMessages([...newMessages, { role: 'assistant', content: assistantResponse }]);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get a response: ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }

  }, [messages, studyContext, aiPersona]);
  
  const performReset = useCallback(() => {
    setIsChatActive(false);
    setStudyContext('');
    setMessages([]);
    setError(null);
    setShowConfirmModal(false);
  }, []);

  const handleResetRequest = useCallback(() => {
    if (messages.length > 1) { // Only show modal if there's a convo
      setShowConfirmModal(true);
    } else {
      performReset();
    }
  }, [messages, performReset]);
  
  const handleSaveAndReset = useCallback(async () => {
    if (chatContainerRef.current) {
      try {
        await saveChatToPdf(chatContainerRef.current);
      } catch (pdfError) {
        console.error("Failed to generate PDF:", pdfError);
        setError("Sorry, there was an error saving the PDF.");
      }
    }
    performReset();
  }, [performReset]);

  const handlePersonaSave = (newPersona: string) => {
    if (newPersona.trim()) {
      setAiPersona(newPersona.trim());
    }
    setIsPersonaModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col p-4 transition-colors">
        <header className="w-full max-w-4xl mx-auto mb-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <CatIcon className="h-8 w-8 text-rose-500" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Learn from Kitty</h1>
          </div>
          <div className="flex items-center gap-4">
            {isChatActive && (
              <button 
                onClick={handleResetRequest}
                className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md text-sm font-medium transition-colors dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                Start Over
              </button>
            )}
            <ThemeToggle />
          </div>
        </header>

        <main className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col flex-1 min-h-0">
          {error && (
            <div className="p-4 bg-red-100 text-red-700 border-b border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800 text-sm rounded-t-xl">
              <strong>Error:</strong> {error}
            </div>
          )}
          {isChatActive ? (
              <ChatInterface 
                  ref={chatContainerRef}
                  messages={messages} 
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onPersonaSettingsClick={() => setIsPersonaModalOpen(true)}
              />
          ) : (
              <MaterialInput onSubmit={handleMaterialsSubmit} isLoading={isLoading} />
          )}
        </main>
      </div>
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSaveAndReset}
        onSecondaryAction={performReset}
        title="Start Over?"
        message="Do you want to save your conversation to a PDF before starting over?"
        confirmText="Save & Start Over"
        secondaryText="Don't Save"
      />
      <PersonaModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        onSave={handlePersonaSave}
        currentPersona={aiPersona}
      />
    </>
  );
};

export default App;