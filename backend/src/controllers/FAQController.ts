import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateFAQRequest,
  UpdateFAQRequest,
  FAQQueryParams
} from '../models/FAQ';

export class FAQController {
  
  // Create a new FAQ
  static async createFAQ(req: Request, res: Response): Promise<void> {
    try {
      const {
        question,
        answer,
        category,
        status = 'active',
        displayOrder = 0
      }: CreateFAQRequest = req.body;

      const faq_id = uuidv4();
      const now = new Date().toISOString();

      const faqData = {
        faq_id,
        question,
        answer,
        category: category || null,
        status,
        display_order: displayOrder,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('faqs')
        .insert([faqData])
        .select('*')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to create FAQ',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'FAQ created successfully',
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

  // Get all FAQs 
  static async getFAQs(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        category,
        page = 1,
        limit = 20,
        search
      }: FAQQueryParams = req.query as any;

      let query = supabase.from('faqs').select('*', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`question.ilike.%${search}%,answer.ilike.%${search}%`);
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
          message: 'Failed to fetch FAQs',
          error: error.message
        });
        return;
      }

      const totalPages = Math.ceil((count || 0) / limitNum);

      res.json({
        success: true,
        message: 'FAQs fetched successfully',
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

  // Get a single FAQ by ID
  static async getFAQ(req: Request, res: Response): Promise<void> {
    try {
      const faq_id = req.params.id;

      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('faq_id', faq_id)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch FAQ',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'FAQ fetched successfully',
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

  // Update a FAQ
  static async updateFAQ(req: Request, res: Response): Promise<void> {
    try {
      const faq_id = req.params.id;
      const updates: UpdateFAQRequest = req.body;

      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.displayOrder !== undefined) {
        updateData.display_order = updates.displayOrder;
        delete updateData.displayOrder;
      }

      const { data, error } = await supabase
        .from('faqs')
        .update(updateData)
        .eq('faq_id', faq_id)
        .select('*')
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update FAQ',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'FAQ not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'FAQ updated successfully',
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

  // Delete a FAQ
  static async deleteFAQ(req: Request, res: Response): Promise<void> {
    try {
      const faq_id = req.params.id;

      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('faq_id', faq_id);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete FAQ',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'FAQ deleted successfully'
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

  // Get active FAQs for frontend (grouped by category)
  static async getActiveFAQs(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.query;

      let query = supabase
        .from('faqs')
        .select('*')
        .eq('status', 'active');

      if (category) {
        query = query.eq('category', category);
      }

      query = query.order('display_order', { ascending: true })
                   .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch active FAQs',
          error: error.message
        });
        return;
      }

      const groupedFAQs = (data || []).reduce((groups: any, faq) => {
        const category = faq.category || 'General';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(faq);
        return groups;
      }, {});

      res.json({
        success: true,
        message: 'Active FAQs fetched successfully',
        data: groupedFAQs
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

  // Get all FAQ categories
  static async getFAQCategories(req: Request, res: Response): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('category')
        .eq('status', 'active')
        .not('category', 'is', null);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch FAQ categories',
          error: error.message
        });
        return;
      }

      const categories = [...new Set((data || []).map(item => item.category))].sort();

      res.json({
        success: true,
        message: 'FAQ categories fetched successfully',
        data: categories
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
  

  // Bulk update display order
  static async updateDisplayOrder(req: Request, res: Response): Promise<void> {
    try {
      const { updates }: { updates: Array<{ faqId: string; displayOrder: number }> } = req.body;
      const errors: any[] = [];
      const successful: string[] = [];

      for (const update of updates) {
        const { faqId, displayOrder } = update;
        
        const { error } = await supabase
          .from('faqs')
          .update({ 
            display_order: displayOrder,
            updated_at: new Date().toISOString() 
          })
          .eq('faq_id', faqId);

        if (error) {
          errors.push({ faqId, error: error.message });
        } else {
          successful.push(faqId);
        }
      }

      if (errors.length > 0) {
        res.status(207).json({
          success: false,
          message: `Bulk update completed with ${errors.length} errors`,
          data: {
            successful,
            errors
          }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Display order updated successfully',
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
}