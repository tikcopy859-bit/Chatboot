
import React from 'react';
import { Message, Role } from '../types';
import { SpeakerIcon, WarningIcon, UserIcon } from './icons/Icons';

interface MessageBubbleProps {
  message: Message;
  onSpeak?: (text: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onSpeak }) => {
  const isUser = message.role === Role.USER;
  const isError = message.role === Role.ERROR;
  const isModel = message.role === Role.MODEL;

  const bubbleClasses = isUser
    ? 'bg-primary-light dark:bg-primary-dark text-white'
    : isError
    ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
    : 'bg-white dark:bg-content-dark text-text-primary-light dark:text-text-primary-dark';

  const alignmentClasses = isUser ? 'justify-end' : 'justify-start';
  
  const formattedText = message.text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className={`flex items-end gap-2 ${alignmentClasses}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {isError ? <WarningIcon /> : <span className="text-lg">🤖</span>}
        </div>
      )}
      <div
        className={`max-w-md lg:max-w-2xl px-4 py-2 rounded-xl shadow-md ${bubbleClasses}`}
      >
        <p className="whitespace-pre-wrap">{formattedText}</p>
        {isModel && onSpeak && message.id !== 'loading' && (
          <button 
            onClick={() => onSpeak(message.text)} 
            className="mt-2 p-1 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors"
            aria-label="Read message aloud"
          >
            <SpeakerIcon />
          </button>
        )}
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <UserIcon />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
