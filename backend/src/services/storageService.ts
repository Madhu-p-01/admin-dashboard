import { supabase } from '../supabaseClient';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export interface ImageUploadOptions {
  bucket: string;
  folder?: string;
  fileName?: string;
  resize?: {
    width?: number;
    height?: number;
    quality?: number;
  };
}

export class StorageService {
  // Upload image to Supabase Storage
  static async uploadImage(
    file: Buffer | File,
    options: ImageUploadOptions
  ): Promise<UploadResult> {
    try {
      const { bucket, folder = '', fileName } = options;
      
      // Generate unique filename if not provided
      const finalFileName = fileName || `${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const filePath = folder ? `${folder}/${finalFileName}` : finalFileName;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Delete image from Supabase Storage
  static async deleteImage(bucket: string, path: string): Promise<UploadResult> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get signed URL for private images
  static async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<UploadResult> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        url: data.signedUrl
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // List files in a bucket folder
  static async listFiles(bucket: string, folder?: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Create storage bucket
  static async createBucket(bucketName: string, isPublic: boolean = true) {
    try {
      const { data, error } = await supabase.storage
        .createBucket(bucketName, {
          public: isPublic,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}
