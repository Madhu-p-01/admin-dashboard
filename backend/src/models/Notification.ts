// admin-dashboard/backend/src/models/Notification.ts

export type NotificationType = 
  | 'order_update' 
  | 'promo' 
  | 'low_stock' 
  | 'new_order' 
  | 'fraud' 
  | 'payment' 
  | 'inventory' 
  | 'reminder' 
  | 'system' 
  | 'marketing';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export type NotificationChannel = 'email' | 'sms' | 'push' | 'inApp';

export type NotificationTarget = 'customer' | 'admin';

export interface Notification {
  id: string;
  target: NotificationTarget;
  targetId: string; // customer_id or admin_id
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  channels: NotificationChannel[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor?: Date;
  sentAt?: Date;
  readAt?: Date;
  archivedAt?: Date;
  metadata?: Record<string, any>; // Additional context data
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  userType: NotificationTarget;
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  // Type-specific preferences
  orderUpdates: boolean;
  promotions: boolean;
  lowStock: boolean;
  newOrders: boolean;
  fraudAlerts: boolean;
  paymentAlerts: boolean;
  inventoryAlerts: boolean;
  reminders: boolean;
  systemAlerts: boolean;
  marketing: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  title: string;
  message: string;
  channels: NotificationChannel[];
  variables: string[]; // Template variables like {{orderNumber}}, {{customerName}}
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationStats {
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
  archivedCount: number;
  byType: Record<NotificationType, number>;
  byChannel: Record<NotificationChannel, number>;
  recentActivity: {
    last24Hours: number;
    last7Days: number;
    last30Days: number;
  };
}

export interface CreateNotificationRequest {
  target: NotificationTarget;
  targetId: string;
  type: NotificationType;
  title: string;
  message: string;
  channels?: NotificationChannel[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor?: Date;
  metadata?: Record<string, any>;
}

export interface UpdatePreferencesRequest {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
  inApp?: boolean;
  orderUpdates?: boolean;
  promotions?: boolean;
  lowStock?: boolean;
  newOrders?: boolean;
  fraudAlerts?: boolean;
  paymentAlerts?: boolean;
  inventoryAlerts?: boolean;
  reminders?: boolean;
  systemAlerts?: boolean;
  marketing?: boolean;
}

export interface NotificationFilters {
  status?: NotificationStatus;
  type?: NotificationType;
  channel?: NotificationChannel;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  from?: Date;
  to?: Date;
  page?: number;
  limit?: number;
}
