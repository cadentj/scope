import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { ChevronDownIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore, MODELS } from '@/lib/store';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8787').replace(/\/$/, '');

export function Chat() {
  const [input, setInput] = useState('');
  const { messages: storedMessages, setMessages: setStoredMessages, model, setModel } = useChatStore();
  const { messages, sendMessage, status } = useChat({
    messages: storedMessages,
    transport: new DefaultChatTransport({
      api: `${API_URL}/api/chat`,
    }),
    onFinish: ({ messages }) => {
      setStoredMessages(messages);
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';
  const currentModel = MODELS.find((m) => m.id === model);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      sendMessage({ text: input }, { body: { model } });
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getTextContent = (parts: typeof messages[0]['parts']) => {
    return parts
      .filter((part): part is Extract<typeof part, { type: 'text' }> => part.type === 'text')
      .map((part) => part.text)
      .join('');
  };

  return (
    <div className="flex flex-col max-w-3xl mx-auto h-[calc(100vh-200px)] border border-border rounded-lg overflow-hidden bg-card">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Start a conversation by typing a message below.</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex flex-col gap-1 p-3 rounded-lg max-w-[80%]',
              message.role === 'user'
                ? 'self-end bg-primary text-primary-foreground'
                : 'self-start bg-muted text-muted-foreground'
            )}
          >
            <div className="text-xs font-semibold opacity-70 uppercase tracking-wide">
              {message.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <div className="whitespace-pre-wrap break-words leading-relaxed">
              {getTextContent(message.parts)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col gap-1 p-3 rounded-lg max-w-[80%] self-start bg-muted text-muted-foreground">
            <div className="text-xs font-semibold opacity-70 uppercase tracking-wide">Assistant</div>
            <div className="whitespace-pre-wrap break-words leading-relaxed">Thinking...</div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border bg-card">
        <InputGroup>
          <InputGroupTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            className="min-h-[2.5rem] max-h-[10rem]"
          />
          <InputGroupAddon align="block-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton className="text-xs">
                  {currentModel?.label} <ChevronDownIcon className="size-3" />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                {MODELS.map((m) => (
                  <DropdownMenuItem key={m.id} onSelect={() => setModel(m.id)}>
                    {m.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupButton
              variant="default"
              size="icon-xs"
              className="ml-auto rounded-full"
              disabled={isLoading || !input.trim()}
              onClick={handleSubmit}
            >
              <ArrowUpIcon />
              <span className="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}
