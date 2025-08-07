// hooks/usePerformanceMonitoring.ts
import { useEffect, useState } from "react";

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  networkType: string;
  connectionSpeed: string;
}

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Check connection type
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      const networkType = connection.effectiveType || "unknown";
      const downlink = connection.downlink || 0;

      setIsSlowConnection(
        networkType === "slow-2g" || networkType === "2g" || downlink < 1
      );

      setMetrics((prev) => ({
        ...prev,
        networkType,
        connectionSpeed: `${downlink} Mbps`,
      }));
    }

    // Performance Observer for Core Web Vitals
    if ("PerformanceObserver" in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as any;

        setMetrics((prev) => ({
          ...prev,
          largestContentfulPaint: lastEntry.startTime,
        }));
      });

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry: any) => {
          setMetrics((prev) => ({
            ...prev,
            firstInputDelay: entry.processingStart - entry.startTime,
          }));
        });
      });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        entryList.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        setMetrics((prev) => ({
          ...prev,
          cumulativeLayoutShift: clsValue,
        }));
      });

      try {
        lcpObserver.observe({
          type: "largest-contentful-paint",
          buffered: true,
        });
        fidObserver.observe({ type: "first-input", buffered: true });
        clsObserver.observe({ type: "layout-shift", buffered: true });
      } catch (e) {
        console.warn("Performance Observer not supported");
      }

      // Cleanup
      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }

    // Fallback: Basic performance metrics
    const loadTime =
      performance.timing.loadEventEnd - performance.timing.navigationStart;

    setMetrics((prev) => ({
      ...prev,
      loadTime,
    }));

    // First Contentful Paint (fallback)
    if (performance.getEntriesByType) {
      const fcpEntry = performance
        .getEntriesByType("paint")
        .find((entry) => entry.name === "first-contentful-paint") as any;

      if (fcpEntry) {
        setMetrics((prev) => ({
          ...prev,
          firstContentfulPaint: fcpEntry.startTime,
        }));
      }
    }
  }, []);

  // Function to log performance metrics
  const logMetrics = () => {
    console.group("Performance Metrics");
    console.log("Load Time:", metrics.loadTime + "ms");
    console.log("First Contentful Paint:", metrics.firstContentfulPaint + "ms");
    console.log(
      "Largest Contentful Paint:",
      metrics.largestContentfulPaint + "ms"
    );
    console.log("Cumulative Layout Shift:", metrics.cumulativeLayoutShift);
    console.log("First Input Delay:", metrics.firstInputDelay + "ms");
    console.log("Network Type:", metrics.networkType);
    console.log("Connection Speed:", metrics.connectionSpeed);
    console.groupEnd();
  };

  // Function to get performance recommendations
  const getRecommendations = () => {
    const recommendations = [];

    if (
      metrics.largestContentfulPaint &&
      metrics.largestContentfulPaint > 2500
    ) {
      recommendations.push(
        "Optimize image loading and reduce main thread blocking"
      );
    }

    if (metrics.firstInputDelay && metrics.firstInputDelay > 100) {
      recommendations.push("Reduce JavaScript execution time");
    }

    if (metrics.cumulativeLayoutShift && metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push("Fix layout shifts by setting image dimensions");
    }

    if (isSlowConnection) {
      recommendations.push(
        "Implement aggressive caching and reduce bundle size"
      );
    }

    return recommendations;
  };

  return {
    metrics,
    isSlowConnection,
    logMetrics,
    getRecommendations,
  };
};

// Resource preloading hook
export const useResourcePreloader = () => {
  const preloadResource = (href: string, as: string, type?: string) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    if (type) link.type = type;

    document.head.appendChild(link);

    // Cleanup function
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  };

  const preloadCriticalResources = () => {
    // Preload critical CSS
    preloadResource("/assets/main.css", "style");

    // Preload critical fonts
    preloadResource("/assets/fonts/main.woff2", "font", "font/woff2");

    // Preload hero images
    preloadResource("/assets/images/hero.webp", "image");
  };

  return {
    preloadResource,
    preloadCriticalResources,
  };
};
