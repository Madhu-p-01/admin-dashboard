import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
  CreatePageRequest,
  UpdatePageRequest,
  PageQueryParams
} from '../models/CMSPage';

export class CMSPageController {
  
  // Create a new CMS page
  static async createPage(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
        status = 'published'
      }: CreatePageRequest = req.body;

      const pageSlug = slug || title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const page_id = uuidv4();
      const now = new Date().toISOString();

      const pageData = {
        page_id,
        title,
        slug: pageSlug,
        content,
        meta_title: metaTitle || title,
        meta_description: metaDescription || null,
        status,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('cms_pages')
        .insert([pageData])
        .select('*')
        .single();

      if (error) {
        if (error.code === '23505') {
          res.status(400).json({
            success: false,
            message: 'A page with this slug already exists',
            error: error.message
          });
          return;
        }
        
        res.status(500).json({
          success: false,
          message: 'Failed to create page',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Page created successfully',
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

  // Get all pages
  static async getPages(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        page = 1,
        limit = 20,
        search
      }: PageQueryParams = req.query as any;

      let query = supabase.from('cms_pages').select('*', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }
      query = query.order('updated_at', { ascending: false });

      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch pages',
          error: error.message
        });
        return;
      }

      const totalPages = Math.ceil((count || 0) / limitNum);

      res.json({
        success: true,
        message: 'Pages fetched successfully',
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

  // Get a single page by ID
  static async getPage(req: Request, res: Response): Promise<void> {
    try {
      const page_id = req.params.id;

      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('page_id', page_id)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch page',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Page not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Page fetched successfully',
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

  // Get a page by slug (for frontend use)
  static async getPageBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch page',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Page not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Page fetched successfully',
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

  // Update a page
  static async updatePage(req: Request, res: Response): Promise<void> {
    try {
      const page_id = req.params.id;
      const updates: UpdatePageRequest = req.body;

      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.metaTitle !== undefined) {
        updateData.meta_title = updates.metaTitle;
        delete updateData.metaTitle;
      }

      if (updates.metaDescription !== undefined) {
        updateData.meta_description = updates.metaDescription;
        delete updateData.metaDescription;
      }

      const { data, error } = await supabase
        .from('cms_pages')
        .update(updateData)
        .eq('page_id', page_id)
        .select('*')
        .single();

      if (error) {
        if (error.code === '23505') {
          res.status(400).json({
            success: false,
            message: 'A page with this slug already exists',
            error: error.message
          });
          return;
        }
        
        res.status(500).json({
          success: false,
          message: 'Failed to update page',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Page not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Page updated successfully',
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

  // Delete a page
  static async deletePage(req: Request, res: Response): Promise<void> {
    try {
      const page_id = req.params.id;

      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('page_id', page_id);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete page',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Page deleted successfully'
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

  // Get published pages for frontend
  static async getPublishedPages(req: Request, res: Response): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('page_id, title, slug, meta_title, meta_description, created_at, updated_at')
        .eq('status', 'published')
        .order('updated_at', { ascending: false });

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch published pages',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Published pages fetched successfully',
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