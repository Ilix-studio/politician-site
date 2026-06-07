import { apiSlice } from "./apiSlice";
import { handleApiError } from "../../lib/apiConfig";

export interface VisitorCountResponse {
  success: boolean;
  count: number;
  message?: string;
}

export interface DailyStat {
  date: string;
  count: number;
}

export interface WeeklyStats {
  thisWeek: number;
  lastWeek: number;
  growth: number;
}

export interface VisitorStatsResponse {
  success: boolean;
  data: {
    totalVisitors: number;
    todayVisitors: number;
    lastVisit: string | null;
    dailyStats: DailyStat[];
    weeklyStats: WeeklyStats;
  };
}

export interface VisitorResetResponse {
  success: boolean;
  message: string;
  count: number;
}

export const visitorApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    incrementVisitorCounter: builder.mutation<VisitorCountResponse, void>({
      query: () => ({
        url: "/visitor/increment-counter",
        method: "POST",
      }),
      invalidatesTags: ["VisitorCount", "VisitorStats"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    getVisitorCount: builder.query<VisitorCountResponse, void>({
      query: () => ({
        url: "/visitor/visitor-count",
        method: "GET",
      }),
      providesTags: ["VisitorCount"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    getVisitorStats: builder.query<VisitorStatsResponse, void>({
      query: () => ({
        url: "/visitor/stats",
        method: "GET",
      }),
      providesTags: ["VisitorStats"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    resetVisitorCounter: builder.mutation<VisitorResetResponse, void>({
      query: () => ({
        url: "/visitor/reset",
        method: "POST",
      }),
      invalidatesTags: ["VisitorCount", "VisitorStats"],
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

export const {
  useIncrementVisitorCounterMutation,
  useGetVisitorCountQuery,
  useLazyGetVisitorCountQuery,
  useGetVisitorStatsQuery,
  useLazyGetVisitorStatsQuery,
  useResetVisitorCounterMutation,
} = visitorApi;
