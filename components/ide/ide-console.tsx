"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trash2,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronDown,
} from "lucide-react";

type LogLevel = "info" | "error" | "warning" | "success";

type LogEntry = {
  id: string;
  message: string;
  level: LogLevel;
  timestamp: Date;
};

export default function IdeConsole({
  code,
  onMinimize,
}: {
  code: string;
  onMinimize?: () => void;
}) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState("console");
  const consoleRef = useRef<HTMLDivElement>(null);

  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Add a log entry
  const addLog = useCallback((message: string, level: LogLevel = "info") => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      message,
      level,
      timestamp: new Date(),
    };
    setLogs((prev) => [...prev, newLog]);
  }, []);

  // Run code and capture console output
  const runCode = useCallback(() => {
    clearLogs();

    try {
      // Create a sandbox iframe to run the code
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // Override console methods to capture logs
      if (iframe.contentWindow) {
        const contentWindow = iframe.contentWindow as Window & {
          console: Console;
        };
        const originalConsole = contentWindow.console;

        contentWindow.console.log = (...args: unknown[]) => {
          originalConsole.log(...args);
          addLog(args.map((arg) => formatLogArgument(arg)).join(" "), "info");
        };

        contentWindow.console.error = (...args: unknown[]) => {
          originalConsole.error(...args);
          addLog(args.map((arg) => formatLogArgument(arg)).join(" "), "error");
        };

        contentWindow.console.warn = (...args: unknown[]) => {
          originalConsole.warn(...args);
          addLog(
            args.map((arg) => formatLogArgument(arg)).join(" "),
            "warning"
          );
        };

        contentWindow.console.info = (...args: unknown[]) => {
          originalConsole.info(...args);
          addLog(args.map((arg) => formatLogArgument(arg)).join(" "), "info");
        };

        // Extract JavaScript code from the HTML
        const jsCode = extractJavaScriptFromHTML(code);

        // Run the code
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          doc.open();
          doc.write(code);
          doc.close();
        } catch (error) {
          addLog(`Error running code: ${error}`, "error");
        }

        // Clean up iframe after a delay
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1000);
      }
    } catch (error) {
      addLog(`Error setting up console: ${error}`, "error");
    }
  }, [code, clearLogs, addLog]);

  // Extract JavaScript code from HTML
  const extractJavaScriptFromHTML = (html: string): string => {
    const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
    let match;
    let jsCode = "";

    while ((match = scriptRegex.exec(html)) !== null) {
      jsCode += match[1] + "\n";
    }

    return jsCode;
  };

  // Format log arguments for display
  const formatLogArgument = (arg: unknown): string => {
    if (typeof arg === "object") {
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  };

  // Scroll to bottom when logs change
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  // Get icon based on log level
  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case "error":
        return <AlertCircle size={16} className="text-red-500" />;
      case "warning":
        return <AlertCircle size={16} className="text-amber-500" />;
      case "success":
        return <CheckCircle size={16} className="text-green-500" />;
      case "info":
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  // Auto-run code when component mounts
  useEffect(() => {
    if (code) {
      runCode();
    }
  }, [code, runCode]);

  return (
    <Card className="h-full flex flex-col border-none rounded-none shadow-none">
      <CardHeader className="p-2 border-b flex-row items-center justify-between space-y-0 bg-muted/30">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between w-full">
            <TabsList className="h-8 bg-muted/50">
              <TabsTrigger value="console" className="text-xs px-3">
                Console
              </TabsTrigger>
              <TabsTrigger value="problems" className="text-xs px-3">
                Problems
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearLogs}
                className="h-8 w-8"
                title="Clear console"
              >
                <Trash2 size={16} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={runCode}
                className="h-8 w-8"
                title="Run code"
              >
                <CheckCircle size={16} />
              </Button>

              {onMinimize && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMinimize}
                  className="h-8 w-8"
                  title="Minimize console"
                >
                  <ChevronDown size={16} />
                </Button>
              )}
            </div>
          </div>
        </Tabs>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent
            value="console"
            className="h-full m-0 p-0 data-[state=active]:flex flex-col"
          >
            <ScrollArea className="h-full">
              <div className="p-2 font-mono text-sm" ref={consoleRef}>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="py-1 border-b border-border/40 flex items-start gap-2"
                    >
                      {getLogIcon(log.level)}
                      <pre className="whitespace-pre-wrap break-words flex-1">
                        {log.message}
                      </pre>
                      <span className="text-xs text-muted-foreground ml-2">
                        {log.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground p-4 text-center">
                    Console output will appear here when you run your code.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="problems"
            className="h-full m-0 p-0 data-[state=active]:flex flex-col"
          >
            <div className="p-4 text-center text-muted-foreground">
              No problems detected in your code.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
