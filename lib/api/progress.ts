import { IProgress } from "@/types/progress";

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

// Progress API calls
export const progressApi = {
  create: (data: Record<string, unknown>) =>
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
  completeLesson: (id: string, data: Record<string, unknown>) =>
    apiCall<IProgress>(`/progress/${id}/complete-lesson`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  saveCode: (id: string, data: Record<string, unknown>) =>
    apiCall<IProgress>(`/progress/${id}/save-code`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  updateTimeSpent: (id: string, data: Record<string, unknown>) =>
    apiCall<IProgress>(`/progress/${id}/time-spent`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/progress/${id}`, {
      method: "DELETE",
    }),
};
