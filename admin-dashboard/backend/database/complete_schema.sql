-- Complete Database Schema for E-commerce Platform
-- Run this entire script in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(category_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    category_id UUID REFERENCES categories(category_id),
    images TEXT[],
    sizes TEXT[],
    colors TEXT[],
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
    variant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    size VARCHAR(50),
    color VARCHAR(50),
    price DECIMAL(10,2),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    sku VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    preferences JSONB DEFAULT '{}',
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    address_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    country VARCHAR(50) DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carts Table
CREATE TABLE IF NOT EXISTS carts (
    cart_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    variant_id UUID REFERENCES product_variants(variant_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlists Table
CREATE TABLE IF NOT EXISTS wishlists (
    wishlist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned')),
    total_amount DECIMAL(10,2) NOT NULL,
    discount_applied UUID,
    shipping_address JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    variant_id UUID REFERENCES product_variants(variant_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id),
    method VARCHAR(20) CHECK (method IN ('COD', 'UPI', 'Card', 'Wallet')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discounts Table
CREATE TABLE IF NOT EXISTS discounts (
    discount_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping')),
    value DECIMAL(10,2) NOT NULL,
    min_purchase DECIMAL(10,2) DEFAULT 0,
    max_discount DECIMAL(10,2),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    usage_limit INTEGER,
    per_customer_limit INTEGER DEFAULT 1,
    applicable_categories UUID[],
    applicable_products UUID[],
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    helpful_votes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'visible' CHECK (status IN ('visible', 'hidden', 'reported')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, customer_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR(20) CHECK (type IN ('order_update', 'promo', 'alert', 'system')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
    channels TEXT[] DEFAULT ARRAY['inApp'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Logs Table
CREATE TABLE IF NOT EXISTS analytics_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) CHECK (entity_type IN ('product', 'order', 'customer', 'admin')),
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    user_id UUID,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Members Table
CREATE TABLE IF NOT EXISTS admin_members (
    member_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) CHECK (role IN ('super_admin', 'admin', 'manager', 'support', 'analyst')),
    permissions TEXT[],
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Blacklisted Customers Table
CREATE TABLE IF NOT EXISTS blacklisted_customers (
    customer_id UUID PRIMARY KEY REFERENCES customers(customer_id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    blacklisted_by UUID REFERENCES admin_members(member_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suspended Customers Table
CREATE TABLE IF NOT EXISTS suspended_customers (
    customer_id UUID PRIMARY KEY REFERENCES customers(customer_id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    suspended_until TIMESTAMP WITH TIME ZONE,
    suspended_by UUID REFERENCES admin_members(member_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loyalty Points History Table
CREATE TABLE IF NOT EXISTS loyalty_points_history (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    type VARCHAR(10) CHECK (type IN ('add', 'redeem')) NOT NULL,
    points INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    admin_id UUID REFERENCES admin_members(member_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Notes Table (Order Management)
CREATE TABLE IF NOT EXISTS order_notes (
    note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_by UUID REFERENCES admin_members(member_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refunds Table (Order Management)
CREATE TABLE IF NOT EXISTS refunds (
    refund_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id),
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    processed_by UUID REFERENCES admin_members(member_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flagged Orders Table (Order Management)
CREATE TABLE IF NOT EXISTS flagged_orders (
    flag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id),
    reason TEXT NOT NULL,
    flagged_by UUID REFERENCES admin_members(member_id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_positive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES admin_members(member_id)
);

-- Order Tracking Table (Order Management)
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

-- Add additional columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_carts_customer_id ON carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_discounts_code ON discounts(code);
CREATE INDEX IF NOT EXISTS idx_discounts_status ON discounts(status);
CREATE INDEX IF NOT EXISTS idx_discounts_start_date ON discounts(start_date);
CREATE INDEX IF NOT EXISTS idx_discounts_end_date ON discounts(end_date);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_loyalty_points ON customers(loyalty_points);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
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
CREATE INDEX IF NOT EXISTS idx_orders_archived ON orders(archived);

-- Insert Sample Data
INSERT INTO customers (customer_id, name, email, phone, password_hash, loyalty_points, preferences, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Ravi Kumar', 'ravi.kumar@example.com', '+91-9876543210', '$2a$10$hashedpasswordexample', 150, '{"newsletter": true, "category_preferences": "clothing"}', '2024-11-01 09:00:00+00', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Anita Sharma', 'anita.sharma@example.com', '+91-9123456789', '$2a$10$hashedpasswordexample', 40, '{"newsletter": false, "category_preferences": "electronics"}', '2025-01-15 14:30:00+00', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Rajesh Patel', 'rajesh.patel@example.com', '+91-9988776655', '$2a$10$hashedpasswordexample', 300, '{"newsletter": true, "category_preferences": "books"}', '2024-08-20 10:15:00+00', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Priya Gupta', 'priya.gupta@example.com', '+91-9555666777', '$2a$10$hashedpasswordexample', 0, '{"newsletter": true, "category_preferences": "home"}', '2025-02-10 16:45:00+00', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Amit Singh', 'amit.singh@example.com', '+91-9444333222', '$2a$10$hashedpasswordexample', 500, '{"newsletter": false, "category_preferences": "sports"}', '2024-06-05 12:30:00+00', NOW());

INSERT INTO addresses (address_id, customer_id, name, phone, line1, line2, city, state, postal_code, country, is_default, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Ravi Kumar', '+91-9876543210', '123, MG Road', 'Apartment 2B', 'Delhi', 'Delhi', '110001', 'India', true, NOW()),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Anita Sharma', '+91-9123456789', '456, Brigade Road', 'Floor 3', 'Bangalore', 'Karnataka', '560001', 'India', true, NOW()),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Rajesh Patel', '+91-9988776655', '789, Commercial Street', NULL, 'Mumbai', 'Maharashtra', '400001', 'India', true, NOW()),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Priya Gupta', '+91-9555666777', '321, Park Street', 'Building A', 'Kolkata', 'West Bengal', '700001', 'India', true, NOW()),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Amit Singh', '+91-9444333222', '654, Residency Road', 'Unit 5', 'Chennai', 'Tamil Nadu', '600001', 'India', true, NOW());

INSERT INTO categories (category_id, name, description, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'Clothing', 'Fashion and apparel', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', 'Electronics', 'Electronic devices and gadgets', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440103', 'Books', 'Books and literature', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440104', 'Home', 'Home and garden products', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440105', 'Sports', 'Sports and fitness equipment', NOW(), NOW());

INSERT INTO products (product_id, name, description, price, currency, stock, category_id, images, sizes, colors, rating, status, is_featured, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440201', 'Denim Jacket', 'Classic blue denim jacket', 2499.00, 'INR', 50, '550e8400-e29b-41d4-a716-446655440101', ARRAY['https://example.com/denim1.jpg', 'https://example.com/denim2.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue', 'Black'], 4.5, 'active', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440202', 'Cotton T-Shirt', 'Comfortable cotton t-shirt', 899.00, 'INR', 100, '550e8400-e29b-41d4-a716-446655440101', ARRAY['https://example.com/tshirt1.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['White', 'Black', 'Red', 'Blue'], 4.2, 'active', false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440203', 'Smartphone', 'Latest smartphone with advanced features', 25000.00, 'INR', 25, '550e8400-e29b-41d4-a716-446655440102', ARRAY['https://example.com/phone1.jpg'], ARRAY['128GB', '256GB'], ARRAY['Black', 'White', 'Blue'], 4.8, 'active', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440204', 'Programming Book', 'Complete guide to programming', 599.00, 'INR', 75, '550e8400-e29b-41d4-a716-446655440103', ARRAY['https://example.com/book1.jpg'], ARRAY['Paperback'], ARRAY['N/A'], 4.6, 'active', false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440205', 'Yoga Mat', 'Premium quality yoga mat', 1299.00, 'INR', 30, '550e8400-e29b-41d4-a716-446655440105', ARRAY['https://example.com/yogamat1.jpg'], ARRAY['Standard'], ARRAY['Purple', 'Blue', 'Pink'], 4.3, 'active', false, NOW(), NOW());

INSERT INTO orders (order_id, customer_id, status, total_amount, shipping_address, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'shipped', 4717.60, '{"name": "Ravi Kumar", "phone": "+91-9876543210", "address": "123, MG Road, Delhi", "pincode": "110001"}', '2025-09-16 10:30:00+00', NOW()),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'delivered', 2499.00, '{"name": "Ravi Kumar", "phone": "+91-9876543210", "address": "123, MG Road, Delhi", "pincode": "110001"}', '2025-09-12 14:20:00+00', NOW()),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'delivered', 1899.50, '{"name": "Ravi Kumar", "phone": "+91-9876543210", "address": "123, MG Road, Delhi", "pincode": "110001"}', '2025-08-28 09:15:00+00', NOW()),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'delivered', 3200.00, '{"name": "Ravi Kumar", "phone": "+91-9876543210", "address": "123, MG Road, Delhi", "pincode": "110001"}', '2025-07-10 11:45:00+00', NOW()),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'cancelled', 1550.00, '{"name": "Ravi Kumar", "phone": "+91-9876543210", "address": "123, MG Road, Delhi", "pincode": "110001"}', '2025-06-15 13:30:00+00', NOW()),
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'delivered', 1850.00, '{"name": "Anita Sharma", "phone": "+91-9123456789", "address": "456, Brigade Road, Bangalore", "pincode": "560001"}', '2025-08-20 15:10:00+00', NOW()),
('750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'pending', 2150.00, '{"name": "Anita Sharma", "phone": "+91-9123456789", "address": "456, Brigade Road, Bangalore", "pincode": "560001"}', '2025-09-18 10:00:00+00', NOW()),
('750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'delivered', 5500.00, '{"name": "Rajesh Patel", "phone": "+91-9988776655", "address": "789, Commercial Street, Mumbai", "pincode": "400001"}', '2025-07-25 12:20:00+00', NOW()),
('750e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'shipped', 3200.00, '{"name": "Rajesh Patel", "phone": "+91-9988776655", "address": "789, Commercial Street, Mumbai", "pincode": "400001"}', '2025-09-10 14:15:00+00', NOW()),
('750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'delivered', 4100.00, '{"name": "Rajesh Patel", "phone": "+91-9988776655", "address": "789, Commercial Street, Mumbai", "pincode": "400001"}', '2025-05-18 16:30:00+00', NOW());

INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440301', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440201', 2, 2499.00, NOW()),
('550e8400-e29b-41d4-a716-446655440302', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440202', 1, 899.00, NOW()),
('550e8400-e29b-41d4-a716-446655440303', '750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440201', 1, 2499.00, NOW()),
('550e8400-e29b-41d4-a716-446655440304', '750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440202', 2, 899.00, NOW()),
('550e8400-e29b-41d4-a716-446655440305', '750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440203', 1, 25000.00, NOW()),
('550e8400-e29b-41d4-a716-446655440306', '750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440204', 1, 599.00, NOW()),
('550e8400-e29b-41d4-a716-446655440307', '750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440202', 1, 899.00, NOW()),
('550e8400-e29b-41d4-a716-446655440308', '750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440205', 1, 1299.00, NOW()),
('550e8400-e29b-41d4-a716-446655440309', '750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440203', 1, 25000.00, NOW()),
('550e8400-e29b-41d4-a716-446655440310', '750e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440201', 1, 2499.00, NOW()),
('550e8400-e29b-41d4-a716-446655440311', '750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440204', 2, 599.00, NOW());

INSERT INTO payments (payment_id, order_id, method, status, transaction_id, amount, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440401', '750e8400-e29b-41d4-a716-446655440001', 'UPI', 'paid', 'TXN123456789', 4717.60, NOW()),
('550e8400-e29b-41d4-a716-446655440402', '750e8400-e29b-41d4-a716-446655440002', 'Card', 'paid', 'TXN123456790', 2499.00, NOW()),
('550e8400-e29b-41d4-a716-446655440403', '750e8400-e29b-41d4-a716-446655440003', 'UPI', 'paid', 'TXN123456791', 1899.50, NOW()),
('550e8400-e29b-41d4-a716-446655440404', '750e8400-e29b-41d4-a716-446655440004', 'Card', 'paid', 'TXN123456792', 3200.00, NOW()),
('550e8400-e29b-41d4-a716-446655440405', '750e8400-e29b-41d4-a716-446655440005', 'UPI', 'failed', 'TXN123456793', 1550.00, NOW()),
('550e8400-e29b-41d4-a716-446655440406', '750e8400-e29b-41d4-a716-446655440006', 'COD', 'pending', NULL, 1850.00, NOW()),
('550e8400-e29b-41d4-a716-446655440407', '750e8400-e29b-41d4-a716-446655440007', 'UPI', 'pending', NULL, 2150.00, NOW()),
('550e8400-e29b-41d4-a716-446655440408', '750e8400-e29b-41d4-a716-446655440008', 'Card', 'paid', 'TXN123456794', 5500.00, NOW()),
('550e8400-e29b-41d4-a716-446655440409', '750e8400-e29b-41d4-a716-446655440009', 'UPI', 'paid', 'TXN123456795', 3200.00, NOW()),
('550e8400-e29b-41d4-a716-446655440410', '750e8400-e29b-41d4-a716-446655440010', 'Card', 'paid', 'TXN123456796', 4100.00, NOW());

INSERT INTO blacklisted_customers (customer_id, reason, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'Fraudulent activity detected during testing', NOW());

INSERT INTO suspended_customers (customer_id, reason, suspended_until, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440005', 'Multiple failed payment attempts', '2025-10-19 00:00:00+00', NOW());

INSERT INTO loyalty_points_history (customer_id, type, points, reason, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'add', 50, 'Welcome bonus', '2024-11-01 09:30:00+00'),
('550e8400-e29b-41d4-a716-446655440001', 'add', 100, 'Order completion bonus', '2025-08-28 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'add', 40, 'Referral bonus', '2025-01-15 15:00:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'add', 200, 'Birthday special', '2024-08-20 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'add', 100, 'Order completion bonus', '2025-07-25 13:00:00+00');

-- Order Management Sample Data
INSERT INTO order_notes (note_id, order_id, note, created_by, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440501', '750e8400-e29b-41d4-a716-446655440001', 'Customer requested gift packaging', NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440502', '750e8400-e29b-41d4-a716-446655440001', 'Order confirmed and ready for shipping', NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440503', '750e8400-e29b-41d4-a716-446655440002', 'Payment received, processing order', NULL, NOW());

INSERT INTO refunds (refund_id, order_id, amount, reason, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440601', '750e8400-e29b-41d4-a716-446655440005', 1550.00, 'Customer requested cancellation', 'completed', NOW());

INSERT INTO flagged_orders (flag_id, order_id, reason, flagged_by, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440701', '750e8400-e29b-41d4-a716-446655440004', 'Multiple failed payment attempts', NULL, 'active', NOW());

INSERT INTO order_tracking (tracking_id, order_id, carrier, tracking_number, estimated_delivery, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440801', '750e8400-e29b-41d4-a716-446655440001', 'BlueDart', 'BD123456789', '2025-09-20', 'in_transit', NOW()),
('550e8400-e29b-41d4-a716-446655440802', '750e8400-e29b-41d4-a716-446655440009', 'DTDC', 'DTDC987654321', '2025-09-18', 'delivered', NOW());
