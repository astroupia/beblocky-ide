import { ISlide } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.beblocky.com";

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

// Slide API calls
export const slideApi = {
  getAll: () => apiCall<ISlide[]>("/slides"),
  getById: (id: string) => apiCall<ISlide>(`/slides/${id}`),
  getByCourseId: (courseId: string) =>
    apiCall<ISlide[]>(`/slides?courseId=${courseId}`),
  getByLessonId: (lessonId: string) =>
    apiCall<ISlide[]>(`/slides?lessonId=${lessonId}`),
  create: (data: Record<string, unknown>) =>
    apiCall<ISlide>("/slides", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    apiCall<ISlide>(`/slides/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/slides/${id}`, {
      method: "DELETE",
    }),
};
