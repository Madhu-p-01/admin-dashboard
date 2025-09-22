import express from 'express';
import { body, param, query } from 'express-validator';
import { supabaseAdminAuth } from '../middleware/supabaseAuthMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { AnalyticsController } from '../controllers/AnalyticsController';

const router = express.Router();

// 1. Sales Overview
router.get(
  '/sales',
  supabaseAdminAuth,
  [
    query('from').optional().isISO8601().withMessage('Invalid from date format (ISO8601)'),
    query('to').optional().isISO8601().withMessage('Invalid to date format (ISO8601)'),
    query('groupBy').optional().isIn(['day', 'week', 'month', 'year']).withMessage('Invalid groupBy option'),
  ],
  validateRequest,
  AnalyticsController.getSalesOverview
);

// 2. Product Performance
router.get(
  '/products/performance',
  supabaseAdminAuth,
  [
    query('from').optional().isISO8601().withMessage('Invalid from date format (ISO8601)'),
    query('to').optional().isISO8601().withMessage('Invalid to date format (ISO8601)'),
    query('sort').optional().isIn(['top_selling', 'revenue', 'growth']).withMessage('Invalid sort option'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  validateRequest,
  AnalyticsController.getProductPerformance
);

// 3. Order Insights
router.get(
  '/orders/insights',
  supabaseAdminAuth,
  [
    query('from').optional().isISO8601().withMessage('Invalid from date format (ISO8601)'),
    query('to').optional().isISO8601().withMessage('Invalid to date format (ISO8601)'),
  ],
  validateRequest,
  AnalyticsController.getOrderInsights
);

// 4. Customer Insights
router.get(
  '/customers/insights',
  supabaseAdminAuth,
  [
    query('from').optional().isISO8601().withMessage('Invalid from date format (ISO8601)'),
    query('to').optional().isISO8601().withMessage('Invalid to date format (ISO8601)'),
  ],
  validateRequest,
  AnalyticsController.getCustomerInsights
);

// 5. Inventory Insights
router.get(
  '/inventory/insights',
  supabaseAdminAuth,
  AnalyticsController.getInventoryInsights
);

// 6. Marketing Campaign Performance
router.get(
  '/campaigns/performance',
  supabaseAdminAuth,
  [
    query('campaignId').optional().isString().trim().withMessage('Campaign ID must be a string'),
  ],
  validateRequest,
  AnalyticsController.getCampaignPerformance
);

// 7. Revenue by Market
router.get(
  '/markets/revenue',
  supabaseAdminAuth,
  [
    query('from').optional().isISO8601().withMessage('Invalid from date format (ISO8601)'),
    query('to').optional().isISO8601().withMessage('Invalid to date format (ISO8601)'),
  ],
  validateRequest,
  AnalyticsController.getMarketRevenue
);

// 8. Refunds & Returns Report
router.get(
  '/refunds',
  supabaseAdminAuth,
  [
    query('from').optional().isISO8601().withMessage('Invalid from date format (ISO8601)'),
    query('to').optional().isISO8601().withMessage('Invalid to date format (ISO8601)'),
  ],
  validateRequest,
  AnalyticsController.getRefundsReport
);

// 9. Traffic & Conversion
router.get(
  '/traffic',
  supabaseAdminAuth,
  [
    query('from').optional().isISO8601().withMessage('Invalid from date format (ISO8601)'),
    query('to').optional().isISO8601().withMessage('Invalid to date format (ISO8601)'),
  ],
  validateRequest,
  AnalyticsController.getTrafficInsights
);

// 10. Export Analytics
router.get(
  '/export',
  supabaseAdminAuth,
  [
    query('report').isIn(['sales', 'products', 'orders', 'customers', 'inventory', 'campaigns', 'markets', 'refunds', 'traffic']).withMessage('Invalid report type'),
    query('format').optional().isIn(['csv', 'excel', 'json']).withMessage('Invalid export format'),
    query('from').optional().isISO8601().withMessage('Invalid from date format (ISO8601)'),
    query('to').optional().isISO8601().withMessage('Invalid to date format (ISO8601)'),
  ],
  validateRequest,
  AnalyticsController.exportAnalytics
);

// Dashboard Overview
router.get(
  '/dashboard/overview',
  supabaseAdminAuth,
  AnalyticsController.getDashboardOverview
);

export default router;

