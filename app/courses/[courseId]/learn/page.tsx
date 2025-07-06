"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import IdeToolbar from "@/components/ide/ide-toolbar";
import IdeWorkspace from "@/components/ide/ide-workspace";
import IdeKeyboardShortcuts from "@/components/ide/ide-keyboard-shortcuts";
import { ThemeProvider } from "@/components/ide/context/theme-provider";
import { CoinProvider } from "@/components/ide/context/coin-context";
import { SettingsProvider } from "@/components/ide/context/settings-context";
import { AIProvider } from "@/components/ide/context/ai-context";
import IdeHeader from "@/components/ide/ide-header";
import useMediaQuery from "@/hooks/use-mobile";
import { AuthProvider } from "@/components/context/auth-context";
import { getCourseWithContent } from "@/lib/api";
import { ICourse, ILesson, ISlide } from "@/types";

export default function LearnPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const isMobile = useMediaQuery("(max-width: 1000px)");

  const [mainCode, setMainCode] = useState<string>("");
  const [currentLayout, setCurrentLayout] = useState<string>("standard");
  const [currentLessonId, setCurrentLessonId] = useState<string>("");
  const [currentSlides, setCurrentSlides] = useState<ISlide[]>([]);
  const [allLessons, setAllLessons] = useState<ILesson[]>([]);
  const [currentCourseTitle, setCurrentCourseTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch course data from API
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);

        const courseData = await getCourseWithContent(courseId);

        if (courseData) {
          setCurrentCourseTitle(courseData.courseTitle);
          setAllLessons(courseData.lessons || []);

          if (courseData.lessons && courseData.lessons.length > 0) {
            const firstLesson = courseData.lessons[0];
            setCurrentLessonId(firstLesson._id!);
            setCurrentSlides(firstLesson.slides || []);
            setMainCode(firstLesson.slides[0]?.startingCode || "");
          }
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError("Failed to load course data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  // Handle lesson selection
  const handleSelectLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId);

    const selectedLesson = allLessons.find((lesson) => lesson._id === lessonId);

    if (selectedLesson) {
      setCurrentSlides(selectedLesson.slides || []);
      setMainCode(selectedLesson.slides[0]?.startingCode || "");
    }
  };

  // Update the handleRunCode function to actually run the code
  const handleRunCode = () => {
    const consoleButton = document.querySelector(
      '[data-console-toggle="true"]'
    );
    if (consoleButton) {
      (consoleButton as HTMLElement).click();
    }
  };

  // Handle saving code
  const handleSaveCode = () => {
    localStorage.setItem(`code-${courseId}-${currentLessonId}`, mainCode);
    alert("Code saved successfully!");
  };

  // Handle format code (placeholder for future implementation)
  const handleFormatCode = () => {
    // TODO: Implement code formatting
    console.log("Format code functionality to be implemented");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <CoinProvider>
          <SettingsProvider>
            <AIProvider>
              <div className="flex flex-col h-screen w-screen overflow-hidden">
                <IdeHeader courseTitle={currentCourseTitle} />
                <IdeToolbar
                  onRunCode={handleRunCode}
                  onSaveCode={handleSaveCode}
                  onChangeLayout={(layout) => {
                    setCurrentLayout(layout);
                    const workspace = document.querySelector(
                      '[data-ide-workspace="true"]'
                    );
                    if (workspace) {
                      workspace.classList.add("layout-change");
                      setTimeout(() => {
                        workspace.classList.remove("layout-change");
                      }, 10);
                    }
                  }}
                  currentLayout={currentLayout}
                />
                <div className="flex-1 overflow-hidden relative">
                  <IdeWorkspace
                    slides={currentSlides}
                    courseId={courseId}
                    mainCode={mainCode}
                    setMainCode={setMainCode}
                    lessons={allLessons}
                    currentLessonId={currentLessonId}
                    onSelectLesson={handleSelectLesson}
                  />
                </div>
                <IdeKeyboardShortcuts
                  onRunCode={handleRunCode}
                  onSaveCode={handleSaveCode}
                  onFormatCode={handleFormatCode}
                />
              </div>
            </AIProvider>
          </SettingsProvider>
        </CoinProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
