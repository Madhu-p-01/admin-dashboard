import express from 'express';
import { body, param, query } from 'express-validator';
import { supabaseAdminAuth } from '../middleware/supabaseAuthMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { ProductController } from '../controllers/ProductController';
import { CategoryController } from '../controllers/CategoryController';
import { VariantController } from '../controllers/VariantController';

const router = express.Router();

// Create Product
router.post(
  '/',
  supabaseAdminAuth,
  [
    body('name').isString().trim().notEmpty().withMessage('Product name is required'),
    body('description').isString().trim(),
    body('category').isString().trim().notEmpty().withMessage('Category name or ID is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('currency').optional().isString().trim().isLength({ min: 3, max: 3 }),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('sizes').optional().isArray(),
    body('colors').optional().isArray(),
    body('images').optional().isArray(),
    body('status').optional().isIn(['active', 'inactive', 'draft']),
  ],
  validateRequest,
  ProductController.createProduct
);

// Get All Products
router.get(
  '/',
  supabaseAdminAuth,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['active', 'inactive', 'draft']),
    query('category').optional().isString().trim(),
    query('sort').optional().isIn(['latest', 'oldest', 'price_asc', 'price_desc', 'rating', 'stock']),
    query('search').optional().isString().trim(),
    query('featured').optional().isBoolean(),
  ],
  validateRequest,
  ProductController.getProducts
);

// Create Category
router.post(
  '/categories',
  supabaseAdminAuth,
  [
    body('name').isString().trim().notEmpty().withMessage('Category name is required'),
    body('description').optional().isString().trim(),
    body('parent_id').optional().isUUID(),
  ],
  validateRequest,
  CategoryController.createCategory
);

// Get All Categories
router.get(
  '/categories',
  supabaseAdminAuth,
  [query('includeProductCount').optional().isBoolean()],
  validateRequest,
  CategoryController.getCategories
);


// Get Single Category
router.get(
  '/categories/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid category ID is required')],
  validateRequest,
  CategoryController.getCategory
);

// Update Category
router.put(
  '/categories/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid category ID is required'),
    body('name').isString().trim().notEmpty(),
    body('description').optional().isString().trim(),
    body('parent_id').optional().isUUID(),
  ],
  validateRequest,
  CategoryController.updateCategory
);

// Delete Category
router.delete(
  '/categories/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid category ID is required')],
  validateRequest,
  CategoryController.deleteCategory
);

// Get Single Product
router.get(
  '/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid product ID is required')],
  validateRequest,
  ProductController.getProduct
);

// Update Product
router.put(
  '/:id',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid product ID is required'),
    body('name').isString().trim().notEmpty(),
    body('description').optional().isString().trim(),
    body('category').optional().isUUID(),
    body('price').optional().isFloat({ min: 0 }),
    body('currency').optional().isString().trim().isLength({ min: 3, max: 3 }),
    body('stock').optional().isInt({ min: 0 }),
    body('sizes').optional().isArray(),
    body('colors').optional().isArray(),
    body('images').optional().isArray(),
    body('status').optional().isIn(['active', 'inactive', 'draft']),
  ],
  validateRequest,
  ProductController.updateProduct
);

// Delete Product
router.delete(
  '/:id',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid product ID is required')],
  validateRequest,
  ProductController.deleteProduct
);


// Update Product Status
router.put(
  '/:id/status',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid product ID is required'),
    body('status').isIn(['active', 'inactive', 'draft']).withMessage('Invalid status value'),
  ],
  validateRequest,
  ProductController.updateProductStatus
);

// Toggle Featured Status
router.put(
  '/:id/feature',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid product ID is required'),
    body('isFeatured').isBoolean().withMessage('isFeatured must be a boolean'),
  ],
  validateRequest,
  ProductController.toggleProductFeatured
);


// Update Product Inventory
router.put(
  '/:id/inventory',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid product ID is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  validateRequest,
  ProductController.updateInventory
);

// Bulk Update Inventory
router.post(
  '/inventory/bulk',
  supabaseAdminAuth,
  [
    body('updates').isArray({ min: 1 }).withMessage('Updates array is required'),
    body('updates.*.productId').isUUID().withMessage('Valid product ID is required'),
    body('updates.*.stock').isInt({ min: 0 }).withMessage('Stock must be non-negative'),
  ],
  validateRequest,
  ProductController.bulkUpdateInventory
);


