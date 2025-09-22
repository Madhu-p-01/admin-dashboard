-- =====================================================
-- MASTER SCHEMA - COMPLETE ECOMMERCE ADMIN DASHBOARD
-- =====================================================
-- This file contains ALL schemas: Products, Customers, Orders, 
-- Team Management, Notifications, Analytics, and more.
-- Run this single file to set up your entire database.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE ECOMMERCE TABLES
-- =====================================================

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES categories(category_id),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category_id UUID REFERENCES categories(category_id),
    sku VARCHAR(100) UNIQUE,
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    min_stock_level INTEGER DEFAULT 5,
    weight DECIMAL(8,2),
    dimensions JSONB,
    images TEXT[],
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
    featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
    variant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    attributes JSONB,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address JSONB,
    loyalty_points INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
    shipping_cost DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    notes TEXT,
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    variant_id UUID REFERENCES product_variants(variant_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(12,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart Table
CREATE TABLE IF NOT EXISTS carts (
    cart_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    variant_id UUID REFERENCES product_variants(variant_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discounts Table
CREATE TABLE IF NOT EXISTS discounts (
    discount_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping')),
    value DECIMAL(10,2) NOT NULL CHECK (value >= 0),
    min_order_amount DECIMAL(10,2),
    max_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TEAM MANAGEMENT SYSTEM
-- =====================================================

-- Roles Table (for RBAC)
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES team_members(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES team_members(id),
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS SYSTEM
-- =====================================================

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target VARCHAR(20) NOT NULL CHECK (target IN ('customer', 'admin')),
    target_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'order_update', 'promo', 'low_stock', 'new_order', 'fraud', 
        'payment', 'inventory', 'reminder', 'system', 'marketing'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    channels TEXT[] DEFAULT '{"inApp"}',
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'admin')),
    email BOOLEAN DEFAULT TRUE,
    sms BOOLEAN DEFAULT FALSE,
    push BOOLEAN DEFAULT TRUE,
    in_app BOOLEAN DEFAULT TRUE,
    order_updates BOOLEAN DEFAULT TRUE,
    promotions BOOLEAN DEFAULT TRUE,
    low_stock BOOLEAN DEFAULT TRUE,
    new_orders BOOLEAN DEFAULT TRUE,
    fraud_alerts BOOLEAN DEFAULT TRUE,
    payment_alerts BOOLEAN DEFAULT TRUE,
    inventory_alerts BOOLEAN DEFAULT TRUE,
    reminders BOOLEAN DEFAULT TRUE,
    system_alerts BOOLEAN DEFAULT TRUE,
    marketing BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, user_type)
);

-- Notification Templates Table
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'order_update', 'promo', 'low_stock', 'new_order', 'fraud',
        'payment', 'inventory', 'reminder', 'system', 'marketing'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channels TEXT[] DEFAULT '{"inApp"}',
    variables TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ADDITIONAL ECOMMERCE FEATURES
-- =====================================================

-- Blacklisted Customers Table
CREATE TABLE IF NOT EXISTS blacklisted_customers (
    customer_id UUID PRIMARY KEY REFERENCES customers(customer_id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    blacklisted_by UUID REFERENCES team_members(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suspended Customers Table
CREATE TABLE IF NOT EXISTS suspended_customers (
    customer_id UUID PRIMARY KEY REFERENCES customers(customer_id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    suspended_until TIMESTAMP WITH TIME ZONE,
    suspended_by UUID REFERENCES team_members(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loyalty Points History Table
CREATE TABLE IF NOT EXISTS loyalty_points_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    points INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'redeemed', 'expired', 'adjusted')),
    description TEXT,
    order_id UUID REFERENCES orders(order_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Notes Table
CREATE TABLE IF NOT EXISTS order_notes (
    note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_by UUID REFERENCES team_members(id),
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refunds Table
CREATE TABLE IF NOT EXISTS refunds (
    refund_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processed')),
    processed_by UUID REFERENCES team_members(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flagged Orders Table
CREATE TABLE IF NOT EXISTS flagged_orders (
    flag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id),
    reason TEXT NOT NULL,
    flagged_by UUID REFERENCES team_members(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_positive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES team_members(id)
);

-- Order Tracking Table
CREATE TABLE IF NOT EXISTS order_tracking (
    tracking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id),
    carrier VARCHAR(100) NOT NULL,
    tracking_number VARCHAR(255) NOT NULL,
    estimated_delivery DATE,
    status VARCHAR(50) DEFAULT 'in_transit',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);

-- Variant indexes
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_archived ON orders(archived);

-- Order item indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Cart indexes
CREATE INDEX IF NOT EXISTS idx_carts_customer_id ON carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

-- Review indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);

-- Customer indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_loyalty_points ON customers(loyalty_points);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

-- Discount indexes
CREATE INDEX IF NOT EXISTS idx_discounts_code ON discounts(code);
CREATE INDEX IF NOT EXISTS idx_discounts_status ON discounts(status);
CREATE INDEX IF NOT EXISTS idx_discounts_start_date ON discounts(start_date);
CREATE INDEX IF NOT EXISTS idx_discounts_end_date ON discounts(end_date);

-- Team management indexes
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_target_id ON notifications(target_id);
CREATE INDEX IF NOT EXISTS idx_notifications_target ON notifications(target);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);

CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_type ON notification_preferences(user_type);

CREATE INDEX IF NOT EXISTS idx_notification_templates_name ON notification_templates(name);
CREATE INDEX IF NOT EXISTS idx_notification_templates_type ON notification_templates(type);
CREATE INDEX IF NOT EXISTS idx_notification_templates_active ON notification_templates(is_active);

-- Additional feature indexes
CREATE INDEX IF NOT EXISTS idx_blacklisted_customers_created_at ON blacklisted_customers(created_at);
CREATE INDEX IF NOT EXISTS idx_suspended_customers_created_at ON suspended_customers(created_at);
CREATE INDEX IF NOT EXISTS idx_suspended_customers_until ON suspended_customers(suspended_until);
CREATE INDEX IF NOT EXISTS idx_loyalty_history_customer_id ON loyalty_points_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_history_type ON loyalty_points_history(type);
CREATE INDEX IF NOT EXISTS idx_loyalty_history_created_at ON loyalty_points_history(created_at);
CREATE INDEX IF NOT EXISTS idx_order_notes_order_id ON order_notes(order_id);
CREATE INDEX IF NOT EXISTS idx_order_notes_created_at ON order_notes(created_at);
CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);
CREATE INDEX IF NOT EXISTS idx_flagged_orders_order_id ON flagged_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_flagged_orders_status ON flagged_orders(status);
CREATE INDEX IF NOT EXISTS idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_tracking_number ON order_tracking(tracking_number);

-- =====================================================
-- TRIGGER FUNCTIONS
-- =====================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Create triggers for updated_at (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_products_updated_at') THEN
        CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_customers_updated_at') THEN
        CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at') THEN
        CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_team_members_updated_at') THEN
        CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_roles_updated_at') THEN
        CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_notifications_updated_at') THEN
        CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_notification_preferences_updated_at') THEN
        CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_notification_templates_updated_at') THEN
        CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- Team member details view
CREATE OR REPLACE VIEW team_member_details AS
SELECT 
    tm.id, tm.name, tm.email, tm.role, tm.permissions, tm.status, tm.joined_at, tm.last_login, tm.created_by, tm.updated_at,
    r.description as role_description, r.is_system as role_is_system
FROM team_members tm
LEFT JOIN roles r ON tm.role = r.name;

-- Audit log details view
CREATE OR REPLACE VIEW audit_log_details AS
SELECT 
    al.id, al.user_id, al.user_name, al.action, al.resource, al.resource_id, al.details, al.ip_address, al.user_agent, al.timestamp,
    tm.role as user_role
FROM audit_logs al
LEFT JOIN team_members tm ON al.user_id = tm.id;

-- Notification details view
CREATE OR REPLACE VIEW notification_details AS
SELECT 
    n.id, n.target, n.target_id, n.type, n.title, n.message, n.status, n.channels, n.priority, n.scheduled_for, n.sent_at, n.read_at, n.archived_at, n.metadata, n.created_at, n.updated_at,
    CASE 
        WHEN n.target = 'customer' THEN c.name
        WHEN n.target = 'admin' THEN tm.name
        ELSE 'Unknown'
    END as target_name,
    CASE 
        WHEN n.target = 'customer' THEN c.email
        WHEN n.target = 'admin' THEN tm.email
        ELSE NULL
    END as target_email
FROM notifications n
LEFT JOIN customers c ON n.target = 'customer' AND n.target_id = c.customer_id
LEFT JOIN team_members tm ON n.target = 'admin' AND n.target_id = tm.id;

-- Notification stats view
CREATE OR REPLACE VIEW notification_stats AS
SELECT 
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN status = 'unread' THEN 1 END) as unread_count,
    COUNT(CASE WHEN status = 'read' THEN 1 END) as read_count,
    COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_count,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as last_24_hours,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as last_7_days,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
FROM notifications;

-- =====================================================
-- ANALYTICS & MARKETING TABLES
-- =====================================================

-- Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'social', 'search', 'display', 'affiliate', 'influencer')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    budget DECIMAL(12,2),
    spent DECIMAL(12,2) DEFAULT 0.00,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    target_audience JSONB,
    metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website Traffic Table
CREATE TABLE IF NOT EXISTS website_traffic (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    page VARCHAR(255) NOT NULL,
    visits INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_session_duration INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    traffic_source VARCHAR(100),
    device_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market Segments Table
CREATE TABLE IF NOT EXISTS market_segments (
    segment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criteria JSONB NOT NULL,
    customer_count INTEGER DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0.00,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_type ON marketing_campaigns(type);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_start_date ON marketing_campaigns(start_date);

CREATE INDEX IF NOT EXISTS idx_website_traffic_date ON website_traffic(date);
CREATE INDEX IF NOT EXISTS idx_website_traffic_page ON website_traffic(page);
CREATE INDEX IF NOT EXISTS idx_website_traffic_source ON website_traffic(traffic_source);
CREATE INDEX IF NOT EXISTS idx_website_traffic_device ON website_traffic(device_type);

CREATE INDEX IF NOT EXISTS idx_market_segments_name ON market_segments(name);
CREATE INDEX IF NOT EXISTS idx_market_segments_active ON market_segments(is_active);

-- =====================================================
-- SAMPLE DATA (SAFE INSERTS)
-- =====================================================

-- Insert default roles
INSERT INTO roles (name, description, permissions, is_system) 
SELECT 'super_admin', 'Super Administrator', ARRAY[
    'orders:read', 'orders:write', 'orders:delete',
    'products:read', 'products:write', 'products:delete',
    'customers:read', 'customers:write', 'customers:delete',
    'discounts:read', 'discounts:write', 'discounts:delete',
    'analytics:read', 'analytics:export',
    'team:read', 'team:write', 'team:delete',
    'settings:read', 'settings:write',
    'inventory:read', 'inventory:write',
    'reports:read', 'reports:export'
], true
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'super_admin');

INSERT INTO roles (name, description, permissions, is_system) 
SELECT 'admin', 'Administrator', ARRAY[
    'orders:read', 'orders:write', 'orders:delete',
    'products:read', 'products:write', 'products:delete',
    'customers:read', 'customers:write', 'customers:delete',
    'discounts:read', 'discounts:write', 'discounts:delete',
    'analytics:read', 'analytics:export',
    'team:read', 'team:write', 'team:delete',
    'settings:read', 'settings:write',
    'inventory:read', 'inventory:write',
    'reports:read', 'reports:export'
], true
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'admin');

INSERT INTO roles (name, description, permissions, is_system) 
SELECT 'manager', 'Manager', ARRAY[
    'orders:read', 'orders:write',
    'products:read', 'products:write',
    'customers:read', 'customers:write',
    'analytics:read',
    'inventory:read', 'inventory:write'
], true
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'manager');

INSERT INTO roles (name, description, permissions, is_system) 
SELECT 'support', 'Customer Support', ARRAY[
    'orders:read', 'orders:write',
    'customers:read', 'customers:write',
    'products:read'
], true
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'support');

INSERT INTO roles (name, description, permissions, is_system) 
SELECT 'analyst', 'Data Analyst', ARRAY[
    'analytics:read', 'analytics:export',
    'reports:read', 'reports:export',
    'orders:read', 'products:read', 'customers:read'
], true
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'analyst');

-- Insert sample team members
INSERT INTO team_members (name, email, role, permissions, status) 
SELECT 'Super Admin', 'superadmin@store.com', 'super_admin', ARRAY[
    'orders:read', 'orders:write', 'orders:delete',
    'products:read', 'products:write', 'products:delete',
    'customers:read', 'customers:write', 'customers:delete',
    'discounts:read', 'discounts:write', 'discounts:delete',
    'analytics:read', 'analytics:export',
    'team:read', 'team:write', 'team:delete',
    'settings:read', 'settings:write',
    'inventory:read', 'inventory:write',
    'reports:read', 'reports:export'
], 'active'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE email = 'superadmin@store.com');

INSERT INTO team_members (name, email, role, permissions, status) 
SELECT 'John Manager', 'john.manager@store.com', 'manager', ARRAY[
    'orders:read', 'orders:write',
    'products:read', 'products:write',
    'customers:read', 'customers:write',
    'analytics:read',
    'inventory:read', 'inventory:write'
], 'active'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE email = 'john.manager@store.com');

