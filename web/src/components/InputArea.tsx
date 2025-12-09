import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MODELS, useChatStore } from "@/lib/store";
import { ArrowUpIcon, ChevronDownIcon, SparklesIcon } from "lucide-react";

interface InputAreaProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const InputArea = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
  onAnalyze,
  isAnalyzing,
}: InputAreaProps) => {
  const { model, setModel } = useChatStore();
  const currentModel = MODELS.find((m) => m.id === model);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
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
        <InputGroupButton
          className="text-xs"
          onClick={onAnalyze}
          disabled={isAnalyzing}
        >
          <SparklesIcon className="size-3" />
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </InputGroupButton>
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
  );
};
