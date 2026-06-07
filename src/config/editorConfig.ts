import { lazy } from "react";

// ── Editor login + dashboard ──────────────────────────────
const EditorLogin = lazy(() => import("@/mainComponents/EditorX/EditorLogin"));
const EditorDashboard = lazy(
  () => import("@/mainComponents/EditorX/EditorDashboard"),
);

// Editor login is public (like /admin/login)
export const editorPublicRoutes = [
  { path: "/editor/login", component: EditorLogin },
];

// Editor dashboards — same lazy components admins use.
export const editorRoutesDash = [
  { path: "/editor/dashboard", component: EditorDashboard },
];
