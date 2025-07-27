// src/App.tsx

import "./App.css";
import { useEffect } from "react";
import { Routes, useLocation } from "react-router-dom";

// Import route configurations
import {
  immediateRoutes,
  publicRoutes,
  adminRoutes,
  adSpecificRoutes,
  fallbackRoute,
} from "./config/routeConfig";
import {
  createAdminRoute,
  createAdSpecificRoute,
  createImmediateRoute,
  createPublicRoute,
} from "./config/routeHelpers";

// Import helper functions

const App = () => {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Step 1: Immediate routes (no lazy loading) */}
      {immediateRoutes.map(({ path, component }) =>
        createImmediateRoute(path, component)
      )}

      {/* Step 2: Public routes (with lazy loading) */}
      {publicRoutes.map(({ path, component }) =>
        createPublicRoute(path, component)
      )}

      {/* Step 3: Admin routes (with protection + lazy loading) */}
      {adminRoutes.map(({ path, component }) =>
        createAdminRoute(path, component)
      )}

      {/* Step 4: Admin Specific Dashboard routes (with protection + lazy loading) */}
      {adSpecificRoutes.map(({ path, component }) =>
        createAdSpecificRoute(path, component)
      )}

      {/* Step 4: Fallback route */}
      {createImmediateRoute(fallbackRoute.path, fallbackRoute.component)}
    </Routes>
  );
};

export default App;
