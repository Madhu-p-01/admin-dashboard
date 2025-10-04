import { Router } from 'express';
import { ImageController, uploadMiddleware } from '../controllers/ImageController';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Upload product image
router.post(
  '/products/:productId',
  [
    param('productId').isUUID().withMessage('Valid product ID is required'),
    validateRequest
  ],
  uploadMiddleware,
  ImageController.uploadProductImage
);

// Upload category image
router.post(
  '/categories/:categoryId',
  [
    param('categoryId').isUUID().withMessage('Valid category ID is required'),
    validateRequest
  ],
  uploadMiddleware,
  ImageController.uploadCategoryImage
);

// Delete image
router.delete(
  '/:bucket/:path(*)',
  [
    param('bucket').isString().withMessage('Bucket name is required'),
    param('path').isString().withMessage('Image path is required'),
    validateRequest
  ],
  ImageController.deleteImage
);

// Get signed URL for private image
router.get(
  '/signed-url/:bucket/:path(*)',
  [
    param('bucket').isString().withMessage('Bucket name is required'),
    param('path').isString().withMessage('Image path is required'),
    query('expiresIn').optional().isInt({ min: 60, max: 86400 }).withMessage('Expires in must be between 60 and 86400 seconds'),
    validateRequest
  ],
  ImageController.getSignedUrl
);

// List images in bucket/folder
router.get(
  '/list/:bucket',
  [
    param('bucket').isString().withMessage('Bucket name is required'),
    query('folder').optional().isString().withMessage('Folder must be a string'),
    validateRequest
  ],
  ImageController.listImages
);

export default router;
