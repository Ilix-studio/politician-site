import { apiSlice } from "./apiSlice";
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

const DEFAULT_FOLDER = "dynamic-images-for-politician";

export const cloudinaryApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    generateSignature: builder.mutation<
      CloudinarySignatureResponse,
      { folder?: string }
    >({
      query: ({ folder }) => ({
        url: "/cloudinary/signature",
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
          url: "/cloudinary/upload-single",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { folder = DEFAULT_FOLDER }) => [
        { type: "CloudinaryFolder", id: folder },
      ],
    }),

    uploadMultipleImages: builder.mutation<
      CloudinaryUploadMultipleResponse,
      CloudinaryUploadMultipleRequest
    >({
      query: ({ files, folder, altTexts }) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));
        if (folder) formData.append("folder", folder);
        if (altTexts) formData.append("altTexts", JSON.stringify(altTexts));

        return {
          url: "/cloudinary/upload-multiple",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { folder = DEFAULT_FOLDER }) => [
        { type: "CloudinaryFolder", id: folder },
      ],
    }),

    deleteMultipleImages: builder.mutation<
      CloudinaryDeleteMultipleResponse,
      CloudinaryDeleteMultipleRequest
    >({
      query: ({ publicIds }) => ({
        url: "/cloudinary/delete-multiple",
        method: "DELETE",
        body: { publicIds },
      }),
      invalidatesTags: ["CloudinaryImage", "CloudinaryFolder"],
    }),

    deleteSingleImage: builder.mutation<CloudinaryDeleteSingleResponse, string>(
      {
        query: (publicId) => ({
          url: `/cloudinary/${publicId}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, publicId) => [
          { type: "CloudinaryImage", id: publicId },
          "CloudinaryFolder",
        ],
      },
    ),

    getImageDetails: builder.query<CloudinaryImageDetailsResponse, string>({
      query: (publicId) => `/cloudinary/details/${publicId}`,
      providesTags: (_result, _error, publicId) => [
        { type: "CloudinaryImage", id: publicId },
      ],
    }),

    listImagesInFolder: builder.query<
      CloudinaryListFolderResponse,
      { folderName: string; maxResults?: number }
    >({
      query: ({ folderName, maxResults = 50 }) =>
        `/cloudinary/folder/${folderName}?maxResults=${maxResults}`,
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
