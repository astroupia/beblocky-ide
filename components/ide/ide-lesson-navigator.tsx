"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Lock,
  Menu,
  X,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

type LessonProps = {
  _id?: string;
  title: string;
  description?: string;
  status?: "completed" | "in-progress" | "locked";
};

export default function IdeLessonNavigator({
  currentLessonId,
  onSelectLesson,
  lessons = [],
}: {
  currentLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  lessons: LessonProps[];
}) {
  // Add status to lessons if not provided
  const processedLessons = lessons.map((lesson, index) => ({
    ...lesson,
    status:
      lesson.status ||
      (index === 0 ? "in-progress" : index < 3 ? "completed" : "locked"),
  }));

  // Calculate overall progress
  const totalLessons = processedLessons.length;
  const completedLessons = processedLessons.filter(
    (lesson) => lesson.status === "completed"
  ).length;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "in-progress":
        return <Circle size={16} className="text-blue-500 fill-blue-500/30" />;
      case "locked":
        return <Lock size={16} className="text-muted-foreground" />;
      default:
        return <Circle size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Progress value={progressPercentage} className="h-2" />
        <div className="text-xs text-muted-foreground">
          {completedLessons} of {totalLessons} lessons completed
        </div>
      </div>

      <ScrollArea className="h-[60vh]">
        <div className="space-y-2">
          {processedLessons.map((lesson) => (
            <Button
              key={lesson._id || lesson.title}
              variant={lesson._id === currentLessonId ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-sm h-auto py-3",
                lesson.status === "locked" ? "opacity-60" : ""
              )}
              onClick={() => {
                if (lesson.status !== "locked" && lesson._id) {
                  onSelectLesson(lesson._id);
                  // Close the drawer after selection
                  const closeButton = document.querySelector(
                    '[data-drawer-close="true"]'
                  );
                  if (closeButton) {
                    (closeButton as HTMLElement).click();
                  }
                }
              }}
              disabled={lesson.status === "locked"}
            >
              <span className="mr-2">
                {getStatusIcon(lesson.status || "locked")}
              </span>
              <div className="text-left">
                <div className="font-medium">{lesson.title}</div>
                {lesson.description && (
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {lesson.description}
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
