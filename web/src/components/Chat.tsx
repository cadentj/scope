import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { InputArea } from "./InputArea";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/store";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8787"
).replace(/\/$/, "");

const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
).replace(/\/$/, "");

interface LogitsData {
  words: string[];
  logits: number[][];
}

interface LogitsRequest {
  messages: { role: string; content: string }[];
}

async function fetchLogits(
  url: string,
  { arg }: { arg: LogitsRequest }
): Promise<LogitsData> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });
  if (!res.ok) throw new Error("Failed to fetch logits");
  return res.json();
}

export function Chat() {
  const [input, setInput] = useState("");
  const {
    messages: storedMessages,
    setMessages: setStoredMessages,
    model,
  } = useChatStore();

  const { messages, sendMessage, status } = useChat({
    messages: storedMessages,
    transport: new DefaultChatTransport({
      api: `${API_URL}/api/chat`,
    }),
    onFinish: ({ messages }) => {
      setStoredMessages(messages);
    },
  });

  const {
    trigger: analyzeLogits,
    data: logitsData,
    isMutating: isAnalyzing,
    reset: resetLogits,
  } = useSWRMutation(`${BACKEND_URL}/logits`, fetchLogits);

  const isLoading = status === "streaming" || status === "submitted";

  const getTextContent = (parts: (typeof messages)[0]["parts"]) => {
    return parts
      .filter(
        (part): part is Extract<typeof part, { type: "text" }> =>
          part.type === "text"
      )
      .map((part) => part.text)
      .join("");
  };

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      sendMessage({ text: input }, { body: { model } });
      setInput("");
      resetLogits();
    }
  };

  const handleAnalyze = () => {
    if (messages.length === 0) return;

    const messagesToAnalyze = messages.map((m) => ({
      role: m.role,
      content: getTextContent(m.parts),
    }));

    analyzeLogits({ messages: messagesToAnalyze });
  };

  const renderHighlightedText = (text: string, startWordIndex: number) => {
    if (!logitsData) {
      return <span>{text}</span>;
    }

    // Match optional leading whitespace + word as a unit
    const segments = text.match(/\s*\S+/g) || [];
    let wordIdx = startWordIndex;

    return (
      <>
        {segments.map((segment, i) => {
          const logitValue = logitsData.logits[wordIdx]?.[0] ?? 0;
          wordIdx++;

          return (
            <span
              key={i}
              style={{
                backgroundColor: `rgba(34, 197, 94, ${logitValue})`,
              }}
            >
              {segment}
            </span>
          );
        })}
      </>
    );
  };

  const getWordOffset = (messageIndex: number) => {
    let offset = 0;
    for (let i = 0; i < messageIndex; i++) {
      const text = getTextContent(messages[i].parts);
      const words = text.split(/\s+/).filter((w) => w.length > 0);
      offset += words.length;
    }
    return offset;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
              <p>Start a conversation by typing a message below.</p>
            </div>
          )}
          {messages.map((message, messageIndex) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col gap-1",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              {message.role === "user" ? (
                <div className="p-3 rounded-2xl max-w-[80%] bg-primary text-primary-foreground">
                  <div className="whitespace-pre-wrap break-words leading-relaxed">
                    {renderHighlightedText(
                      getTextContent(message.parts),
                      getWordOffset(messageIndex)
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Assistant
                  </div>
                  <div className="whitespace-pre-wrap break-words leading-relaxed text-foreground">
                    {renderHighlightedText(
                      getTextContent(message.parts),
                      getWordOffset(messageIndex)
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex flex-col gap-1 items-start">
              <div className="w-full">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Assistant
                </div>
                <div className="text-muted-foreground">Thinking...</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-3xl mx-auto">
          <InputArea
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    </div>
  );
}
