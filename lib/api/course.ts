import { ICourse } from "@/types";

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

// Course API calls
export const courseApi = {
  getAll: () => apiCall<ICourse[]>("/courses"),
  getById: (id: string) => apiCall<ICourse>(`/courses/${id}`),
  create: (data: Record<string, unknown>) =>
    apiCall<ICourse>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    apiCall<ICourse>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/courses/${id}`, {
      method: "DELETE",
    }),
};