INSERT INTO team_members (name, email, role, permissions, status) 
SELECT 'Sarah Support', 'sarah.support@store.com', 'support', ARRAY[
    'orders:read', 'orders:write',
    'customers:read', 'customers:write',
    'products:read'
], 'active'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE email = 'sarah.support@store.com');

INSERT INTO team_members (name, email, role, permissions, status) 
SELECT 'Mike Analyst', 'mike.analyst@store.com', 'analyst', ARRAY[
    'analytics:read', 'analytics:export',
    'reports:read', 'reports:export',
    'orders:read', 'products:read', 'customers:read'
], 'active'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE email = 'mike.analyst@store.com');

-- Insert sample notification templates
INSERT INTO notification_templates (name, type, title, message, channels, variables, is_active)
SELECT 'order_shipped', 'order_update', 'Order Shipped - {{orderNumber}}', 'Your order {{orderNumber}} has been shipped and will arrive by {{deliveryDate}}.', ARRAY['inApp', 'email'], ARRAY['orderNumber', 'deliveryDate'], true
WHERE NOT EXISTS (SELECT 1 FROM notification_templates WHERE name = 'order_shipped');

INSERT INTO notification_templates (name, type, title, message, channels, variables, is_active)
SELECT 'order_delivered', 'order_update', 'Order Delivered - {{orderNumber}}', 'Your order {{orderNumber}} has been delivered successfully.', ARRAY['inApp', 'email'], ARRAY['orderNumber'], true
WHERE NOT EXISTS (SELECT 1 FROM notification_templates WHERE name = 'order_delivered');

