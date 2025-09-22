import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
  Order,
  OrderItem,
  Payment,
  OrderWithDetails,
  OrderQueryParams,
  OrderStats,
  OrderAnalytics,
  OrderStatus,
  PaymentStatus,
  ORDER_COLUMNS,
  ORDER_ITEM_COLUMNS,
  PAYMENT_COLUMNS
} from '../models/Order';

export class OrderController {
  
  // 1. Get All Orders (with Filters & Pagination)
  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        paymentStatus,
        date_from,
        date_to,
        page = 1,
        limit = 20,
        sort = 'date_desc',
        search,
        min_amount,
        max_amount,
        customer_id
      }: OrderQueryParams = req.query as any;

      let query = supabase
        .from('orders')
        .select(`
          ${ORDER_COLUMNS},
          customers(customer_id, name, email, phone)
        `, { count: 'exact' });

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }

      if (customer_id) {
        query = query.eq('customer_id', customer_id);
      }

      if (date_from) {
        query = query.gte('created_at', date_from);
      }

      if (date_to) {
        query = query.lte('created_at', date_to);
      }

      if (min_amount) {
        query = query.gte('total_amount', min_amount);
      }

      if (max_amount) {
        query = query.lte('total_amount', max_amount);
      }

      if (search) {
        query = query.or(`order_id.ilike.%${search}%,customers.name.ilike.%${search}%,customers.email.ilike.%${search}%`);
      }

      // Apply sorting
      switch (sort) {
        case 'date_desc':
          query = query.order('created_at', { ascending: false });
          break;
        case 'date_asc':
          query = query.order('created_at', { ascending: true });
          break;
        case 'amount_desc':
          query = query.order('total_amount', { ascending: false });
          break;
        case 'amount_asc':
          query = query.order('total_amount', { ascending: true });
          break;
        case 'status':
          query = query.order('status', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;
      query = query.range(from, to);

      const { data: orders, error, count } = await query;

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch orders',
          error: error.message
        });
        return;
      }

      // Get payment status for each order
      const ordersWithPaymentStatus = await Promise.all(
        (orders || []).map(async (order: any) => {
          const { data: payment } = await supabase
            .from('payments')
            .select('status')
            .eq('order_id', order.order_id)
            .single();

          return {
            id: order.order_id,
            orderNumber: `#${order.order_id.slice(-4)}`,
            customer: {
              id: order.customers?.[0]?.customer_id || order.customer_id,
              name: order.customers?.[0]?.name || 'Unknown',
              email: order.customers?.[0]?.email || 'unknown@example.com'
            },
            total: order.total_amount,
            currency: 'INR',
            paymentStatus: payment?.status || 'pending',
            fulfillmentStatus: order.status,
            date: order.created_at
          };
        })
      );

      // Filter by payment status if specified
      let filteredOrders = ordersWithPaymentStatus;
      if (paymentStatus) {
        filteredOrders = ordersWithPaymentStatus.filter(order => order.paymentStatus === paymentStatus);
      }

      const totalPages = Math.ceil((count || 0) / limitNum);

      res.json({
        success: true,
        message: 'Orders fetched successfully',
        data: filteredOrders,
        meta: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages
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

  // 2. Get Single Order Details
  static async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const order_id = req.params.id;

      // Get order with customer details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          ${ORDER_COLUMNS},
          customers(customer_id, name, email, phone)
        `)
        .eq('order_id', order_id)
        .single();

      if (orderError || !order) {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
        return;
      }

      // Get order items with product details
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          ${ORDER_ITEM_COLUMNS},
          products(product_id, name, images),
          product_variants(variant_id, size, color)
        `)
        .eq('order_id', order_id);

      if (itemsError) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch order items',
          error: itemsError.message
        });
        return;
      }

      // Get payment details
      const { data: payment } = await supabase
        .from('payments')
        .select(PAYMENT_COLUMNS)
        .eq('order_id', order_id)
        .single();

      // Get discount details if applied
      let discount = null;
      if (order.discount_applied) {
        const { data: discountData } = await supabase
          .from('discounts')
          .select('discount_id, code, type, value')
          .eq('discount_id', order.discount_applied)
          .single();
        discount = discountData;
      }

      // Get order notes
      const { data: notes } = await supabase
        .from('order_notes')
        .select('note_id, note, created_by, created_at')
        .eq('order_id', order_id)
        .order('created_at', { ascending: false });

      const orderDetails = {
        id: order.order_id,
        orderNumber: `#${order.order_id.slice(-4)}`,
        customer: {
          id: order.customers?.[0]?.customer_id || order.customer_id,
          name: order.customers?.[0]?.name || 'Unknown',
          email: order.customers?.[0]?.email || 'unknown@example.com'
        },
        items: orderItems?.map((item: any) => ({
          productId: item.product_id,
          name: item.products.name,
          qty: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price,
          variant: item.product_variants ? {
            size: item.product_variants.size,
            color: item.product_variants.color
          } : null
        })) || [],
        subtotal: orderItems?.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0) || 0,
        discount: discount ? {
          code: discount.code,
          type: discount.type,
          value: discount.value
        } : null,
        total: order.total_amount,
        paymentStatus: payment?.status || 'pending',
        fulfillmentStatus: order.status,
        deliveryStatus: order.status === 'shipped' ? 'shipped' : order.status === 'delivered' ? 'delivered' : 'not_shipped',
        shippingAddress: order.shipping_address,
        tracking: order.status === 'shipped' ? {
          carrier: 'BlueDart', // This would come from a tracking table
          trackingNumber: `BD${order.order_id.slice(-9)}`,
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        } : null,
        notes: notes || [],
        createdAt: order.created_at,
        updatedAt: order.updated_at
      };

      res.json({
        success: true,
        message: 'Order details fetched successfully',
        data: orderDetails
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

  // 3. Update Order Status - Payment
  static async updatePaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const order_id = req.params.id;
      const { paymentStatus }: { paymentStatus: PaymentStatus } = req.body;

      const { data: payment, error } = await supabase
        .from('payments')
        .update({ 
          status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', order_id)
        .select(PAYMENT_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update payment status',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Payment status updated successfully',
        data: payment
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

  // 3. Update Order Status - Fulfillment
  static async updateFulfillmentStatus(req: Request, res: Response): Promise<void> {
    try {
      const order_id = req.params.id;
      const { fulfillmentStatus }: { fulfillmentStatus: OrderStatus } = req.body;

      const { data: order, error } = await supabase
        .from('orders')
        .update({ 
          status: fulfillmentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', order_id)
        .select(ORDER_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update fulfillment status',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Fulfillment status updated successfully',
        data: order
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

  // 3. Update Order Status - Tracking
  static async updateTrackingInfo(req: Request, res: Response): Promise<void> {
    try {
      const order_id = req.params.id;
      const { carrier, trackingNumber, estimatedDelivery } = req.body;

      // Update order with tracking info
      const { data: order, error } = await supabase
        .from('orders')
        .update({ 
          status: 'shipped',
          updated_at: new Date().toISOString()
        })
        .eq('order_id', order_id)
        .select(ORDER_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update tracking info',
          error: error.message
        });
        return;
      }

      // Store tracking info (you might want to create a separate tracking table)
      const trackingInfo = {
        order_id,
        carrier,
        trackingNumber,
        estimatedDelivery,
        created_at: new Date().toISOString()
      };

      res.json({
        success: true,
        message: 'Tracking info updated successfully',
        data: {
          order,
          tracking: trackingInfo
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

  // 4. Cancel an Order (Admin Action)
  static async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const order_id = req.params.id;
      const { reason }: { reason: string } = req.body;

      const { data: order, error } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('order_id', order_id)
        .select(ORDER_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to cancel order',
          error: error.message
        });
        return;
      }

      // Add cancellation note
      await supabase
        .from('order_notes')
        .insert({
          note_id: uuidv4(),
          order_id,
          note: `Order cancelled: ${reason}`,
          created_by: (req as any).user?.id || 'admin',
          created_at: new Date().toISOString()
        });

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        orderId: order_id,
        status: 'cancelled'
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

  // 5. Refund an Order
  static async refundOrder(req: Request, res: Response): Promise<void> {
    try {
      const order_id = req.params.id;
      const { amount, reason }: { amount: number; reason: string } = req.body;

      // Create refund record
      const refund_id = uuidv4();
      const { data: refund, error } = await supabase
        .from('refunds')
        .insert({
          refund_id,
          order_id,
          amount,
          reason,
          status: 'completed',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to process refund',
          error: error.message
        });
        return;
      }

      // Update payment status to refunded
      await supabase
        .from('payments')
        .update({ status: 'refunded' })
        .eq('order_id', order_id);

      // Add refund note
      await supabase
        .from('order_notes')
        .insert({
          note_id: uuidv4(),
          order_id,
          note: `Refund processed: ${reason} (Amount: ${amount})`,
          created_by: (req as any).user?.id || 'admin',
          created_at: new Date().toISOString()
        });

      res.json({
        success: true,
        message: 'Refund processed',
        refundId: refund_id,
        status: 'completed'
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

  // 6. Bulk Actions
  static async bulkActions(req: Request, res: Response): Promise<void> {
    try {
      const { action, orderIds }: { action: string; orderIds: string[] } = req.body;

      if (!orderIds || orderIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Order IDs are required'
        });
        return;
      }

      let updateData: any = {};
      let message = '';

      switch (action) {
        case 'mark_as_shipped':
          updateData = { status: 'shipped', updated_at: new Date().toISOString() };
          message = 'Orders marked as shipped';
          break;
        case 'mark_as_delivered':
          updateData = { status: 'delivered', updated_at: new Date().toISOString() };
          message = 'Orders marked as delivered';
          break;
        case 'mark_as_cancelled':
          updateData = { status: 'cancelled', updated_at: new Date().toISOString() };
          message = 'Orders marked as cancelled';
          break;
        default:
          res.status(400).json({
            success: false,
            message: 'Invalid action'
          });
          return;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .in('order_id', orderIds);

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to update orders',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: `${orderIds.length} orders updated successfully`
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

  // 7. Export Orders
  static async exportOrders(req: Request, res: Response): Promise<void> {
    try {
      const {
        format = 'csv',
        status,
        date_from,
        date_to,
        paymentStatus
      } = req.query as any;

      let query = supabase
        .from('orders')
        .select(`
          ${ORDER_COLUMNS},
          customers(customer_id, name, email, phone)
        `);

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }

      if (date_from) {
        query = query.gte('created_at', date_from);
      }

      if (date_to) {
        query = query.lte('created_at', date_to);
      }

      const { data: orders, error } = await query.order('created_at', { ascending: false });

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to export orders',
          error: error.message
        });
        return;
      }

      if (format === 'csv') {
        const headers = ['Order ID', 'Order Number', 'Customer Name', 'Customer Email', 'Total Amount', 'Status', 'Date'];
        const csvRows = [headers.join(',')];
        
        orders?.forEach((order: any) => {
          const row = [
            order.order_id,
            `#${order.order_id.slice(-4)}`,
            `"${order.customers.name}"`,
            order.customers.email,
            order.total_amount,
            order.status,
            order.created_at.split('T')[0]
          ];
          csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=orders-export-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csvContent);
      } else {
        res.status(501).json({
          success: false,
          message: 'Excel export not implemented yet. Use CSV format.'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: errorMessage
      });
    }
  }

  // 8. Add Order Note
  static async addOrderNote(req: Request, res: Response): Promise<void> {
    try {
      const order_id = req.params.id;
      const { note }: { note: string } = req.body;

      const note_id = uuidv4();
      const { data, error } = await supabase
        .from('order_notes')
        .insert({
          note_id,
          order_id,
          note,
          created_by: (req as any).user?.id || 'admin',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to add note',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Note added successfully',
        data
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

  // 8. Get Order Notes
  static async getOrderNotes(req: Request, res: Response): Promise<void> {
    try {
      const order_id = req.params.id;

      const { data: notes, error } = await supabase
        .from('order_notes')
        .select('note_id, note, created_by, created_at')
        .eq('order_id', order_id)
        .order('created_at', { ascending: false });

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch notes',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: 'Notes fetched successfully',
        data: notes?.map(note => ({
          noteId: note.note_id,
          note: note.note,
          createdBy: note.created_by,
          date: note.created_at.split('T')[0]
        })) || []
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

  // 9. Flag Suspicious Orders
  static async flagOrder(req: Request, res: Response): Promise<void> {
    try {
      const order_id = req.params.id;
      const { reason }: { reason: string } = req.body;

      const flag_id = uuidv4();
      const { data, error } = await supabase
        .from('flagged_orders')
        .insert({
          flag_id,
          order_id,
          reason,
          flagged_by: (req as any).user?.id || 'admin',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to flag order',
          error: error.message
        });
        return;
      }

      // Add flag note
      await supabase
        .from('order_notes')
        .insert({
          note_id: uuidv4(),
          order_id,
          note: `Order flagged: ${reason}`,
          created_by: (req as any).user?.id || 'admin',
          created_at: new Date().toISOString()
        });

      res.json({
        success: true,
        message: 'Order flagged successfully',
        data
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

  // 10. Archive Order
  static async archiveOrder(req: Request, res: Response): Promise<void> {
    try {
      const order_id = req.params.id;
      const { archived = true }: { archived?: boolean } = req.body;

      const { data, error } = await supabase
        .from('orders')
        .update({ 
          archived,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', order_id)
        .select(ORDER_COLUMNS)
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to archive order',
          error: error.message
        });
        return;
      }

      res.json({
        success: true,
        message: `Order ${archived ? 'archived' : 'unarchived'} successfully`,
        data
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

  // Get Order Statistics
  static async getOrderStats(req: Request, res: Response): Promise<void> {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, total_amount');

      if (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch order statistics',
          error: error.message
        });
        return;
      }

      const stats = {
        total_orders: orders?.length || 0,
        total_revenue: orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
        pending_orders: orders?.filter(o => o.status === 'pending').length || 0,
        confirmed_orders: orders?.filter(o => o.status === 'confirmed').length || 0,
        shipped_orders: orders?.filter(o => o.status === 'shipped').length || 0,
        delivered_orders: orders?.filter(o => o.status === 'delivered').length || 0,
        cancelled_orders: orders?.filter(o => o.status === 'cancelled').length || 0,
        returned_orders: orders?.filter(o => o.status === 'returned').length || 0,
        average_order_value: orders?.length ? orders.reduce((sum, order) => sum + order.total_amount, 0) / orders.length : 0
      };

      res.json({
        success: true,
        message: 'Order statistics fetched successfully',
        data: stats
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
