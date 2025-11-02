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
  Terminal,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Slide } from "@/lib/mock-data";
import { ILesson } from "@/types";

export default function IdeWorkspace({
  slides,
  courseId,
  mainCode,
  setMainCode,
  lessons,
  currentLessonId,
  onSelectLesson,
  currentLayout,
  showAiAssistant,
  onToggleAiAssistant,
  initialSlideIndex = 0,
  onSlideChange,
  studentId,
}: {
  slides: any[]; // Changed from unknown[] to any[] to match expected types
  courseId: string;
  mainCode: string;
  setMainCode: (code: string) => void;
  lessons?: ILesson[];
  currentLessonId?: string;
  onSelectLesson?: (lessonId: string) => void;
  currentLayout: string;
  showAiAssistant: boolean;
  onToggleAiAssistant: () => void;
  initialSlideIndex?: number;
  onSlideChange?: (slideIndex: number) => void;
  studentId?: string;
}) {
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const [activeTab, setActiveTab] = useState("editor");
  const [showConsole, setShowConsole] = useState(false);
  const [consoleMinimized, setConsoleMinimized] = useState(true);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [isAiCollapsed, setIsAiCollapsed] = useState(false);

  // Default layout configuration
  const getLayoutSizes = () => {
    if (isMobile) return [100]; // On mobile, use full width for the active panel

    // Handle collapsed states
    if (isPreviewCollapsed && isAiCollapsed) {
      return [20, 80, 0, 0];
    }
    if (isPreviewCollapsed && showAiAssistant) {
      return [20, 50, 0, 30];
    }
    if (isAiCollapsed) {
      return [25, 40, 35, 0];
    }

    switch (currentLayout) {
      case "standard":
        // When AI is shown, bias towards editor + AI, reduce preview size
        return showAiAssistant ? [20, 45, 5, 30] : [25, 40, 35];
      case "split":
        return showAiAssistant ? [15, 35, 10, 40] : [20, 30, 50];
      case "focus":
        return showAiAssistant ? [0, 70, 5, 25] : [0, 85, 15];
      default:
        return [25, 40, 35];
    }
  };

  const toggleConsole = () => {
    if (showConsole && !consoleMinimized) {
      setConsoleMinimized(true);
    } else {
      setShowConsole(true);
      setConsoleMinimized(false);
    }
  };

  // Get starting code safely
  const getStartingCode = () => {
    const firstSlide = slides?.[0];
    return firstSlide?.startingCode || "";
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
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
        className="flex-1 overflow-hidden relative min-w-0"
        data-ide-workspace="true"
      >
        {isMobile ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col min-w-0"
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
                  lessons={lessons}
                  currentLessonId={currentLessonId}
                  onSelectLesson={onSelectLesson}
                  initialSlideIndex={initialSlideIndex}
                  onSlideChange={onSlideChange}
                />
              </TabsContent>

              <TabsContent value="editor" className="h-full m-0 p-0">
                <IdeEditor
                  setMainCode={setMainCode}
                  startingCode={getStartingCode()}
                />
              </TabsContent>

              <TabsContent value="preview" className="h-full m-0 p-0">
                <IdePreview mainCode={mainCode} />
              </TabsContent>

              <TabsContent value="ai" className="h-full m-0 p-0">
                <IdeAiAssistant
                  code={mainCode}
                  courseId={courseId}
                  lessonId={currentLessonId || ""}
                  studentId={studentId || "guest"}
                />
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <ResizablePanelGroup direction="vertical" className="h-full min-w-0">
            <ResizablePanel
              defaultSize={showConsole && !consoleMinimized ? 70 : 100}
              minSize={40}
            >
              <ResizablePanelGroup
                direction="horizontal"
                className="h-full min-w-0"
              >
                {currentLayout !== "focus" && (
                  <>
                    <ResizablePanel
                      defaultSize={getLayoutSizes()[0]}
                      minSize={15}
                      className="min-w-0 overflow-hidden"
                    >
                      <IdeSlides
                        slides={slides}
                        courseId={courseId}
                        lessons={lessons}
                        currentLessonId={currentLessonId}
                        onSelectLesson={onSelectLesson}
                      />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                  </>
                )}

                <ResizablePanel
                  defaultSize={getLayoutSizes()[1]}
                  minSize={25}
                  className="min-w-0 overflow-hidden"
                >
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between p-2 border-b bg-muted/30">
                      <span className="text-sm font-medium">Editor</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setIsPreviewCollapsed(!isPreviewCollapsed)
                          }
                          className="h-6 w-6 p-0"
                        >
                          {isPreviewCollapsed ? (
                            <ChevronRight size={14} />
                          ) : (
                            <ChevronLeft size={14} />
                          )}
                        </Button>
                        {showAiAssistant && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsAiCollapsed(!isAiCollapsed)}
                            className="h-6 w-6 p-0"
                          >
                            {isAiCollapsed ? (
                              <ChevronRight size={14} />
                            ) : (
                              <ChevronLeft size={14} />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-h-0">
                      <IdeEditor
                        setMainCode={setMainCode}
                        startingCode={getStartingCode()}
                      />
                    </div>
                  </div>
                </ResizablePanel>

                {!isPreviewCollapsed && (
                  <>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                      defaultSize={getLayoutSizes()[2]}
                      minSize={15}
                      className="min-w-0 overflow-hidden"
                    >
                      <IdePreview mainCode={mainCode} />
                    </ResizablePanel>
                  </>
                )}

                {showAiAssistant && !isAiCollapsed && (
                  <>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                      defaultSize={getLayoutSizes()[3]}
                      minSize={15}
                      className="min-w-0 overflow-hidden"
                    >
                      <IdeAiAssistant
                        code={mainCode}
                        courseId={courseId}
                        lessonId={currentLessonId || ""}
                        studentId={studentId || "guest"}
                      />
                    </ResizablePanel>
                  </>
                )}
              </ResizablePanelGroup>
            </ResizablePanel>

            {showConsole && !consoleMinimized && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel
                  defaultSize={30}
                  minSize={20}
                  className="min-w-0 overflow-hidden"
                >
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
    </div>
  );
}
