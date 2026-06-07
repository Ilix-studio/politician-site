import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../lib/apiConfig";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Admin",
    "Category",
    "CloudinaryImage",
    "CloudinaryFolder",
    "ContactMessages",
    "ContactMessage",
    "Editor",
    "Photo",
    "Press",
    "Video",
    "VideoCategory",
    "VisitorCount",
    "VisitorStats",
  ],
  endpoints: () => ({}),
});
