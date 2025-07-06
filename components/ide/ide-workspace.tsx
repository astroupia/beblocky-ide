"use client";

import { useState } from "react";
import { useTheme } from "./context/theme-provider";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useMediaQuery from "@/hooks/use-mobile";
import IdeSlides from "./ide-slides";
import IdeEditor from "./ide-editor";
import IdePreview from "./ide-preview";
import IdeAiAssistant from "./ide-ai-assistant";
import IdeConsole from "./ide-console";
import {
  Book,
  Code,
  Play,
  Bot,
  LayoutGrid,
  LayoutList,
  Terminal,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IdeWorkspace({
  slides,
  courseId,
  mainCode,
  setMainCode,
}: {
  slides: any[];
  courseId: string;
  mainCode: string;
  setMainCode: (code: string) => void;
}) {
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const [activeTab, setActiveTab] = useState("editor");
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleMinimized, setConsoleMinimized] = useState(true);
  const [currentLayout, setCurrentLayout] = useState<
    "standard" | "split" | "focus"
  >("standard");

  // Default layout configuration
  const getLayoutSizes = () => {
    if (isMobile) return [100]; // On mobile, use full width for the active panel

    switch (currentLayout) {
      case "standard":
        return showAiAssistant ? [20, 40, 25, 15] : [25, 40, 35];
      case "split":
        return showAiAssistant ? [15, 30, 40, 15] : [20, 30, 50];
      case "focus":
        return showAiAssistant ? [0, 70, 15, 15] : [0, 85, 15];
      default:
        return [25, 40, 35];
    }
  };

  const toggleLayout = () => {
    const layouts: ("standard" | "split" | "focus")[] = [
      "standard",
      "split",
      "focus",
    ];
    const currentIndex = layouts.indexOf(currentLayout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setCurrentLayout(layouts[nextIndex]);
  };

  const toggleConsole = () => {
    if (showConsole && !consoleMinimized) {
      setConsoleMinimized(true);
    } else {
      setShowConsole(true);
      setConsoleMinimized(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Layout toggle button */}
      <div className="absolute top-20 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLayout}
          className="h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm"
        >
          {currentLayout === "standard" ? (
            <LayoutGrid size={14} />
          ) : currentLayout === "split" ? (
            <LayoutList size={14} />
          ) : (
            <Code size={14} />
          )}
        </Button>
      </div>

      {/* Minimized console tab */}
      {showConsole && consoleMinimized && !isMobile && (
        <div
          className="h-10 border-t bg-background flex items-center px-4 justify-between cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => setConsoleMinimized(false)}
        >
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Console</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setConsoleMinimized(false);
            }}
          >
            <ChevronUp size={16} />
          </Button>
        </div>
      )}

      {/* Full-width console toggle when console is not shown */}
      {!showConsole && !isMobile && (
        <div
          className="h-10 border-t bg-background flex items-center px-4 justify-between cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => {
            setShowConsole(true);
            setConsoleMinimized(false);
          }}
        >
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Console</span>
          </div>
          <ChevronUp size={16} className="text-muted-foreground" />
        </div>
      )}

      <div
        className="flex-1 overflow-hidden relative"
        data-ide-workspace="true"
      >
        {isMobile ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <TabsList className="w-full justify-between bg-muted/50 p-1">
              <TabsTrigger value="slides" className="flex items-center gap-2">
                <Book size={16} />
                <span>Slides</span>
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Code size={16} />
                <span>Editor</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Play size={16} />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Bot size={16} />
                <span>AI</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="slides" className="h-full m-0 p-0">
                <IdeSlides
                  slides={slides}
                  courseId={courseId}
                  mainCode={mainCode}
                />
              </TabsContent>

              <TabsContent value="editor" className="h-full m-0 p-0">
                <IdeEditor
                  setMainCode={setMainCode}
                  startingCode={slides[0]?.startingCode}
                />
              </TabsContent>

              <TabsContent value="preview" className="h-full m-0 p-0">
                <IdePreview mainCode={mainCode} />
              </TabsContent>

              <TabsContent value="ai" className="h-full m-0 p-0">
                <IdeAiAssistant slides={slides} code={mainCode} />
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <ResizablePanelGroup direction="vertical" className="h-full">
            <ResizablePanel
              defaultSize={showConsole && !consoleMinimized ? 70 : 100}
              minSize={40}
            >
              <ResizablePanelGroup direction="horizontal" className="h-full">
                {currentLayout !== "focus" && (
                  <>
                    <ResizablePanel
                      defaultSize={getLayoutSizes()[0]}
                      minSize={15}
                    >
                      <IdeSlides
                        slides={slides}
                        courseId={courseId}
                        mainCode={mainCode}
                      />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                  </>
                )}

                <ResizablePanel defaultSize={getLayoutSizes()[1]} minSize={25}>
                  <IdeEditor
                    setMainCode={setMainCode}
                    startingCode={slides[0]?.startingCode}
                  />
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={getLayoutSizes()[2]} minSize={15}>
                  <IdePreview mainCode={mainCode} />
                </ResizablePanel>

                {showAiAssistant && (
                  <>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                      defaultSize={getLayoutSizes()[3]}
                      minSize={15}
                    >
                      <IdeAiAssistant slides={slides} code={mainCode} />
                    </ResizablePanel>
                  </>
                )}
              </ResizablePanelGroup>
            </ResizablePanel>

            {showConsole && !consoleMinimized && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30} minSize={20}>
                  <IdeConsole
                    code={mainCode}
                    onMinimize={() => setConsoleMinimized(true)}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        )}
      </div>

      {!isMobile && (
        <div className="fixed bottom-4 right-4 z-10">
          <button
            onClick={() => setShowAiAssistant(!showAiAssistant)}
            className={`relative p-3 rounded-full shadow-lg transition-all duration-300 ${
              showAiAssistant
                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                : "bg-gradient-to-r from-purple-500/80 to-blue-400/80 text-white hover:from-purple-600 hover:to-blue-500"
            }`}
          >
            <Bot size={24} />
            <span className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping"></span>
            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                showAiAssistant ? "bg-green-500" : "bg-blue-400"
              }`}
            ></span>
          </button>
          {!showAiAssistant && (
            <div className="absolute -top-10 right-0 bg-background border rounded-md px-3 py-1 text-xs shadow-md whitespace-nowrap">
              Ask AI Assistant
            </div>
          )}
        </div>
      )}
    </div>
  );
}
