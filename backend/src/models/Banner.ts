export interface Banner {
  banner_id: string;
  title: string;
  image_url: string;
  link?: string;
  position: BannerPosition;
  status: BannerStatus;
  start_date?: string;
  end_date?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBannerRequest {
  title: string;
  imageUrl: string;
  link?: string;
  position?: BannerPosition;
  status?: BannerStatus;
  startDate?: string;
  endDate?: string;
  displayOrder?: number;
}

export interface UpdateBannerRequest {
  title?: string;
  imageUrl?: string;
  link?: string;
  position?: BannerPosition;
  status?: BannerStatus;
  startDate?: string;
  endDate?: string;
  displayOrder?: number;
}

export interface BannerQueryParams {
  status?: BannerStatus;
  position?: BannerPosition;
  page?: number;
  limit?: number;
}

export interface BulkBannerUpdate {
  bannerId: string;
  displayOrder?: number;
  status?: BannerStatus;
}

export type BannerPosition = 'homepage_top' | 'homepage_middle' | 'homepage_bottom' | 'category_top' | 'category_sidebar' | 'product_detail';
export type BannerStatus = 'active' | 'inactive' | 'draft';

export interface BannerResponse extends ApiResponse<Banner> {}
export interface BannersResponse extends ApiResponse<PaginatedResponse<Banner>> {}

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

export const BANNER_COLUMNS = [
  'banner_id',
  'title',
  'image_url',
  'link',
  'position',
  'status',
  'start_date',
  'end_date',
  'display_order',
  'created_at',
  'updated_at'
].join(',');