import express from 'express';
import { body, param, query } from 'express-validator';
import { supabaseAdminAuth } from '../middleware/supabaseAuthMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { DiscountController } from '../controllers/DiscountController';

const router = express.Router();

// Create Discount / Coupon Code
router.post(
  '/',
  supabaseAdminAuth,
  [
    body('code')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 3, max: 50 })
      .withMessage('Code must be between 3-50 characters'),
    body('type')
      .isIn(['percentage', 'fixed_amount', 'free_shipping'])
      .withMessage('Type must be percentage, fixed_amount, or free_shipping'),
    body('value')
      .isFloat({ min: 0 })
      .withMessage('Value must be a positive number'),
    body('minPurchase')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum purchase must be a positive number'),
    body('maxDiscount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum discount must be a positive number'),
    body('startDate')
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    body('endDate')
      .isISO8601()
      .withMessage('End date must be a valid ISO date'),
    body('usageLimit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Usage limit must be a positive integer'),
    body('perCustomerLimit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Per customer limit must be a positive integer'),
    body('applicableCategories')
      .optional()
      .isArray()
      .withMessage('Applicable categories must be an array'),
    body('applicableProducts')
      .optional()
      .isArray()
      .withMessage('Applicable products must be an array'),
    body('status')
      .optional()
      .isIn(['active', 'inactive'])
      .withMessage('Status must be active or inactive'),
  ],
  validateRequest,
  DiscountController.createDiscount
);

// Get All Discounts
router.get(
  '/',
  supabaseAdminAuth,
  [
    query('status')
      .optional()
      .isIn(['active', 'inactive'])
      .withMessage('Status must be active or inactive'),
    query('type')
      .optional()
      .isIn(['percentage', 'fixed_amount', 'free_shipping'])
      .withMessage('Type must be percentage, fixed_amount, or free_shipping'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1-100'),
    query('search')
      .optional()
      .isString()
      .trim()
      .withMessage('Search must be a string'),
    query('active')
      .optional()
      .isIn(['true', 'false'])
      .withMessage('Active must be true or false'),
    query('expired')
      .optional()
      .isIn(['true', 'false'])
      .withMessage('Expired must be true or false'),
  ],
  validateRequest,
  DiscountController.getDiscounts
);

// Get Available Categories and Products
router.get(
  '/options',
  supabaseAdminAuth,
  DiscountController.getAvailableOptions
);

// Export Discounts
router.get(
  '/export',
  supabaseAdminAuth,
  [
    query('format')
      .isIn(['csv', 'excel'])
      .withMessage('Format must be csv or excel'),
    query('status')
      .optional()
      .isIn(['active', 'inactive'])
      .withMessage('Status must be active or inactive'),
    query('type')
      .optional()
      .isIn(['percentage', 'fixed_amount', 'free_shipping'])
      .withMessage('Type must be percentage, fixed_amount, or free_shipping'),
    query('dateFrom')
      .optional()
      .isISO8601()
      .withMessage('Date from must be a valid ISO date'),
    query('dateTo')
      .optional()
      .isISO8601()
      .withMessage('Date to must be a valid ISO date'),
  ],
  validateRequest,
  DiscountController.exportDiscounts
);

// Bulk Create Discounts (Import)
router.post(
  '/bulk',
  supabaseAdminAuth,
  [
    body('discounts')
      .isArray({ min: 1 })
      .withMessage('Discounts must be a non-empty array'),
    body('discounts.*.code')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 3, max: 50 })
      .withMessage('Each code must be between 3-50 characters'),
    body('discounts.*.type')
      .isIn(['percentage', 'fixed_amount', 'free_shipping'])
      .withMessage('Each type must be percentage, fixed_amount, or free_shipping'),
    body('discounts.*.value')
      .isFloat({ min: 0 })
      .withMessage('Each value must be a positive number'),
    body('discounts.*.startDate')
      .isISO8601()
      .withMessage('Each start date must be a valid ISO date'),
    body('discounts.*.endDate')
      .isISO8601()
      .withMessage('Each end date must be a valid ISO date'),
  ],
  validateRequest,
  DiscountController.bulkCreateDiscounts
);

