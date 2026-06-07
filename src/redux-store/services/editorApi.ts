import { apiSlice } from "./apiSlice";
import { handleApiError } from "../../lib/apiConfig";
import { User, loginSuccess, logout } from "../slices/authSlice";

// ── Request payloads ────────────────────────────────────
export interface EditorLoginRequest {
  email: string;
  password: string;
}

export interface CreateEditorRequest {
  name: string;
  email: string;
}

// ── Domain entity (shape returned by GET /editor) ───────
export interface Editor {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Response shapes (derived from editorController.ts) ───
export interface EditorLoginResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string; // ROLES.EDITOR
    token: string;
  };
}

export interface EditorLogoutResponse {
  success: boolean;
  message: string;
}

export interface CreateEditorResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
  };
}

export interface GetEditorsResponse {
  success: boolean;
  count: number;
  data: Editor[];
}

export interface ToggleEditorStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    isActive: boolean;
  };
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export const editorApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // ── Public ──────────────────────────────────────────
    loginEditor: builder.mutation<EditorLoginResponse, EditorLoginRequest>({
      query: (credentials) => ({
        url: "/editor/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            // User type has no `role`; persist only supported fields.
            const userData: User = {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
            };
            dispatch(loginSuccess({ user: userData, token: data.data.token }));
          }
        } catch (error) {
          console.error("Editor login failed:", error);
        }
      },
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // ── Editor-authenticated ────────────────────────────
    logoutEditor: builder.mutation<EditorLogoutResponse, void>({
      query: () => ({
        url: "/editor/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (error) {
          console.error("Editor logout failed:", error);
        }
      },
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // ── Super-Admin only: editor management ─────────────
    createEditor: builder.mutation<CreateEditorResponse, CreateEditorRequest>({
      query: (data) => ({
        url: "/editor",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Editor", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    getEditors: builder.query<Editor[], void>({
      query: () => "/editor",
      transformResponse: (response: GetEditorsResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Editor" as const,
                id: _id,
              })),
              { type: "Editor", id: "LIST" },
            ]
          : [{ type: "Editor", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    resendEditorCredentials: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/editor/${id}/resend-credentials`,
        method: "POST",
      }),
      // No cache mutation: regenerates password, list shape unchanged.
      transformErrorResponse: (response) => handleApiError(response),
    }),

    toggleEditorStatus: builder.mutation<ToggleEditorStatusResponse, string>({
      query: (id) => ({
        url: `/editor/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Editor", id },
        { type: "Editor", id: "LIST" },
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    deleteEditor: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/editor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Editor", id },
        { type: "Editor", id: "LIST" },
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

export const {
  useLoginEditorMutation,
  useLogoutEditorMutation,
  useCreateEditorMutation,
  useGetEditorsQuery,
  useResendEditorCredentialsMutation,
  useToggleEditorStatusMutation,
  useDeleteEditorMutation,
} = editorApi;
