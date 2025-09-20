export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BulkOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: Array<{
    id: string;
    error: string;
  }>;
}

export type ContentStatus = 'draft' | 'published' | 'archived';
export type VisibilityType = 'public' | 'private' | 'members_only';

export interface ContentMetadata {
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };
  analytics?: {
    trackingId?: string;
    category?: string;
  };
  [key: string]: any;
}

export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContentStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FileUploadInfo {
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimeType: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ProcessedImage extends FileUploadInfo {
  dimensions: ImageDimensions;
  thumbnails?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}