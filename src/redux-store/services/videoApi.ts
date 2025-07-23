import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, handleApiError } from "../../lib/apiConfig";
import {
  VideoUploadData,
  VideoCreateData,
  VideoUpdateData,
  VideoQueryParams,
  VideoResponse,
  VideosResponse,
  CategoriesResponse,
  DeleteVideoResponse,
} from "../../types/video.types";

// Create the Video API slice
export const videoApi = createApi({
  reducerPath: "videoApi",
  baseQuery,
  tagTypes: ["Video", "Category"],
  endpoints: (builder) => ({
    // Get all videos with filtering and pagination
    getVideos: builder.query<VideosResponse, VideoQueryParams>({
      query: (params) => {
        const queryString = new URLSearchParams();

        // Add all non-undefined parameters to query string
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryString.append(key, value.toString());
          }
        });

        return `/videos${queryString.toString() ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.videos.map(({ _id }) => ({
                type: "Video" as const,
                id: _id,
              })),
              { type: "Video", id: "LIST" },
            ]
          : [{ type: "Video", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get single video
    getVideo: builder.query<VideoResponse, string>({
      query: (id) => `/videos/${id}`,
      providesTags: (_, __, id) => [{ type: "Video", id }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get featured videos
    getFeaturedVideos: builder.query<VideosResponse, { limit?: number }>({
      query: ({ limit = 6 } = {}) => `/videos/featured?limit=${limit}`,
      providesTags: [{ type: "Video", id: "FEATURED" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Upload video with file
    uploadVideo: builder.mutation<
      VideoResponse,
      { videoFile: File; thumbnailFile?: File; data: VideoUploadData }
    >({
      query: ({ videoFile, thumbnailFile, data }) => {
        const formData = new FormData();
        formData.append("video", videoFile);

        if (thumbnailFile) {
          formData.append("thumbnail", thumbnailFile);
        }

        // Append other data
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              formData.append(key, value.join(","));
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        return {
          url: "/videos/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Video", "Category"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Create video (with existing Cloudinary URLs)
    createVideo: builder.mutation<VideoResponse, VideoCreateData>({
      query: (data) => ({
        url: "/videos",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Video", "Category"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Update video
    updateVideo: builder.mutation<
      VideoResponse,
      { id: string; data: VideoUpdateData }
    >({
      query: ({ id, data }) => ({
        url: `/videos/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Video", id },
        "Video",
        "Category",
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Delete video
    deleteVideo: builder.mutation<DeleteVideoResponse, string>({
      query: (id) => ({
        url: `/videos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Video", "Category"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Toggle featured status
    toggleVideoFeatured: builder.mutation<VideoResponse, string>({
      query: (id) => ({
        url: `/videos/${id}/featured`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Video", id },
        { type: "Video", id: "FEATURED" },
        "Video",
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get video categories
    getVideoCategories: builder.query<CategoriesResponse, void>({
      query: () => "/videos/categories",
      providesTags: ["Category"],
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

// Export hooks for using the API endpoints
export const {
  useGetVideosQuery,
  useGetVideoQuery,
  useGetFeaturedVideosQuery,
  useUploadVideoMutation,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useToggleVideoFeaturedMutation,
  useGetVideoCategoriesQuery,
} = videoApi;
