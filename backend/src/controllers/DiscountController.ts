import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import {
  CreateDiscountRequest,
  UpdateDiscountRequest,
  DiscountQueryParams,
  DiscountStatusUpdateRequest,
  BulkCreateDiscountRequest,
  AutoDiscountRequest,
  DiscountExportParams,
} from '../models/Discount';

export class DiscountController {
  
  // Create new discount/coupon
  static async createDiscount(req: Request, res: Response): Promise<void> {
    try {
      const {
        code,
        type,
        value,
        minPurchase = 0,
        maxDiscount,
        startDate,
        endDate,
        usageLimit,
        perCustomerLimit = 1,
        applicableCategories = [],
        applicableProducts = [],
        status = 'active'
      }: CreateDiscountRequest = req.body;

      const { data: existingDiscount, error: checkError } = await supabase
        .from('discounts')
        .select('discount_id')
        .eq('code', code)
        .single();

      if (existingDiscount) {
        res.status(400).json({
          success: false,
          message: 'Discount code already exists'
        });
        return;
      }

      if (applicableCategories.length > 0) {
        const { data: categories, error: categoryError } = await supabase
          .from('categories')
          .select('category_id')
          .in('category_id', applicableCategories);

        if (categoryError) {
          res.status(500).json({
            success: false,
            message: 'Error validating categories',
            error: categoryError.message
          });
          return;
        }

        if (!categories || categories.length !== applicableCategories.length) {
          const validIds = categories?.map(c => c.category_id) || [];
          const invalidIds = applicableCategories.filter(id => !validIds.includes(id));
          res.status(400).json({
            success: false,
            message: 'Some category IDs are invalid',
            data: { invalidCategoryIds: invalidIds }
          });
          return;
        }
      }

      if (applicableProducts.length > 0) {
        const { data: products, error: productError } = await supabase
          .from('products')
          .select('product_id')
          .in('product_id', applicableProducts);

        if (productError) {
          res.status(500).json({
            success: false,
            message: 'Error validating products',
            error: productError.message
          });
          return;
        }

        if (!products || products.length !== applicableProducts.length) {
          const validIds = products?.map(p => p.product_id) || [];
          const invalidIds = applicableProducts.filter(id => !validIds.includes(id));
          res.status(400).json({
            success: false,
            message: 'Some product IDs are invalid',
            data: { invalidProductIds: invalidIds }
          });
          return;
        }
      }

      const { data: discount, error } = await supabase
        .from('discounts')
        .insert({
          code,
          type,
          value,
          min_purchase: minPurchase,
          max_discount: maxDiscount,
          start_date: startDate,
          end_date: endDate,
          usage_limit: usageLimit,
          per_customer_limit: perCustomerLimit,
          applicable_categories: applicableCategories,
          applicable_products: applicableProducts,
          status,
          usage_count: 0
        })
        .select()
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Error creating discount',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Discount created successfully',
        data: {
          discountId: discount.discount_id
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Get all discounts
  static async getDiscounts(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        type,
        page = 1,
        limit = 20,
        search,
        active,
        expired
      }: DiscountQueryParams = req.query as any;

      let query = supabase
        .from('discounts')
        .select('*', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      if (type) {
        query = query.eq('type', type);
      }

      if (search) {
        query = query.ilike('code', `%${search}%`);
      }

      if (active === 'true') {
        const now = new Date().toISOString();
        query = query.eq('status', 'active')
                    .lte('start_date', now)
                    .gte('end_date', now);
      }

      if (expired === 'true') {
        const now = new Date().toISOString();
        query = query.lt('end_date', now);
      }

      query = query.order('created_at', { ascending: false });

      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data: discounts, error, count } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching discounts',
          error: error.message
        });
        return;
      }

