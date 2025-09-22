
import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
  PRODUCT_COLUMNS,
  ProductSortOrder,
  ProductStatus
} from '../models/Product';

export class ProductController {
  
  // Create a new product
  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        description,
        category,
        price,
        currency = 'INR',
        stock,
        sizes = [],
        colors = [],
        images = [],
        status = 'active'
      }: CreateProductRequest = req.body;

  
      let category_id = category;
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category);
      if (!isUUID) 
        {
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('category_id')
          .eq('name', category)
          .single();

        if (categoryError || !categoryData) {
          res.status(400).json({
            success: false,
            message: `Category '${category}' not found. Please create the category first.`,
            error: categoryError?.message
          });
          return;
        }

        category_id = categoryData.category_id;
      }

      const product_id = uuidv4();
      const now = new Date().toISOString();

      const productData = {
        product_id,
        name,
        description,
        category_id,
        price,
        currency,
        stock,
        images,
        sizes,
        colors,
        rating: 0,
        status,
        is_featured: false,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select(PRODUCT_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to create product',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
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

  // Update an existing product
  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const product_id = req.params.id;
      const updates: UpdateProductRequest = req.body;
      
      if (updates.category) {
        (updates as any).category_id = updates.category;
        delete updates.category;
      }

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('product_id', product_id)
        .select(PRODUCT_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update product',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product updated successfully',
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

  // Delete a product
  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const product_id = req.params.id;

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('product_id', product_id);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to delete product',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product deleted successfully'
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

  // Get products with filtering, sorting, and pagination
  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        category,
        page = 1,
        limit = 20,
        sort = 'latest',
        search,
        featured
      }: ProductQueryParams = req.query as any;
      

      let query = supabase.from('products').select(PRODUCT_COLUMNS, { count: 'exact' });

      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (category) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category);
        
        if (isUUID) {
          query = query.eq('category_id', category);
        } else {
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('category_id')
            .eq('name', category)
            .single();

          if (categoryError || !categoryData) {
            res.status(400).json({
              success: false,
              message: `Category '${category}' not found.`,
              error: categoryError?.message
            });
            return;
          }
          query = query.eq('category_id', categoryData.category_id);
        }
      }
      if (featured !== undefined) {
        query = query.eq('is_featured', featured);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      switch (sort) {
        case 'latest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'stock':
          query = query.order('stock', { ascending: false });
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
          message: 'Failed to fetch products',
          error: error.message
        });
        return;
      }

      const totalPages = Math.ceil((count || 0) / limitNum);

      res.json({
        success: true,
        message: 'Products fetched successfully',
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

  // Get a single product by ID
  static async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const product_id = req.params.id;

      const { data, error } = await supabase
        .from('products')
        .select(`
          ${PRODUCT_COLUMNS},
          categories(category_id, name, description)
        `)
        .eq('product_id', product_id)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch product',
          error: error.message
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product fetched successfully',
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

  // Update product status (active, inactive, out_of_stock)
  static async updateProductStatus(req: Request, res: Response): Promise<void> {
    try {
      const product_id = req.params.id;
      const { status }: { status: ProductStatus } = req.body;

      const { data, error } = await supabase
        .from('products')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('product_id', product_id)
        .select(PRODUCT_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update product status',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product status updated successfully',
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
 
   // Toggle product featured
  static async toggleProductFeatured(req: Request, res: Response): Promise<void> {
    try {
      const product_id = req.params.id;
      const { isFeatured }: { isFeatured: boolean } = req.body;

      const { data, error } = await supabase
        .from('products')
        .update({ 
          is_featured: isFeatured,
          updated_at: new Date().toISOString() 
        })
        .eq('product_id', product_id)
        .select(PRODUCT_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update featured status',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product featured status updated successfully',
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

  // Update product inventory (stock)
  static async updateInventory(req: Request, res: Response): Promise<void> {
    try {
      const product_id = req.params.id;
      const { stock }: { stock: number } = req.body;

      const { data, error } = await supabase
        .from('products')
        .update({ 
          stock,
          updated_at: new Date().toISOString() 
        })
        .eq('product_id', product_id)
        .select(PRODUCT_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update inventory',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Inventory updated successfully',
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

  // Update product price
  static async updatePrice(req: Request, res: Response): Promise<void> {
    try {
      const product_id = req.params.id;
      const { price, currency }: { price: number; currency?: string } = req.body;

      const updateData: any = { 
        price,
        updated_at: new Date().toISOString() 
      };

      if (currency) {
        updateData.currency = currency;
      }

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('product_id', product_id)
        .select(PRODUCT_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update price',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Price updated successfully',
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

  // Bulk update inventory for multiple products
  static async bulkUpdateInventory(req: Request, res: Response): Promise<void> {
    try {
      const { updates }: { updates: Array<{ productId: string; stock: number }> } = req.body;
      const errors: any[] = [];
      const successful: string[] = [];

      for (const update of updates) {
        const { productId, stock } = update;
        
        const { error } = await supabase
          .from('products')
          .update({ 
            stock,
            updated_at: new Date().toISOString() 
          })
          .eq('product_id', productId);

        if (error) {
          errors.push({ productId, error: error.message });
        } else {
          successful.push(productId);
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
        message: 'Bulk inventory update successful',
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

  // Bulk update prices for multiple products
  static async bulkUpdatePrices(req: Request, res: Response): Promise<void> {
    try {
      const { updates }: { updates: Array<{ productId: string; price: number }> } = req.body;
      const errors: any[] = [];
      const successful: string[] = [];

      for (const update of updates) {
        const { productId, price } = update;
        
        const { error } = await supabase
          .from('products')
          .update({ 
            price,
            updated_at: new Date().toISOString() 
          })
          .eq('product_id', productId);

        if (error) {
          errors.push({ productId, error: error.message });
        } else {
          successful.push(productId);
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
        message: 'Bulk price update successful',
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