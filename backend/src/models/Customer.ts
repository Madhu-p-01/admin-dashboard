export interface Customer {
  customer_id: string;
  name: string;
  email: string;
  phone?: string;
  loyalty_points: number;
  status: CustomerStatus;
  orders_count: number;
  total_spent: number;
  created_at: Date;
  updated_at: Date;
  preferences?: any;
}

export interface CustomerAddress {
  address_id: string;
  customer_id: string;
  label: string;
  name: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: Date;
}

export interface CustomerOrder {
  order_id: string;
  customer_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerLoyaltyHistory {
  transaction_id: string;
  customer_id: string;
  type: 'add' | 'redeem';
  points: number;
  reason: string;
  created_at: Date;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  phone?: string;
  status?: CustomerStatus;
}

export interface CustomerQueryParams {
  status?: CustomerStatus;
  page?: number;
  limit?: number;
  sort?: CustomerSortOrder;
  search?: string;
  minOrders?: number;
  minSpent?: number;
  segment?: CustomerSegment;
}

export interface CustomerStatusUpdateRequest {
  status: CustomerStatus;
  reason?: string;
}

export interface LoyaltyPointsRequest {
  points: number;
  reason: string;
}

export interface CustomerSegmentParams {
  type?: CustomerSegment;
  minOrders?: number;
  maxOrders?: number;
  minSpent?: number;
  maxSpent?: number;
  loyaltyTier?: string;
}

export interface CustomerExportParams {
  format: 'csv' | 'excel';
  status?: CustomerStatus;
  minSpent?: number;
  maxSpent?: number;
  dateFrom?: string;
  dateTo?: string;
}

export type CustomerStatus = 'active' | 'inactive' | 'blacklisted' | 'suspended';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type CustomerSortOrder = 'latest' | 'oldest' | 'name_asc' | 'name_desc' | 'total_spent_desc' | 'total_spent_asc' | 'orders_desc';
export type CustomerSegment = 'loyal' | 'new' | 'inactive' | 'high_value' | 'at_risk';

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

export interface CustomerResponse extends ApiResponse<Customer> {}
export interface CustomersResponse extends ApiResponse<PaginatedResponse<Customer>> {}
export interface CustomerOrdersResponse extends ApiResponse<CustomerOrder[]> {}
export interface CustomerAddressesResponse extends ApiResponse<CustomerAddress[]> {}

export const CUSTOMER_COLUMNS = [
  'c.customer_id',
  'c.name',
  'c.email',
  'c.phone',
  'c.loyalty_points',
  'c.created_at',
  'c.updated_at',
  'c.preferences',
  'COALESCE(order_stats.orders_count, 0) as orders_count',
  'COALESCE(order_stats.total_spent, 0) as total_spent',
  `CASE 
    WHEN c.customer_id IN (SELECT customer_id FROM blacklisted_customers) THEN 'blacklisted'
    WHEN c.customer_id IN (SELECT customer_id FROM suspended_customers) THEN 'suspended'
    WHEN COALESCE(order_stats.orders_count, 0) = 0 AND c.created_at < NOW() - INTERVAL '30 days' THEN 'inactive'
    ELSE 'active'
  END as status`
].join(',');

export const CUSTOMER_ADDRESS_COLUMNS = [
  'address_id',
  'customer_id',
  'name as label',
  'phone',
  'line1',
  'line2',
  'city',
  'state',
  'postal_code',
  'country',
  'is_default',
  'created_at'
].join(',');

export const CUSTOMER_ORDER_COLUMNS = [
  'order_id',
  'customer_id',
  'status',
  'total_amount',
  'created_at',
  'updated_at'
].join(',');