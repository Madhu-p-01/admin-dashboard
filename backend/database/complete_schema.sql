-- =====================================================
-- COMPLETE ECOMMERCE ADMIN DASHBOARD SCHEMA
-- =====================================================
-- This file contains ALL schemas: Authentication, Products, Customers, Orders, 
-- Team Management, Notifications, Analytics, and more.
-- Run this single file to set up your entire database.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- AUTHENTICATION & ADMIN MANAGEMENT
-- =====================================================

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    permissions TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Sessions Table (for token blacklisting)
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_revoked BOOLEAN DEFAULT false
);

-- Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    attributes JSONB,
    images TEXT[],
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address JSONB,
    preferences JSONB,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0.00,
    last_order_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(customer_id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
    payment_method VARCHAR(50),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (tax_amount >= 0),
    shipping_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (shipping_amount >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (discount_amount >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(3) DEFAULT 'INR',
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    notes TEXT,
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(product_id),
    variant_id UUID REFERENCES product_variants(variant_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TEAM MANAGEMENT
-- =====================================================

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

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS & COMMUNICATION
-- =====================================================

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target VARCHAR(20) NOT NULL CHECK (target IN ('customer', 'admin')),
    target_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'order_created', 'order_updated', 'order_cancelled',
        'payment_success', 'payment_failed',
        'product_low_stock', 'product_out_of_stock',
        'customer_registered', 'customer_updated',
        'system_alert', 'maintenance'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Templates Table
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channels TEXT[] NOT NULL DEFAULT '{}',
    variables TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DISCOUNTS & PROMOTIONS
-- =====================================================

-- Discounts Table
CREATE TABLE IF NOT EXISTS discounts (
    discount_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
    value DECIMAL(10,2) NOT NULL CHECK (value >= 0),
    minimum_amount DECIMAL(10,2),
    maximum_discount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS & REPORTING
-- =====================================================

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    user_id UUID,
    session_id VARCHAR(255),
    properties JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Admin tables indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_user_id ON admin_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at);

-- E-commerce tables indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Team management indexes
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_target ON notifications(target);
CREATE INDEX IF NOT EXISTS idx_notifications_target_id ON notifications(target_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at 
    BEFORE UPDATE ON product_variants 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON team_members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at 
    BEFORE UPDATE ON roles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at 
    BEFORE UPDATE ON notification_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discounts_updated_at 
    BEFORE UPDATE ON discounts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy for admin_users (users can only see their own data, super_admin can see all)
CREATE POLICY admin_users_policy ON admin_users
    FOR ALL
    USING (
        auth.uid()::uuid = id OR 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()::uuid AND role = 'super_admin'
        )
    );

-- Policy for admin_sessions (users can only see their own sessions)
CREATE POLICY admin_sessions_policy ON admin_sessions
    FOR ALL
    USING (user_id = auth.uid()::uuid);

-- Policy for admin_audit_logs (super_admin can see all, others can see their own)
CREATE POLICY admin_audit_logs_policy ON admin_audit_logs
    FOR ALL
    USING (
        user_id = auth.uid()::uuid OR 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()::uuid AND role = 'super_admin'
        )
    );

-- =====================================================
-- DEFAULT DATA INSERTION
-- =====================================================

-- Insert default admin users (password: admin123)
INSERT INTO admin_users (email, password_hash, name, role, permissions) 
VALUES (
    'admin@syntellite.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', -- admin123
    'Super Admin',
    'super_admin',
    ARRAY['*'] -- All permissions
) ON CONFLICT (email) DO NOTHING;

INSERT INTO admin_users (email, password_hash, name, role, permissions) 
VALUES (
    'admin@test.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', -- admin123
    'Test Admin',
    'admin',
    ARRAY['products:read', 'products:write', 'orders:read', 'orders:write', 'customers:read', 'customers:write']
) ON CONFLICT (email) DO NOTHING;

-- Insert default roles
INSERT INTO roles (name, description, permissions, is_system) 
SELECT 'super_admin', 'Super Administrator', ARRAY[
    'orders:read', 'orders:write', 'orders:delete',
    'products:read', 'products:write', 'products:delete',
    'customers:read', 'customers:write', 'customers:delete',
    'categories:read', 'categories:write', 'categories:delete',
    'team:read', 'team:write', 'team:delete',
    'analytics:read', 'analytics:export',
    'settings:read', 'settings:write',
    'reports:read', 'reports:export'
], true
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'super_admin');

INSERT INTO roles (name, description, permissions, is_system) 
SELECT 'admin', 'Administrator', ARRAY[
    'orders:read', 'orders:write', 'orders:delete',
    'products:read', 'products:write', 'products:delete',
    'customers:read', 'customers:write', 'customers:delete',
    'categories:read', 'categories:write', 'categories:delete',
    'team:read', 'team:write',
    'analytics:read', 'analytics:export',
    'reports:read', 'reports:export'
], true
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'admin');

INSERT INTO roles (name, description, permissions, is_system) 
SELECT 'manager', 'Manager', ARRAY[
    'orders:read', 'orders:write',
    'products:read', 'products:write',
    'customers:read', 'customers:write',
    'categories:read', 'categories:write',
    'analytics:read',
    'reports:read'
], true
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'manager');

