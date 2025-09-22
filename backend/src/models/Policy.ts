export interface Policy {
  policy_id: string;
  title: string;
  content: string;
  policy_type?: PolicyType;
  status: PolicyStatus;
  version: string;
  effective_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePolicyRequest {
  title: string;
  content: string;
  policyType?: PolicyType;
  status?: PolicyStatus;
  version?: string;
  effectiveDate?: string;
}

export interface UpdatePolicyRequest {
  title?: string;
  content?: string;
  policyType?: PolicyType;
  status?: PolicyStatus;
  version?: string;
  effectiveDate?: string;
}

export interface PolicyQueryParams {
  policyType?: PolicyType;
  status?: PolicyStatus;
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreatePolicyVersionRequest {
  title?: string;
  content?: string;
  version?: string;
  effectiveDate?: string;
}

export type PolicyType = 'return' | 'privacy' | 'shipping' | 'terms' | 'refund' | 'other';
export type PolicyStatus = 'published' | 'draft' | 'archived';

export interface PolicyResponse extends ApiResponse<Policy> {}
export interface PoliciesResponse extends ApiResponse<PaginatedResponse<Policy>> {}

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

export const POLICY_COLUMNS = [
  'policy_id',
  'title',
  'content',
  'policy_type',
  'status',
  'version',
  'effective_date',
  'created_at',
  'updated_at'
].join(',');