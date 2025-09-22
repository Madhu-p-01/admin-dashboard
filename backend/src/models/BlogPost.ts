export interface BlogPost {
  post_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author: string;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  status: BlogStatus;
  is_featured: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostRequest {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  status?: BlogStatus;
  isFeatured?: boolean;
  publishedAt?: string;
}

export interface UpdateBlogPostRequest {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  status?: BlogStatus;
  isFeatured?: boolean;
  publishedAt?: string;
}

export interface BlogQueryParams {
  status?: BlogStatus;
  featured?: boolean;
  author?: string;
  tags?: string;
  page?: number;
  limit?: number;
  search?: string;
  sort?: BlogSortOrder;
}

export type BlogStatus = 'published' | 'draft' | 'archived';
export type BlogSortOrder = 'latest' | 'oldest' | 'featured';

export interface BlogPostResponse extends ApiResponse<BlogPost> {}
export interface BlogPostsResponse extends ApiResponse<PaginatedResponse<BlogPost>> {}

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

export const BLOG_POST_COLUMNS = [
  'post_id',
  'title',
  'slug',
  'content',
  'excerpt',
  'featured_image',
  'author',
  'tags',
  'meta_title',
  'meta_description',
  'status',
  'is_featured',
  'published_at',
  'created_at',
  'updated_at'
].join(',');