"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { ICodeAnalysis, ICodeFeedback } from "@/types/ai";

interface IdeCodeAnalysisProps {
  isAnalyzing: boolean;
  currentAnalysis: ICodeAnalysis | null;
  codeFeedback: ICodeFeedback[];
  analysisHistory: ICodeAnalysis[];
  onAnalyzeCode: () => void;
  onSelectAnalysis: (analysis: ICodeAnalysis) => void;
}

export default function IdeCodeAnalysis({
  isAnalyzing,
  currentAnalysis,
  codeFeedback,
  analysisHistory,
  onAnalyzeCode,
  onSelectAnalysis,
}: IdeCodeAnalysisProps) {
  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-purple-500 border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
          <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-r-transparent border-b-pink-500 border-l-transparent animate-spin animation-delay-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Code size={24} className="text-blue-500" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
            AI is analyzing your code...
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Checking syntax, best practices, and providing feedback
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Zap size={12} />
            <span>Powered by Beblocky AI</span>
          </div>
        </div>
      </div>
    );
  }

  // Parse JSON from message content if it exists
  const parseFeedbackFromMessage = (message: string): ICodeFeedback[] => {
    try {
      // Check if message contains JSON code block
      const jsonMatch = message.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsed = JSON.parse(jsonMatch[1].trim());
        // If parsed object has feedback array, return it
        if (parsed.feedback && Array.isArray(parsed.feedback)) {
          return parsed.feedback;
        }
        // If parsed is an array, return it
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      // Try parsing the entire message as JSON
      const parsed = JSON.parse(message.trim());
      if (parsed.feedback && Array.isArray(parsed.feedback)) {
        return parsed.feedback;
      }
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // Not JSON, return empty array
    }
    return [];
  };

  // Helper function to clean message from JSON code blocks
  const cleanMessage = (message: string): string => {
    if (!message || typeof message !== "string") return "";
    let cleaned = message;
    // Remove JSON code blocks (with various formats)
    cleaned = cleaned.replace(/```json\s*[\s\S]*?\s*```/gi, "");
    cleaned = cleaned.replace(/```\s*json\s*[\s\S]*?\s*```/gi, "");
    // Remove any other code blocks
    cleaned = cleaned.replace(/```\s*[\s\S]*?\s*```/g, "");
    // Remove any remaining JSON-like structures at the start
    cleaned = cleaned.replace(/^\s*json\s*\{[\s\S]*?\}\s*$/gm, "");
    // Remove "json {" pattern that might appear
    cleaned = cleaned.replace(/^\s*json\s*\{/gi, "");
    // Remove if the entire message is just JSON structure
    if (cleaned.trim().match(/^\s*\{\s*"feedback"\s*:/i)) {
      return "";
    }
    cleaned = cleaned.trim();
    return cleaned;
  };

  // Process feedback items to extract JSON from messages
  const processedFeedback = useMemo(() => {
    const processed: ICodeFeedback[] = [];

    codeFeedback.forEach((feedback) => {
      // If message contains JSON, parse it and add all items
      const parsedItems = parseFeedbackFromMessage(feedback.message);

      if (parsedItems.length > 0) {
        // Add all parsed feedback items with cleaned messages
        parsedItems.forEach((item) => {
          // Ensure the parsed item's message is clean
          const itemMessage = cleanMessage(item.message);
          // Only add if there's a meaningful message or other useful data
          if (itemMessage || item.line || item.code || item.suggestion) {
            processed.push({
              ...item,
              message: itemMessage,
            });
          }
        });
      } else {
        // Not JSON, use the feedback item as-is but clean the message
        const cleanMsg = cleanMessage(feedback.message);
        // Only add if there's a meaningful message or other useful data
        if (cleanMsg || feedback.line || feedback.code || feedback.suggestion) {
          processed.push({
            ...feedback,
            message: cleanMsg,
          });
        }
      }
    });

    return processed;
  }, [codeFeedback]);

  if (currentAnalysis || processedFeedback.length > 0) {
    // Get info message from first element if it exists and is info type
    const infoMessage =
      processedFeedback.length > 0 && processedFeedback[0]?.type === "info"
        ? processedFeedback[0]
        : null;

    // Start feedback from index 1 (skip info message at index 0)
    const displayFeedback = infoMessage
      ? processedFeedback.slice(1)
      : processedFeedback;

    return (
      <ScrollArea className="h-full scrollbar-hide">
        <div className="p-4 space-y-4">
          {/* Info Message (from index 0) */}
          {infoMessage && (
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default" className="text-xs bg-blue-500">
                      INFO
                    </Badge>
                    {infoMessage.points !== undefined &&
                      infoMessage.points !== 0 && (
                        <Badge variant="outline" className="text-xs">
                          {infoMessage.points > 0 ? "+" : ""}
                          {infoMessage.points} pts
                        </Badge>
                      )}
                  </div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {infoMessage.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Current Analysis Results */}
          {displayFeedback.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-4 border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-800 dark:text-slate-200">
                  Latest Analysis
                </h4>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600">
                  {displayFeedback.filter((f) => f.type !== "info").length}{" "}
                  feedback items
                </Badge>
              </div>

              {currentAnalysis && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {currentAnalysis.totalPoints}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Points
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {
                        currentAnalysis.feedback.filter(
                          (f) => f.type === "success"
                        ).length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Success</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {
                        currentAnalysis.feedback.filter(
                          (f) => f.type === "warning" || f.type === "error"
                        ).length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Issues</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {displayFeedback
                  .filter((feedback) => {
                    // Skip if message is empty or only contains JSON structure
                    const msg = (feedback.message || "").trim();
                    // Check if message looks like JSON only
                    const looksLikeJson =
                      !msg ||
                      msg.toLowerCase().startsWith("json") ||
                      msg.includes("```json") ||
                      msg.match(/^\s*\{\s*"feedback"/i) ||
                      (msg.startsWith("{") &&
                        msg.endsWith("}") &&
                        msg.includes('"feedback"'));
                    // Don't skip if it has a meaningful message or other useful data
                    return (
                      (msg && !looksLikeJson) ||
                      feedback.line ||
                      feedback.code ||
                      feedback.suggestion
                    );
                  })
                  .map((feedback, index) => {
                    // Message should already be cleaned from processedFeedback
                    const messageText = feedback.message || "";

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                          feedback.type === "success"
                            ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                            : feedback.type === "warning"
                            ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                            : feedback.type === "error"
                            ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                            : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              feedback.type === "success"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                                : feedback.type === "warning"
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                                : feedback.type === "error"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                            }`}
                          >
                            {feedback.type === "success" ? (
                              <CheckCircle size={16} />
                            ) : (
                              <AlertCircle size={16} />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  feedback.type === "success"
                                    ? "default"
                                    : feedback.type === "warning"
                                    ? "secondary"
                                    : feedback.type === "error"
                                    ? "destructive"
                                    : "default"
                                }
                                className={`text-xs ${
                                  feedback.type === "info" ? "bg-blue-500" : ""
                                }`}
                              >
                                {feedback.type.toUpperCase()}
                              </Badge>
                              {feedback.points !== undefined &&
                                feedback.points !== 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {feedback.points > 0 ? "+" : ""}
                                    {feedback.points} pts
                                  </Badge>
                                )}
                            </div>

                            {messageText && (
                              <p className="text-sm font-medium mb-2">
                                {messageText}
                              </p>
                            )}

                            {feedback.line && feedback.code && (
                              <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-md border">
                                <p className="text-xs text-muted-foreground mb-2 font-medium">
                                  Line {feedback.line}:
                                </p>
                                <pre className="text-xs font-mono bg-white dark:bg-slate-900 p-2 rounded border overflow-x-auto">
                                  {feedback.code}
                                </pre>
                              </div>
                            )}

                            {feedback.suggestion && (
                              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-2">
                                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs text-blue-600">
                                      💡
                                    </span>
                                  </div>
                                  <p className="text-sm text-blue-800 dark:text-blue-200">
                                    {feedback.suggestion}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Analysis History */}
          {analysisHistory.length > 1 && (
            <div className="mt-6">
              <h4 className="font-medium text-sm mb-3 text-slate-700 dark:text-slate-300">
                Previous Analyses
              </h4>
              <div className="space-y-2">
                {analysisHistory.slice(1).map((analysis, index) => (
                  <div
                    key={analysis._id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => onSelectAnalysis(analysis)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Analysis #{analysisHistory.length - index}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(analysis.analysisDate).toLocaleDateString()}{" "}
                          • {analysis.totalPoints} points
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {analysis.language}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
        <Code size={24} className="text-blue-600" />
      </div>
      <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
        No code analysis available
      </p>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        Write some code in the editor and click "Analyze" to get AI-powered
        feedback on your programming.
      </p>
      <Button
        onClick={onAnalyzeCode}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        <Zap size={16} className="mr-2" />
        Analyze Code
      </Button>
    </div>
  );
}
