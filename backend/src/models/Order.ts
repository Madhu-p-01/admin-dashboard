// Order Management Types and Interfaces

export interface Order {
  order_id: string;
  customer_id: string;
  status: OrderStatus;
  total_amount: number;
  discount_applied?: string;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  order_item_id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Payment {
  payment_id: string;
  order_id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  amount: number;
  created_at: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  pincode: string;
  city?: string;
  state?: string;
  country?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentMethod = 'COD' | 'UPI' | 'Card' | 'Wallet';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Request/Response Types
export interface CreateOrderRequest {
  customer_id: string;
  items: CreateOrderItemRequest[];
  shipping_address: ShippingAddress;
  discount_code?: string;
  payment_method: PaymentMethod;
}

export interface CreateOrderItemRequest {
  product_id: string;
  variant_id?: string;
  quantity: number;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  shipping_address?: ShippingAddress;
  notes?: string;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customer_id?: string;
  date_from?: string;
  date_to?: string;
  sort?: OrderSortOrder;
  search?: string;
  min_amount?: number;
  max_amount?: number;
}

export type OrderSortOrder = 'latest' | 'oldest' | 'amount_asc' | 'amount_desc' | 'status' | 'date_desc' | 'date_asc';

export interface OrderWithDetails extends Order {
  customer: {
    customer_id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: (OrderItem & {
    product: {
      product_id: string;
      name: string;
      images?: string[];
    };
    variant?: {
      variant_id: string;
      size?: string;
      color?: string;
    };
  })[];
  payment?: Payment;
  discount?: {
    discount_id: string;
    code: string;
    type: string;
    value: number;
  };
}

export interface OrderStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  confirmed_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  returned_orders: number;
  average_order_value: number;
}

export interface OrderAnalytics {
  daily_orders: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  status_distribution: Array<{
    status: OrderStatus;
    count: number;
    percentage: number;
  }>;
  top_products: Array<{
    product_id: string;
    product_name: string;
    quantity_sold: number;
    revenue: number;
  }>;
  customer_segments: Array<{
    segment: string;
    order_count: number;
    total_revenue: number;
  }>;
}

// Constants
export const ORDER_COLUMNS = `
  order_id,
  customer_id,
  status,
  total_amount,
  discount_applied,
  shipping_address,
  created_at,
  updated_at
`;

export const ORDER_ITEM_COLUMNS = `
  order_item_id,
  order_id,
  product_id,
  variant_id,
  quantity,
  price,
  created_at
`;

export const PAYMENT_COLUMNS = `
  payment_id,
  order_id,
  method,
  status,
  transaction_id,
  amount,
  created_at
`;

export const ORDER_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  'COD', 'UPI', 'Card', 'Wallet'
];

export const PAYMENT_STATUSES: PaymentStatus[] = [
  'pending', 'paid', 'failed', 'refunded'
];
