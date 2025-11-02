"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageCircle, Clock, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Conversation = {
  _id: string;
  title: string;
  lastActivity: string;
  courseId: string;
  messages?: any[];
};

interface IdeConversationSidebarProps {
  conversations: Conversation[];
  selectedConversationId: string;
  isLoading: boolean;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function IdeConversationSidebar({
  conversations,
  selectedConversationId,
  isLoading,
  onConversationSelect,
  onNewConversation,
  isOpen,
  onClose,
}: IdeConversationSidebarProps) {
  const formatLastActivity = (lastActivity: string) => {
    const date = new Date(lastActivity);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transform transition-all duration-300 ease-in-out",
          // Mobile: slide in/out; Desktop: collapse width
          isOpen
            ? "translate-x-0 w-80 lg:w-80"
            : "-translate-x-full lg:translate-x-0 w-0 lg:w-0 border-transparent overflow-hidden"
        )}
      >
        <div
          className={cn(
            "flex flex-col h-full",
            // Hide content completely when collapsed on desktop
            !isOpen ? "lg:hidden" : ""
          )}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="lg:hidden p-1 h-8 w-8"
                >
                  <X size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="hidden lg:flex p-1 h-8 w-8"
                >
                  <ChevronLeft size={16} />
                </Button>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Previous Chats
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onNewConversation}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
              >
                <Plus size={16} className="mr-1" />
                New Chat
              </Button>
            </div>

            {conversations.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {conversations.length} conversation
                {conversations.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1 p-2">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"
                  >
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <MessageCircle size={32} className="text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No previous chats
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Start a new conversation to get help
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <button
                    key={conversation._id}
                    onClick={() => onConversationSelect(conversation._id)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-colors duration-200",
                      "hover:bg-slate-100 dark:hover:bg-slate-800",
                      selectedConversationId === conversation._id
                        ? "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                        : "bg-transparent"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {conversation.title || "Untitled Chat"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock
                            size={12}
                            className="text-slate-400 flex-shrink-0"
                          />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatLastActivity(conversation.lastActivity)}
                          </span>
                        </div>
                      </div>
                      {conversation.messages &&
                        conversation.messages.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-xs ml-2 flex-shrink-0"
                          >
                            {conversation.messages.length}
                          </Badge>
                        )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
