"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Code,
  Copy,
  Check,
  X,
  Play,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Slide } from "@/lib/mock-data";
import IdeLessonNavigator from "./ide-lesson-navigator";
import IdeMarkdownPreview from "./ide-markdown-preview";

export default function IdeSlides({
  slides,
  courseId,
  lessons,
  currentLessonId,
  onSelectLesson,
}: {
  slides: Slide[];
  courseId: string;
  lessons?: any[];
  currentLessonId?: string;
  onSelectLesson?: (lessonId: string) => void;
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("content");
  const [copied, setCopied] = useState(false);

  const currentSlide = slides[currentSlideIndex] || {
    _id: "default",
    courseId: courseId,
    order: 0,
    title: "No slides available",
    content: "This lesson doesn't have any slides yet.",
    imageUrls: [],
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    themeColors: { main: "#000000", secondary: "#FFFFFF" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const totalSlides = slides.length;
  const progress =
    totalSlides > 0 ? ((currentSlideIndex + 1) / totalSlides) * 100 : 0;

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Extract code blocks from content
  const extractCodeBlocks = (content: string) => {
    const codeRegex = /```[\s\S]*?```/g;
    const matches = [];
    let match;

    while ((match = codeRegex.exec(content)) !== null) {
      matches.push(match[0]);
    }

    return matches;
  };

  const codeBlocks = currentSlide.content
    ? extractCodeBlocks(currentSlide.content)
    : [];

  return (
    <Card className="h-full min-w-0 flex flex-col border-none rounded-none shadow-none overflow-hidden">
      <CardHeader className="p-2 border-b flex-row items-center justify-between space-y-0 bg-muted/30 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu size={16} />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh] overflow-hidden flex flex-col">
              <DrawerTitle className="sr-only">Lesson Navigator</DrawerTitle>
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Lesson Navigator</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse all lessons in this course
                  </p>
                </div>
              </div>
              <div className="flex-1 p-4">
                {lessons && onSelectLesson && currentLessonId ? (
                  <IdeLessonNavigator
                    currentLessonId={currentLessonId}
                    onSelectLesson={onSelectLesson}
                    lessons={lessons.map((lesson: any) => ({
                      _id: lesson._id?.toString(),
                      title: lesson.title,
                      description: lesson.description,
                    }))}
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    No lessons available
                  </div>
                )}
              </div>
            </DrawerContent>
          </Drawer>
          <div className="text-sm font-medium truncate">Learning Materials</div>
        </div>
        <div className="text-xs text-muted-foreground">
          Slide {currentSlideIndex + 1} of {totalSlides || 1}
        </div>
      </CardHeader>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden min-w-0"
      >
        <TabsList className="px-4 pt-2 justify-start flex-shrink-0">
          <TabsTrigger value="content" className="text-xs">
            Content
          </TabsTrigger>
          {(codeBlocks.length > 0 || currentSlide.startingCode) && (
            <TabsTrigger value="code" className="text-xs">
              Code Examples
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent
          value="content"
          className="flex-1 overflow-hidden m-0 p-0 min-w-0"
        >
          <IdeMarkdownPreview content={currentSlide.content || ""} />
        </TabsContent>

        <TabsContent
          value="code"
          className="flex-1 overflow-hidden m-0 p-0 min-w-0"
        >
          <div className="h-full overflow-y-auto scrollbar-hide min-w-0 max-w-full">
            <CardContent className="p-4 bg-muted/10 min-w-0 max-w-full">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Code size={18} className="text-primary" />
                  Code Examples
                </h3>

                {/* Starting Code Section */}
                {currentSlide.startingCode && (
                  <div className="space-y-3">
                    <h4 className="text-md font-medium text-primary flex items-center gap-2">
                      <Play size={16} />
                      Starting Code
                    </h4>
                    <div className="relative group">
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              currentSlide.startingCode || ""
                            );
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                        >
                          {copied ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono border-l-4 border-primary max-w-full">
                        {currentSlide.startingCode}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Code Blocks from Content */}
                {codeBlocks.length > 0 && (
                  <div className="space-y-3 min-w-0 max-w-full">
                    <h4 className="text-md font-medium text-muted-foreground flex items-center gap-2">
                      <Code size={16} />
                      Code Examples from Content
                    </h4>
                    {codeBlocks.map((code, index) => (
                      <div
                        key={index}
                        className="relative group min-w-0 max-w-full"
                      >
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                            onClick={() => {
                              navigator.clipboard.writeText(code);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                          >
                            {copied ? (
                              <Check size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </Button>
                        </div>
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono max-w-full">
                          {code}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Code Message */}
                {!currentSlide.startingCode && codeBlocks.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No code examples in this slide.
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t flex-shrink-0 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousSlide}
            disabled={currentSlideIndex === 0}
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
          >
            Next <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>

        <Progress value={progress} className="h-1" />
      </div>
    </Card>
  );
}