INSERT INTO roles (name, description, permissions, is_system) 
SELECT 'staff', 'Staff', ARRAY[
    'orders:read',
    'products:read',
    'customers:read',
    'categories:read'
], true
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'staff');

-- Insert sample team members
INSERT INTO team_members (name, email, role, permissions, status) 
SELECT 'Super Admin', 'superadmin@store.com', 'super_admin', ARRAY[
    'orders:read', 'orders:write', 'orders:delete',
    'products:read', 'products:write', 'products:delete',
    'customers:read', 'customers:write', 'customers:delete',
    'categories:read', 'categories:write', 'categories:delete',
    'team:read', 'team:write', 'team:delete',
    'analytics:read', 'analytics:export',
    'settings:read', 'settings:write',
    'reports:read', 'reports:export'
], 'active'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE email = 'superadmin@store.com');

INSERT INTO team_members (name, email, role, permissions, status) 
SELECT 'Store Manager', 'manager@store.com', 'manager', ARRAY[
    'orders:read', 'orders:write',
    'products:read', 'products:write',
    'customers:read', 'customers:write',
    'categories:read', 'categories:write',
    'analytics:read',
    'reports:read'
], 'active'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE email = 'manager@store.com');

-- Insert notification templates
INSERT INTO notification_templates (name, type, title, message, channels, variables, is_active)
SELECT 'new_order_admin', 'new_order', 'New Order - {{orderNumber}}', 'New order {{orderNumber}} placed by {{customerName}} for ₹{{orderTotal}}.', ARRAY['inApp', 'email'], ARRAY['orderNumber', 'customerName', 'orderTotal'], true
WHERE NOT EXISTS (SELECT 1 FROM notification_templates WHERE name = 'new_order_admin');

INSERT INTO notification_templates (name, type, title, message, channels, variables, is_active)
SELECT 'order_status_update', 'order_updated', 'Order {{orderNumber}} Status Update', 'Your order {{orderNumber}} status has been updated to {{orderStatus}}.', ARRAY['inApp', 'email', 'sms'], ARRAY['orderNumber', 'orderStatus'], true
WHERE NOT EXISTS (SELECT 1 FROM notification_templates WHERE name = 'order_status_update');

INSERT INTO notification_templates (name, type, title, message, channels, variables, is_active)
SELECT 'low_stock_alert', 'product_low_stock', 'Low Stock Alert - {{productName}}', 'Product {{productName}} is running low on stock. Current stock: {{currentStock}}', ARRAY['inApp', 'email'], ARRAY['productName', 'currentStock'], true
WHERE NOT EXISTS (SELECT 1 FROM notification_templates WHERE name = 'low_stock_alert');

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Order summary view
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.order_id,
    o.order_number,
    o.status,
    o.payment_status,
    o.total_amount,
    o.created_at,
    c.name as customer_name,
    c.email as customer_email,
    COUNT(oi.item_id) as item_count
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, o.order_number, o.status, o.payment_status, o.total_amount, o.created_at, c.name, c.email;

-- Product performance view
CREATE OR REPLACE VIEW product_performance AS
SELECT 
    p.product_id,
    p.name,
    p.price,
    p.stock_quantity,
    p.rating,
    p.review_count,
    COUNT(oi.item_id) as times_ordered,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.total_price) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.name, p.price, p.stock_quantity, p.rating, p.review_count;

-- Customer analytics view
CREATE OR REPLACE VIEW customer_analytics AS
SELECT 
    c.customer_id,
    c.name,
    c.email,
    c.total_orders,
    c.total_spent,
    c.last_order_date,
    COUNT(o.order_id) as actual_orders,
    AVG(o.total_amount) as avg_order_value,
    MAX(o.created_at) as most_recent_order
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.email, c.total_orders, c.total_spent, c.last_order_date;

-- Notification summary view
CREATE OR REPLACE VIEW notification_summary AS
SELECT 
    n.id,
    n.type,
    n.title,
    n.is_read,
    n.created_at,
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
    type,
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN is_read = true THEN 1 END) as read_notifications,
    COUNT(CASE WHEN is_read = false THEN 1 END) as unread_notifications,
    ROUND(
        COUNT(CASE WHEN is_read = true THEN 1 END) * 100.0 / COUNT(*), 2
    ) as read_percentage
FROM notifications
GROUP BY type;

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
-- This schema includes:
--  Authentication & Admin Management
-- Core E-commerce Tables
--  Team Management
--  Notifications & Communication
-- Discounts & Promotions
--  Analytics & Reporting
--  Performance Indexes
--  Security Policies
--  Default Data
--  Reporting Views
