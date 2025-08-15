import { ILesson } from "@/types";

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

// Lesson API calls
export const lessonApi = {
  getAll: () => apiCall<ILesson[]>("/lessons"),
  getById: (id: string) => apiCall<ILesson>(`/lessons/${id}`),
  getByCourseId: (courseId: string) =>
    apiCall<ILesson[]>(`/lessons?courseId=${courseId}`),
  create: (data: Record<string, unknown>) =>
    apiCall<ILesson>("/lessons", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    apiCall<ILesson>(`/lessons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/lessons/${id}`, {
      method: "DELETE",
    }),
};
