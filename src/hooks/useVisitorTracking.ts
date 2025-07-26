import { useEffect, useState } from "react";
import {
  useGetVisitorCountQuery,
  useGetVisitorStatsQuery,
  useIncrementVisitorCounterMutation,
  useLazyGetVisitorCountQuery,
  useResetVisitorCounterMutation,
} from "../redux-store/services/visitorApi";

interface UseVisitorTrackingReturn {
  count: number;
  isNewVisitor: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useVisitorTracking = (): UseVisitorTrackingReturn => {
  const [isNewVisitor, setIsNewVisitor] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // RTK Query hooks
  const [
    incrementCounter,
    { isLoading: incrementLoading, error: incrementError },
  ] = useIncrementVisitorCounterMutation();

  const [getVisitorCount, { isLoading: getLoading, error: getError }] =
    useLazyGetVisitorCountQuery();

  // Manual query for refetching
  const { refetch: refetchQuery } = useGetVisitorCountQuery(undefined, {
    skip: true, // Skip initial load since we handle it manually
  });

  // State for tracking the current count
  const [currentCount, setCurrentCount] = useState(0);

  // Check if user has visited before
  const isReturningVisitor = (): boolean => {
    return localStorage.getItem("visitor_tracked") === "true";
  };

  // Mark user as having visited
  const markAsVisited = (): void => {
    localStorage.setItem("visitor_tracked", "true");
    setIsNewVisitor(true);
  };

  // Initialize visitor tracking
  const initializeTracking = async (): Promise<void> => {
    if (hasInitialized) return;

    try {
      const returning = isReturningVisitor();

      if (returning) {
        // Returning visitor - just get current count
        const result = await getVisitorCount().unwrap();
        setCurrentCount(result.count);
        setIsNewVisitor(false);
      } else {
        // New visitor - increment count
        const result = await incrementCounter().unwrap();
        setCurrentCount(result.count);
        markAsVisited();
      }
    } catch (error) {
      console.error("Error initializing visitor tracking:", error);
      // Try to get current count as fallback
      try {
        const result = await getVisitorCount().unwrap();
        setCurrentCount(result.count);
      } catch (fallbackError) {
        console.error("Fallback visitor count failed:", fallbackError);
      }
    } finally {
      setHasInitialized(true);
    }
  };

  // Refetch function
  const refetch = async (): Promise<void> => {
    try {
      const result = await refetchQuery().unwrap();
      setCurrentCount(result.count);
    } catch (error) {
      console.error("Error refetching visitor count:", error);
    }
  };

  // Initialize on mount
  useEffect(() => {
    initializeTracking();
  }, []);

  // Handle page visibility changes (optional: for more accurate tracking)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !isReturningVisitor() && hasInitialized) {
        // Page became visible and user hasn't been tracked yet
        initializeTracking();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasInitialized]);

  // Determine loading state
  const loading = !hasInitialized || incrementLoading || getLoading;

  // Determine error state
  const error = incrementError || getError;
  const errorMessage = error
    ? typeof error === "string"
      ? error
      : "Failed to track visitor"
    : null;

  return {
    count: currentCount,
    isNewVisitor,
    loading,
    error: errorMessage,
    refetch,
  };
};

// Hook for admin dashboard statistics
export const useVisitorStats = () => {
  const {
    data: statsData,
    isLoading,
    error,
    refetch,
  } = useGetVisitorStatsQuery();

  const [resetCounter, { isLoading: resetLoading, error: resetError }] =
    useResetVisitorCounterMutation();

  const resetVisitorCount = async (): Promise<boolean> => {
    try {
      await resetCounter().unwrap();
      // Refetch stats after reset
      refetch();
      return true;
    } catch (error) {
      console.error("Error resetting visitor count:", error);
      return false;
    }
  };

  return {
    stats: statsData?.data || null,
    loading: isLoading,
    error: error
      ? typeof error === "string"
        ? error
        : "Failed to load stats"
      : null,
    refetch,
    resetVisitorCount,
    resetLoading,
    resetError: resetError
      ? typeof resetError === "string"
        ? resetError
        : "Failed to reset"
      : null,
  };
};

export default useVisitorTracking;
