// admin-dashboard/backend/src/controllers/NotificationController.ts

import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
import { 
  Notification, 
  NotificationPreferences, 
  NotificationTemplate, 
  NotificationStats,
  CreateNotificationRequest,
  UpdatePreferencesRequest,
  NotificationFilters
} from '../models/Notification';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class NotificationController {
  // =====================================================
  // CUSTOMER NOTIFICATIONS
  // =====================================================

  /**
   * Get customer notifications with filtering and pagination
   */
  static async getCustomerNotifications(req: Request, res: Response) {
    try {
      const { customerId, status, type, page = 1, limit = 20 } = req.query;
      
      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: 'Customer ID is required'
        });
      }

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('target', 'customer')
        .eq('target_id', customerId as string)
        .order('created_at', { ascending: false });

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }
      if (type) {
        query = query.eq('type', type);
      }

      // Apply pagination
      const from = (Number(page) - 1) * Number(limit);
      const to = from + Number(limit) - 1;
      query = query.range(from, to);

      const { data: notifications, error, count } = await query;

      if (error) {
        console.error('Error fetching customer notifications:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch notifications'
        });
      }

      // Get unread count
      const { count: unreadCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('target', 'customer')
        .eq('target_id', customerId as string)
        .eq('status', 'unread');

      return res.status(200).json({
        success: true,
        message: 'Customer notifications fetched successfully',
        data: {
          data: notifications || [],
          meta: {
            page: Number(page),
            limit: Number(limit),
            total: count || 0,
            totalPages: Math.ceil((count || 0) / Number(limit)),
            unreadCount: unreadCount || 0
          }
        }
      });
    } catch (error) {
      console.error('Error in getCustomerNotifications:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Mark notification as read (generic method for both customer and admin)
   */
  static async markNotificationAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to mark notification as read'
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Error in markNotificationAsRead:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Mark customer notification as read
   */
  static async markCustomerNotificationAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { customerId } = req.query;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: 'Customer ID is required'
        });
      }

      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('target', 'customer')
        .eq('target_id', customerId as string)
        .select()
        .single();

      if (error) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to mark notification as read'
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Error in markCustomerNotificationAsRead:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Clear all customer notifications
   */
  static async clearCustomerNotifications(req: Request, res: Response) {
    try {
      const { customerId } = req.query;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: 'Customer ID is required'
        });
      }

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('target', 'customer')
        .eq('target_id', customerId as string);

      if (error) {
        console.error('Error clearing customer notifications:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to clear notifications'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'All notifications cleared'
      });
    } catch (error) {
      console.error('Error in clearCustomerNotifications:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update customer notification preferences
   */
  static async updateCustomerPreferences(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const preferences: UpdatePreferencesRequest = req.body;

      const { data, error } = await supabase
        .from('notification_preferences')
        .update({
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', id)
        .eq('user_type', 'customer')
        .select()
        .single();

      if (error) {
        console.error('Error updating customer preferences:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to update notification preferences'
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Customer preferences not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Notification preferences updated',
        data
      });
    } catch (error) {
      console.error('Error in updateCustomerPreferences:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // =====================================================
  // ADMIN NOTIFICATIONS
  // =====================================================

  /**
   * Get admin notifications with filtering and pagination
   */
  static async getAdminNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const { status, type, page = 1, limit = 20 } = req.query;

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('target', 'admin')
        .order('created_at', { ascending: false });

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }
      if (type) {
        query = query.eq('type', type);
      }

      // Apply pagination
      const from = (Number(page) - 1) * Number(limit);
      const to = from + Number(limit) - 1;
      query = query.range(from, to);

      const { data: notifications, error, count } = await query;

      if (error) {
        console.error('Error fetching admin notifications:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch notifications'
        });
      }

      // Get unread count
      const { count: unreadCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('target', 'admin')
        .eq('status', 'unread');

      return res.status(200).json({
        success: true,
        message: 'Admin notifications fetched successfully',
        data: {
          data: notifications || [],
          meta: {
            page: Number(page),
            limit: Number(limit),
            total: count || 0,
            totalPages: Math.ceil((count || 0) / Number(limit)),
            unreadCount: unreadCount || 0
          }
        }
      });
    } catch (error) {
      console.error('Error in getAdminNotifications:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Mark admin notification as read
   */
  static async markAdminNotificationAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('target', 'admin')
        .select()
        .single();

      if (error) {
        console.error('Error marking admin notification as read:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to mark notification as read'
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Error in markAdminNotificationAsRead:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Create admin alert
   */
  static async createAdminAlert(req: AuthenticatedRequest, res: Response) {
    try {
      const { type, title, message, priority = 'medium', targetId } = req.body;

      if (!type || !title || !message) {
        return res.status(400).json({
          success: false,
          message: 'Type, title, and message are required'
        });
      }

      const notificationData = {
        target: 'admin' as const,
        target_id: targetId || req.user?.id,
        type,
        title,
        message,
        status: 'unread' as const,
        channels: ['inApp', 'email'],
        priority,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single();

      if (error) {
        console.error('Error creating admin alert:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to create admin alert'
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Admin alert created',
        data
      });
    } catch (error) {
      console.error('Error in createAdminAlert:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Clear all admin notifications
   */
  static async clearAdminNotifications(req: Request, res: Response) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('target', 'admin');

      if (error) {
        console.error('Error clearing admin notifications:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to clear notifications'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'All admin notifications cleared'
      });
    } catch (error) {
      console.error('Error in clearAdminNotifications:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // =====================================================
  // SYSTEM-LEVEL NOTIFICATIONS
  // =====================================================

  /**
   * Create notification (for customer or admin)
   */
  static async createNotification(req: AuthenticatedRequest, res: Response) {
    try {
      const notificationData: CreateNotificationRequest = req.body;

      if (!notificationData.target || !notificationData.targetId || !notificationData.type || 
          !notificationData.title || !notificationData.message) {
        return res.status(400).json({
          success: false,
          message: 'Target, targetId, type, title, and message are required'
        });
      }

      const notification = {
        target: notificationData.target,
        target_id: notificationData.targetId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        status: 'unread' as const,
        channels: notificationData.channels || ['inApp'],
        priority: notificationData.priority || 'medium',
        scheduled_for: notificationData.scheduledFor?.toISOString(),
        metadata: notificationData.metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to create notification'
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data
      });
    } catch (error) {
      console.error('Error in createNotification:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get notification preferences
   */
  static async getNotificationPreferences(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching notification preferences:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch notification preferences'
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Notification preferences not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Notification preferences fetched successfully',
        data
      });
    } catch (error) {
      console.error('Error in getNotificationPreferences:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Export notifications
   */
  static async exportNotifications(req: Request, res: Response) {
    try {
      const { role, format = 'csv', from, to } = req.query;

      let query = supabase
        .from('notification_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (role) {
        query = query.eq('target', role);
      }
      if (from) {
        query = query.gte('created_at', from as string);
      }
      if (to) {
        query = query.lte('created_at', to as string);
      }

      const { data: notifications, error } = await query;

      if (error) {
        console.error('Error exporting notifications:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to export notifications'
        });
      }

      if (format === 'csv') {
        // Convert to CSV format
        const csvHeaders = 'ID,Target,Target Name,Type,Title,Message,Status,Priority,Created At\n';
        const csvData = notifications?.map(notification => 
          `${notification.id},${notification.target},${notification.target_name},${notification.type},${notification.title},${notification.message},${notification.status},${notification.priority},${notification.created_at}`
        ).join('\n') || '';

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=notifications.csv');
        return res.status(200).send(csvHeaders + csvData);
      } else {
        return res.status(200).json({
          success: true,
          message: 'Notifications exported successfully',
          data: notifications
        });
      }
    } catch (error) {
      console.error('Error in exportNotifications:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get notification statistics
   */
  static async getNotificationStats(req: Request, res: Response) {
    try {
      const { data: stats, error } = await supabase
        .from('notification_stats')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching notification stats:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch notification statistics'
        });
      }

      // Get additional stats by type
      const { data: typeStats } = await supabase
        .from('notifications')
        .select('type')
        .not('type', 'is', null);

      const byType = typeStats?.reduce((acc: Record<string, number>, notification) => {
        acc[notification.type] = (acc[notification.type] || 0) + 1;
        return acc;
      }, {}) || {};

      return res.status(200).json({
        success: true,
        message: 'Notification statistics fetched successfully',
        data: {
          ...stats,
          byType
        }
      });
    } catch (error) {
      console.error('Error in getNotificationStats:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Bulk mark notifications as read
   */
  static async bulkMarkAsRead(req: Request, res: Response) {
    try {
      const { notificationIds } = req.body;

      if (!notificationIds || !Array.isArray(notificationIds)) {
        return res.status(400).json({
          success: false,
          message: 'Notification IDs array is required'
        });
      }

      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .in('id', notificationIds)
        .select();

      if (error) {
        console.error('Error bulk marking notifications as read:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to mark notifications as read'
        });
      }

      return res.status(200).json({
        success: true,
        message: `${data?.length || 0} notifications marked as read`,
        data
      });
    } catch (error) {
      console.error('Error in bulkMarkAsRead:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Clear all customer notifications
   */
  static async clearAllCustomerNotifications(req: Request, res: Response) {
    try {
      const { customerId } = req.query;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: 'Customer ID is required'
        });
      }

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('target', 'customer')
        .eq('target_id', customerId as string);

      if (error) {
        console.error('Error clearing customer notifications:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to clear notifications'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'All customer notifications cleared'
      });
    } catch (error) {
      console.error('Error in clearAllCustomerNotifications:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Clear all admin notifications
   */
  static async clearAllAdminNotifications(req: Request, res: Response) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('target', 'admin');

      if (error) {
        console.error('Error clearing admin notifications:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to clear notifications'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'All admin notifications cleared'
      });
    } catch (error) {
      console.error('Error in clearAllAdminNotifications:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get notification templates
   */
  static async getNotificationTemplates(req: Request, res: Response) {
    try {
      const { type, active } = req.query;

      let query = supabase
        .from('notification_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }
      if (active !== undefined) {
        query = query.eq('is_active', active === 'true');
      }

      const { data: templates, error } = await query;

      if (error) {
        console.error('Error fetching notification templates:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch notification templates'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Notification templates fetched successfully',
        data: templates || []
      });
    } catch (error) {
      console.error('Error in getNotificationTemplates:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Create notification template
   */
  static async createNotificationTemplate(req: AuthenticatedRequest, res: Response) {
    try {
      const templateData = req.body;

      const { data, error } = await supabase
        .from('notification_templates')
        .insert({
          ...templateData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification template:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to create notification template'
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Notification template created successfully',
        data
      });
    } catch (error) {
      console.error('Error in createNotificationTemplate:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update notification template
   */
  static async updateNotificationTemplate(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { data, error } = await supabase
        .from('notification_templates')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating notification template:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to update notification template'
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Notification template not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Notification template updated successfully',
        data
      });
    } catch (error) {
      console.error('Error in updateNotificationTemplate:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete notification template
   */
  static async deleteNotificationTemplate(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('notification_templates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting notification template:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to delete notification template'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Notification template deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteNotificationTemplate:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get notification overview statistics
   */
  static async getNotificationOverview(req: Request, res: Response) {
    try {
      const { data: stats, error } = await supabase
        .from('notification_stats')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching notification overview:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch notification overview'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Notification overview fetched successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error in getNotificationOverview:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Bulk archive notifications
   */
  static async bulkArchive(req: Request, res: Response) {
    try {
      const { notificationIds } = req.body;

      if (!notificationIds || !Array.isArray(notificationIds)) {
        return res.status(400).json({
          success: false,
          message: 'Notification IDs array is required'
        });
      }

      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          status: 'archived',
          archived_at: new Date().toISOString()
        })
        .in('id', notificationIds)
        .select();

      if (error) {
        console.error('Error bulk archiving notifications:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to archive notifications'
        });
      }

      return res.status(200).json({
        success: true,
        message: `${data?.length || 0} notifications archived`,
        data
      });
    } catch (error) {
      console.error('Error in bulkArchive:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Bulk delete notifications
   */
  static async bulkDelete(req: Request, res: Response) {
    try {
      const { notificationIds } = req.body;

      if (!notificationIds || !Array.isArray(notificationIds)) {
        return res.status(400).json({
          success: false,
          message: 'Notification IDs array is required'
        });
      }

      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .in('id', notificationIds)
        .select();

      if (error) {
        console.error('Error bulk deleting notifications:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to delete notifications'
        });
      }

      return res.status(200).json({
        success: true,
        message: `${data?.length || 0} notifications deleted`,
        data
      });
    } catch (error) {
      console.error('Error in bulkDelete:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}