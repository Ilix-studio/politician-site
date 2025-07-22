import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, handleApiError } from "../../lib/apiConfig";

// Types matching your Photo interface
export interface Photo {
  _id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  cloudinaryPublicId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface PhotoUploadData {
  title: string;
  category: string;
  date?: string;
  location?: string;
  description?: string;
}

export interface PhotoCreateData extends PhotoUploadData {
  src: string;
  cloudinaryPublicId: string;
}

export interface PhotosResponse {
  success: boolean;
  data: {
    photos: Photo[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface PhotoResponse {
  success: boolean;
  data: Photo;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface PhotoQuery {
  page?: number;
  limit?: number;
  category?: string;
  tags?: string | string[];
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export const photoApi = createApi({
  reducerPath: "photoApi",
  baseQuery,
  tagTypes: ["Photo", "Category"],
  endpoints: (builder) => ({
    // Get photos with pagination and filtering
    getPhotos: builder.query<PhotosResponse, PhotoQuery | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit)
          searchParams.append("limit", params.limit.toString());
        if (params?.category) searchParams.append("category", params.category);
        if (params?.search) searchParams.append("search", params.search);
        if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params?.sortOrder)
          searchParams.append("sortOrder", params.sortOrder);

        const queryString = searchParams.toString();
        return `/photos${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.photos.map(({ _id }) => ({
                type: "Photo" as const,
                id: _id,
              })),
              { type: "Photo", id: "LIST" },
            ]
          : [{ type: "Photo", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get single photo
    getPhoto: builder.query<PhotoResponse, string>({
      query: (id) => `/photos/${id}`,
      providesTags: (_, __, id) => [{ type: "Photo", id }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Upload photo with file
    uploadPhoto: builder.mutation<
      PhotoResponse,
      { file: File; data: PhotoUploadData }
    >({
      query: ({ file, data }) => {
        const formData = new FormData();
        formData.append("photo", file);

        // Append other data
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              formData.append(key, value.join(","));
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        return {
          url: "/photos/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Photo", "Category"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Create photo (with existing Cloudinary URL)
    createPhoto: builder.mutation<PhotoResponse, PhotoCreateData>({
      query: (data) => ({
        url: "/photos",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Photo", "Category"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Update photo
    updatePhoto: builder.mutation<
      PhotoResponse,
      { id: string; data: Partial<PhotoCreateData> }
    >({
      query: ({ id, data }) => ({
        url: `/photos/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Photo", id },
        "Photo",
        "Category",
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Delete photo
    deletePhoto: builder.mutation<DeleteResponse, string>({
      query: (id) => ({
        url: `/photos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Photo", "Category"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get categories
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "/photos/categories",
      providesTags: ["Category"],
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

export const {
  useGetPhotosQuery,
  useGetPhotoQuery,
  useUploadPhotoMutation,
  useCreatePhotoMutation,
  useUpdatePhotoMutation,
  useDeletePhotoMutation,
  useGetCategoriesQuery,
} = photoApi;
