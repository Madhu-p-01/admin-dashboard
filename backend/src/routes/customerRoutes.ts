import express from 'express';
import { body, param, query } from 'express-validator';
import { supabaseAdminAuth } from '../middleware/supabaseAuthMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { CustomerController } from '../controllers/CustomerController';

const router = express.Router();

// Get All Customers
router.get(
  '/',
  supabaseAdminAuth,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['active', 'inactive', 'blacklisted', 'suspended']),
    query('sort').optional().isIn(['latest', 'oldest', 'name_asc', 'name_desc', 'total_spent_desc', 'total_spent_asc', 'orders_desc']),
    query('search').optional().isString().trim(),
    query('minOrders').optional().isInt({ min: 0 }),
    query('minSpent').optional().isFloat({ min: 0 }),
  ],
  validateRequest,
  CustomerController.getCustomers
);


// Search Customers
router.get(
  '/search',
  supabaseAdminAuth,
  [query('q').isString().trim().notEmpty().withMessage('Search query is required')],
  validateRequest,
  CustomerController.searchCustomers
);

// Segment Customers
router.get(
  '/segments',
  supabaseAdminAuth,
  [
    query('type').optional().isIn(['loyal', 'new', 'inactive', 'high_value', 'at_risk']),
    query('minOrders').optional().isInt({ min: 0 }),
    query('maxOrders').optional().isInt({ min: 0 }),
    query('minSpent').optional().isFloat({ min: 0 }),
    query('maxSpent').optional().isFloat({ min: 0 }),
    query('loyaltyTier').optional().isString().trim(),
  ],
  validateRequest,
  CustomerController.getCustomerSegments
);

// Export Customers 
router.get(
  '/export',
  supabaseAdminAuth,
  [
    query('format').isIn(['csv', 'excel']),
    query('status').optional().isIn(['active', 'inactive', 'blacklisted', 'suspended']),
    query('minSpent').optional().isFloat({ min: 0 }),
    query('maxSpent').optional().isFloat({ min: 0 }),
    query('dateFrom').optional().isISO8601(),
    query('dateTo').optional().isISO8601(),
  ],
  validateRequest,
  CustomerController.exportCustomers
);

// Get Customer Details
router.get(
  '/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid customer ID is required')],
  validateRequest,
  CustomerController.getCustomer
);

// Update Customer Info
router.put(
  '/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid customer ID is required'),
    body('name').isString().trim().notEmpty(),
    body('phone').optional().isString().trim(),
    body('status').optional().isIn(['active', 'inactive', 'blacklisted', 'suspended']),
  ],
  validateRequest,
  CustomerController.updateCustomer
);


// Deactivate/Blacklist Customer
router.put(
  '/:id/status',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid customer ID is required'),
    body('status').isIn(['active', 'inactive', 'blacklisted', 'suspended']).withMessage('Invalid status value'),
    body('reason').optional().isString().trim(),
    body('suspended_until').optional().isISO8601(),
  ],
  validateRequest,
  CustomerController.updateCustomerStatus
);

// Get Customer Orders
router.get(
  '/:id/orders',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid customer ID is required')],
  validateRequest,
  CustomerController.getCustomerOrders
);

// Delete Customer
router.delete(
  '/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid customer ID is required')],
  validateRequest,
  CustomerController.deleteCustomer
);

// Add Loyalty Points
router.post(
  '/:id/loyalty/add',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid customer ID is required'),
    body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
    body('reason').isString().trim().notEmpty().withMessage('Reason is required'),
  ],
  validateRequest,
  CustomerController.addLoyaltyPoints
);

// Redeem Loyalty Points (Admin Adjustment)
router.post(
  '/:id/loyalty/redeem',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid customer ID is required'),
    body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
    body('reason').isString().trim().notEmpty().withMessage('Reason is required'),
  ],
  validateRequest,
  CustomerController.redeemLoyaltyPoints
);

export default router;



// Customer Management Routes Summary


/*
CUSTOMER MANAGEMENT API ENDPOINTS:

GET    http://localhost:4000/api/v1/admin/customers/
GET    http://localhost:4000/api/v1/admin/customers/:id
PUT    http://localhost:4000/api/v1/admin/customers/:id
PUT    http://localhost:4000/api/v1/admin/customers/:id/status
DELETE http://localhost:4000/api/v1/admin/customers/:id
GET    http://localhost:4000/api/v1/admin/customers/search?q=ravi
GET    http://localhost:4000/api/v1/admin/customers/:id/orders
POST   http://localhost:4000/api/v1/admin/customers/:id/loyalty/add
POST   http://localhost:4000/api/v1/admin/customers/:id/loyalty/redeem
GET    http://localhost:4000/api/v1/admin/customers/segments
GET    http://localhost:4000/api/v1/admin/customers/export

Example URLs:
http://localhost:4000/api/v1/admin/customers/?status=active&sort=latest&page=1&limit=20
http://localhost:4000/api/v1/admin/customers/search?q=ravi
http://localhost:4000/api/v1/admin/customers/segments?type=loyal&minOrders=5
http://localhost:4000/api/v1/admin/customers/export?format=csv&status=active&minSpent=5000

*/