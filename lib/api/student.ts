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

// Student API calls
export const studentApi = {
  getStreak: (id: string) =>
    apiCall<{ streak: number }>(`/students/${id}/streak`),
  updateActivity: (id: string, data: Record<string, unknown>) =>
    apiCall<Record<string, unknown>>(`/students/${id}/activity`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  getTotalCoins: (id: string) =>
    apiCall<{ total: number }>(`/students/${id}/coins/total`),
  addCoins: (id: string, data: Record<string, unknown>) =>
    apiCall<Record<string, unknown>>(`/students/${id}/coins/add`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTimeSpent: (id: string, data: Record<string, unknown>) =>
    apiCall<Record<string, unknown>>(`/students/${id}/time-spent`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
