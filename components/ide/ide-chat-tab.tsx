"use client";

import { IChatMessage } from "@/types/ai";
import IdeMessageList from "./ide-message-list";
import IdeChatInput from "./ide-chat-input";

interface IdeChatTabProps {
  messages: IChatMessage[];
  inputValue: string;
  selectedConversationId: string;
  isThinking: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export default function IdeChatTab({
  messages,
  inputValue,
  selectedConversationId,
  isThinking,
  onInputChange,
  onSendMessage,
}: IdeChatTabProps) {
  return (
    <div className=" flex-1 flex flex-col min-h-0 bg-transparent rounded-full">
      <IdeMessageList messages={messages} isThinking={isThinking} />
      <IdeChatInput
        inputValue={inputValue}
        selectedConversationId={selectedConversationId}
        isThinking={isThinking}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
      />
    </div>
  );
}
