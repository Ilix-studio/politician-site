// Mirrors backend ROLES (server: src/constants/roles.ts).
// Keep these literals in sync with the API's ROLES constant.
export type UserRole = "Super-Admin" | "Editor";

export const USER_ROLES = {
  SUPER_ADMIN: "Super-Admin",
  EDITOR: "Editor",
} as const;
