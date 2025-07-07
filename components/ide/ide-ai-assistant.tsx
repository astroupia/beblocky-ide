"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bot, Code, Send, CheckCircle, AlertCircle } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type CodeFeedback = {
  type: "success" | "warning" | "error";
  message: string;
  line?: number;
  code?: string;
};

export default function IdeAiAssistant({ code }: { code: string }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your coding assistant. I can help you with your code and answer questions about the lesson. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [codeFeedback, setCodeFeedback] = useState<CodeFeedback[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate code analysis when code changes
  useEffect(() => {
    if (activeTab === "analysis" && code) {
      analyzeCode();
    }
  }, [code, activeTab]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    // Simulate AI response (would be replaced with actual AI integration)
    setTimeout(() => {
      setIsThinking(false);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  const analyzeCode = () => {
    setIsAnalyzing(true);
    setIsThinking(true);

    // Simulate code analysis (would be replaced with actual AI analysis)
    setTimeout(() => {
      setIsThinking(false);

      // Example feedback
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

      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <Card className="h-full flex flex-col border-none rounded-none shadow-none">
      <CardHeader className="p-2 border-b space-y-0 bg-muted/30">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 h-8">
            <TabsTrigger value="chat" className="text-xs">
              <Bot size={14} className="mr-1" /> Chat Assistant
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">
              <Code size={14} className="mr-1" /> Code Analysis
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent
            value="chat"
            className="h-full m-0 data-[state=active]:flex flex-col"
          >
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
                        <span className="text-xs text-muted-foreground ml-1">
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t mt-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isThinking) {
                      handleSendMessage();
                    }
                  }}
                  disabled={isThinking}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={isThinking}
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="analysis"
            className="h-full m-0 data-[state=active]:flex flex-col"
          >
            <div className="flex-1 p-4 overflow-auto">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center">
                  {isThinking ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-primary border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
                        <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-r-transparent border-b-primary border-l-transparent animate-spin animation-delay-300"></div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        AI is analyzing your code...
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Checking syntax and best practices
                      </p>
                    </div>
                  ) : (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {codeFeedback.length > 0 ? (
                    codeFeedback.map((feedback, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          {feedback.type === "success" ? (
                            <CheckCircle
                              size={18}
                              className="text-green-500 mt-0.5"
                            />
                          ) : feedback.type === "warning" ? (
                            <AlertCircle
                              size={18}
                              className="text-amber-500 mt-0.5"
                            />
                          ) : (
                            <AlertCircle
                              size={18}
                              className="text-red-500 mt-0.5"
                            />
                          )}

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant={
                                  feedback.type === "success"
                                    ? "default"
                                    : feedback.type === "warning"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {feedback.type}
                              </Badge>
                            </div>
                            <p className="text-sm">{feedback.message}</p>
                            {feedback.line && feedback.code && (
                              <div className="mt-2 text-xs bg-muted p-2 rounded">
                                <p className="text-muted-foreground mb-1">
                                  Line {feedback.line}:
                                </p>
                                <pre className="whitespace-pre-wrap">
                                  {feedback.code}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Code size={24} className="mb-2" />
                      <p className="text-sm">No code analysis available yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Simulate AI response generation
function generateAIResponse(): string {
  // This would be replaced with actual AI integration
  const responses = [
    "I see you're working on HTML and CSS. The structure looks good, but you might want to consider adding more semantic HTML elements for better accessibility.",
    "That's a great question! In JavaScript, you can use event listeners to respond to user interactions. For example: `element.addEventListener('click', function() { /* your code */ });`",
    "Based on the current lesson, you should focus on understanding how CSS selectors work. They determine which elements your styles will apply to.",
    "Your code is coming along nicely! One tip: remember to test your website in different browsers to ensure compatibility.",
    "I'd recommend breaking down this problem into smaller steps. First, create the HTML structure, then style it with CSS, and finally add the JavaScript functionality.",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
