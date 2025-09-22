import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import {
  SalesOverview,
  ProductPerformance,
  OrderInsights,
  CustomerInsights,
  InventoryInsights,
  CampaignPerformance,
  MarketRevenue,
  RefundsReport,
  TrafficInsights,
  DashboardOverview,
  AnalyticsQueryParams,
  ExportParams
} from '../models/Analytics';

export class AnalyticsController {
  
  // 1. Sales Overview
  static async getSalesOverview(req: Request, res: Response): Promise<void> {
    try {
      const { from, to, groupBy = 'day' }: AnalyticsQueryParams = req.query as any;

      // Set default date range if not provided
      const fromDate = from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const toDate = to || new Date().toISOString().split('T')[0];

      // Get total revenue and orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', fromDate)
        .lte('created_at', toDate);

      if (ordersError) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch sales data',
          error: ordersError.message
        });
        return;
      }

      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalOrders = orders?.length || 0;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Generate breakdown by date
      const breakdown = await generateSalesBreakdown(orders || [], groupBy);

      const salesOverview: SalesOverview = {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        currency: 'INR',
        breakdown
      };

      res.json({
        success: true,
        message: 'Sales overview fetched successfully',
        data: salesOverview
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // 2. Product Performance
  static async getProductPerformance(req: Request, res: Response): Promise<void> {
    try {
      const { from, to, sort = 'top_selling', limit = 20 }: AnalyticsQueryParams = req.query as any;

      const fromDate = from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const toDate = to || new Date().toISOString().split('T')[0];

      // Get order items with product details
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          price,
          products(name),
          orders(created_at)
        `)
        .gte('orders.created_at', fromDate)
        .lte('orders.created_at', toDate);

      if (itemsError) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch product performance data',
          error: itemsError.message
        });
        return;
      }

      // Aggregate product performance
      const productMap = new Map<string, ProductPerformance>();
      
      orderItems?.forEach((item: any) => {
        const productId = item.product_id;
        const existing = productMap.get(productId) || {
          productId,
          name: item.products.name,
          unitsSold: 0,
          revenue: 0
        };

        existing.unitsSold += item.quantity;
        existing.revenue += item.quantity * item.price;
        productMap.set(productId, existing);
      });

      let products = Array.from(productMap.values());

      // Sort products
      switch (sort) {
        case 'top_selling':
          products = products.sort((a, b) => b.unitsSold - a.unitsSold);
          break;
        case 'revenue':
          products = products.sort((a, b) => b.revenue - a.revenue);
          break;
        case 'growth':
          // This would require historical data comparison
          products = products.sort((a, b) => b.revenue - a.revenue);
          break;
      }

      products = products.slice(0, limit);

      res.json({
        success: true,
        message: 'Product performance fetched successfully',
        data: products
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // 3. Order Insights
  static async getOrderInsights(req: Request, res: Response): Promise<void> {
    try {
      const { from, to }: AnalyticsQueryParams = req.query as any;

      const fromDate = from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const toDate = to || new Date().toISOString().split('T')[0];

      // Get orders with status distribution
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('status, created_at, updated_at')
        .gte('created_at', fromDate)
        .lte('created_at', toDate);

      if (ordersError) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch order insights',
          error: ordersError.message
        });
        return;
      }

      const totalOrders = orders?.length || 0;
      const statusCounts = {
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        returned: 0
      };

      let totalFulfillmentTime = 0;
      let fulfilledOrders = 0;

      orders?.forEach((order: any) => {
        statusCounts[order.status as keyof typeof statusCounts]++;
        
        if (order.status === 'delivered' && order.updated_at) {
          const created = new Date(order.created_at);
          const updated = new Date(order.updated_at);
          const days = (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          totalFulfillmentTime += days;
          fulfilledOrders++;
        }
      });

      const avgFulfillmentTime = fulfilledOrders > 0 ? (totalFulfillmentTime / fulfilledOrders).toFixed(1) : '0';

      const orderStatusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        percentage: totalOrders > 0 ? parseFloat((count / totalOrders * 100).toFixed(1)) : 0
      }));

      const orderInsights: OrderInsights = {
        totalOrders,
        pending: statusCounts.pending,
        shipped: statusCounts.shipped,
        delivered: statusCounts.delivered,
        cancelled: statusCounts.cancelled,
        returned: statusCounts.returned,
        avgFulfillmentTime: `${avgFulfillmentTime} days`,
        orderStatusDistribution
      };

      res.json({
        success: true,
        message: 'Order insights fetched successfully',
        data: orderInsights
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // 4. Customer Insights
  static async getCustomerInsights(req: Request, res: Response): Promise<void> {
    try {
      const { from, to }: AnalyticsQueryParams = req.query as any;

      const fromDate = from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const toDate = to || new Date().toISOString().split('T')[0];

      // Get customer data
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('customer_id, created_at, loyalty_points');

      if (customersError) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch customer insights',
          error: customersError.message
        });
        return;
      }

      const totalCustomers = customers?.length || 0;
      const newCustomers = customers?.filter(c => new Date(c.created_at) >= new Date(fromDate || new Date().toISOString())).length || 0;
      const loyalCustomers = customers?.filter(c => c.loyalty_points >= 1000).length || 0;

      // Get returning customers (customers with multiple orders)
      const { data: customerOrders } = await supabase
        .from('orders')
        .select('customer_id')
        .gte('created_at', fromDate)
        .lte('created_at', toDate);

      const customerOrderCounts = new Map<string, number>();
      customerOrders?.forEach((order: any) => {
        const count = customerOrderCounts.get(order.customer_id) || 0;
        customerOrderCounts.set(order.customer_id, count + 1);
      });

      const returningCustomers = Array.from(customerOrderCounts.values()).filter(count => count > 1).length;

      // Calculate average lifetime value
      const { data: allOrders } = await supabase
        .from('orders')
        .select('customer_id, total_amount');

      const customerRevenue = new Map<string, number>();
      allOrders?.forEach((order: any) => {
        const revenue = customerRevenue.get(order.customer_id) || 0;
        customerRevenue.set(order.customer_id, revenue + order.total_amount);
      });

      const totalRevenue = Array.from(customerRevenue.values()).reduce((sum, revenue) => sum + revenue, 0);
      const avgLifetimeValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

      // Mock churn rate (would need historical data for accurate calculation)
      const churnRate = 5.2;

      const customerInsights: CustomerInsights = {
        totalCustomers,
        newCustomers,
        returningCustomers,
        loyalCustomers,
        churnRate,
        avgLifetimeValue,
        customerSegments: [
          { segment: 'New', count: newCustomers, percentage: (newCustomers / totalCustomers * 100), avgOrderValue: 500 },
          { segment: 'Returning', count: returningCustomers, percentage: (returningCustomers / totalCustomers * 100), avgOrderValue: 1200 },
          { segment: 'Loyal', count: loyalCustomers, percentage: (loyalCustomers / totalCustomers * 100), avgOrderValue: 2500 }
        ]
      };

      res.json({
        success: true,
        message: 'Customer insights fetched successfully',
        data: customerInsights
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // 5. Inventory Insights
  static async getInventoryInsights(req: Request, res: Response): Promise<void> {
    try {
      // Get all products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('product_id, name, stock, price, category_id, categories(name)');

      if (productsError) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch inventory insights',
          error: productsError.message
        });
        return;
      }

      const totalProducts = products?.length || 0;
      const totalValue = products?.reduce((sum, product) => sum + (product.stock * product.price), 0) || 0;

      const lowStock = products?.filter(p => p.stock > 0 && p.stock <= 10).map(p => ({
        productId: p.product_id,
        name: p.name,
        stock: p.stock,
        minThreshold: 10,
        category: (p.categories as any)?.name || 'Uncategorized'
      })) || [];

      const outOfStock = products?.filter(p => p.stock === 0).map(p => ({
        productId: p.product_id,
        name: p.name,
        stock: p.stock,
        lastSold: '2025-09-15', // Mock data
        category: (p.categories as any)?.name || 'Uncategorized'
      })) || [];

      // Get top selling products
      const { data: orderItems } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          price,
          products(name, categories(name))
        `);

      const productSales = new Map<string, { unitsSold: number; revenue: number }>();
      orderItems?.forEach((item: any) => {
        const existing = productSales.get(item.product_id) || { unitsSold: 0, revenue: 0 };
        existing.unitsSold += item.quantity;
        existing.revenue += item.quantity * item.price;
        productSales.set(item.product_id, existing);
      });

      const topSelling = Array.from(productSales.entries())
        .map(([productId, sales]) => {
          const product = products?.find(p => p.product_id === productId);
          return {
            productId,
            name: product?.name || 'Unknown',
            unitsSold: sales.unitsSold,
            revenue: sales.revenue,
            category: (product?.categories as any)?.name || 'Uncategorized'
          };
        })
        .sort((a, b) => b.unitsSold - a.unitsSold)
        .slice(0, 10);

      const inventoryInsights: InventoryInsights = {
        totalProducts,
        totalValue,
        lowStock,
        outOfStock,
        topSelling,
        slowMoving: [] // Would need historical data
      };

      res.json({
        success: true,
        message: 'Inventory insights fetched successfully',
        data: inventoryInsights
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // 6. Marketing Campaign Performance
  static async getCampaignPerformance(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId }: AnalyticsQueryParams = req.query as any;

      // Mock campaign data (would come from marketing platform integration)
      const campaignPerformance: CampaignPerformance = {
        campaignId: campaignId || 'cmp_501',
        name: 'Diwali Sale Blast',
        sent: 5000,
        openRate: 60,
        clickRate: 25,
        conversions: 300,
        revenueGenerated: 450000,
        cost: 50000,
        roi: 800 // 800% ROI
      };

      res.json({
        success: true,
        message: 'Campaign performance fetched successfully',
        data: campaignPerformance
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // 7. Revenue by Market
  static async getMarketRevenue(req: Request, res: Response): Promise<void> {
    try {
      const { from, to }: AnalyticsQueryParams = req.query as any;

      // Mock market data (would come from order analysis by shipping address)
      const marketRevenue: MarketRevenue[] = [
        {
          market: 'India',
          revenue: 300000,
          orders: 800,
          avgOrderValue: 375,
          growth: 15.5
        },
        {
          market: 'USA',
          revenue: 150000,
          orders: 400,
          avgOrderValue: 375,
          growth: 8.2
        },
        {
          market: 'UK',
          revenue: 75000,
          orders: 200,
          avgOrderValue: 375,
          growth: 12.1
        }
      ];

      res.json({
        success: true,
        message: 'Market revenue fetched successfully',
        data: marketRevenue
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // 8. Refunds & Returns Report
  static async getRefundsReport(req: Request, res: Response): Promise<void> {
    try {
      const { from, to }: AnalyticsQueryParams = req.query as any;

      // Get refunds data
      const { data: refunds, error: refundsError } = await supabase
        .from('refunds')
        .select('amount, reason, created_at')
        .gte('created_at', from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .lte('created_at', to || new Date().toISOString().split('T')[0]);

      if (refundsError) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch refunds report',
          error: refundsError.message
        });
        return;
      }

      const totalRefunds = refunds?.length || 0;
      const amountRefunded = refunds?.reduce((sum, refund) => sum + refund.amount, 0) || 0;
      const avgRefundAmount = totalRefunds > 0 ? amountRefunded / totalRefunds : 0;

      // Categorize refund reasons
      const reasons = {
        size_issue: 0,
        damaged: 0,
        wrong_item: 0,
        not_as_described: 0,
        other: 0
      };

      refunds?.forEach((refund: any) => {
        const reason = refund.reason.toLowerCase();
        if (reason.includes('size')) reasons.size_issue++;
        else if (reason.includes('damaged')) reasons.damaged++;
        else if (reason.includes('wrong')) reasons.wrong_item++;
        else if (reason.includes('described')) reasons.not_as_described++;
        else reasons.other++;
      });

      const refundsReport: RefundsReport = {
        totalRefunds,
        amountRefunded,
        avgRefundAmount,
        reasons,
        trends: [] // Would need historical data
      };

      res.json({
        success: true,
        message: 'Refunds report fetched successfully',
        data: refundsReport
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // 9. Traffic & Conversion
  static async getTrafficInsights(req: Request, res: Response): Promise<void> {
    try {
      const { from, to }: AnalyticsQueryParams = req.query as any;

      // Mock traffic data (would come from Google Analytics or similar)
      const trafficInsights: TrafficInsights = {
        visits: 25000,
        uniqueVisitors: 18000,
        cartAdditions: 5000,
        ordersPlaced: 1200,
        conversionRate: 4.8,
        bounceRate: 35.2,
        avgSessionDuration: '3m 45s',
        topPages: [
          { page: '/products', visits: 8000, conversions: 400, conversionRate: 5.0 },
          { page: '/categories', visits: 6000, conversions: 300, conversionRate: 5.0 },
          { page: '/home', visits: 5000, conversions: 200, conversionRate: 4.0 }
        ],
        trafficSources: [
          { source: 'Organic Search', visits: 12000, conversions: 600, conversionRate: 5.0 },
          { source: 'Direct', visits: 8000, conversions: 400, conversionRate: 5.0 },
          { source: 'Social Media', visits: 3000, conversions: 120, conversionRate: 4.0 },
          { source: 'Email', visits: 2000, conversions: 80, conversionRate: 4.0 }
        ]
      };

      res.json({
        success: true,
        message: 'Traffic insights fetched successfully',
        data: trafficInsights
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // 10. Export Analytics
  static async exportAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { report, format = 'csv', from, to }: ExportParams = req.query as any;

      if (!report) {
        res.status(400).json({
          success: false,
          message: 'Report type is required'
        });
        return;
      }

      // Mock export data (would generate actual report based on type)
      const exportData = {
        report,
        format,
        from,
        to,
        generatedAt: new Date().toISOString(),
        data: [] // Would contain actual report data
      };

      if (format === 'csv') {
        const csvContent = `Report,${report}\nGenerated,${exportData.generatedAt}\nFrom,${from || 'N/A'}\nTo,${to || 'N/A'}\n\nData,Value\nSample,100\n`;
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${report}-report-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csvContent);
      } else {
        res.json({
          success: true,
          message: 'Analytics export generated successfully',
          data: exportData
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // Dashboard Overview
  static async getDashboardOverview(req: Request, res: Response): Promise<void> {
    try {
      // Get today's data
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const thisWeekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const lastWeekStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0];

      // Get sales data
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', today);

      const { data: yesterdayOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', yesterday)
        .lt('created_at', today);

      const todaySales = todayOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const yesterdaySales = yesterdayOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      // Get customer data
      const { data: customers } = await supabase
        .from('customers')
        .select('created_at');

      const totalCustomers = customers?.length || 0;
      const newCustomers = customers?.filter(c => new Date(c.created_at) >= new Date(thisWeekStart || new Date().toISOString())).length || 0;

      // Get product data
      const { data: products } = await supabase
        .from('products')
        .select('stock, status');

      const totalProducts = products?.length || 0;
      const activeProducts = products?.filter(p => p.status === 'active').length || 0;
      const lowStockProducts = products?.filter(p => p.stock > 0 && p.stock <= 10).length || 0;
      const outOfStockProducts = products?.filter(p => p.stock === 0).length || 0;

      const dashboardOverview: DashboardOverview = {
        sales: {
          today: todaySales,
          yesterday: yesterdaySales,
          thisWeek: todaySales * 7, // Mock calculation
          lastWeek: yesterdaySales * 7, // Mock calculation
          thisMonth: todaySales * 30, // Mock calculation
          lastMonth: yesterdaySales * 30, // Mock calculation
          growth: yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales * 100) : 0
        },
        orders: {
          today: todayOrders?.length || 0,
          yesterday: yesterdayOrders?.length || 0,
          thisWeek: (todayOrders?.length || 0) * 7,
          lastWeek: (yesterdayOrders?.length || 0) * 7,
          thisMonth: (todayOrders?.length || 0) * 30,
          lastMonth: (yesterdayOrders?.length || 0) * 30,
          growth: (yesterdayOrders?.length || 0) > 0 ? 
            (((todayOrders?.length || 0) - (yesterdayOrders?.length || 0)) / (yesterdayOrders?.length || 0) * 100) : 0
        },
        customers: {
          total: totalCustomers,
          new: newCustomers,
          returning: Math.floor(totalCustomers * 0.3), // Mock calculation
          growth: 12.5 // Mock growth
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts
        },
        conversion: {
          rate: 4.8,
          trend: 'up' as const
        }
      };

      res.json({
        success: true,
        message: 'Dashboard overview fetched successfully',
        data: dashboardOverview
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }
}

// Helper function to generate sales breakdown
async function generateSalesBreakdown(orders: any[], groupBy: string) {
  const breakdown: any[] = [];
  const dateMap = new Map<string, { revenue: number; orders: number }>();

  orders.forEach(order => {
    const date = new Date(order.created_at);
    let key: string;

    switch (groupBy) {
      case 'day':
        key = date.toISOString().split('T')[0] || '';
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0] || '';
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'year':
        key = String(date.getFullYear());
        break;
      default:
        key = date.toISOString().split('T')[0] || '';
    }

    const existing = dateMap.get(key) || { revenue: 0, orders: 0 };
    existing.revenue += order.total_amount;
    existing.orders += 1;
    dateMap.set(key, existing);
  });

  Array.from(dateMap.entries()).forEach(([date, data]) => {
    breakdown.push({
      date,
      revenue: data.revenue,
      orders: data.orders
    });
  });

  return breakdown.sort((a, b) => a.date.localeCompare(b.date));
}
