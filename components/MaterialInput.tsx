
import React, { useState, useCallback } from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { parseFile } from '../utils/fileParser';

interface MaterialInputProps {
  onSubmit: (materials: string) => void;
  isLoading: boolean;
}

export const MaterialInput: React.FC<MaterialInputProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!text && files.length === 0) {
      setError('Please provide study materials either by text or by uploading a file.');
      return;
    }

    let combinedContent = text;

    try {
      const fileContents = await Promise.all(files.map(parseFile));
      combinedContent += '\n\n' + fileContents.join('\n\n---\n\n');
      onSubmit(combinedContent.trim());
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Error reading files: ${errorMessage}`);
    }
  }, [text, files, onSubmit]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <BookOpenIcon className="h-16 w-16 text-rose-400 mb-4" />
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Upload Your Study Materials</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">Paste text or upload files (.pdf, .docx, .pptx, .txt). We'll get everything ready for your study session.</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your notes here..."
          className="w-full h-32 p-3 bg-white text-slate-800 placeholder-slate-400 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400 resize-y max-h-80"
          disabled={isLoading}
        />
        
        <label className="w-full flex items-center justify-center px-4 py-3 bg-white text-rose-600 rounded-lg shadow-sm tracking-wide border border-rose-300 cursor-pointer hover:bg-rose-50 hover:text-rose-700 transition dark:bg-slate-700 dark:border-slate-600 dark:text-rose-400 dark:hover:bg-slate-600 dark:hover:text-rose-300">
          <PaperclipIcon className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">{files.length > 0 ? `${files.length} file(s) selected` : 'Upload Files'}</span>
          <input type='file' className="hidden" multiple onChange={handleFileChange} accept=".txt,.md,.csv,.pdf,.docx,.doc,.pptx" disabled={isLoading} />
        </label>
        
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors dark:disabled:bg-slate-600 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Start Study Session'
          )}
        </button>
      </form>
    </div>
  );
};
