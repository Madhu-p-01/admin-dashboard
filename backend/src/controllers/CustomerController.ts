import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import {
  UpdateCustomerRequest,
  CustomerQueryParams,
  CustomerStatusUpdateRequest,
  LoyaltyPointsRequest,
  CustomerSegmentParams,
  CustomerExportParams,
  CustomerStatus,
} from '../models/Customer';

export class CustomerController {
  
  // Get all customers
  static async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        page = 1,
        limit = 20,
        sort = 'latest',
        search,
        minOrders,
        minSpent
      }: CustomerQueryParams = req.query as any;

      let query = supabase
        .from('customers')
        .select(`
          customer_id,
          name,
          email,
          phone,
          loyalty_points,
          created_at,
          updated_at
        `, { count: 'exact' });

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      switch (sort) {
        case 'latest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        case 'name_desc':
          query = query.order('name', { ascending: false });
          break;
      }

      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data: customers, error, count } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching customers',
          error: error.message
        });
        return;
      }

      const enrichedCustomers = await Promise.all(
        (customers || []).map(async (customer: any) => {
          const { data: orderStats } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('customer_id', customer.customer_id);

          const ordersCount = orderStats?.length || 0;
          const totalSpent = orderStats?.reduce((sum: number, order: any) => sum + order.total_amount, 0) || 0;

          let customerStatus: CustomerStatus = 'active';
          
          const { data: blacklisted } = await supabase
            .from('blacklisted_customers')
            .select('customer_id')
            .eq('customer_id', customer.customer_id)
            .single();

          const { data: suspended } = await supabase
            .from('suspended_customers')
            .select('customer_id')
            .eq('customer_id', customer.customer_id)
            .single();

          if (blacklisted) {
            customerStatus = 'blacklisted';
          } else if (suspended) {
            customerStatus = 'suspended';
          } else if (ordersCount === 0 && new Date(customer.created_at) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
            customerStatus = 'inactive';
          }

          return {
            id: customer.customer_id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone || '',
            ordersCount,
            totalSpent,
            loyaltyPoints: customer.loyalty_points,
            status: customerStatus,
            createdAt: customer.created_at
          };
        })
      );

      let filteredCustomers = enrichedCustomers;

      if (status) {
        filteredCustomers = filteredCustomers.filter(c => c.status === status);
      }

      if (minOrders) {
        filteredCustomers = filteredCustomers.filter(c => c.ordersCount >= minOrders);
      }

      if (minSpent) {
        filteredCustomers = filteredCustomers.filter(c => c.totalSpent >= minSpent);
      }

      const totalPages = Math.ceil((count || 0) / limit);

      res.json({
        success: true,
        message: 'Customers fetched successfully',
        data: {
          data: filteredCustomers,
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

  // Get single customer details
  static async getCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select(`
          customer_id,
          name,
          email,
          phone,
          loyalty_points,
          preferences,
          created_at,
          updated_at
        `)
        .eq('customer_id', id)
        .single();

      if (customerError || !customer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found',
          error: customerError?.message
        });
        return;
      }

      const { data: orders, error: ordersStatsError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('customer_id', id);

      const ordersCount = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      let status: string = 'active';

      const { data: blacklisted } = await supabase
        .from('blacklisted_customers')
        .select('customer_id')
        .eq('customer_id', id)
        .single();

      const { data: suspended } = await supabase
        .from('suspended_customers')
        .select('customer_id')
        .eq('customer_id', id)
        .single();

      if (blacklisted) {
        status = 'blacklisted';
      } else if (suspended) {
        status = 'suspended';
      } else if (ordersCount === 0 && new Date(customer.created_at) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
        status = 'inactive';
      }

      const { data: addresses, error: addressError } = await supabase
        .from('addresses')
        .select(`
          address_id,
          name,
          phone,
          line1,
          line2,
          city,
          state,
          postal_code,
          country,
          is_default,
          created_at
        `)
        .eq('customer_id', id)
        .order('is_default', { ascending: false });

      const { data: recentOrders, error: recentOrdersError } = await supabase
        .from('orders')
        .select(`
          order_id,
          status,
          total_amount,
          created_at,
          updated_at
        `)
        .eq('customer_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      const formattedAddresses = addresses?.map(addr => ({
        label: addr.name || 'Home',
        city: addr.city,
        pincode: addr.postal_code,
        country: addr.country
      })) || [];
 
      const formattedOrders = recentOrders?.map(order => ({
        orderId: order.order_id,
        total: order.total_amount,
        status: order.status
      })) || [];

      const customerData = {
        id: customer.customer_id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        status,
        loyaltyPoints: customer.loyalty_points,
        addresses: formattedAddresses,
        orders: formattedOrders,
        totalSpent,
        joinedAt: customer.created_at
      };

      res.json({
        success: true,
        message: 'Customer details fetched successfully',
        data: customerData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Update customer information
  static async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, phone, status }: UpdateCustomerRequest = req.body;

      const { data: existingCustomer, error: checkError } = await supabase
        .from('customers')
        .select('customer_id')
        .eq('customer_id', id)
        .single();

      if (checkError || !existingCustomer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
        return;
      }

      const updateData: any = { updated_at: new Date() };
      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;

      const { error: updateError } = await supabase
        .from('customers')
        .update(updateData)
        .eq('customer_id', id);

      if (updateError) {
        res.status(500).json({
          success: false,
          message: 'Error updating customer',
          error: updateError.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Customer updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Update customer status (blacklist, suspend, activate)
  static async updateCustomerStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, reason = '' }: CustomerStatusUpdateRequest = req.body;
      
      // Get admin ID from auth context (we might need to modify this based on your auth setup)
      const adminId = (req as any).user?.id || null;

      const { data: existingCustomer, error: checkError } = await supabase
        .from('customers')
        .select('customer_id')
        .eq('customer_id', id)
        .single();

      if (checkError || !existingCustomer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
        return;
      }

      await supabase.from('blacklisted_customers').delete().eq('customer_id', id);
      await supabase.from('suspended_customers').delete().eq('customer_id', id);

      switch (status) {
        case 'blacklisted':
          const { error: blacklistError } = await supabase
            .from('blacklisted_customers')
            .insert({
              customer_id: id,
              reason,
              blacklisted_by: adminId
            });

          if (blacklistError) {
            res.status(500).json({
              success: false,
              message: 'Error blacklisting customer',
              error: blacklistError.message
            });
            return;
          }
          break;

        case 'suspended':
          const suspendedUntil = req.body.suspended_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days default
          const { error: suspendError } = await supabase
            .from('suspended_customers')
            .insert({
              customer_id: id,
              reason,
              suspended_until: suspendedUntil,
              suspended_by: adminId
            });

          if (suspendError) {
            res.status(500).json({
              success: false,
              message: 'Error suspending customer',
              error: suspendError.message
            });
            return;
          }
          break;

        case 'active':
          break;
      }

      const statusMessage = status === 'active' ? 'activated' : 
                           status === 'blacklisted' ? 'blacklisted' : 'suspended';

      res.json({
        success: true,
        message: `Customer ${statusMessage} successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Delete customer 
  static async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const { data: existingCustomer, error: checkError } = await supabase
        .from('customers')
        .select('customer_id, name')
        .eq('customer_id', id)
        .single();

      if (checkError || !existingCustomer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
        return;
      }

      // Check if customer has orders
      const { data: customerOrders, error: ordersError } = await supabase
        .from('orders')
        .select('order_id')
        .eq('customer_id', id)
        .limit(1);

      if (ordersError) {
        res.status(500).json({
          success: false,
          message: 'Error checking customer orders',
          error: ordersError.message
        });
        return;
      }

      // If customer has orders, don't allow deletion
      if (customerOrders && customerOrders.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete customer with existing orders. Consider blacklisting instead.',
          data: {
            customerName: existingCustomer.name,
            hasOrders: true,
            suggestion: 'Use PUT /customers/:id/status with status "blacklisted" instead'
          }
        });
        return;
      }

      // If no orders, proceed with deletion
      const { error: deleteError } = await supabase
        .from('customers')
        .delete()
        .eq('customer_id', id);

      if (deleteError) {
        res.status(500).json({
          success: false,
          message: 'Error deleting customer',
          error: deleteError.message
        });
        return;
      }

      res.json({
        success: true,
        message: `Customer '${existingCustomer.name}' deleted successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Search customers
  static async searchCustomers(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
        return;
      }

      const { data: customers, error } = await supabase
        .from('customers')
        .select('customer_id, name, email, phone')
        .or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`)
        .limit(20);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Error searching customers',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Search completed successfully',
        data: customers || []
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Get customer orders history
  static async getCustomerOrders(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const { data: existingCustomer, error: checkError } = await supabase
        .from('customers')
        .select('customer_id')
        .eq('customer_id', id)
        .single();

      if (checkError || !existingCustomer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
        return;
      }

      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          order_id,
          status,
          total_amount,
          created_at,
          updated_at,
          shipping_address
        `)
        .eq('customer_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching customer orders',
          error: error.message
        });
        return;
      }

      const formattedOrders = orders?.map(order => ({
        orderId: order.order_id,
        date: order.created_at.split('T')[0],
        total: order.total_amount,
        status: order.status
      })) || [];

      res.json({
        success: true,
        message: 'Customer orders fetched successfully',
        data: formattedOrders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Add loyalty points
  static async addLoyaltyPoints(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { points, reason }: LoyaltyPointsRequest = req.body;
      
      const adminId = (req as any).user?.id || null;

      const { data: customer, error: checkError } = await supabase
        .from('customers')
        .select('customer_id, loyalty_points')
        .eq('customer_id', id)
        .single();

      if (checkError || !customer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
        return;
      }

      const { error: updateError } = await supabase
        .from('customers')
        .update({ 
          loyalty_points: customer.loyalty_points + points,
          updated_at: new Date()
        })
        .eq('customer_id', id);

      if (updateError) {
        res.status(500).json({
          success: false,
          message: 'Error updating loyalty points',
          error: updateError.message
        });
        return;
      }

      await supabase
        .from('loyalty_points_history')
        .insert({
          customer_id: id,
          type: 'add',
          points,
          reason,
          admin_id: adminId
        });

      res.json({
        success: true,
        message: 'Loyalty points added successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Redeem loyalty points
  static async redeemLoyaltyPoints(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { points, reason }: LoyaltyPointsRequest = req.body;
      
      const adminId = (req as any).user?.id || null;

      const { data: customer, error: checkError } = await supabase
        .from('customers')
        .select('customer_id, loyalty_points')
        .eq('customer_id', id)
        .single();

      if (checkError || !customer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
        return;
      }

      if (customer.loyalty_points < points) {
        res.status(400).json({
          success: false,
          message: 'Insufficient loyalty points'
        });
        return;
      }

      const { error: updateError } = await supabase
        .from('customers')
        .update({ 
          loyalty_points: customer.loyalty_points - points,
          updated_at: new Date()
        })
        .eq('customer_id', id);

      if (updateError) {
        res.status(500).json({
          success: false,
          message: 'Error updating loyalty points',
          error: updateError.message
        });
        return;
      }

      await supabase
        .from('loyalty_points_history')
        .insert({
          customer_id: id,
          type: 'redeem',
          points,
          reason,
          admin_id: adminId
        });

      res.json({
        success: true,
        message: 'Loyalty points redeemed successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Get customer segments
  static async getCustomerSegments(req: Request, res: Response): Promise<void> {
    try {
      const {
        type,
        minOrders = 0,
        maxOrders,
        minSpent = 0,
        maxSpent,
      }: CustomerSegmentParams = req.query as any;

      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select(`
          customer_id,
          name,
          email,
          loyalty_points,
          created_at,
          updated_at
        `);

      if (customersError) {
        res.status(500).json({
          success: false,
          message: 'Error fetching customers',
          error: customersError.message
        });
        return;
      }

      const enrichedCustomers = await Promise.all(
        (customers || []).map(async (customer: any) => {
          const { data: orders } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('customer_id', customer.customer_id);

          const ordersCount = orders?.length || 0;
          const totalSpent = orders?.reduce((sum: number, order: any) => sum + order.total_amount, 0) || 0;

          return {
            id: customer.customer_id,
            name: customer.name,
            email: customer.email,
            ordersCount,
            totalSpent,
            loyaltyPoints: customer.loyalty_points,
            createdAt: customer.created_at,
            updatedAt: customer.updated_at
          };
        })
      );

      let filteredCustomers = enrichedCustomers;
      if (type) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        switch (type) {
          case 'loyal':
            const loyalMinOrders = minOrders || 5;
            filteredCustomers = filteredCustomers.filter(c => c.ordersCount >= loyalMinOrders);
            break;
          case 'high_value':
            const highValueMinSpent = minSpent || 10000;
            filteredCustomers = filteredCustomers.filter(c => c.totalSpent >= highValueMinSpent);
            break;
          case 'new':
            filteredCustomers = filteredCustomers.filter(c => new Date(c.createdAt) >= thirtyDaysAgo);
            break;
          case 'inactive':
            filteredCustomers = filteredCustomers.filter(c => 
              c.ordersCount === 0 || new Date(c.updatedAt) < ninetyDaysAgo
            );
            break;
          case 'at_risk':
            filteredCustomers = filteredCustomers.filter(c => 
              c.ordersCount > 0 && new Date(c.updatedAt) < sixtyDaysAgo
            );
            break;
        }
      }

      if (minOrders > 0) {
        filteredCustomers = filteredCustomers.filter(c => c.ordersCount >= minOrders);
      }

      if (maxOrders) {
        filteredCustomers = filteredCustomers.filter(c => c.ordersCount <= maxOrders);
      }

      if (minSpent > 0) {
        filteredCustomers = filteredCustomers.filter(c => c.totalSpent >= minSpent);
      }

      if (maxSpent) {
        filteredCustomers = filteredCustomers.filter(c => c.totalSpent <= maxSpent);
      }

      const sortedCustomers = filteredCustomers
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 100);

      res.json({
        success: true,
        message: 'Customer segments fetched successfully',
        data: sortedCustomers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Export customers
  static async exportCustomers(req: Request, res: Response): Promise<void> {
    try {
      const {
        format = 'csv',
        status,
        minSpent,
        maxSpent,
        dateFrom,
        dateTo
      }: CustomerExportParams = req.query as any;

      let query = supabase
        .from('customers')
        .select(`
          customer_id,
          name,
          email,
          phone,
          loyalty_points,
          created_at
        `);


      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }

      if (dateTo) {
        query = query.lte('created_at', dateTo);
      }

      const { data: customers, error } = await query.order('created_at', { ascending: false });

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Error exporting customers',
          error: error.message
        });
        return;
      }

      const enrichedCustomers = await Promise.all(
        (customers || []).map(async (customer: any) => {
          const { data: orders } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('customer_id', customer.customer_id);

          const ordersCount = orders?.length || 0;
          const totalSpent = orders?.reduce((sum: number, order: any) => sum + order.total_amount, 0) || 0;

          let customerStatus = 'active';
          const { data: blacklisted } = await supabase
            .from('blacklisted_customers')
            .select('customer_id')
            .eq('customer_id', customer.customer_id)
            .single();

          const { data: suspended } = await supabase
            .from('suspended_customers')
            .select('customer_id')
            .eq('customer_id', customer.customer_id)
            .single();

          if (blacklisted) {
            customerStatus = 'blacklisted';
          } else if (suspended) {
            customerStatus = 'suspended';
          } else if (ordersCount === 0 && new Date(customer.created_at) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
            customerStatus = 'inactive';
          }

          return {
            customer_id: customer.customer_id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone || '',
            loyalty_points: customer.loyalty_points,
            created_at: customer.created_at,
            orders_count: ordersCount,
            total_spent: totalSpent,
            status: customerStatus
          };
        })
      );

      let filteredCustomers = enrichedCustomers;

      if (status) {
        filteredCustomers = filteredCustomers.filter(c => c.status === status);
      }

      if (minSpent) {
        filteredCustomers = filteredCustomers.filter(c => c.total_spent >= minSpent);
      }

      if (maxSpent) {
        filteredCustomers = filteredCustomers.filter(c => c.total_spent <= maxSpent);
      }

      if (format === 'csv') {
        const headers = ['Customer ID', 'Name', 'Email', 'Phone', 'Orders Count', 'Total Spent', 'Loyalty Points', 'Status', 'Joined Date'];
        const csvRows = [headers.join(',')];
        
        filteredCustomers.forEach((customer: any) => {
          const row = [
            customer.customer_id,
            `"${customer.name}"`,
            customer.email,
            customer.phone || '',
            customer.orders_count,
            customer.total_spent,
            customer.loyalty_points,
            customer.status,
            customer.created_at.split('T')[0]
          ];
          csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=customers-export-${new Date().toISOString().split('T')[0]}.csv`);
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
}