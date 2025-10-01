// Analytics Types and Interfaces

export interface SalesOverview {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  currency: string;
  breakdown: SalesBreakdown[];
}

export interface SalesBreakdown {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductPerformance {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
  profit?: number;
  conversionRate?: number;
}

export interface OrderInsights {
  totalOrders: number;
  pending: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
  avgFulfillmentTime: string;
  orderStatusDistribution: OrderStatusDistribution[];
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface CustomerInsights {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  loyalCustomers: number;
  churnRate: number;
  avgLifetimeValue: number;
  customerSegments: CustomerSegment[];
}

export interface CustomerSegment {
  segment: string;
  count: number;
  percentage: number;
  avgOrderValue: number;
}

export interface InventoryInsights {
  totalProducts: number;
  totalValue: number;
  lowStock: LowStockItem[];
  outOfStock: OutOfStockItem[];
  topSelling: TopSellingItem[];
  slowMoving: SlowMovingItem[];
}

export interface LowStockItem {
  productId: string;
  name: string;
  stock: number;
  minThreshold: number;
  category: string;
}

export interface OutOfStockItem {
  productId: string;
  name: string;
  stock: number;
  lastSold: string;
  category: string;
}

export interface TopSellingItem {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
  category: string;
}

export interface SlowMovingItem {
  productId: string;
  name: string;
  stock: number;
  daysSinceLastSale: number;
  category: string;
}

export interface CampaignPerformance {
  campaignId: string;
  name: string;
  sent: number;
  openRate: number;
  clickRate: number;
  conversions: number;
  revenueGenerated: number;
  cost: number;
  roi: number;
}

export interface MarketRevenue {
  market: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  growth: number;
}

export interface RefundsReport {
  totalRefunds: number;
  amountRefunded: number;
  avgRefundAmount: number;
  reasons: RefundReasons;
  trends: RefundTrend[];
}

export interface RefundReasons {
  size_issue: number;
  damaged: number;
  wrong_item: number;
  not_as_described: number;
  other: number;
}

export interface RefundTrend {
  date: string;
  count: number;
  amount: number;
}

export interface TrafficInsights {
  visits: number;
  uniqueVisitors: number;
  cartAdditions: number;
  ordersPlaced: number;
  conversionRate: number;
  bounceRate: number;
  avgSessionDuration: string;
  topPages: TopPage[];
  trafficSources: TrafficSource[];
}

export interface TopPage {
  page: string;
  visits: number;
  conversions: number;
  conversionRate: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
  conversions: number;
  conversionRate: number;
}

export interface AnalyticsQueryParams {
  from?: string;
  to?: string;
  groupBy?: 'day' | 'week' | 'month' | 'year';
  sort?: 'revenue' | 'orders' | 'units' | 'growth' | 'top_selling';
  limit?: number;
  category?: string;
  market?: string;
  campaignId?: string;
}

export interface ExportParams {
  report: 'sales' | 'products' | 'orders' | 'customers' | 'inventory' | 'campaigns' | 'markets' | 'refunds' | 'traffic';
  format: 'csv' | 'excel' | 'json';
  from?: string;
  to?: string;
  filters?: Record<string, any>;
}

export interface DashboardOverview {
  sales: {
    today: number;
    yesterday: number;
    thisWeek: number;
    lastWeek: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  orders: {
    today: number;
    yesterday: number;
    thisWeek: number;
    lastWeek: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    growth: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
  conversion: {
    rate: number;
    trend: 'up' | 'down' | 'stable';
  };
}

// Constants
export const ANALYTICS_GROUP_BY_OPTIONS = ['day', 'week', 'month', 'year'] as const;
export const ANALYTICS_SORT_OPTIONS = ['revenue', 'orders', 'units', 'growth'] as const;
export const EXPORT_FORMATS = ['csv', 'excel', 'json'] as const;
export const REPORT_TYPES = ['sales', 'products', 'orders', 'customers', 'inventory', 'campaigns', 'markets', 'refunds', 'traffic'] as const;

export type GroupByOption = typeof ANALYTICS_GROUP_BY_OPTIONS[number];
export type SortOption = typeof ANALYTICS_SORT_OPTIONS[number] | 'top_selling';
export type ExportFormat = typeof EXPORT_FORMATS[number];
export type ReportType = typeof REPORT_TYPES[number];
