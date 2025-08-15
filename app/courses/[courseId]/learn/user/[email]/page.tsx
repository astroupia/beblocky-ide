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
import IdeSettingsPanel from "@/components/ide/ide-settings-panel";
import { AuthProvider } from "@/components/context/auth-context";
import { getCourseWithContent, userApi, progressApi } from "@/lib/api";
import { ILesson, ISlide } from "@/types";
import { decryptEmail, generateInitials } from "@/lib/utils";
import { UserRole, IUser } from "@/types/user";
import { IStudentProgress } from "@/types/progress";
import IdeLoadingSkeleton from "@/components/ide/ide-loading";

interface UserData {
  id: string;
  _id?: string;
  name: string;
  email: string;
  initials: string;
  role: UserRole;
  progress: Record<string, unknown>;
  preferences: Record<string, unknown>;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function LearnPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const encryptedEmail = params.email as string;

  const [mainCode, setMainCode] = useState<string>("");
  const [currentLayout, setCurrentLayout] = useState<string>("standard");
  const [currentLessonId, setCurrentLessonId] = useState<string>("");
  const [currentSlides, setCurrentSlides] = useState<ISlide[]>([]);
  const [allLessons, setAllLessons] = useState<ILesson[]>([]);
  const [currentCourseTitle, setCurrentCourseTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProgress, setUserProgress] = useState<IStudentProgress | null>(
    null
  );
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  // Fetch course data and user data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Decrypt the email
        const email = decryptEmail(encryptedEmail);

        // Fetch course data
        const courseData = await getCourseWithContent(courseId);

        if (courseData) {
          setCurrentCourseTitle(courseData.courseTitle);
          setAllLessons((courseData.lessons as unknown as ILesson[]) || []);

          if (courseData.lessons && courseData.lessons.length > 0) {
            const firstLesson = courseData.lessons[0];
            setCurrentLessonId(firstLesson._id?.toString() || "");
            setCurrentSlides((firstLesson.slides as unknown as ISlide[]) || []);
            setMainCode(
              (firstLesson.slides as unknown as ISlide[])?.[0]?.startingCode ||
                ""
            );
          }
        }

        // Fetch user data based on email
        if (email !== "guest") {
          try {
            const userData = await userApi.getByEmail(email);
            // Generate initials for the user
            const initials = generateInitials(
              userData.name || userData.email,
              userData.email
            );

            const userWithData: UserData = {
              ...userData,
              id: userData._id?.toString() || "guest",
              initials,
              role: userData.role || UserRole.STUDENT, // Default to student if no role
              progress: {},
              preferences: {},
            };

            setUserData(userWithData);

            // If user is a student, fetch their progress for this course
            if (userWithData.role === UserRole.STUDENT) {
              try {
                const progress = await progressApi.getByStudentAndCourse(
                  userWithData.id,
                  courseId
                );
                setUserProgress(progress);

                // If this is the first time accessing the course, create initial progress
                if (
                  progress.progress.length === 0 &&
                  courseData.lessons &&
                  courseData.lessons.length > 0
                ) {
                  const firstLesson = courseData.lessons[0];
                  await progressApi.create({
                    studentId: userWithData.id,
                    courseId: courseId,
                    lessonId: firstLesson._id?.toString() || "",
                    code:
                      (firstLesson.slides as unknown as ISlide[])?.[0]
                        ?.startingCode || "",
                    timeSpent: 0,
                    completed: false,
                  });

                  // Refresh progress data
                  const updatedProgress =
                    await progressApi.getByStudentAndCourse(
                      userWithData.id,
                      courseId
                    );
                  setUserProgress(updatedProgress);
                }
              } catch (progressError) {
                console.warn("Could not fetch user progress:", progressError);
                // Continue without progress data
              }
            }
          } catch (error) {
            console.warn("Could not fetch user data, using guest mode:", error);
            // Fallback to guest user data if API fails
            setUserData({
              id: "guest",
              name: "Guest User",
              email: email,
              initials: "GU",
              role: UserRole.STUDENT,
              progress: {},
              preferences: {},
              emailVerified: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              _id: "guest",
            });
          }
        } else {
          // Guest user
          setUserData({
            id: "guest",
            name: "Guest User",
            email: "guest",
            initials: "GU",
            role: UserRole.STUDENT,
            progress: {},
            preferences: {},
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            _id: "guest",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId && encryptedEmail) {
      fetchData();
    }
  }, [courseId, encryptedEmail]);

