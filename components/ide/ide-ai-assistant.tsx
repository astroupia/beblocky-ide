"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, MessageCircle, Zap } from "lucide-react";
import { aiConversationApi } from "@/lib/api/ai-conversation";
import { codeAnalysisApi } from "@/lib/api/code-analysis";
import {
  IAiConversation,
  ICodeAnalysis,
  IChatMessage,
  ICodeFeedback,
} from "@/types/ai";
import IdeConversationSidebar from "./ide-conversation-sidebar";
import IdeMessageList from "./ide-message-list";
import IdeChatInput from "./ide-chat-input";
import IdeCodeAnalysis from "./ide-code-analysis";
import IdeChatTab from "./ide-chat-tab";
import { progressApi } from "@/lib/api/progress";

type Conversation = {
  _id: string;
  title: string;
  lastActivity: string;
  courseId: string;
  messages?: IChatMessage[];
};

export default function IdeAiAssistant({
  code,
  courseId,
  lessonId,
  studentId,
}: {
  code: string;
  courseId: string;
  lessonId: string;
  studentId: string;
}) {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [codeFeedback, setCodeFeedback] = useState<ICodeFeedback[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<ICodeAnalysis | null>(
    null
  );
  const [analysisHistory, setAnalysisHistory] = useState<ICodeAnalysis[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConversationSidebarOpen, setIsConversationSidebarOpen] =
    useState(true); // Show by default on desktop
  const [hasLoadedConversations, setHasLoadedConversations] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  // Load conversations and analysis history when component mounts
  useEffect(() => {
    console.log(
      "Component mounted, loading conversations for student:",
      studentId
    );
    loadConversations();
    loadAnalysisHistory();
  }, [studentId, courseId]);

  // Load conversations when AI Chat tab is selected
  useEffect(() => {
    if (activeTab === "chat" && !hasLoadedConversations) {
      console.log("AI Chat tab selected, loading conversations");
      loadConversations();
      setHasLoadedConversations(true);
    }
  }, [activeTab, hasLoadedConversations]);

  // Debug effect to monitor state changes
  useEffect(() => {
    // Debugging console log removed as requested.
  }, [conversations, selectedConversationId, inputValue]);

  // Load conversations for the current student
  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const conversationList = await aiConversationApi.getByStudent(studentId);

      const conversations: Conversation[] = conversationList
        .filter(
          (conv): conv is IAiConversation & { _id: string } =>
            !!conv &&
            !!conv._id &&
            typeof conv._id === "string" &&
            conv._id.length > 0
        ) // Filter out conversations without valid _id
        .map((conv) => ({
          _id: conv._id!,
          title:
            conv.title ||
            (conv.messages && conv.messages.length > 0
              ? "New Conversation"
              : "Untitled Conversation"),
          lastActivity: new Date(conv.lastActivity).toISOString(),
          courseId: conv.courseId.toString(),
          messages: conv.messages,
        }));

      console.log("Filtered conversations:", conversations);
      setConversations(conversations);

      // Don't auto-select conversation - let user choose
      if (conversations.length === 0) {
        console.log("No conversations found");
        setSelectedConversationId("");
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load code analysis history for the current student
  const loadAnalysisHistory = async () => {
    try {
      const history = await codeAnalysisApi.getByStudent(studentId);
      setAnalysisHistory(history);
    } catch (error) {
      console.error("Failed to load analysis history:", error);
    }
  };

  // Create new conversation
  // Handle new chat button - only clear messages, don't create conversation
  const handleNewChat = () => {
    setSelectedConversationId("");
    setMessages([]);
    setIsConversationSidebarOpen(false);
    console.log("Cleared messages for new chat");
  };

  const createNewConversation = async () => {
    if (isCreatingConversation) {
      console.log("Conversation creation already in progress, skipping...");
      return;
    }

    try {
      setIsCreatingConversation(true);
      setIsLoading(true);

      const newConversation = await aiConversationApi.create({
        courseId,
        studentId,
        title: "", // Will be generated by AI when first message is sent
        lessonId: lessonId,
        initialMessage: inputValue,
      });

      const conversation = {
        _id: newConversation._id || `temp-${Date.now()}`,
        title: "New Conversation", // Temporary title until AI generates one
        lastActivity: new Date(newConversation.lastActivity).toISOString(),
        courseId: newConversation.courseId.toString(),
        messages: newConversation.messages || [],
      };

      setConversations((prev) => [...prev, conversation]);
      setSelectedConversationId(conversation._id);
      setMessages(conversation.messages);

      // Close sidebar on mobile after selection
      setIsConversationSidebarOpen(false);

      console.log("New conversation created:", conversation._id);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsLoading(false);
      setIsCreatingConversation(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isCreatingConversation) return;

    // If no conversation is selected, create one first
    if (!selectedConversationId) {
      await createNewConversation();
      // Don't proceed if conversation creation failed
      if (!selectedConversationId) {
        console.log("Failed to create conversation, cannot send message");
        return;
      }
    }

    // Add user message to UI immediately
    const userMessage: IChatMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    try {
      // Send message to API
      const updatedConversation = await aiConversationApi.sendMessage(
        selectedConversationId,
        {
          message: inputValue,
          lessonId: lessonId,
        }
      );

      // Update messages with the response
      setMessages(updatedConversation.messages);

      // Update conversation title if this is the first message and title needs to be generated
      if (messages.length === 0 && updatedConversation.title) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === selectedConversationId
              ? { ...conv, title: updatedConversation.title! }
              : conv
          )
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);

      // Fallback to mock response if API fails
      setTimeout(() => {
        const aiResponse: IChatMessage = {
          role: "assistant",
          content: generateAIResponse(),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1500);
    } finally {
      setIsThinking(false);
    }
  };

  const analyzeCode = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setIsThinking(true);

    try {
      // Step a: Find code analysis related to the student
      const existingAnalyses = await codeAnalysisApi.getByStudent(studentId);
      console.log("Existing analyses for student:", existingAnalyses);

      // Filter analyses by current lesson
      const lessonAnalyses = existingAnalyses.filter(
        (analysis) => String(analysis.lessonId) === String(lessonId)
      );

      let analysis: ICodeAnalysis;

      // Step b: If no code-analysis exists, create a new one
      if (lessonAnalyses.length === 0) {
        console.log("No analysis found for this lesson, creating new one");
        const progressArr = await progressApi.getByStudent(studentId);
        const progressId =
          Array.isArray(progressArr) && progressArr.length > 0
            ? (progressArr[0] as any)?._id || (progressArr[0] as any)?.id
            : undefined;

        analysis = await codeAnalysisApi.analyze({
          progressId: progressId,
          lessonId: lessonId,
          codeContent: code,
          language: detectLanguage(code),
        });
      } else {
        // Step c: If code-analysis exists, load the latest one and do new analysis
        const latestAnalysis = lessonAnalyses.sort(
          (a, b) =>
            new Date(b.analysisDate).getTime() -
            new Date(a.analysisDate).getTime()
        )[0];

        console.log("Loading latest analysis:", latestAnalysis._id);

        // Load the existing analysis first
        setCurrentAnalysis(latestAnalysis);
        setCodeFeedback(latestAnalysis.feedback);

        // Then perform a new analysis with the updated code
        const progressArr = await progressApi.getByStudent(studentId);
        const progressId =
          Array.isArray(progressArr) && progressArr.length > 0
            ? (progressArr[0] as any)?._id || (progressArr[0] as any)?.id
            : undefined;

        analysis = await codeAnalysisApi.analyze({
          progressId: progressId,
          lessonId: lessonId,
          codeContent: code,
          language: detectLanguage(code),
        });
      }

      // Update with the latest analysis result
      setCurrentAnalysis(analysis);
      setCodeFeedback(analysis.feedback);

      // Refresh analysis history to include the new analysis
      await loadAnalysisHistory();
    } catch (error) {
      console.error("Code analysis failed:", error);

      // Fallback to mock analysis if API fails
      setTimeout(() => {
        setCodeFeedback([
          {
            type: "success",
            message: "Your HTML structure looks good!",
          },
          {
            type: "warning",
            message:
              "Consider adding more comments to your JavaScript code for better readability.",
            line: 5,
            code: "function calculateTotal() { /* missing comments */ }",
          },
          {
            type: "error",
            message: "Missing closing tag in your HTML.",
            line: 12,
            code: "<div>Content",
          },
        ]);
      }, 1500);
    } finally {
      setIsThinking(false);
      setIsAnalyzing(false);
    }
  };

  // Detect programming language from code
  const detectLanguage = (code: string): string => {
    const trimmedCode = code.trim().toLowerCase();

    if (trimmedCode.includes("def ") && trimmedCode.includes("import "))
      return "python";
    if (
      trimmedCode.includes("public class") ||
      trimmedCode.includes("system.out.print")
    )
      return "java";
    if (
      trimmedCode.includes("#include") ||
      trimmedCode.includes("printf(") ||
      trimmedCode.includes("cout")
    )
      return "cpp";
    if (trimmedCode.includes("<html") || trimmedCode.includes("<div"))
      return "html";
    if (
      trimmedCode.includes("{") &&
      trimmedCode.includes("}") &&
      trimmedCode.includes(":")
    )
      return "css";

    return "javascript";
  };

  return (
    <Card className="h-full flex flex-col border-none rounded-none shadow-none bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="p-2 sm:p-3 border-b space-y-2 sm:space-y-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <div className="flex items-center justify-between">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 h-9 sm:h-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <TabsTrigger
                value="chat"
                className="text-xs sm:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 px-2 sm:px-4"
              >
                <MessageCircle size={14} className="sm:size-4 mr-1 sm:mr-2" />
                <span className="hidden min-[400px]:inline">AI Chat</span>
                <span className="min-[400px]:hidden">Chat</span>
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="text-xs sm:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 px-2 sm:px-4"
              >
                <Code size={14} className="sm:size-4 mr-1 sm:mr-2" />
                <span className="hidden min-[400px]:inline">Code Analysis</span>
                <span className="min-[400px]:hidden">Analysis</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent
            value="chat"
            className="h-full m-0 data-[state=active]:flex flex-col min-h-0"
          >
            <div className="flex h-full min-h-0 min-w-0">
              {/* Conversation Sidebar */}
              <IdeConversationSidebar
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                isLoading={isLoading}
                onConversationSelect={(conversationId) => {
                  const conversation = conversations.find(
                    (c) => c._id === conversationId
                  );
                  if (conversation) {
                    setSelectedConversationId(conversation._id);
                    setMessages(conversation.messages || []);
                    // Close sidebar after selection
                    setIsConversationSidebarOpen(false);
                  }
                }}
                onNewConversation={handleNewChat}
                isOpen={isConversationSidebarOpen}
                onClose={() => setIsConversationSidebarOpen(false)}
              />

              {/* Chat Area */}
              <div className="bg-transparent flex-1 flex flex-col min-h-0 min-w-0">
                {/* Toggle button for sidebar */}
                <div className="p-1.5 sm:p-2 bg-transparent border-b border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setIsConversationSidebarOpen(!isConversationSidebarOpen)
                    }
                    className="w-full lg:w-auto text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <MessageCircle
                      size={14}
                      className="sm:size-4 mr-1.5 sm:mr-2"
                    />
                    <span className="hidden min-[400px]:inline">
                      {selectedConversationId ? "Switch Chat" : "Select Chat"}
                    </span>
                    <span className="min-[400px]:hidden">Chats</span>
                  </Button>
                </div>

                <IdeChatTab
                  messages={messages}
                  inputValue={inputValue}
                  selectedConversationId={selectedConversationId}
                  isThinking={isThinking}
                  onInputChange={setInputValue}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="analysis"
            className="h-full m-0 data-[state=active]:flex flex-col"
          >
            <IdeCodeAnalysis
              isAnalyzing={isAnalyzing}
              currentAnalysis={currentAnalysis}
              codeFeedback={codeFeedback}
              analysisHistory={analysisHistory}
              onAnalyzeCode={analyzeCode}
              onSelectAnalysis={(analysis) => {
                setCurrentAnalysis(analysis);
                setCodeFeedback(analysis.feedback);
              }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Generate mock AI response for fallback
function generateAIResponse(): string {
  const responses = [
    "I see you're working on HTML and CSS. The structure looks good, but you might want to consider adding more semantic HTML elements for better accessibility.",
    "That's a great question! In JavaScript, you can use event listeners to respond to user interactions. For example: `element.addEventListener('click', function() { /* your code */ });`",
    "Based on the current lesson, you should focus on understanding how CSS selectors work. They determine which elements your styles will apply to.",
    "Your code is coming along nicely! One tip: remember to test your website in different browsers to ensure compatibility.",
    "I'd recommend breaking down this problem into smaller steps. First, create the HTML structure, then style it with CSS, and finally add the JavaScript functionality.",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
