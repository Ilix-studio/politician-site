// Interfaces based on your backend model and controllers
export interface PressImage {
  src: string;
  alt: string;
  cloudinaryPublicId: string;
}

export interface Press {
  _id: string;
  title: string;
  source: string;
  date: string;
  images: PressImage[];
  category:
    | {
        _id: string;
        name: string;
        type: string;
      }
    | string;
  author: string;
  readTime: string;
  content: string;
  excerpt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  current: number;
  pages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Query parameters for getPress
export interface PressQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "date" | "title" | "author" | "readTime";
  sortOrder?: "asc" | "desc";
}

// Response types
export interface PressListResponse {
  success: boolean;
  data: {
    press: Press[];
    pagination: PaginationData;
  };
}

export interface PressResponse {
  success: boolean;
  data: Press;
  message?: string;
}

export interface PressUploadResponse {
  success: boolean;
  message: string;
  data: {
    press: Press;
    imagesCount?: number;
  };
}

export interface PressDeleteResponse {
  success: boolean;
  message: string;
}

// Create/Update data types
export interface PressCreateData {
  title: string;
  source: string;
  date?: string;
  images: PressImage[];
  category: string;
  author: string;
  readTime: string;
  content: string;
  excerpt: string;
}

export interface PressUpdateData {
  title?: string;
  source?: string;
  date?: string;
  images?: PressImage[];
  category?: string;
  author?: string;
  readTime?: string;
  content?: string;
  excerpt?: string;
  isActive?: boolean;
}

export interface PressUploadData {
  title: string;
  source: string;
  date?: string;
  category: string;
  author: string;
  readTime: string;
  content: string;
  excerpt: string;
  alt?: string;
}

export interface PressMultipleUploadData {
  title: string;
  source: string;
  date?: string;
  category: string;
  author: string;
  readTime: string;
  content: string;
  excerpt: string;
  altTexts?: string | string[];
}
