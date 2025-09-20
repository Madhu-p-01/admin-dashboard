import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
  MediaItem,
  FileType,
  CreateMediaRequest,
  UpdateMediaRequest,
  MediaQueryParams,
} from '../models/Media';

export class MediaController {
  
  // Upload a new media file
  static async uploadMedia(req: Request, res: Response): Promise<void> {
    try {
      const {
        fileName,
        originalFilename,
        url,
        fileType,
        fileSize,
        mimeType,
        altText,
        description,
        uploadedBy
      }: CreateMediaRequest = req.body;

      const media_id = uuidv4();
      const now = new Date().toISOString();

      const mediaData = {
        media_id,
        filename: fileName,
        original_filename: originalFilename || fileName,
        url,
        file_type: fileType,
        file_size: fileSize || null,
        mime_type: mimeType || null,
        alt_text: altText || null,
        description: description || null,
        uploaded_by: uploadedBy || null,
        created_at: now,
      };

      const { data, error } = await supabase
        .from('media_library')
        .insert([mediaData])
        .select('*')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to upload media file',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Media file uploaded successfully',
        data: data
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

  // Get all media files
  static async getMediaFiles(req: Request, res: Response): Promise<void> {
    try {
      const {
        fileType,
        uploadedBy,
        page = 1,
        limit = 20,
        search,
        sort = 'latest'
      }: MediaQueryParams = req.query as any;

      let query = supabase.from('media_library').select('*', { count: 'exact' });
      if (fileType) {
        query = query.eq('file_type', fileType);
      }

      if (uploadedBy) {
        query = query.eq('uploaded_by', uploadedBy);
      }

      if (search) {
        query = query.or(`filename.ilike.%${search}%,original_filename.ilike.%${search}%,description.ilike.%${search}%`);
      }

      switch (sort) {
        case 'latest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'name':
          query = query.order('original_filename', { ascending: true });
          break;
        case 'size':
          query = query.order('file_size', { ascending: false, nullsFirst: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch media files',
          error: error.message
        });
        return;
      }

      const totalPages = Math.ceil((count || 0) / limitNum);

      res.json({
        success: true,
        message: 'Media files fetched successfully',
        data: {
          data: data || [],
          meta: {
            page: pageNum,
            limit: limitNum,
            total: count || 0,
            totalPages
          }
        }
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

  // Get a single media file by ID
  static async getMediaFile(req: Request, res: Response): Promise<void> {
    try {
      const media_id = req.params.id;

      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .eq('media_id', media_id)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch media file',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Media file not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Media file fetched successfully',
        data: data
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

  // Update media file metadata
  static async updateMediaFile(req: Request, res: Response): Promise<void> {
    try {
      const media_id = req.params.id;
      const updates: UpdateMediaRequest = req.body;
      const updateData: any = { ...updates };

      if (updates.fileName !== undefined) {
        updateData.filename = updates.fileName;
        delete updateData.fileName;
      }

      if (updates.altText !== undefined) {
        updateData.alt_text = updates.altText;
        delete updateData.altText;
      }

      const { data, error } = await supabase
        .from('media_library')
        .update(updateData)
        .eq('media_id', media_id)
        .select('*')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update media file',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Media file not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Media file updated successfully',
        data: data
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

  // Delete a media file
  static async deleteMediaFile(req: Request, res: Response): Promise<void> {
    try {
      const media_id = req.params.id;

      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('media_id', media_id);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete media file',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Media file deleted successfully'
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

  // Get media files by type
  static async getMediaByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const { limit = 50 } = req.query;

      let query = supabase
        .from('media_library')
        .select('*')
        .eq('file_type', type)
        .order('created_at', { ascending: false });

      if (limit) {
        const limitNum = parseInt(String(limit), 10);
        query = query.limit(limitNum);
      }

      const { data, error } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch media files by type',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: `${type} files fetched successfully`,
        data: data || []
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

  // Get media library statistics
  static async getMediaStats(req: Request, res: Response): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('file_type, file_size');

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch media statistics',
          error: error.message
        });
        return;
      }

      const stats = (data || []).reduce((acc: any, file) => {
        const type = file.file_type || 'unknown';
        
        if (!acc[type]) {
          acc[type] = {
            count: 0,
            totalSize: 0
          };
        }
        
        acc[type].count++;
        if (file.file_size) {
          acc[type].totalSize += file.file_size;
        }
        
        return acc;
      }, {});

      const totalFiles = data?.length || 0;
      const totalSize = Object.values(stats).reduce((sum: number, type: any) => sum + type.totalSize, 0);

      res.json({
        success: true,
        message: 'Media statistics fetched successfully',
        data: {
          totalFiles,
          totalSize,
          breakdown: stats
        }
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

  // Bulk delete media files
  static async bulkDeleteMedia(req: Request, res: Response): Promise<void> {
    try {
      const { mediaIds }: { mediaIds: string[] } = req.body;
      const errors: any[] = [];
      const successful: string[] = [];

      for (const mediaId of mediaIds) {
        const { error } = await supabase
          .from('media_library')
          .delete()
          .eq('media_id', mediaId);

        if (error) {
          errors.push({ mediaId, error: error.message });
        } else {
          successful.push(mediaId);
        }
      }

      if (errors.length > 0) {
        res.status(207).json({
          success: false,
          message: `Bulk deletion completed with ${errors.length} errors`,
          data: {
            successful,
            errors
          }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Media files deleted successfully',
        data: {
          successful
        }
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

  // Search media files
  static async searchMedia(req: Request, res: Response): Promise<void> {
    try {
      const { query: searchQuery, fileType, limit = 20 } = req.query;

      if (!searchQuery) {
        res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
        return;
      }

      let query = supabase
        .from('media_library')
        .select('*')
        .or(`filename.ilike.%${searchQuery}%,original_filename.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,alt_text.ilike.%${searchQuery}%`);

      if (fileType) {
        query = query.eq('file_type', fileType);
      }

      query = query.order('created_at', { ascending: false })
                   .limit(parseInt(String(limit), 10));

      const { data, error } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to search media files',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Media search completed successfully',
        data: data || []
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