
import { useState, useEffect, useRef, useCallback } from 'react';

// The Web Speech API is still prefixed in some browsers
// FIX: Cast window to `any` to access vendor-prefixed properties and rename constant to avoid conflict with `SpeechRecognition` type.
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechToText = (onTranscript: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!SpeechRecognitionAPI) {
      console.error("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };
    
    recognition.onend = () => {
      // Only set listening to false if it was intentionally stopped.
      // If it stops on its own, we might want to restart it.
    };

    recognitionRef.current = recognition;
  }, [onTranscript]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);
  
  const toggleListening = useCallback(() => {
      if(isListening) {
          stopListening();
      } else {
          startListening();
      }
  }, [isListening, startListening, stopListening]);

  return { isListening, toggleListening, hasSupport: !!SpeechRecognitionAPI };
};
