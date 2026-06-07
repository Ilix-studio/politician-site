// adminApi.ts
import { apiSlice } from "./apiSlice";
import { User, loginSuccess, logout } from "../slices/authSlice";
import { USER_ROLES } from "@/types/editor.types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    token: string;
    role?: string; // present if backend is updated; optional otherwise
  };
}

export const adminApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    loginAdmin: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            const userData: User = {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              // Use backend role if provided; otherwise this endpoint is
              // super-admin only, so default to SUPER_ADMIN.
              role: (data.data.role as User["role"]) ?? USER_ROLES.SUPER_ADMIN,
            };
            dispatch(loginSuccess({ user: userData, token: data.data.token }));
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    logoutAdmin: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
});

export const { useLoginAdminMutation, useLogoutAdminMutation } = adminApi;
