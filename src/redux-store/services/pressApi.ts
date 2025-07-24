// src/redux-store/services/pressApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../lib/apiConfig";
import {
  DeletePressResponse,
  PressCategoriesResponse,
  PressCreateData,
  PressListResponse,
  PressQueryParams,
  PressResponse,
  PressUpdateData,
} from "@/types/press.types";

export const pressApi = createApi({
  reducerPath: "pressApi",
  baseQuery,
  tagTypes: ["Press", "PressCategories"],
  endpoints: (builder) => ({
    // Get all press articles
    getPress: builder.query<PressListResponse, PressQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            searchParams.append(key, value.toString());
          }
        });

        return {
          url: `/press${
            searchParams.toString() ? `?${searchParams.toString()}` : ""
          }`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.press.map(({ _id }) => ({
                type: "Press" as const,
                id: _id,
              })),
              { type: "Press", id: "LIST" },
            ]
          : [{ type: "Press", id: "LIST" }],
    }),

    // Get single press article by ID
    getPressById: builder.query<PressResponse, string>({
      query: (id) => ({
        url: `/press/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Press", id }],
    }),

    // Get press categories
    getPressCategories: builder.query<PressCategoriesResponse, void>({
      query: () => ({
        url: "/press/categories",
        method: "GET",
      }),
      providesTags: [{ type: "PressCategories", id: "LIST" }],
    }),

    // Upload press article with image
    uploadPressArticle: builder.mutation<PressResponse, { formData: FormData }>(
      {
        query: ({ formData }) => ({
          url: "/press/upload",
          method: "POST",
          body: formData,
        }),
        invalidatesTags: [{ type: "Press", id: "LIST" }],
      }
    ),

    // Create press article with existing image URL
    createPressArticle: builder.mutation<PressResponse, PressCreateData>({
      query: (pressData) => ({
        url: "/press",
        method: "POST",
        body: pressData,
      }),
      invalidatesTags: [{ type: "Press", id: "LIST" }],
    }),

    // Update press article
    updatePressArticle: builder.mutation<
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
        { type: "Press", id: "LIST" },
      ],
    }),

    // Delete press article
    deletePressArticle: builder.mutation<DeletePressResponse, string>({
      query: (id) => ({
        url: `/press/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Press", id },
        { type: "Press", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPressQuery,
  useGetPressByIdQuery,
  useGetPressCategoriesQuery,
  useUploadPressArticleMutation,
  useCreatePressArticleMutation,
  useUpdatePressArticleMutation,
  useDeletePressArticleMutation,
} = pressApi;