  // Handle lesson selection
  const handleSelectLesson = async (lessonId: string) => {
    setCurrentLessonId(lessonId);

    const selectedLesson = allLessons.find(
      (lesson) => lesson._id?.toString() === lessonId
    );

    if (selectedLesson) {
      setCurrentSlides((selectedLesson.slides as unknown as ISlide[]) || []);
      setMainCode(
        (selectedLesson.slides as unknown as ISlide[])?.[0]?.startingCode || ""
      );

      // Update progress for the selected lesson (only for students)
      if (userData?.id !== "guest" && userData?.role === UserRole.STUDENT) {
        try {
          // Check if progress exists for this lesson
          const existingProgress = userProgress?.progress.find(
            (p: { lessonId?: { toString: () => string } }) =>
              p.lessonId?.toString() === lessonId
          );

          if (existingProgress) {
            // Update existing progress with new lastAccessed time
            await progressApi.updateTimeSpent(
              existingProgress._id?.toString() || "",
              {
                timeSpent: existingProgress.timeSpent || 0,
                lastAccessed: new Date().toISOString(),
              }
            );
          } else {
            // Create new progress for this lesson
            await progressApi.create({
              studentId: userData.id,
              courseId: courseId,
              lessonId: lessonId,
              code:
                (selectedLesson.slides as unknown as ISlide[])?.[0]
                  ?.startingCode || "",
              timeSpent: 0,
              completed: false,
            });

            // Refresh progress data
            const updatedProgress = await progressApi.getByStudentAndCourse(
              userData.id,
              courseId
            );
            setUserProgress(updatedProgress);
          }
        } catch (error) {
          console.error("Failed to update progress for lesson:", error);
        }
      }
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

  // Handle saving code with user context
  const handleSaveCode = async (): Promise<void> => {
    const saveKey = `code-${courseId}-${currentLessonId}-${
      userData?.id || "guest"
    }`;
    localStorage.setItem(saveKey, mainCode);

    // Save to backend with user context (only if not guest and is student)
    if (userData?.id !== "guest" && userData?.role === UserRole.STUDENT) {
      try {
        // Use existing progress data if available
        if (userProgress?.progress && userProgress.progress.length > 0) {
          // Update existing progress
          const progressId = userProgress.progress.find(
            (p: {
              lessonId?: { toString: () => string };
              _id?: { toString: () => string };
            }) => p.lessonId?.toString() === currentLessonId
          )?._id;
          if (progressId) {
            await progressApi.saveCode(progressId.toString(), {
              code: mainCode,
              lessonId: currentLessonId,
            });
          } else {
            // Create new progress for this lesson if it doesn't exist
            await progressApi.create({
              studentId: userData.id,
              courseId: courseId,
              lessonId: currentLessonId,
              code: mainCode,
            });

            // Refresh progress data
            const updatedProgress = await progressApi.getByStudentAndCourse(
              userData.id,
              courseId
            );
            setUserProgress(updatedProgress);
          }
        } else {
          // Create new progress if none exists
          await progressApi.create({
            studentId: userData.id,
            courseId: courseId,
            lessonId: currentLessonId,
            code: mainCode,
          });

          // Refresh progress data
          const updatedProgress = await progressApi.getByStudentAndCourse(
            userData.id,
            courseId
          );
          setUserProgress(updatedProgress);
        }
      } catch (error) {
        console.error("Failed to save to backend:", error);
        throw new Error("Failed to save to server");
      }
    }
  };

  // Handle format code (placeholder for future implementation)
  const handleFormatCode = () => {
    // TODO: Implement code formatting
    console.log("Format code functionality to be implemented");
  };

  // Handle AI assistant toggle
  const handleToggleAiAssistant = () => {
    setShowAiAssistant(!showAiAssistant);
  };

  if (loading) {
    return <IdeLoadingSkeleton />;
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
                <IdeHeader
                  courseTitle={currentCourseTitle}
                  userData={userData || undefined}
                  onSettingsClick={() => setIsSettingsOpen(true)}
                />
                <IdeToolbar
                  onRunCode={handleRunCode}
                  onSaveCode={handleSaveCode}
                  mainCode={mainCode}
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
                  onToggleAiAssistant={handleToggleAiAssistant}
                  showAiAssistant={showAiAssistant}
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
                    currentLayout={currentLayout}
                    showAiAssistant={showAiAssistant}
                    onToggleAiAssistant={handleToggleAiAssistant}
                  />
                </div>
                <IdeKeyboardShortcuts
                  onRunCode={handleRunCode}
                  onSaveCode={handleSaveCode}
                  onFormatCode={handleFormatCode}
                />
              </div>

              <IdeSettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
              />
            </AIProvider>
          </SettingsProvider>
        </CoinProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
