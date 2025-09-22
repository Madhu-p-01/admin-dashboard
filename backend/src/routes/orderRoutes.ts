import express from 'express';
import { body, param, query } from 'express-validator';
import { supabaseAdminAuth } from '../middleware/supabaseAuthMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { OrderController } from '../controllers/OrderController';

const router = express.Router();

// 1. Get All Orders (with Filters & Pagination)
router.get(
  '/',
  supabaseAdminAuth,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned']),
    query('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']),
    query('date_from').optional().isISO8601(),
    query('date_to').optional().isISO8601(),
    query('sort').optional().isIn(['date_desc', 'date_asc', 'amount_desc', 'amount_asc', 'status']),
    query('search').optional().isString().trim(),
    query('min_amount').optional().isFloat({ min: 0 }),
    query('max_amount').optional().isFloat({ min: 0 }),
    query('customer_id').optional().isUUID(),
  ],
  validateRequest,
  OrderController.getOrders
);

// 2. Get Single Order Details
router.get(
  '/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid order ID is required')],
  validateRequest,
  OrderController.getOrder
);

// 3. Update Order Status - Payment
router.put(
  '/:id/payment',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid order ID is required'),
    body('paymentStatus').isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status'),
  ],
  validateRequest,
  OrderController.updatePaymentStatus
);

// 3. Update Order Status - Fulfillment
router.put(
  '/:id/fulfillment',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid order ID is required'),
    body('fulfillmentStatus').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned']).withMessage('Invalid fulfillment status'),
  ],
  validateRequest,
  OrderController.updateFulfillmentStatus
);

// 3. Update Order Status - Tracking
router.put(
  '/:id/tracking',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid order ID is required'),
    body('carrier').isString().trim().notEmpty().withMessage('Carrier is required'),
    body('trackingNumber').isString().trim().notEmpty().withMessage('Tracking number is required'),
    body('estimatedDelivery').optional().isISO8601(),
  ],
  validateRequest,
  OrderController.updateTrackingInfo
);

// 4. Cancel an Order (Admin Action)
router.put(
  '/:id/cancel',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid order ID is required'),
    body('reason').isString().trim().notEmpty().withMessage('Cancellation reason is required'),
  ],
  validateRequest,
  OrderController.cancelOrder
);

// 5. Refund an Order
router.post(
  '/:id/refund',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid order ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Refund amount must be positive'),
    body('reason').isString().trim().notEmpty().withMessage('Refund reason is required'),
  ],
  validateRequest,
  OrderController.refundOrder
);

// 6. Bulk Actions
router.post(
  '/bulk',
  supabaseAdminAuth,
  [
    body('action').isIn(['mark_as_shipped', 'mark_as_delivered', 'mark_as_cancelled']).withMessage('Invalid action'),
    body('orderIds').isArray({ min: 1 }).withMessage('Order IDs array is required'),
    body('orderIds.*').isUUID().withMessage('Valid order ID is required'),
  ],
  validateRequest,
  OrderController.bulkActions
);

// 7. Export Orders
router.get(
  '/export',
  supabaseAdminAuth,
  [
    query('format').isIn(['csv', 'excel']).withMessage('Format must be csv or excel'),
    query('status').optional().isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned']),
    query('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']),
    query('date_from').optional().isISO8601(),
    query('date_to').optional().isISO8601(),
  ],
  validateRequest,
  OrderController.exportOrders
);

// 8. Add Order Note
router.post(
  '/:id/notes',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid order ID is required'),
    body('note').isString().trim().notEmpty().withMessage('Note is required'),
  ],
  validateRequest,
  OrderController.addOrderNote
);

// 8. Get Order Notes
router.get(
  '/:id/notes',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid order ID is required')],
  validateRequest,
  OrderController.getOrderNotes
);

// 9. Flag Suspicious Orders
router.post(
  '/:id/flag',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid order ID is required'),
    body('reason').isString().trim().notEmpty().withMessage('Flag reason is required'),
  ],
  validateRequest,
  OrderController.flagOrder
);

// 10. Archive Order
router.put(
  '/:id/archive',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid order ID is required'),
    body('archived').optional().isBoolean(),
  ],
  validateRequest,
  OrderController.archiveOrder
);

// Get Order Statistics
router.get(
  '/stats/overview',
  supabaseAdminAuth,
  validateRequest,
  OrderController.getOrderStats
);

export default router;

// Order Management Routes Summary
/*
ORDER MANAGEMENT API ENDPOINTS:

GET    /api/v1/admin/orders/                    - Get all orders with filters
GET    /api/v1/admin/orders/:id                 - Get single order details
PUT    /api/v1/admin/orders/:id/payment         - Update payment status
PUT    /api/v1/admin/orders/:id/fulfillment     - Update fulfillment status
PUT    /api/v1/admin/orders/:id/tracking        - Update tracking info
PUT    /api/v1/admin/orders/:id/cancel          - Cancel order
POST   /api/v1/admin/orders/:id/refund          - Process refund
POST   /api/v1/admin/orders/bulk                - Bulk actions
GET    /api/v1/admin/orders/export              - Export orders
POST   /api/v1/admin/orders/:id/notes           - Add order note
GET    /api/v1/admin/orders/:id/notes           - Get order notes
POST   /api/v1/admin/orders/:id/flag            - Flag suspicious order
PUT    /api/v1/admin/orders/:id/archive         - Archive order
GET    /api/v1/admin/orders/stats/overview      - Get order statistics

Example URLs:
GET /api/v1/admin/orders/?status=pending&paymentStatus=paid&page=1&limit=20&sort=date_desc
GET /api/v1/admin/orders/export?format=csv&status=paid&date_from=2025-09-01&date_to=2025-09-16
POST /api/v1/admin/orders/bulk {"action": "mark_as_shipped", "orderIds": ["ord_1005", "ord_1006"]}
*/

