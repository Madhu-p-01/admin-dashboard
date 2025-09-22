export interface CMSPage {
  page_id: string;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  status: PageStatus;
  created_at: string;
  updated_at: string;
}

export interface CreatePageRequest {
  title: string;
  slug?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: PageStatus;
}

export interface UpdatePageRequest {
  title?: string;
  slug?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: PageStatus;
}

export interface PageQueryParams {
  status?: PageStatus;
  page?: number;
  limit?: number;
  search?: string;
}

export type PageStatus = 'published' | 'draft' | 'archived';

export interface PageResponse extends ApiResponse<CMSPage> {}
export interface PagesResponse extends ApiResponse<PaginatedResponse<CMSPage>> {}

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

export const CMS_PAGE_COLUMNS = [
  'page_id',
  'title',
  'slug',
  'content',
  'meta_title',
  'meta_description',
  'status',
  'created_at',
  'updated_at'
].join(',');