INSERT INTO notification_templates (name, type, title, message, channels, variables, is_active)
SELECT 'low_stock_alert', 'low_stock', 'Low Stock Alert', '{{productName}} stock is below {{threshold}} units.', ARRAY['inApp', 'email'], ARRAY['productName', 'threshold'], true
WHERE NOT EXISTS (SELECT 1 FROM notification_templates WHERE name = 'low_stock_alert');

INSERT INTO notification_templates (name, type, title, message, channels, variables, is_active)
SELECT 'new_order_admin', 'new_order', 'New Order - {{orderNumber}}', 'New order {{orderNumber}} placed by {{customerName}} for ₹{{orderTotal}}.', ARRAY['inApp', 'email'], ARRAY['orderNumber', 'customerName', 'orderTotal'], true
WHERE NOT EXISTS (SELECT 1 FROM notification_templates WHERE name = 'new_order_admin');

INSERT INTO notification_templates (name, type, title, message, channels, variables, is_active)
SELECT 'promo_notification', 'promo', '{{promoTitle}}', '{{promoMessage}} - Use code {{promoCode}} for {{discount}}% off!', ARRAY['inApp', 'email', 'push'], ARRAY['promoTitle', 'promoMessage', 'promoCode', 'discount'], true
WHERE NOT EXISTS (SELECT 1 FROM notification_templates WHERE name = 'promo_notification');

