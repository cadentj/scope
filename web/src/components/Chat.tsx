import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { InputArea } from "./InputArea";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/store";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8787"
).replace(/\/$/, "");

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

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      sendMessage({ text: input }, { body: { model } });
      setInput("");
    }
  };

  const getTextContent = (parts: (typeof messages)[0]["parts"]) => {
    return parts
      .filter(
        (part): part is Extract<typeof part, { type: "text" }> =>
          part.type === "text"
      )
      .map((part) => part.text)
      .join("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
              <p>Start a conversation by typing a message below.</p>
            </div>
          )}
          {messages.map((message) => (
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
                    {getTextContent(message.parts)}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Assistant
                  </div>
                  <div className="whitespace-pre-wrap break-words leading-relaxed text-foreground">
                    {getTextContent(message.parts)}
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

      {/* Input area */}
      <div className="p-4">
        <div className="max-w-3xl mx-auto">
          <InputArea
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
