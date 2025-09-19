import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
  ProductVariant,
  CreateVariantRequest,
  UpdateVariantRequest,
  VARIANT_COLUMNS
} from '../models/Product';

export class VariantController {
  
  // Get all variants for a specific product
  static async getProductVariants(req: Request, res: Response): Promise<void> {
    try {
      const product_id = req.params.id;

      const { data, error } = await supabase
        .from('product_variants')
        .select(VARIANT_COLUMNS)
        .eq('product_id', product_id)
        .order('created_at', { ascending: false });

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch variants',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Variants fetched successfully',
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

 // Create a new variant for a specific product
  static async createVariant(req: Request, res: Response): Promise<void> {
    try {
      const product_id = req.params.id;
      const { size, color, price, stock, sku }: CreateVariantRequest = req.body;

      const variant_id = uuidv4();
      const now = new Date().toISOString();

      const variantData = {
        variant_id,
        product_id,
        size,
        color,
        price,
        stock,
        sku,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('product_variants')
        .insert([variantData])
        .select(VARIANT_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to create variant',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Variant created successfully',
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

  // Update an existing variant
  static async updateVariant(req: Request, res: Response): Promise<void> {
    try {
      const { productId, variantId } = req.params;
      const updates: UpdateVariantRequest = req.body;

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('product_variants')
        .update(updateData)
        .eq('variant_id', variantId)
        .eq('product_id', productId)
        .select(VARIANT_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update variant',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Variant not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Variant updated successfully',
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

  // Delete a variant
  static async deleteVariant(req: Request, res: Response): Promise<void> {
    try {
      const { productId, variantId } = req.params;

      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('variant_id', variantId)
        .eq('product_id', productId);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete variant',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Variant deleted successfully'
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