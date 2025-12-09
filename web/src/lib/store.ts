import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIMessage } from '@ai-sdk/react';

export const MODELS = [
  { id: 'google/gemma-3-12b-it', label: 'Gemma 3 12B' },
  { id: 'deepseek/deepseek-r1-0528-qwen3-8b', label: 'Qwen 3 8B R1' },
  { id: 'meta-llama/llama-3-8b-instruct', label: 'Llama 3 8B Instruct' },
] as const;

export type ModelId = (typeof MODELS)[number]['id'];

interface ChatStore {
  messages: UIMessage[];
  setMessages: (messages: UIMessage[]) => void;
  model: ModelId;
  setModel: (model: ModelId) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      setMessages: (messages) => set({ messages }),
      model: 'google/gemma-3-12b-it',
      setModel: (model) => set({ model }),
    }),
    { name: 'scope-chat' }
  )
);