// Update Product Price
router.put(
  '/:id/price',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid product ID is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('currency').optional().isString().trim().isLength({ min: 3, max: 3 }),
  ],
  validateRequest,
  ProductController.updatePrice
);

// Bulk Update Prices
router.post(
  '/pricing/bulk',
  supabaseAdminAuth,
  [
    body('updates').isArray({ min: 1 }).withMessage('Updates array is required'),
    body('updates.*.productId').isUUID().withMessage('Valid product ID is required'),
    body('updates.*.price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  ],
  validateRequest,
  ProductController.bulkUpdatePrices
);


// Get Product Variants
router.get(
  '/:id/variants',
  supabaseAdminAuth,
  [param('id').isUUID().withMessage('Valid product ID is required')],
  validateRequest,
  VariantController.getProductVariants
);

// Create Product Variant
router.post(
  '/:id/variants',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid product ID is required'),
    body('size').isString().trim(),
    body('color').optional().isString().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be non-negative'),
    body('sku').optional().isString().trim(),
  ],
  validateRequest,
  VariantController.createVariant
);

// Update Product Variant
router.put(
  '/:productId/variants/:variantId',
  supabaseAdminAuth,
  [
    param('productId').isUUID().withMessage('Valid product ID is required'),
    param('variantId').isUUID().withMessage('Valid variant ID is required'),
    body('size').isString().trim(),
    body('color').optional().isString().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
    body('sku').optional().isString().trim(),
  ],
  validateRequest,
  VariantController.updateVariant
);

// Delete Product Variant
router.delete(
  '/:productId/variants/:variantId',
  supabaseAdminAuth,
  [
    param('productId').isUUID().withMessage('Valid product ID is required'),
    param('variantId').isUUID().withMessage('Valid variant ID is required'),
  ],
  validateRequest,
  VariantController.deleteVariant
);


// Add Product Image , not yet implemented completely as we need a MediaController
router.post(
  '/:id/images',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid product ID is required'),
    body('imageUrl').isString().trim().notEmpty().withMessage('Image URL or filename is required'),
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      // This would be implemented in a MediaController
      res.status(501).json({
        success: false,
        message: 'Image management not implemented yet'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
);

// Delete Product Image, not yet implemented completely as we need a MediaController
router.delete(
  '/:id/images/:imageId',
  supabaseAdminAuth,
  [
    param('id').isUUID().withMessage('Valid product ID is required'),
    param('imageId').isString().withMessage('Image ID is required'),
  ],
  validateRequest,
 async (req: express.Request, res: express.Response) => {
    try {
      // This would be implemented in a MediaController
      res.status(501).json({
        success: false,
        message: 'Image management not implemented yet'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
);

export default router;


// routes that are done for products management

/*
GET    http://localhost:4000/api/v1/admin/products/
POST   http://localhost:4000/api/v1/admin/products/
GET    http://localhost:4000/api/v1/admin/products/:id
PUT    http://localhost:4000/api/v1/admin/products/:id
DELETE http://localhost:4000/api/v1/admin/products/:id

PUT    http://localhost:4000/api/v1/admin/products/:id/status
PUT    http://localhost:4000/api/v1/admin/products/:id/feature

PUT    http://localhost:4000/api/v1/admin/products/:id/inventory
POST   http://localhost:4000/api/v1/admin/products/inventory/bulk

PUT    http://localhost:4000/api/v1/admin/products/:id/price
POST   http://localhost:4000/api/v1/admin/products/pricing/bulk

POST   http://localhost:4000/api/v1/admin/products/:id/images
DELETE http://localhost:4000/api/v1/admin/products/:id/images/:imageId

POST   http://localhost:4000/api/v1/admin/products/categories
GET    http://localhost:4000/api/v1/admin/products/categories
GET    http://localhost:4000/api/v1/admin/products/categories/:id
PUT    http://localhost:4000/api/v1/admin/products/categories/:id
DELETE http://localhost:4000/api/v1/admin/products/categories/:id

GET    http://localhost:4000/api/v1/admin/products/:id/variants
POST   http://localhost:4000/api/v1/admin/products/:id/variants
PUT    http://localhost:4000/api/v1/admin/products/:productId/variants/:variantId
DELETE http://localhost:4000/api/v1/admin/products/:productId/variants/:variantId

http://localhost:4000/api/v1/admin/products/?status=active&category=men&page=1&limit=20&sort=latest&search=hoodie&featured=true


*/