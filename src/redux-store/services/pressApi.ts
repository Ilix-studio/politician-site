import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, handleApiError } from "../../lib/apiConfig";
import {
  PressCreateData,
  PressDeleteResponse,
  PressListResponse,
  PressMultipleUploadData,
  PressQueryParams,
  PressResponse,
  PressUpdateData,
  PressUploadData,
  PressUploadResponse,
} from "@/types/press.types";

export const pressApi = createApi({
  reducerPath: "pressApi",
  baseQuery,
  tagTypes: ["Press"],
  endpoints: (builder) => ({
    // PUBLIC ENDPOINTS

    // Get all press articles with pagination and filtering
    getPress: builder.query<PressListResponse, PressQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value.toString());
          }
        });

        return `/press${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;
      },
      providesTags: (result) => [
        "Press",
        ...(result?.data.press || []).map(({ _id }) => ({
          type: "Press" as const,
          id: _id,
        })),
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get single press article by ID
    getPressById: builder.query<PressResponse, string>({
      query: (id) => `/press/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Press", id }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get press articles by category
    getPressByCategory: builder.query<
      PressListResponse,
      { category: string; limit?: number }
    >({
      query: ({ category, limit = 10 }) => {
        const searchParams = new URLSearchParams();
        if (limit) searchParams.append("limit", limit.toString());

        return `/press/category/${category}${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;
      },
      providesTags: (_result, _error, { category }) => [
        { type: "Press", id: `category-${category}` },
        "Press",
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Search press articles
    searchPress: builder.query<
      PressListResponse,
      { search: string; limit?: number }
    >({
      query: ({ search, limit = 10 }) => {
        const searchParams = new URLSearchParams();
        searchParams.append("search", search);
        if (limit) searchParams.append("limit", limit.toString());

        return `/press/search?${searchParams.toString()}`;
      },
      providesTags: ["Press"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // PROTECTED ENDPOINTS (Admin only)

    // Create press article with existing image URLs
    createPress: builder.mutation<PressResponse, PressCreateData>({
      query: (data) => ({
        url: "/press",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Press"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Upload single press article with image file
    uploadPress: builder.mutation<
      PressUploadResponse,
      { file: File; data: PressUploadData }
    >({
      query: ({ file, data }) => {
        const formData = new FormData();
        formData.append("image", file);

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        return {
          url: "/press/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Press"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Upload press article with multiple images
    uploadMultiplePress: builder.mutation<
      PressUploadResponse,
      { files: File[]; data: PressMultipleUploadData }
    >({
      query: ({ files, data }) => {
        const formData = new FormData();

        files.forEach((file) => {
          formData.append("images", file);
        });

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === "altTexts" && Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        return {
          url: "/press/upload-multiple",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Press"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Update press article
    updatePress: builder.mutation<
      PressResponse,
      { id: string; data: PressUpdateData }
    >({
      query: ({ id, data }) => ({
        url: `/press/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Press", id },
        "Press",
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Delete press article
    deletePress: builder.mutation<PressDeleteResponse, string>({
      query: (id) => ({
        url: `/press/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Press", id },
        "Press",
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

// Export hooks for using the API endpoints
export const {
  // Public endpoints
  useGetPressQuery,
  useGetPressByIdQuery,
  useGetPressByCategoryQuery,
  useSearchPressQuery,

  // Admin endpoints
  useCreatePressMutation,
  useUploadPressMutation,
  useUploadMultiplePressMutation,
  useUpdatePressMutation,
  useDeletePressMutation,
} = pressApi;
