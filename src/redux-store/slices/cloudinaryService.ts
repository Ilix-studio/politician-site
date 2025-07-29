// services/cloudinaryService.ts
import { API_CONFIG } from "@/lib/apiConfig";
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

const BASE_URL = `${API_CONFIG.BASE_URL}/cloudinary`;

class CloudinaryService {
  /**
   * Generate a signature for authenticated Cloudinary uploads
   */
  generateSignature = async (
    folder?: string
  ): Promise<CloudinarySignatureResponse> => {
    const response = await fetch(`${BASE_URL}/signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folder }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to generate signature");
    }

    return response.json();
  };

  /**
   * Upload single image to Cloudinary
   */
  uploadSingleImage = async ({
    file,
    folder,
    alt,
  }: CloudinaryUploadSingleRequest): Promise<CloudinaryUploadSingleResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    if (folder) formData.append("folder", folder);
    if (alt) formData.append("alt", alt);

    const response = await fetch(`${BASE_URL}/upload-single`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload image");
    }

    return response.json();
  };

  /**
   * Upload multiple images to Cloudinary
   */
  uploadMultipleImages = async ({
    files,
    folder,
    altTexts,
  }: CloudinaryUploadMultipleRequest): Promise<CloudinaryUploadMultipleResponse> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    if (folder) formData.append("folder", folder);
    if (altTexts) formData.append("altTexts", JSON.stringify(altTexts));

    const response = await fetch(`${BASE_URL}/upload-multiple`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload images");
    }

    return response.json();
  };

  /**
   * Delete multiple images from Cloudinary
   */
  deleteMultipleImages = async ({
    publicIds,
  }: CloudinaryDeleteMultipleRequest): Promise<CloudinaryDeleteMultipleResponse> => {
    const response = await fetch(`${BASE_URL}/delete-multiple`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicIds }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete images");
    }

    return response.json();
  };

  /**
   * Delete single image from Cloudinary
   */
  deleteSingleImage = async (
    publicId: string
  ): Promise<CloudinaryDeleteSingleResponse> => {
    const response = await fetch(`${BASE_URL}/${publicId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete image");
    }

    return response.json();
  };

  /**
   * Get image details from Cloudinary
   */
  getImageDetails = async (
    publicId: string
  ): Promise<CloudinaryImageDetailsResponse> => {
    const response = await fetch(`${BASE_URL}/details/${publicId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get image details");
    }

    return response.json();
  };

  /**
   * List images in a folder
   */
  listImagesInFolder = async (
    folderName: string,
    maxResults = 50
  ): Promise<CloudinaryListFolderResponse> => {
    const response = await fetch(
      `${BASE_URL}/folder/${folderName}?maxResults=${maxResults}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to list folder images");
    }

    return response.json();
  };
}

export const cloudinaryService = new CloudinaryService();