      const formattedDiscounts = (discounts || []).map((discount: any) => ({
        id: discount.discount_id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
        status: discount.status,
        startDate: discount.start_date,
        endDate: discount.end_date,
        usageCount: discount.usage_count,
        usageLimit: discount.usage_limit,
        minPurchase: discount.min_purchase,
        maxDiscount: discount.max_discount,
        perCustomerLimit: discount.per_customer_limit,
        applicableCategories: discount.applicable_categories || [],
        applicableProducts: discount.applicable_products || [],
        createdAt: discount.created_at
      }));

      const totalPages = Math.ceil((count || 0) / limit);

      res.json({
        success: true,
        message: 'Discounts fetched successfully',
        data: {
          data: formattedDiscounts,
          meta: {
            page: Number(page),
            limit: Number(limit),
            total: count || 0,
            totalPages
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Get single discount details
  static async getDiscount(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const { data: discount, error } = await supabase
        .from('discounts')
        .select('*')
        .eq('discount_id', id)
        .single();

      if (error || !discount) {
        res.status(404).json({
          success: false,
          message: 'Discount not found'
        });
        return;
      }

      const discountData = {
        id: discount.discount_id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
        minPurchase: discount.min_purchase,
        maxDiscount: discount.max_discount,
        usageCount: discount.usage_count,
        usageLimit: discount.usage_limit,
        perCustomerLimit: discount.per_customer_limit,
        status: discount.status,
        applicableCategories: discount.applicable_categories || [],
        applicableProducts: discount.applicable_products || [],
        startDate: discount.start_date,
        endDate: discount.end_date,
        createdAt: discount.created_at
      };

      res.json({
        success: true,
        message: 'Discount details fetched successfully',
        data: discountData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Update discount
  static async updateDiscount(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateDiscountRequest = req.body;

      const { data: existingDiscount, error: checkError } = await supabase
        .from('discounts')
        .select('discount_id')
        .eq('discount_id', id)
        .single();

      if (checkError || !existingDiscount) {
        res.status(404).json({
          success: false,
          message: 'Discount not found'
        });
        return;
      }

      if (updateData.code) {
        const { data: codeConflict } = await supabase
          .from('discounts')
          .select('discount_id')
          .eq('code', updateData.code)
          .neq('discount_id', id)
          .single();

        if (codeConflict) {
          res.status(400).json({
            success: false,
            message: 'Discount code already exists'
          });
          return;
        }
      }

      const updateObject: any = {};
      if (updateData.code !== undefined) updateObject.code = updateData.code;
      if (updateData.type !== undefined) updateObject.type = updateData.type;
      if (updateData.value !== undefined) updateObject.value = updateData.value;
      if (updateData.minPurchase !== undefined) updateObject.min_purchase = updateData.minPurchase;
      if (updateData.maxDiscount !== undefined) updateObject.max_discount = updateData.maxDiscount;
      if (updateData.startDate !== undefined) updateObject.start_date = updateData.startDate;
      if (updateData.endDate !== undefined) updateObject.end_date = updateData.endDate;
      if (updateData.usageLimit !== undefined) updateObject.usage_limit = updateData.usageLimit;
      if (updateData.perCustomerLimit !== undefined) updateObject.per_customer_limit = updateData.perCustomerLimit;
      if (updateData.applicableCategories !== undefined) updateObject.applicable_categories = updateData.applicableCategories;
      if (updateData.applicableProducts !== undefined) updateObject.applicable_products = updateData.applicableProducts;
      if (updateData.status !== undefined) updateObject.status = updateData.status;

      const { error: updateError } = await supabase
        .from('discounts')
        .update(updateObject)
        .eq('discount_id', id);

      if (updateError) {
        res.status(500).json({
          success: false,
          message: 'Error updating discount',
          error: updateError.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Discount updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Delete discount
  static async deleteDiscount(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const { data: existingDiscount, error: checkError } = await supabase
        .from('discounts')
        .select('discount_id, code, usage_count')
        .eq('discount_id', id)
        .single();

      if (checkError || !existingDiscount) {
        res.status(404).json({
          success: false,
          message: 'Discount not found'
        });
        return;
      }
      if (existingDiscount.usage_count > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete discount that has been used. Consider deactivating instead.',
          data: {
            discountCode: existingDiscount.code,
            usageCount: existingDiscount.usage_count,
            suggestion: 'Use PUT /discounts/:id/status with status "inactive" instead'
          }
        });
        return;
      }

      const { error: deleteError } = await supabase
        .from('discounts')
        .delete()
        .eq('discount_id', id);

      if (deleteError) {
        res.status(500).json({
          success: false,
          message: 'Error deleting discount',
          error: deleteError.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Discount deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Activate/Deactivate discount
  static async updateDiscountStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status }: DiscountStatusUpdateRequest = req.body;

      const { data: existingDiscount, error: checkError } = await supabase
        .from('discounts')
        .select('discount_id')
        .eq('discount_id', id)
        .single();

      if (checkError || !existingDiscount) {
        res.status(404).json({
          success: false,
          message: 'Discount not found'
        });
        return;
      }

      const { error: updateError } = await supabase
        .from('discounts')
        .update({ status })
        .eq('discount_id', id);

      if (updateError) {
        res.status(500).json({
          success: false,
          message: 'Error updating discount status',
          error: updateError.message
        });
        return;
      }

      const statusMessage = status === 'active' ? 'activated' : 'deactivated';
      res.json({
        success: true,
        message: `Discount ${statusMessage} successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Track discount usage
  static async getDiscountUsage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const { data: discount, error: discountError } = await supabase
        .from('discounts')
        .select('discount_id, code, usage_count, usage_limit')
        .eq('discount_id', id)
        .single();

      if (discountError || !discount) {
        res.status(404).json({
          success: false,
          message: 'Discount not found'
        });
        return;
      }

      const { data: usageData, error: usageError } = await supabase
        .from('discount_usage')
        .select(`
          usage_id,
          order_id,
          customer_id,
          discount_value,
          applied_at,
          customers (name)
        `)
        .eq('discount_id', id)
        .order('applied_at', { ascending: false });

      if (usageError) {
        res.status(500).json({
          success: false,
          message: 'Error fetching discount usage',
          error: usageError.message
        });
        return;
      }

      const ordersApplied = (usageData || []).map((usage: any) => ({
        orderId: usage.order_id,
        customer: usage.customers?.name || 'Unknown',
        discountValue: usage.discount_value,
        appliedAt: usage.applied_at
      }));

      const usageStats = {
        discountId: discount.discount_id,
        code: discount.code,
        usageCount: discount.usage_count,
        usageLimit: discount.usage_limit,
        ordersApplied
      };

      res.json({
        success: true,
        message: 'Discount usage fetched successfully',
        data: usageStats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Bulk create discounts
  static async bulkCreateDiscounts(req: Request, res: Response): Promise<void> {
    try {
      const { discounts }: BulkCreateDiscountRequest = req.body;

      if (!discounts || !Array.isArray(discounts) || discounts.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Discounts array is required and cannot be empty'
        });
        return;
      }

      const codes = discounts.map(d => d.code);
      const duplicateCodes = codes.filter((code, index) => codes.indexOf(code) !== index);
      
      if (duplicateCodes.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Duplicate codes found in request',
          data: { duplicateCodes }
        });
        return;
      }

      const { data: existingDiscounts } = await supabase
        .from('discounts')
        .select('code')
        .in('code', codes);

      if (existingDiscounts && existingDiscounts.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Some discount codes already exist',
          data: { existingCodes: existingDiscounts.map(d => d.code) }
        });
        return;
      }

      const discountsToInsert = discounts.map(discount => ({
        code: discount.code,
        type: discount.type,
        value: discount.value,
        min_purchase: discount.minPurchase || 0,
        max_discount: discount.maxDiscount,
        start_date: discount.startDate,
        end_date: discount.endDate,
        usage_limit: discount.usageLimit,
        per_customer_limit: discount.perCustomerLimit || 1,
        applicable_categories: discount.applicableCategories || [],
        applicable_products: discount.applicableProducts || [],
        status: discount.status || 'active',
        usage_count: 0
      }));

      const { data: createdDiscounts, error } = await supabase
        .from('discounts')
        .insert(discountsToInsert)
        .select();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Error creating bulk discounts',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: `${createdDiscounts?.length || 0} discounts created successfully`,
        data: {
          createdCount: createdDiscounts?.length || 0,
          discountIds: createdDiscounts?.map(d => d.discount_id) || []
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Create auto discount
  static async createAutoDiscount(req: Request, res: Response): Promise<void> {
    try {
      const {
        rule,
        category,
        startDate,
        endDate,
        value = 10,
        type = 'percentage'
      }: AutoDiscountRequest = req.body;

      const autoCode = `AUTO_${rule.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}`.substring(0, 50);

      const { data: discount, error } = await supabase
        .from('discounts')
        .insert({
          code: autoCode,
          type,
          value,
          min_purchase: 0,
          start_date: startDate,
          end_date: endDate,
          usage_limit: null, 
          per_customer_limit: 1,
          applicable_categories: category ? [category] : [],
          applicable_products: [],
          status: 'active',
          usage_count: 0
        })
        .select()
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Error creating auto discount',
          error: error.message
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Auto discount created successfully',
        data: {
          discountId: discount.discount_id,
          code: discount.code,
          rule
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Export discounts
  static async exportDiscounts(req: Request, res: Response): Promise<void> {
    try {
      const {
        format = 'csv',
        status,
        type,
        dateFrom,
        dateTo
      }: DiscountExportParams = req.query as any;

      let query = supabase
        .from('discounts')
        .select('*');

      if (status) {
        query = query.eq('status', status);
      }

      if (type) {
        query = query.eq('type', type);
      }

      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }

      if (dateTo) {
        query = query.lte('created_at', dateTo);
      }

      const { data: discounts, error } = await query.order('created_at', { ascending: false });

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Error exporting discounts',
          error: error.message
        });
        return;
      }

      if (format === 'csv') {
        const headers = [
          'Discount ID', 'Code', 'Type', 'Value', 'Min Purchase', 'Max Discount',
          'Start Date', 'End Date', 'Usage Limit', 'Per Customer Limit',
          'Usage Count', 'Status', 'Created Date'
        ];
        const csvRows = [headers.join(',')];
        
        (discounts || []).forEach((discount: any) => {
          const row = [
            discount.discount_id,
            `"${discount.code}"`,
            discount.type,
            discount.value,
            discount.min_purchase || 0,
            discount.max_discount || '',
            discount.start_date.split('T')[0],
            discount.end_date.split('T')[0],
            discount.usage_limit || '',
            discount.per_customer_limit,
            discount.usage_count,
            discount.status,
            discount.created_at.split('T')[0]
          ];
          csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=discounts-export-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csvContent);
      } else {
        res.status(501).json({
          success: false,
          message: 'Excel export not implemented yet. Use CSV format.'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Get available categories and products for discount creation
  static async getAvailableOptions(req: Request, res: Response): Promise<void> {
    try {
      const { data: categories, error: categoryError } = await supabase
        .from('categories')
        .select('category_id, name, description')
        .order('name');

      const { data: products, error: productError } = await supabase
        .from('products')
        .select('product_id, name, price, category_id')
        .eq('status', 'active')
        .order('name');

      if (categoryError || productError) {
        res.status(500).json({
          success: false,
          message: 'Error fetching available options',
          error: categoryError?.message || productError?.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Available options fetched successfully',
        data: {
          categories: (categories || []).map(cat => ({
            id: cat.category_id,
            name: cat.name,
            description: cat.description
          })),
          products: (products || []).map(prod => ({
            id: prod.product_id,
            name: prod.name,
            price: prod.price,
            categoryId: prod.category_id
          }))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}