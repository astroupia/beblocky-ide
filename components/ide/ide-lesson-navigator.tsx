"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Lock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

type LessonProps = {
  _id: string;
  lessonTitle: string;
  lessonDescription?: string;
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
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="relative">
      {isExpanded ? (
        <Card className="absolute top-0 left-0 w-64 h-[calc(100vh-8rem)] z-10 shadow-lg">
          <CardHeader className="p-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Course Navigator</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
              >
                <ChevronLeft size={16} />
              </Button>
            </div>
            <Progress value={progressPercentage} className="h-1 mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {completedLessons} of {totalLessons} lessons completed
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-2">
                <ul className="space-y-1">
                  {processedLessons.map((lesson) => (
                    <li key={lesson._id}>
                      <Button
                        variant={
                          lesson._id === currentLessonId ? "secondary" : "ghost"
                        }
                        className={`w-full justify-start text-xs h-8 ${
                          lesson.status === "locked" ? "opacity-60" : ""
                        }`}
                        onClick={() =>
                          lesson.status !== "locked" &&
                          onSelectLesson(lesson._id)
                        }
                        disabled={lesson.status === "locked"}
                      >
                        <span className="mr-2">
                          {getStatusIcon(lesson.status || "locked")}
                        </span>
                        <span className="truncate">{lesson.lessonTitle}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 left-4 z-10"
          onClick={() => setIsExpanded(true)}
        >
          <ChevronRight size={16} className="mr-1" />
          Lessons
        </Button>
      )}
    </div>
  );
}
