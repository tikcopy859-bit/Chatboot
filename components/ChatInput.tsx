
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { SendIcon, MicIcon } from './icons/Icons';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTranscript = useCallback((transcript: string) => {
    setText(prev => prev + transcript);
  }, []);

  const { isListening, toggleListening, hasSupport } = useSpeechToText(handleTranscript);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="bg-bkg-light dark:bg-bkg-dark p-4 border-t border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {hasSupport && (
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-500 text-white' 
                : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            <MicIcon />
          </button>
        )}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 p-2 bg-content-light dark:bg-content-dark border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none max-h-40"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="p-2 bg-primary-light dark:bg-primary-dark text-white rounded-full disabled:bg-gray-400 disabled:dark:bg-gray-500 transition-colors"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
