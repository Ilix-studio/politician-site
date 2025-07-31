// store/slices/cloudinaryApiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CloudinarySignatureResponse,
  CloudinaryUploadSingleRequest,
  CloudinaryUploadSingleResponse,
  CloudinaryUploadMultipleRequest,
  CloudinaryUploadMultipleResponse,
  CloudinaryDeleteMultipleRequest,
  CloudinaryDeleteMultipleResponse,
  CloudinaryDeleteSingleResponse,
  CloudinaryImageDetailsResponse,
  CloudinaryListFolderResponse,
} from "../../types/cloudinary.types";

export const cloudinaryApi = createApi({
  reducerPath: "cloudinaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/cloudinary",
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["CloudinaryImage", "CloudinaryFolder"],
  endpoints: (builder) => ({
    generateSignature: builder.mutation<
      CloudinarySignatureResponse,
      { folder?: string }
    >({
      query: ({ folder }) => ({
        url: "/signature",
        method: "POST",
        body: { folder },
      }),
    }),

    uploadSingleImage: builder.mutation<
      CloudinaryUploadSingleResponse,
      CloudinaryUploadSingleRequest
    >({
      query: ({ file, folder, alt }) => {
        const formData = new FormData();
        formData.append("image", file);
        if (folder) formData.append("folder", folder);
        if (alt) formData.append("alt", alt);

        return {
          url: "/upload-single",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (
        _result,
        _error,
        { folder = "dynamic-images-for-politician" }
      ) => [{ type: "CloudinaryFolder", id: folder }],
    }),

    uploadMultipleImages: builder.mutation<
      CloudinaryUploadMultipleResponse,
      CloudinaryUploadMultipleRequest
    >({
      query: ({ files, folder, altTexts }) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("images", file);
        });
        if (folder) formData.append("folder", folder);
        if (altTexts) formData.append("altTexts", JSON.stringify(altTexts));

        return {
          url: "/upload-multiple",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (
        _result,
        _error,
        { folder = "dynamic-images-for-politician" }
      ) => [{ type: "CloudinaryFolder", id: folder }],
    }),

    deleteMultipleImages: builder.mutation<
      CloudinaryDeleteMultipleResponse,
      CloudinaryDeleteMultipleRequest
    >({
      query: ({ publicIds }) => ({
        url: "/delete-multiple",
        method: "DELETE",
        body: { publicIds },
      }),
      invalidatesTags: ["CloudinaryImage", "CloudinaryFolder"],
    }),

    deleteSingleImage: builder.mutation<CloudinaryDeleteSingleResponse, string>(
      {
        query: (publicId) => ({
          url: `/${publicId}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, publicId) => [
          { type: "CloudinaryImage", id: publicId },
          "CloudinaryFolder",
        ],
      }
    ),

    getImageDetails: builder.query<CloudinaryImageDetailsResponse, string>({
      query: (publicId) => `/details/${publicId}`,
      providesTags: (_result, _error, publicId) => [
        { type: "CloudinaryImage", id: publicId },
      ],
    }),

    listImagesInFolder: builder.query<
      CloudinaryListFolderResponse,
      { folderName: string; maxResults?: number }
    >({
      query: ({ folderName, maxResults = 50 }) =>
        `/folder/${folderName}?maxResults=${maxResults}`,
      providesTags: (result, _error, { folderName }) => [
        { type: "CloudinaryFolder", id: folderName },
        ...(result?.data.images.map(({ publicId }) => ({
          type: "CloudinaryImage" as const,
          id: publicId,
        })) || []),
      ],
    }),
  }),
});

export const {
  useGenerateSignatureMutation,
  useUploadSingleImageMutation,
  useUploadMultipleImagesMutation,
  useDeleteMultipleImagesMutation,
  useDeleteSingleImageMutation,
  useGetImageDetailsQuery,
  useLazyGetImageDetailsQuery,
  useListImagesInFolderQuery,
  useLazyListImagesInFolderQuery,
} = cloudinaryApi;
