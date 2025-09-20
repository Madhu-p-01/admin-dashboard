import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateBannerRequest,
  UpdateBannerRequest,
  BannerQueryParams,
} from '../models/Banner';

export class BannerController {
  
  // Create a new banner
  static async createBanner(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        imageUrl,
        link,
        position = 'homepage_top',
        status = 'active',
        startDate,
        endDate,
        displayOrder = 0
      }: CreateBannerRequest = req.body;

      const banner_id = uuidv4();
      const now = new Date().toISOString();

      const bannerData = {
        banner_id,
        title,
        image_url: imageUrl,
        link: link || null,
        position,
        status,
        start_date: startDate ? new Date(startDate).toISOString() : null,
        end_date: endDate ? new Date(endDate).toISOString() : null,
        display_order: displayOrder,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('banners')
        .insert([bannerData])
        .select('*')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to create banner',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Banner created successfully',
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

  // Get all banners
  static async getBanners(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        position,
        page = 1,
        limit = 20
      }: BannerQueryParams = req.query as any;

      let query = supabase.from('banners').select('*', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }
      if (position) {
        query = query.eq('position', position);
      }

      query = query.order('display_order', { ascending: true })
                   .order('created_at', { ascending: false });

      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch banners',
          error: error.message
        });
        return;
      }

      const totalPages = Math.ceil((count || 0) / limitNum);

      res.json({
        success: true,
        message: 'Banners fetched successfully',
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

  // Get a single banner
  static async getBanner(req: Request, res: Response): Promise<void> {
    try {
      const banner_id = req.params.id;

      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('banner_id', banner_id)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch banner',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Banner not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Banner fetched successfully',
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

  // Update a banner
  static async updateBanner(req: Request, res: Response): Promise<void> {
    try {
      const banner_id = req.params.id;
      const updates: UpdateBannerRequest = req.body;
      
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.imageUrl) {
        updateData.image_url = updates.imageUrl;
        delete updateData.imageUrl;
      }

      if (updates.startDate) {
        updateData.start_date = new Date(updates.startDate).toISOString();
        delete updateData.startDate;
      }

      if (updates.endDate) {
        updateData.end_date = new Date(updates.endDate).toISOString();
        delete updateData.endDate;
      }

      if (updates.displayOrder !== undefined) {
        updateData.display_order = updates.displayOrder;
        delete updateData.displayOrder;
      }

      const { data, error } = await supabase
        .from('banners')
        .update(updateData)
        .eq('banner_id', banner_id)
        .select('*')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update banner',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Banner not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Banner updated successfully',
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

  // Delete a banner
  static async deleteBanner(req: Request, res: Response): Promise<void> {
    try {
      const banner_id = req.params.id;

      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('banner_id', banner_id);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete banner',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Banner deleted successfully'
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

  // Get active banners by position (for frontend use)
  static async getActiveBanners(req: Request, res: Response): Promise<void> {
    try {
      const { position } = req.query;
      const now = new Date().toISOString();

      let query = supabase
        .from('banners')
        .select('*')
        .eq('status', 'active')
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`);

      if (position) {
        query = query.eq('position', position);
      }

      query = query.order('display_order', { ascending: true })
                   .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch active banners',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Active banners fetched successfully',
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