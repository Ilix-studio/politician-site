import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_CONFIG = {
  BASE_URL: import.meta.env.DEV
    ? "https://biswajit-be-34098913955.europe-west1.run.app/api"
    : "https://biswajit-be-34098913955.europe-west1.run.app/api",

  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 3000,
};

// Create a retry function
const retry = async (
  fn: () => Promise<any>,
  attempts: number = API_CONFIG.RETRY_ATTEMPTS,
): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
    return retry(fn, attempts - 1);
  }
};

export const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Accept-Encoding", "gzip, deflate, br");

    return headers;
  },
});

// Client-side cache check
export const getCachedData = (args: any) => {
  if (args.method !== "GET") return null;

  const cacheKey = `api_cache_${JSON.stringify(args)}`;
  const cached = sessionStorage.getItem(cacheKey);

  if (cached) {
    try {
      const { data, timestamp, ttl } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        return { data };
      }
      sessionStorage.removeItem(cacheKey);
    } catch (e) {
      sessionStorage.removeItem(cacheKey);
    }
  }

  return null;
};

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  // Log detailed error for debugging
  console.error("API Error Details:", {
    status: error.status,
    data: error.data,
    error: error.error,
  });

  // Network error
  if (error.status === "FETCH_ERROR") {
    return "Network error. Please check your connection and try again.";
  }

  // Timeout error
  if (error.status === "TIMEOUT_ERROR") {
    return "Request timed out. Please try again.";
  }

  // CORS error
  if (error.status === 403 || error.error?.message?.includes("CORS")) {
    return "CORS error. Please check server configuration.";
  }

  // Server error with message
  if (error.data?.message) {
    return error.data.message;
  }

  // HTTP status codes
  switch (error.status) {
    case 404:
      return "Content not found.";
    case 500:
      return "Server error. Please try again later.";
    case 429:
      return "Too many requests. Please wait a moment.";
    default:
      return "An unexpected error occurred. Please try again later.";
  }
};

// Prefetch utility for critical data
export const prefetchCriticalData = async () => {
  const criticalEndpoints = [
    "/photos?limit=6&page=1",
    "/videos?limit=6&page=1",
    "/visitor/count",
  ];

  const prefetchPromises = criticalEndpoints.map((endpoint) => {
    return fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "public, max-age=300",
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.warn(`Prefetch failed for ${endpoint}:`, error);
      });
  });

  return Promise.allSettled(prefetchPromises);
};
