import { Request, Response } from 'express';
import { StorageService } from '../services/storageService';
import multer from 'multer';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

export class ImageController {
  // Upload product image
  static async uploadProductImage(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
        return;
      }

      const result = await StorageService.uploadImage(req.file.buffer, {
        bucket: 'product-images',
        folder: `products/${productId}`,
        fileName: `${Date.now()}-${req.file.originalname}`
      });

      if (!result.success) {
        res.status(500).json({
          success: false,
          message: 'Failed to upload image',
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: result.url,
          path: result.path
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Upload category image
  static async uploadCategoryImage(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
        return;
      }

      const result = await StorageService.uploadImage(req.file.buffer, {
        bucket: 'category-images',
        folder: `categories/${categoryId}`,
        fileName: `${Date.now()}-${req.file.originalname}`
      });

      if (!result.success) {
        res.status(500).json({
          success: false,
          message: 'Failed to upload image',
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: result.url,
          path: result.path
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete image
  static async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { bucket, path } = req.params;
      
      const result = await StorageService.deleteImage(bucket, path);

      if (!result.success) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete image',
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get signed URL for private image
  static async getSignedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { bucket, path } = req.params;
      const { expiresIn = 3600 } = req.query;
      
      const result = await StorageService.getSignedUrl(
        bucket, 
        path, 
        parseInt(expiresIn as string)
      );

      if (!result.success) {
        res.status(500).json({
          success: false,
          message: 'Failed to generate signed URL',
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          url: result.url
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // List images in a folder
  static async listImages(req: Request, res: Response): Promise<void> {
    try {
      const { bucket } = req.params;
      const { folder } = req.query;
      
      const files = await StorageService.listFiles(bucket, folder as string);

      res.status(200).json({
        success: true,
        data: files
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

// Export multer middleware
export const uploadMiddleware = upload.single('image');
