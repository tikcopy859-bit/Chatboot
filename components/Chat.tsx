
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type Chat as GeminiChat } from "@google/genai";
import { createChatSession } from '../services/geminiService';
import { Message, Role, TTSSettings } from '../types';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import SettingsPanel from './SettingsPanel';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { SettingsIcon } from './icons/Icons';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const chatSessionRef = useRef<GeminiChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { settings, setSettings, voices, speak } = useTextToSpeech();

  // Initialize chat session on component mount
  useEffect(() => {
    chatSessionRef.current = createChatSession();
    // Add a welcome message
    setMessages([{
        id: 'welcome-message',
        role: Role.MODEL,
        text: "Hello! I'm a Gemini-powered chatbot. How can I help you today?"
    }]);
  }, []);

  // Scroll to the bottom of the message list when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: Role.USER, text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
          throw new Error("Chat session not initialized.");
      }
      
      const response = await chatSessionRef.current.sendMessage({ message: inputText });
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: response.text,
      };
      setMessages(prev => [...prev, modelMessage]);

    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.ERROR,
        text: "Sorry, something went wrong. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex h-full bg-content-light dark:bg-content-dark">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-full">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onSpeak={speak} />
          ))}
          {isLoading && <MessageBubble message={{ id: 'loading', role: Role.MODEL, text: '...' }} />}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Settings Panel */}
      <div className="relative">
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle TTS Settings"
        >
          <SettingsIcon />
        </button>
        <SettingsPanel 
          isOpen={isSettingsOpen}
          settings={settings}
          onSettingsChange={setSettings}
          voices={voices}
        />
      </div>
    </div>
  );
};

export default Chat;
