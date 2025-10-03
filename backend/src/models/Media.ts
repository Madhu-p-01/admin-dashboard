export interface MediaItem {
  media_id: string;
  filename: string;
  original_filename: string;
  url: string;
  file_type: FileType;
  file_size?: number;
  mime_type?: string;
  alt_text?: string;
  description?: string;
  uploaded_by?: string;
  created_at: string;
}

export interface UploadMediaRequest {
  fileName: string;
  originalFilename?: string;
  url: string;
  fileType: string;
  fileSize?: number;
  mimeType?: string;
  altText?: string;
  description?: string;
  uploadedBy?: string;
  category?: MediaCategory;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface CreateMediaRequest {
  fileName: string;
  originalFilename?: string;
  url: string;
  fileType: FileType;
  fileSize?: number;
  mimeType?: string;
  altText?: string;
  description?: string;
  uploadedBy?: string;
}

export interface UpdateMediaRequest {
  fileName?: string;
  altText?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  category?: MediaCategory;
}

export interface MediaQueryParams {
  category?: MediaCategory;
  mimeType?: string;
  tag?: string;
  fileType?: FileType;
  uploadedBy?: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'filename' | 'created_at' | 'file_size';
  sortOrder?: 'asc' | 'desc';
  sort?: 'latest' | 'oldest' | 'name' | 'size';
}

export interface BulkMediaUpdate {
  mediaIds: string[];
  tags?: string[];
  altText?: string;
  category?: MediaCategory;
}

export type MediaCategory = 'product' | 'banner' | 'blog' | 'general' | 'avatar';
export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';

export interface MediaResponse extends ApiResponse<MediaItem> {}
export interface MediaListResponse extends ApiResponse<PaginatedResponse<MediaItem>> {}

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

export const MEDIA_COLUMNS = [
  'media_id',
  'filename',
  'original_filename',
  'url',
  'file_type',
  'file_size',
  'mime_type',
  'alt_text',
  'description',
  'uploaded_by',
  'created_at'
].join(',');