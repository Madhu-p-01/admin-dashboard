-- ===============================================
-- E-Commerce Admin Dashboard Database Schema
-- ===============================================
-- Run this SQL in your Supabase SQL Editor to create all tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- 1. CATEGORIES TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(category_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 2. PRODUCTS TABLE
-- ===============================================
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

-- ===============================================
-- 3. PRODUCT VARIANTS TABLE
-- ===============================================
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

-- ===============================================
-- 4. CUSTOMERS TABLE
-- ===============================================
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

-- ===============================================
-- 5. ADDRESSES TABLE
-- ===============================================
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

-- ===============================================
-- 6. CARTS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS carts (
    cart_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 7. CART ITEMS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    variant_id UUID REFERENCES product_variants(variant_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 8. WISHLISTS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS wishlists (
    wishlist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

-- ===============================================
-- 9. ORDERS TABLE
-- ===============================================
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

-- ===============================================
-- 10. ORDER ITEMS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    variant_id UUID REFERENCES product_variants(variant_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 11. PAYMENTS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS payments (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id),
    method VARCHAR(20) CHECK (method IN ('COD', 'UPI', 'Card', 'Wallet')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 12. DISCOUNTS/COUPONS TABLE
-- ===============================================
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

-- ===============================================
-- 13. REVIEWS TABLE
-- ===============================================
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

-- ===============================================
-- 14. NOTIFICATIONS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR(20) CHECK (type IN ('order_update', 'promo', 'alert', 'system')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
    channels TEXT[] DEFAULT '{"inApp"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 15. ANALYTICS LOGS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS analytics_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) CHECK (entity_type IN ('product', 'order', 'customer', 'admin')),
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    user_id UUID,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 16. ADMIN/TEAM MEMBERS TABLE
-- ===============================================
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

-- ===============================================
-- 17. MARKETING SEGMENTS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS marketing_segments (
    segment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    criteria JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 18. MARKETING CAMPAIGNS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('email', 'sms', 'push', 'social')),
    subject VARCHAR(255),
    content TEXT,
    target_audience JSONB,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'paused', 'completed')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    sent_count INTEGER DEFAULT 0,
    open_rate DECIMAL(5,4) DEFAULT 0,
    click_rate DECIMAL(5,4) DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- INDEXES FOR BETTER PERFORMANCE
-- ===============================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);

-- Product variants indexes
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Cart indexes
CREATE INDEX IF NOT EXISTS idx_carts_customer_id ON carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);

-- ===============================================
-- TRIGGERS FOR AUTOMATIC UPDATED_AT
-- ===============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables that have updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


    -- Customer status management tables
CREATE TABLE IF NOT EXISTS blacklisted_customers (
    customer_id UUID PRIMARY KEY REFERENCES customers(customer_id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    blacklisted_by UUID REFERENCES admin_members(member_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suspended_customers (
    customer_id UUID PRIMARY KEY REFERENCES customers(customer_id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    suspended_until TIMESTAMP WITH TIME ZONE,
    suspended_by UUID REFERENCES admin_members(member_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer loyalty points history
CREATE TABLE IF NOT EXISTS loyalty_points_history (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    type VARCHAR(10) CHECK (type IN ('add', 'redeem')) NOT NULL,
    points INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    admin_id UUID REFERENCES admin_members(member_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_loyalty_points ON customers(loyalty_points);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

-- Customer status indexes
CREATE INDEX IF NOT EXISTS idx_blacklisted_customers_created_at ON blacklisted_customers(created_at);
CREATE INDEX IF NOT EXISTS idx_suspended_customers_created_at ON suspended_customers(created_at);
CREATE INDEX IF NOT EXISTS idx_suspended_customers_until ON suspended_customers(suspended_until);

-- Loyalty history indexes
CREATE INDEX IF NOT EXISTS idx_loyalty_history_customer_id ON loyalty_points_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_history_type ON loyalty_points_history(type);
CREATE INDEX IF NOT EXISTS idx_loyalty_history_created_at ON loyalty_points_history(created_at);

INSERT INTO customers (customer_id, name, email, phone, password_hash, loyalty_points, preferences, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Ravi Kumar', 'ravi.kumar@example.com', '+91-9876543210', '$2a$10$hashedpasswordexample', 150, '{"newsletter": true, "category_preferences": "clothing"}', '2024-11-01 09:00:00+00', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Anita Sharma', 'anita.sharma@example.com', '+91-9123456789', '$2a$10$hashedpasswordexample', 40, '{"newsletter": false, "category_preferences": "electronics"}', '2025-01-15 14:30:00+00', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Rajesh Patel', 'rajesh.patel@example.com', '+91-9988776655', '$2a$10$hashedpasswordexample', 300, '{"newsletter": true, "category_preferences": "books"}', '2024-08-20 10:15:00+00', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Priya Gupta', 'priya.gupta@example.com', '+91-9555666777', '$2a$10$hashedpasswordexample', 0, '{"newsletter": true, "category_preferences": "home"}', '2025-02-10 16:45:00+00', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Amit Singh', 'amit.singh@example.com', '+91-9444333222', '$2a$10$hashedpasswordexample', 500, '{"newsletter": false, "category_preferences": "sports"}', '2024-06-05 12:30:00+00', NOW());

-- 2. Insert Test Addresses
INSERT INTO addresses (address_id, customer_id, name, phone, line1, line2, city, state, postal_code, country, is_default, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Ravi Kumar', '+91-9876543210', '123, MG Road', 'Apartment 2B', 'Delhi', 'Delhi', '110001', 'India', true, NOW()),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Anita Sharma', '+91-9123456789', '456, Brigade Road', 'Floor 3', 'Bangalore', 'Karnataka', '560001', 'India', true, NOW()),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Rajesh Patel', '+91-9988776655', '789, Commercial Street', NULL, 'Mumbai', 'Maharashtra', '400001', 'India', true, NOW()),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Priya Gupta', '+91-9555666777', '321, Park Street', 'Building A', 'Kolkata', 'West Bengal', '700001', 'India', true, NOW()),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Amit Singh', '+91-9444333222', '654, Residency Road', 'Unit 5', 'Chennai', 'Tamil Nadu', '600001', 'India', true, NOW());

-- 3. Insert Test Orders
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

-- 4. Create a Blacklisted Customer (for testing status endpoints)
INSERT INTO blacklisted_customers (customer_id, reason, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'Fraudulent activity detected during testing', NOW());

-- 5. Create a Suspended Customer (for testing status endpoints)  
INSERT INTO suspended_customers (customer_id, reason, suspended_until, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440005', 'Multiple failed payment attempts', '2025-10-19 00:00:00+00', NOW());

-- 6. Insert Some Loyalty Points History
INSERT INTO loyalty_points_history (customer_id, type, points, reason, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'add', 50, 'Welcome bonus', '2024-11-01 09:30:00+00'),
('550e8400-e29b-41d4-a716-446655440001', 'add', 100, 'Order completion bonus', '2025-08-28 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'add', 40, 'Referral bonus', '2025-01-15 15:00:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'add', 200, 'Birthday special', '2024-08-20 11:00:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'add', 100, 'Order completion bonus', '2025-07-25 13:00:00+00');


CREATE TABLE IF NOT EXISTS banners (
    banner_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    link VARCHAR(500),
    position VARCHAR(50) DEFAULT 'homepage_top' CHECK (position IN ('homepage_top', 'homepage_middle', 'homepage_bottom', 'category_top', 'category_sidebar', 'product_detail')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS cms_pages (
    page_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS blog_posts (
    post_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    author VARCHAR(100) DEFAULT 'Admin',
    tags TEXT[],
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS faqs (
    faq_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS policies (
    policy_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    policy_type VARCHAR(50) CHECK (policy_type IN ('return', 'privacy', 'shipping', 'terms', 'refund', 'other')),
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    version VARCHAR(10) DEFAULT '1.0',
    effective_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS announcements (
    announcement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error', 'promo')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'scheduled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    display_on TEXT[] DEFAULT '{"homepage", "checkout"}',
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS media_library (
    media_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    alt_text VARCHAR(255),
    description TEXT,
    uploaded_by UUID REFERENCES admin_members(member_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Management Indexes
CREATE INDEX IF NOT EXISTS idx_banners_status ON banners(status);
CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position);
CREATE INDEX IF NOT EXISTS idx_banners_start_date ON banners(start_date);
CREATE INDEX IF NOT EXISTS idx_banners_end_date ON banners(end_date);
CREATE INDEX IF NOT EXISTS idx_banners_display_order ON banners(display_order);

CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_cms_pages_created_at ON cms_pages(created_at);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_faqs_status ON faqs(status);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);

CREATE INDEX IF NOT EXISTS idx_policies_policy_type ON policies(policy_type);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_effective_date ON policies(effective_date);

CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);
CREATE INDEX IF NOT EXISTS idx_announcements_start_date ON announcements(start_date);
CREATE INDEX IF NOT EXISTS idx_announcements_end_date ON announcements(end_date);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority);

CREATE INDEX IF NOT EXISTS idx_media_library_file_type ON media_library(file_type);
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_by ON media_library(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_library_created_at ON media_library(created_at);




    -- Database Functions
CREATE OR REPLACE FUNCTION get_customer_with_stats(customer_uuid UUID)
RETURNS TABLE (
    customer_id UUID,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    loyalty_points INTEGER,
    status TEXT,
    orders_count BIGINT,
    total_spent NUMERIC,
    joined_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.customer_id,
        c.name,
        c.email,
        c.phone,
        c.loyalty_points,
        CASE 
            WHEN bc.customer_id IS NOT NULL THEN 'blacklisted'
            WHEN sc.customer_id IS NOT NULL THEN 'suspended'
            WHEN COALESCE(order_stats.orders_count, 0) = 0 AND c.created_at < NOW() - INTERVAL '30 days' THEN 'inactive'
            ELSE 'active'
        END as status,
        COALESCE(order_stats.orders_count, 0) as orders_count,
        COALESCE(order_stats.total_spent, 0) as total_spent,
        c.created_at as joined_at,
        c.created_at,
        c.updated_at
    FROM customers c
    LEFT JOIN blacklisted_customers bc ON c.customer_id = bc.customer_id
    LEFT JOIN suspended_customers sc ON c.customer_id = sc.customer_id
    LEFT JOIN (
        SELECT 
            customer_id,
            COUNT(*) as orders_count,
            SUM(total_amount) as total_spent
        FROM orders 
        GROUP BY customer_id
    ) order_stats ON c.customer_id = order_stats.customer_id
    WHERE c.customer_id = customer_uuid;
END;
$$ LANGUAGE plpgsql;


-- ===============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================================

-- Enable RLS on sensitive tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_members ENABLE ROW LEVEL SECURITY;

-- Admin access policy (Service Role can access all)
CREATE POLICY "Admin full access" ON customers
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin full access" ON orders
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin full access" ON payments
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin full access" ON admin_members
    FOR ALL USING (auth.role() = 'service_role');

-- ===============================================
-- SAMPLE DATA (OPTIONAL)
-- ===============================================

-- Insert sample categories
INSERT INTO categories (name, description) VALUES 
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items'),
('Books', 'Books and educational materials'),
('Home & Garden', 'Home improvement and gardening supplies');

-- Insert sample admin member
INSERT INTO admin_members (name, email, role, permissions) VALUES 
('Admin User', 'admin@yourdomain.com', 'super_admin', '{"all"}');

-- ===============================================
-- COMPLETION MESSAGE
-- ===============================================
-- Schema creation completed successfully!
-- Don't forget to:
-- 1. Set up your environment variables in .env
-- 2. Configure RLS policies based on your requirements
-- 3. Test the API endpoints
-- ===============================================