import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CATEGORY_COLUMNS
} from '../models/Product';

export class CategoryController {
  
  // Create a new category
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, parent_id }: CreateCategoryRequest = req.body;
      const category_id = uuidv4();
      const now = new Date().toISOString();

      const categoryData = {
        category_id,
        name,
        description,
        parent_id,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select(CATEGORY_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to create category',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
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


  // Update an existing category
  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const category_id = req.params.id;
      const updates: UpdateCategoryRequest = req.body;

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('category_id', category_id)
        .select(CATEGORY_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update category',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Category not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Category updated successfully',
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

  // Delete a category
  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const category_id = req.params.id;

      const { data: products, error: checkError } = await supabase
        .from('products')
        .select('product_id')
        .eq('category_id', category_id)
        .limit(1);

      if (checkError) {
        res.status(500).json({
          success: false,
          message: 'Failed to check category usage',
          error: checkError.message
        });
        return;
      }

      if (products && products.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete category that has products. Please move or delete products first.'
        });
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('category_id', category_id);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete category',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Category deleted successfully'
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

  // Get all categories with optional product counts
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const { includeProductCount } = req.query;

      let query = supabase.from('categories').select(CATEGORY_COLUMNS);

      // If we need product counts, join with products table
      if (includeProductCount === 'true') {
        query = supabase
          .from('categories')
          .select(`
            ${CATEGORY_COLUMNS},
            products(count)
          `);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch categories',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Categories fetched successfully',
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


  // Get a single category by ID with optional product count
  static async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const category_id = req.params.id;

      const { data, error } = await supabase
        .from('categories')
        .select(`
          ${CATEGORY_COLUMNS},
          parent:categories!parent_id(category_id, name),
          products(count)
        `)
        .eq('category_id', category_id)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch category',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Category not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Category fetched successfully',
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
}