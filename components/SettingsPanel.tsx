
import React from 'react';
import { TTSSettings } from '../types';
import { DownloadIcon } from './icons/Icons';

interface SettingsPanelProps {
  isOpen: boolean;
  settings: TTSSettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<TTSSettings>>;
  voices: SpeechSynthesisVoice[];
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, settings, onSettingsChange, voices }) => {
  if (!isOpen) return null;

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoice = voices.find(v => v.name === e.target.value) || null;
    onSettingsChange(prev => ({ ...prev, voice: selectedVoice }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onSettingsChange(prev => ({ ...prev, [name]: parseFloat(value) }));
  };
  
  // FIX: Explicitly provide the type parameter to the `reduce` method to ensure correct type inference for `groupedVoices`.
  const groupedVoices = voices.reduce<Record<string, SpeechSynthesisVoice[]>>((acc, voice) => {
    const lang = voice.lang.split('-')[0];
    if (!acc[lang]) {
      acc[lang] = [];
    }
    acc[lang].push(voice);
    return acc;
  }, {});


  return (
    <div className="w-80 bg-bkg-light dark:bg-bkg-dark border-l border-gray-200 dark:border-gray-700 p-4 space-y-6 overflow-y-auto h-full">
      <h3 className="text-lg font-semibold">Voice Settings</h3>
      
      {/* Voice Selection */}
      <div>
        <label htmlFor="voice" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Voice</label>
        <select
          id="voice"
          value={settings.voice?.name || ''}
          onChange={handleVoiceChange}
          className="w-full p-2 bg-content-light dark:bg-content-dark border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none"
        >
          {Object.entries(groupedVoices).map(([lang, voiceGroup]) => (
            <optgroup key={lang} label={lang.toUpperCase()}>
              {voiceGroup.map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Speed Control */}
      <div>
        <label htmlFor="rate" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Speed: {settings.rate.toFixed(1)}</label>
        <input
          type="range"
          id="rate"
          name="rate"
          min="0.5"
          max="2"
          step="0.1"
          value={settings.rate}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      {/* Pitch Control */}
      <div>
        <label htmlFor="pitch" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Pitch: {settings.pitch.toFixed(1)}</label>
        <input
          type="range"
          id="pitch"
          name="pitch"
          min="0"
          max="2"
          step="0.1"
          value={settings.pitch}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
      
      {/* Volume Control */}
      <div>
        <label htmlFor="volume" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Volume: {settings.volume.toFixed(1)}</label>
        <input
          type="range"
          id="volume"
          name="volume"
          min="0"
          max="1"
          step="0.1"
          value={settings.volume}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      {/* Download Buttons (Non-functional placeholders) */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            Note: Client-side audio download from browser TTS is not reliably supported. These are placeholders.
          </p>
          <button disabled className="w-full flex items-center justify-center gap-2 p-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed">
            <DownloadIcon /> Download as MP3
          </button>
           <button disabled className="w-full flex items-center justify-center gap-2 p-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-md cursor-not-allowed">
            <DownloadIcon /> Download as WAV
          </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
