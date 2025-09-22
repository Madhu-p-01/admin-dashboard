// admin-dashboard/backend/src/routes/notificationRoutes.ts

import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { NotificationController } from '../controllers/NotificationController';
import { supabaseAdminAuth } from '../middleware/supabaseAuthMiddleware';

const router = Router();

// =====================================================
// VALIDATION MIDDLEWARE
// =====================================================

const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// =====================================================
// CUSTOMER NOTIFICATIONS
// =====================================================

/**
 * GET /customer - Get customer notifications
 */
router.get('/customer', [
  query('customerId').isUUID().withMessage('Valid customer ID is required'),
  query('status').optional().isIn(['unread', 'read', 'archived']).withMessage('Invalid status'),
  query('type').optional().isIn(['order_update', 'promo', 'low_stock', 'new_order', 'fraud', 'payment', 'inventory', 'reminder', 'system', 'marketing']).withMessage('Invalid type'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], validateRequest, NotificationController.getCustomerNotifications);

/**
 * PUT /customer/:id/read - Mark notification as read
 */
router.put('/customer/:id/read', [
  param('id').isUUID().withMessage('Valid notification ID is required')
], validateRequest, NotificationController.markNotificationAsRead);

/**
 * DELETE /customer - Clear all customer notifications
 */
router.delete('/customer', [
  query('customerId').isUUID().withMessage('Valid customer ID is required')
], validateRequest, NotificationController.clearCustomerNotifications);

/**
 * POST /customer/:id/preferences - Update notification preferences
 */
router.post('/customer/:id/preferences', [
  param('id').isUUID().withMessage('Valid customer ID is required'),
  body('email').optional().isBoolean().withMessage('Email preference must be boolean'),
  body('sms').optional().isBoolean().withMessage('SMS preference must be boolean'),
  body('push').optional().isBoolean().withMessage('Push preference must be boolean'),
  body('inApp').optional().isBoolean().withMessage('In-app preference must be boolean'),
  body('orderUpdates').optional().isBoolean().withMessage('Order updates preference must be boolean'),
  body('promotions').optional().isBoolean().withMessage('Promotions preference must be boolean'),
  body('lowStock').optional().isBoolean().withMessage('Low stock preference must be boolean'),
  body('newOrders').optional().isBoolean().withMessage('New orders preference must be boolean'),
  body('fraudAlerts').optional().isBoolean().withMessage('Fraud alerts preference must be boolean'),
  body('paymentAlerts').optional().isBoolean().withMessage('Payment alerts preference must be boolean'),
  body('inventoryAlerts').optional().isBoolean().withMessage('Inventory alerts preference must be boolean'),
  body('reminders').optional().isBoolean().withMessage('Reminders preference must be boolean'),
  body('systemAlerts').optional().isBoolean().withMessage('System alerts preference must be boolean'),
  body('marketing').optional().isBoolean().withMessage('Marketing preference must be boolean')
], validateRequest, NotificationController.updateCustomerPreferences);

// =====================================================
// ADMIN NOTIFICATIONS
// =====================================================

/**
 * GET /admin - Get admin notifications
 */
router.get('/admin', [
  supabaseAdminAuth,
  query('status').optional().isIn(['unread', 'read', 'archived']).withMessage('Invalid status'),
  query('type').optional().isIn(['order_update', 'promo', 'low_stock', 'new_order', 'fraud', 'payment', 'inventory', 'reminder', 'system', 'marketing']).withMessage('Invalid type'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], validateRequest, NotificationController.getAdminNotifications);

/**
 * PUT /admin/:id/read - Mark admin notification as read
 */
router.put('/admin/:id/read', [
  supabaseAdminAuth,
  param('id').isUUID().withMessage('Valid notification ID is required')
], validateRequest, NotificationController.markNotificationAsRead);

/**
 * POST /admin/alerts - Create admin alert
 */
router.post('/admin/alerts', [
  supabaseAdminAuth,
  body('type').isIn(['fraud', 'payment', 'inventory', 'system']).withMessage('Invalid alert type'),
  body('title').isLength({ min: 1, max: 255 }).withMessage('Title is required and must be less than 255 characters'),
  body('message').isLength({ min: 1 }).withMessage('Message is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object')
], validateRequest, NotificationController.createAdminAlert);

/**
 * DELETE /admin - Clear all admin notifications
 */
router.delete('/admin', [
  supabaseAdminAuth
], NotificationController.clearAdminNotifications);

// =====================================================
// SYSTEM-LEVEL NOTIFICATIONS
// =====================================================

/**
 * POST /create - Create notification (for customer or admin)
 */
router.post('/create', [
  supabaseAdminAuth,
  body('target').isIn(['customer', 'admin']).withMessage('Target must be customer or admin'),
  body('targetId').isUUID().withMessage('Valid target ID is required'),
  body('type').isIn(['order_update', 'promo', 'low_stock', 'new_order', 'fraud', 'payment', 'inventory', 'reminder', 'system', 'marketing']).withMessage('Invalid notification type'),
  body('title').isLength({ min: 1, max: 255 }).withMessage('Title is required and must be less than 255 characters'),
  body('message').isLength({ min: 1 }).withMessage('Message is required'),
  body('channels').optional().isArray().withMessage('Channels must be an array'),
  body('channels.*').optional().isIn(['email', 'sms', 'push', 'inApp']).withMessage('Invalid channel'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('scheduledFor').optional().isISO8601().withMessage('Scheduled date must be valid ISO 8601 format'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object')
], validateRequest, NotificationController.createNotification);

/**
 * GET /preferences/:userId - Get notification preferences
 */
router.get('/preferences/:userId', [
  supabaseAdminAuth,
  param('userId').isUUID().withMessage('Valid user ID is required')
], validateRequest, NotificationController.getNotificationPreferences);

/**
 * GET /export - Export notifications
 */
router.get('/export', [
  supabaseAdminAuth,
  query('role').optional().isIn(['customer', 'admin']).withMessage('Invalid role'),
  query('format').isIn(['csv', 'excel']).withMessage('Format must be csv or excel'),
  query('from').optional().isISO8601().withMessage('From date must be valid ISO 8601 format'),
  query('to').optional().isISO8601().withMessage('To date must be valid ISO 8601 format'),
  query('type').optional().isIn(['order_update', 'promo', 'low_stock', 'new_order', 'fraud', 'payment', 'inventory', 'reminder', 'system', 'marketing']).withMessage('Invalid type'),
  query('status').optional().isIn(['unread', 'read', 'archived']).withMessage('Invalid status')
], validateRequest, NotificationController.exportNotifications);

// =====================================================
// NOTIFICATION TEMPLATES
// =====================================================

/**
 * GET /templates - Get all notification templates
 */
router.get('/templates', [
  supabaseAdminAuth,
  query('type').optional().isIn(['order_update', 'promo', 'low_stock', 'new_order', 'fraud', 'payment', 'inventory', 'reminder', 'system', 'marketing']).withMessage('Invalid type'),
  query('active').optional().isBoolean().withMessage('Active must be boolean')
], validateRequest, NotificationController.getNotificationTemplates);

/**
 * POST /templates - Create notification template
 */
router.post('/templates', [
  supabaseAdminAuth,
  body('name').isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('type').isIn(['order_update', 'promo', 'low_stock', 'new_order', 'fraud', 'payment', 'inventory', 'reminder', 'system', 'marketing']).withMessage('Invalid template type'),
  body('title').isLength({ min: 1, max: 255 }).withMessage('Title is required and must be less than 255 characters'),
  body('message').isLength({ min: 1 }).withMessage('Message is required'),
  body('channels').isArray().withMessage('Channels must be an array'),
  body('channels.*').isIn(['email', 'sms', 'push', 'inApp']).withMessage('Invalid channel'),
  body('variables').optional().isArray().withMessage('Variables must be an array'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean')
], validateRequest, NotificationController.createNotificationTemplate);

/**
 * PUT /templates/:id - Update notification template
 */
router.put('/templates/:id', [
  supabaseAdminAuth,
  param('id').isUUID().withMessage('Valid template ID is required'),
  body('name').optional().isLength({ min: 1, max: 100 }).withMessage('Name must be less than 100 characters'),
  body('type').optional().isIn(['order_update', 'promo', 'low_stock', 'new_order', 'fraud', 'payment', 'inventory', 'reminder', 'system', 'marketing']).withMessage('Invalid template type'),
  body('title').optional().isLength({ min: 1, max: 255 }).withMessage('Title must be less than 255 characters'),
  body('message').optional().isLength({ min: 1 }).withMessage('Message cannot be empty'),
  body('channels').optional().isArray().withMessage('Channels must be an array'),
  body('channels.*').optional().isIn(['email', 'sms', 'push', 'inApp']).withMessage('Invalid channel'),
  body('variables').optional().isArray().withMessage('Variables must be an array'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean')
], validateRequest, NotificationController.updateNotificationTemplate);

/**
 * DELETE /templates/:id - Delete notification template
 */
router.delete('/templates/:id', [
  supabaseAdminAuth,
  param('id').isUUID().withMessage('Valid template ID is required')
], validateRequest, NotificationController.deleteNotificationTemplate);

// =====================================================
// NOTIFICATION STATISTICS
// =====================================================

/**
 * GET /stats - Get notification statistics
 */
router.get('/stats', [
  supabaseAdminAuth,
  query('target').optional().isIn(['customer', 'admin']).withMessage('Invalid target'),
  query('from').optional().isISO8601().withMessage('From date must be valid ISO 8601 format'),
  query('to').optional().isISO8601().withMessage('To date must be valid ISO 8601 format')
], validateRequest, NotificationController.getNotificationStats);

/**
 * GET /stats/overview - Get notification overview statistics
 */
router.get('/stats/overview', [
  supabaseAdminAuth
], NotificationController.getNotificationOverview);

// =====================================================
// BULK OPERATIONS
// =====================================================

/**
 * PUT /bulk-read - Mark multiple notifications as read
 */
router.put('/bulk-read', [
  supabaseAdminAuth,
  body('notificationIds').isArray().withMessage('Notification IDs must be an array'),
  body('notificationIds.*').isUUID().withMessage('Each notification ID must be valid UUID')
], validateRequest, NotificationController.bulkMarkAsRead);

/**
 * PUT /bulk-archive - Archive multiple notifications
 */
router.put('/bulk-archive', [
  supabaseAdminAuth,
  body('notificationIds').isArray().withMessage('Notification IDs must be an array'),
  body('notificationIds.*').isUUID().withMessage('Each notification ID must be valid UUID')
], validateRequest, NotificationController.bulkArchive);

/**
 * DELETE /bulk-delete - Delete multiple notifications
 */
router.delete('/bulk-delete', [
  supabaseAdminAuth,
  body('notificationIds').isArray().withMessage('Notification IDs must be an array'),
  body('notificationIds.*').isUUID().withMessage('Each notification ID must be valid UUID')
], validateRequest, NotificationController.bulkDelete);

export default router;
