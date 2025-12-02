import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "@/config/systemPrompt";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_CHATBOT_KEY    ,
});

// ---------- CONFIG ----------
const MAX_HISTORY = 5; // keep last 5 user+assistant turns
// const MAX_REPARSE_ATTEMPTS = 2;
const THINKING_BUDGET = 0; // cheapest for cost-effectiveness

// ---------- TYPES ----------
export type Role = "system" | "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
  timestamp: string;
  source: "system" | "local" | "api";
}

export interface ParsedResponse {
  type: "response" | "navigate" | "error";
  message: string;
  navigation?: {
    page: string | null;
    section: string | null;
  };
}

// ---------- HELPERS ----------
// function sleep(ms: number) {
//   return new Promise((r) => setTimeout(r, ms));
// }

// helper to create type-safe messages
function createMessage(role: Role, content: string, source: "system" | "local" | "api" = "api"): ChatMessage {
  return { role, content, source, timestamp: new Date().toISOString() };
}

// extract JSON substring from triple-backtick responses
function extractJsonSubstring(text: string): string | null {
  if (!text) return null;
  const s = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const firstIdx = s.indexOf("{");
  if (firstIdx === -1) return null;

  let depth = 0;
  let start = -1;
  for (let i = firstIdx; i < s.length; i++) {
    const ch = s[i];
    if (ch === "{") {
      if (start === -1) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        const candidate = s.slice(start, i + 1)
          .replace(/,(\s*[}\]])/g, "$1")
          .replace(/'([^']*)'/g, `"$1"`);
        try { JSON.parse(candidate); return candidate; } catch(err) {
            console.log(err)
        }
      }
    }
  }
  return null;
}

function cleanAndParse(raw: string): ParsedResponse | null {
  if (!raw) return null;
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  try { return JSON.parse(cleaned) as ParsedResponse; } catch(err) {
    console.log(err)
  }
  const candidate = extractJsonSubstring(cleaned);
  if (candidate) {
    try { return JSON.parse(candidate) as ParsedResponse; } catch(err) {
        console.log(err)
    }
  }
  return null;
}

// ---------- API CALL ----------
async function callModelAPI(messages: ChatMessage[]) {
  const messagesForAI = messages
    .filter((m) => m.role !== "system" && m.source !== "local")
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: messagesForAI,
    config: {
      thinkingConfig: {
        thinkingBudget: THINKING_BUDGET,
      },
      systemInstruction: SYSTEM_PROMPT,
    },
  });

  const raw = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  return { raw, data: response };
}

// ---------- HOOK ----------
export function useChatbot() {
  // messages that will actually appear in the UI
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", "Hello! How can I assist you today? I can help you with information about the site or navigation", "local"),
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // store system prompt separately for payload
  const systemMessage = createMessage("system", SYSTEM_PROMPT, "system");

  function buildPayloadMessages(fullMessages: ChatMessage[]) {
    const trimmed = fullMessages
      .filter((m) => m.source !== "local") // remove welcome messages from payload
      .slice(-MAX_HISTORY);

    return [systemMessage, ...trimmed];
  }

  async function sendMessage(userInput: string): Promise<ParsedResponse> {
    setIsLoading(true);

    const newMessages = [...messages, createMessage("user", userInput, "api")];
    setMessages(newMessages);

    const payloadMessages = buildPayloadMessages(newMessages);

    let rawAssistant = "";
    let parsed: ParsedResponse | null = null;

    try {
      const { raw } = await callModelAPI(payloadMessages);
      rawAssistant = raw;
      parsed = cleanAndParse(rawAssistant);
    } catch (err) {
      console.error("Model call error:", err);
      setMessages((m) => [...m, createMessage("assistant", `Model error: ${String(err)}`, "api")]);
      setIsLoading(false);
      return { type: "error", message: "Model API error", navigation: { page: null, section: null } };
    }

    // reparsing if needed (same as before) ...
    // omitted here for brevity; keep your reparsing loop

    setMessages((m) => [...m, createMessage("assistant", rawAssistant, "api")]);
    setIsLoading(false);

    if (!parsed) return { type: "error", message: "Assistant returned malformed output.", navigation: { page: null, section: null } };
    return parsed;
  }

  return [messages, sendMessage, isLoading] as const;
}