-- Insert sample marketing campaigns
INSERT INTO marketing_campaigns (name, description, type, status, budget, spent, start_date, end_date, target_audience, metrics)
SELECT 'Summer Sale 2024', 'Summer sale campaign with 30% off', 'email', 'active', 50000.00, 15000.00, '2024-06-01', '2024-08-31', 
    '{"age_range": "25-45", "interests": ["fashion", "electronics"]}', 
    '{"opens": 15000, "clicks": 3000, "conversions": 150}'
WHERE NOT EXISTS (SELECT 1 FROM marketing_campaigns WHERE name = 'Summer Sale 2024');

INSERT INTO marketing_campaigns (name, description, type, status, budget, spent, start_date, end_date, target_audience, metrics)
SELECT 'Black Friday 2024', 'Black Friday mega sale', 'social', 'active', 100000.00, 25000.00, '2024-11-01', '2024-11-30', 
    '{"age_range": "18-65", "interests": ["shopping", "deals"]}', 
    '{"impressions": 500000, "clicks": 25000, "conversions": 500}'
WHERE NOT EXISTS (SELECT 1 FROM marketing_campaigns WHERE name = 'Black Friday 2024');

-- Insert sample website traffic data
INSERT INTO website_traffic (date, page, visits, unique_visitors, page_views, bounce_rate, avg_session_duration, conversions, conversion_rate, traffic_source, device_type)
SELECT '2024-09-20', '/products', 5000, 4000, 8000, 35.5, 180, 250, 5.0, 'Organic Search', 'Desktop'
WHERE NOT EXISTS (SELECT 1 FROM website_traffic WHERE date = '2024-09-20' AND page = '/products');