// Auto Discounts
router.post(
  '/auto',
  supabaseAdminAuth,
  [
    body('rule')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Rule is required'),
    body('category')
      .isString()
      .trim()
      .withMessage('Category must be a string'),
    body('startDate')
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    body('endDate')
      .isISO8601()
      .withMessage('End date must be a valid ISO date'),
    body('value')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Value must be a positive number'),
    body('type')
      .optional()
      .isIn(['percentage', 'fixed_amount', 'free_shipping'])
      .withMessage('Type must be percentage, fixed_amount, or free_shipping'),
  ],
  validateRequest,
  DiscountController.createAutoDiscount
);

// Get Discount Details
router.get(
  '/:id',
  supabaseAdminAuth,
  [
    param('id')
      .isUUID()
      .withMessage('Valid discount ID is required'),
  ],
  validateRequest,
  DiscountController.getDiscount
);

// Update Discount
router.put(
  '/:id',
  supabaseAdminAuth,
  [
    param('id')
      .isUUID()
      .withMessage('Valid discount ID is required'),
    body('code')
      .isString()
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Code must be between 3-50 characters'),
    body('type')
      .optional()
      .isIn(['percentage', 'fixed_amount', 'free_shipping'])
      .withMessage('Type must be percentage, fixed_amount, or free_shipping'),
    body('value')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Value must be a positive number'),
    body('minPurchase')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum purchase must be a positive number'),
    body('maxDiscount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum discount must be a positive number'),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO date'),
    body('usageLimit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Usage limit must be a positive integer'),
    body('perCustomerLimit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Per customer limit must be a positive integer'),
    body('applicableCategories')
      .optional()
      .isArray()
      .withMessage('Applicable categories must be an array'),
    body('applicableProducts')
      .optional()
      .isArray()
      .withMessage('Applicable products must be an array'),
    body('status')
      .optional()
      .isIn(['active', 'inactive'])
      .withMessage('Status must be active or inactive'),
  ],
  validateRequest,
  DiscountController.updateDiscount
);

// Delete Discount
router.delete(
  '/:id',
  supabaseAdminAuth,
  [
    param('id')
      .isUUID()
      .withMessage('Valid discount ID is required'),
  ],
  validateRequest,
  DiscountController.deleteDiscount
);

// Activate/Deactivate Discount
router.put(
  '/:id/status',
  supabaseAdminAuth,
  [
    param('id')
      .isUUID()
      .withMessage('Valid discount ID is required'),
    body('status')
      .isIn(['active', 'inactive'])
      .withMessage('Status must be active or inactive'),
  ],
  validateRequest,
  DiscountController.updateDiscountStatus
);

// Track Discount Usage
router.get(
  '/:id/usage',
  supabaseAdminAuth,
  [
    param('id')
      .isUUID()
      .withMessage('Valid discount ID is required'),
  ],
  validateRequest,
  DiscountController.getDiscountUsage
);

export default router;

/*
DISCOUNT MANAGEMENT API ENDPOINTS:

POST   http://localhost:4000/api/v1/admin/discounts/                    
GET    http://localhost:4000/api/v1/admin/discounts/                    
GET    http://localhost:4000/api/v1/admin/discounts/options             
GET    http://localhost:4000/api/v1/admin/discounts/:id                   
PUT    http://localhost:4000/api/v1/admin/discounts/:id                
DELETE http://localhost:4000/api/v1/admin/discounts/:id                 
PUT    http://localhost:4000/api/v1/admin/discounts/:id/status         
GET    http://localhost:4000/api/v1/admin/discounts/:id/usage           
POST   http://localhost:4000/api/v1/admin/discounts/bulk               
POST   http://localhost:4000/api/v1/admin/discounts/auto                
GET    http://localhost:4000/api/v1/admin/discounts/export             


*/