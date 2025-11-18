
import { useState, useEffect, useCallback } from 'react';
import { TTSSettings } from '../types';

export const useTextToSpeech = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<TTSSettings>({
    voice: null,
    rate: 1,
    pitch: 1,
    volume: 1,
  });

  // Populate voices when they are loaded by the browser
  const populateVoiceList = useCallback(() => {
    const newVoices = window.speechSynthesis.getVoices();
    setVoices(newVoices);
    // Set a default voice if none is selected
    if (!settings.voice && newVoices.length > 0) {
      const defaultVoice = newVoices.find(voice => voice.lang.startsWith('en')) || newVoices[0];
      setSettings(prev => ({ ...prev, voice: defaultVoice }));
    }
  }, [settings.voice]);

  useEffect(() => {
    populateVoiceList();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = (text: string) => {
    if (!text || !settings.voice) return;
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = settings.voice;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    window.speechSynthesis.speak(utterance);
  };

  return { settings, setSettings, voices, speak };
};