INSERT INTO website_traffic (date, page, visits, unique_visitors, page_views, bounce_rate, avg_session_duration, conversions, conversion_rate, traffic_source, device_type)
SELECT '2024-09-20', '/categories', 3000, 2500, 4500, 40.2, 150, 120, 4.0, 'Direct', 'Mobile'
WHERE NOT EXISTS (SELECT 1 FROM website_traffic WHERE date = '2024-09-20' AND page = '/categories');

INSERT INTO website_traffic (date, page, visits, unique_visitors, page_views, bounce_rate, avg_session_duration, conversions, conversion_rate, traffic_source, device_type)
SELECT '2024-09-20', '/home', 2000, 1800, 3000, 45.0, 120, 80, 4.0, 'Social Media', 'Tablet'
WHERE NOT EXISTS (SELECT 1 FROM website_traffic WHERE date = '2024-09-20' AND page = '/home');

-- Insert sample market segments
INSERT INTO market_segments (name, description, criteria, customer_count, avg_order_value, total_revenue, is_active)
SELECT 'High Value Customers', 'Customers with high lifetime value', '{"min_orders": 5, "min_total_spent": 10000}', 150, 2500.00, 375000.00, true
WHERE NOT EXISTS (SELECT 1 FROM market_segments WHERE name = 'High Value Customers');

INSERT INTO market_segments (name, description, criteria, customer_count, avg_order_value, total_revenue, is_active)
SELECT 'Frequent Buyers', 'Customers who shop regularly', '{"min_orders": 3, "timeframe": "90_days"}', 500, 800.00, 400000.00, true
WHERE NOT EXISTS (SELECT 1 FROM market_segments WHERE name = 'Frequent Buyers');

INSERT INTO market_segments (name, description, criteria, customer_count, avg_order_value, total_revenue, is_active)
SELECT 'New Customers', 'Recently registered customers', '{"registration_days": 30}', 200, 300.00, 60000.00, true
WHERE NOT EXISTS (SELECT 1 FROM market_segments WHERE name = 'New Customers');

-- Success message
SELECT 'Master schema created successfully! All tables, indexes, triggers, views, and sample data are ready.' as message;
