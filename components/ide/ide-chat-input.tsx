"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ArrowUpFromDot } from "lucide-react";

interface IdeChatInputProps {
  inputValue: string;
  selectedConversationId: string;
  isThinking: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export default function IdeChatInput({
  inputValue,
  selectedConversationId,
  isThinking,
  onInputChange,
  onSendMessage,
}: IdeChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isThinking && inputValue.trim()) {
      onSendMessage();
    }
  };
  ``;
  return (
    <div className="m-2 bg-transparent rounded-full ">
      <div className="bg-transparent flex gap-1.5 ">
        <Input
          placeholder="Ask a question..."
          value={inputValue}
          onChange={(e) => {
            onInputChange(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          disabled={isThinking}
          className="flex-1 text-xs sm:text-sm h-9 sm:h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-primary rounded-full"
        />
        <Button
          size="default"
          onClick={onSendMessage}
          disabled={isThinking || !inputValue.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 sm:h-10 px-3 sm:px-4 rounded-full"
        >
          <ArrowUpFromDot size={14} className="sm:size-4 mr-0 sm:mr-1" />
          <span className="hidden min-[400px]:inline">Send</span>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 sm:mt-2 text-center hidden sm:block">
        Ready to start chatting!
      </p>
    </div>
  );
}
