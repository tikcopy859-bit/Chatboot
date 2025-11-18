
import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this environment, we assume the key is present.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Creates a new chat session with the Gemini model.
 * @returns A Chat instance.
 */
export const createChatSession = (): Chat => {
  const model = 'gemini-2.5-flash';
  const chat: Chat = ai.chats.create({
    model: model,
    // System instruction can be added here if needed
    // config: {
    //   systemInstruction: 'You are a helpful assistant.',
    // },
  });
  return chat;
};
