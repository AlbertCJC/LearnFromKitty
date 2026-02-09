
import React, { useState, useEffect } from 'react';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (persona: string) => void;
  currentPersona: string;
}

export const PersonaModal: React.FC<PersonaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentPersona,
}) => {
  const [persona, setPersona] = useState(currentPersona);

  useEffect(() => {
    if (isOpen) {
      setPersona(currentPersona);
    }
  }, [currentPersona, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(persona);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-slate-100" id="modal-title">
            Customize AI Persona
          </h3>
          <div className="mt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Describe how you want Kitty to behave. This will be the first instruction the AI receives.
            </p>
          </div>
          <textarea
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="e.g., You are a Shakespearean scholar who answers in iambic pentameter..."
            className="mt-4 w-full h-40 p-3 bg-white text-slate-800 placeholder-slate-400 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400 resize-y"
          />
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:col-start-2"
            onClick={handleSave}
          >
            Save Persona
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 sm:col-start-1 sm:mt-0"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
