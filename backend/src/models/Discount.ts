export interface Discount {
  discount_id: string;
  code: string;
  type: DiscountType;
  value: number;
  min_purchase: number;
  max_discount?: number;
  start_date: Date;
  end_date: Date;
  usage_limit?: number;
  per_customer_limit: number;
  applicable_categories?: string[];
  applicable_products?: string[];
  status: DiscountStatus;
  usage_count: number;
  created_at: Date;
}


export interface CreateDiscountRequest {
  code: string;
  type: DiscountType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  perCustomerLimit?: number;
  applicableCategories?: string[];
  applicableProducts?: string[];
  status?: DiscountStatus;
}

export interface UpdateDiscountRequest {
  code?: string;
  type?: DiscountType;
  value?: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  perCustomerLimit?: number;
  applicableCategories?: string[];
  applicableProducts?: string[];
  status?: DiscountStatus;
}

export interface DiscountQueryParams {
  status?: DiscountStatus;
  type?: DiscountType;
  page?: number;
  limit?: number;
  search?: string;
  active?: string;
  expired?: string;
}

export interface DiscountStatusUpdateRequest {
  status: DiscountStatus;
}

export interface BulkCreateDiscountRequest {
  discounts: CreateDiscountRequest[];
}

export interface AutoDiscountRequest {
  rule: string;
  category?: string;
  startDate: string;
  endDate: string;
  value?: number;
  type?: DiscountType;
}

export interface DiscountExportParams {
  format: 'csv' | 'excel';
  status?: DiscountStatus;
  type?: DiscountType;
  dateFrom?: string;
  dateTo?: string;
}

export interface DiscountUsageStats {
  discountId: string;
  code: string;
  usageCount: number;
  usageLimit?: number;
  ordersApplied: {
    orderId: string;
    customer: string;
    discountValue: number;
    appliedAt: string;
  }[];
}

export type DiscountType = 'percentage' | 'fixed_amount' | 'free_shipping';
export type DiscountStatus = 'active' | 'inactive';

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
    totalPages?: number;
  };
}

export interface DiscountResponse extends ApiResponse<Discount> {}
export interface DiscountsResponse extends ApiResponse<PaginatedResponse<Discount>> {}

export const DISCOUNT_COLUMNS = [
  'd.discount_id',
  'd.code',
  'd.type',
  'd.value',
  'd.min_purchase',
  'd.max_discount',
  'd.start_date',
  'd.end_date',
  'd.usage_limit',
  'd.per_customer_limit',
  'd.applicable_categories',
  'd.applicable_products',
  'd.status',
  'd.usage_count',
  'd.created_at'
].join(',');

