
export enum Role {
  USER = "user",
  MODEL = "model",
  ERROR = "error",
}

export interface Message {
  id: string;
  role: Role;
  text: string;
}

export interface TTSSettings {
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  volume: number;
}
