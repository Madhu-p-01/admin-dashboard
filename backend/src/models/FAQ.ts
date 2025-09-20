export interface FAQ {
  faq_id: string;
  question: string;
  answer: string;
  category?: string;
  status: FAQStatus;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  category?: string;
  status?: FAQStatus;
  displayOrder?: number;
}

export interface UpdateFAQRequest {
  question?: string;
  answer?: string;
  category?: string;
  status?: FAQStatus;
  displayOrder?: number;
}

export interface FAQQueryParams {
  status?: FAQStatus;
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface BulkFAQDisplayOrderUpdate {
  faqId: string;
  displayOrder: number;
}

export type FAQStatus = 'active' | 'inactive';

export interface FAQResponse extends ApiResponse<FAQ> {}
export interface FAQsResponse extends ApiResponse<PaginatedResponse<FAQ>> {}

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

export const FAQ_COLUMNS = [
  'faq_id',
  'question',
  'answer',
  'category',
  'status',
  'display_order',
  'created_at',
  'updated_at'
].join(',');