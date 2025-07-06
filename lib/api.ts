import { ICourse, ILesson, ISlide } from "@/types";
import { IProgress, IStudentProgress, ICourseProgress } from "@/types/progress";
import { IStudent } from "@/types/student";
import { UserRole } from "@/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API call failed: ${response.statusText}`
    );
  }

  return response.json();
}

// Course API calls
export const courseApi = {
  getAll: () => apiCall<ICourse[]>("/courses"),
  getById: (id: string) => apiCall<ICourse>(`/courses/${id}`),
  create: (data: any) =>
    apiCall<ICourse>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall<ICourse>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/courses/${id}`, {
      method: "DELETE",
    }),
};

// Lesson API calls
export const lessonApi = {
  getAll: () => apiCall<ILesson[]>("/lessons"),
  getById: (id: string) => apiCall<ILesson>(`/lessons/${id}`),
  getByCourseId: (courseId: string) =>
    apiCall<ILesson[]>(`/lessons?courseId=${courseId}`),
  create: (data: any) =>
    apiCall<ILesson>("/lessons", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall<ILesson>(`/lessons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/lessons/${id}`, {
      method: "DELETE",
    }),
};

// Slide API calls
export const slideApi = {
  getAll: () => apiCall<ISlide[]>("/slides"),
  getById: (id: string) => apiCall<ISlide>(`/slides/${id}`),
  getByCourseId: (courseId: string) =>
    apiCall<ISlide[]>(`/slides?courseId=${courseId}`),
  getByLessonId: (lessonId: string) =>
    apiCall<ISlide[]>(`/slides?lessonId=${lessonId}`),
  create: (data: any) =>
    apiCall<ISlide>("/slides", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall<ISlide>(`/slides/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/slides/${id}`, {
      method: "DELETE",
    }),
};

// User API calls
export const userApi = {
  getById: (id: string) => apiCall<any>(`/users/${id}`),
  getByEmail: (email: string) =>
    apiCall<any>(`/users/by-email?email=${encodeURIComponent(email)}`),
  update: (id: string, data: any) =>
    apiCall<any>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Progress API calls
export const progressApi = {
  create: (data: any) =>
    apiCall<IProgress>("/progress", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAll: () => apiCall<IProgress[]>("/progress"),
  getById: (id: string) => apiCall<IProgress>(`/progress/${id}`),
  getByStudent: (studentId: string) =>
    apiCall<IProgress[]>(`/progress/student/${studentId}`),
  getByCourse: (courseId: string) =>
    apiCall<IProgress[]>(`/progress/course/${courseId}`),
  getByStudentAndCourse: (studentId: string, courseId: string) =>
    apiCall<IStudentProgress>(`/progress/${studentId}/${courseId}`),
  getCompletionPercentage: (studentId: string, courseId: string) =>
    apiCall<{ percentage: number }>(
      `/progress/${studentId}/${courseId}/percentage`
    ),
  completeLesson: (id: string, data: any) =>
    apiCall<IProgress>(`/progress/${id}/complete-lesson`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  saveCode: (id: string, data: any) =>
    apiCall<IProgress>(`/progress/${id}/save-code`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  updateTimeSpent: (id: string, data: any) =>
    apiCall<IProgress>(`/progress/${id}/time-spent`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/progress/${id}`, {
      method: "DELETE",
    }),
};

// Student API calls
export const studentApi = {
  getStreak: (id: string) =>
    apiCall<{ streak: number }>(`/students/${id}/streak`),
  updateActivity: (id: string, data: any) =>
    apiCall<any>(`/students/${id}/activity`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  getTotalCoins: (id: string) =>
    apiCall<{ total: number }>(`/students/${id}/coins/total`),
  addCoins: (id: string, data: any) =>
    apiCall<any>(`/students/${id}/coins/add`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTimeSpent: (id: string, data: any) =>
    apiCall<any>(`/students/${id}/time-spent`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// Helper function to get course with full content (lessons and slides)
export const getCourseWithContent = async (courseId: string) => {
  try {
    const course = await courseApi.getById(courseId);
    const lessons = await lessonApi.getByCourseId(courseId);

    // Get slides for each lesson
    const lessonsWithSlides = await Promise.all(
      lessons.map(async (lesson) => {
        const slides = await slideApi.getByLessonId(
          lesson._id?.toString() || ""
        );
        return {
          ...lesson,
          slides: slides.sort((a, b) => a.order - b.order), // Sort slides by order
        };
      })
    );

    // Sort lessons by their order (assuming they have an order field)
    const sortedLessons = lessonsWithSlides.sort((a, b) => {
      // If lessons don't have order, sort by creation date
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return {
      ...course,
      lessons: sortedLessons,
    };
  } catch (error) {
    console.error("Error fetching course with content:", error);
    throw error;
  }
};
