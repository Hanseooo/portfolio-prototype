import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ChatMessage, } from "@/hooks/useChatbot";
import { SYSTEM_PROMPT } from "@/config/systemPrompt";

interface NavigationState {
  page: string | null;
  section: string | null;
}

interface ChatStore {
  messages: ChatMessage[];          // full history including system messages
  navigation: NavigationState | null;
  isOpen: boolean;

  // actions
  setOpen: (open: boolean) => void;
  addMessage: (msg: ChatMessage) => void;
  setNavigation: (nav: NavigationState | null) => void;
  reset: () => void;

  // helper: get messages for UI only (hide system)
  getVisibleMessages: () => ChatMessage[];
}

// initial messages: system prompt hidden in UI
const INITIAL_MESSAGES: ChatMessage[] = [
  { role: "system", content: SYSTEM_PROMPT, timestamp: new Date().toISOString(), source: "system" },
  { role: "assistant", content: "Hello! How can I assist you today?", timestamp: new Date().toISOString(), source: "local" },
];

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: INITIAL_MESSAGES,
      navigation: null,
      isOpen: false,

      setOpen: (open) => set({ isOpen: open }),
      addMessage: (msg) => set({ messages: [...get().messages, msg] }),
      setNavigation: (nav) => set({ navigation: nav }),
      reset: () => set({ messages: INITIAL_MESSAGES, navigation: null }),

      getVisibleMessages: () => get().messages.filter((m) => m.role !== "system"),
    }),
    {
      name: "chatbot-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
