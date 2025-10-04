-- =====================================================
-- SAMPLE DATA FOR ORDERS, PRODUCTS, AND CATALOG
-- =====================================================

-- First, add missing columns if they don't exist
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Add missing columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_stock_level INTEGER DEFAULT 5;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight DECIMAL(8,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Add missing columns to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address JSONB;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS total_spent DECIMAL(12,2) DEFAULT 0.00;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT 'sample_hash';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS gender VARCHAR(10);

-- Create catalog_sections table if it doesn't exist
CREATE TABLE IF NOT EXISTS catalog_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_type VARCHAR(50) NOT NULL CHECK (section_type IN ('hero', 'showcase', 'banner', 'featured')),
    title VARCHAR(255) NOT NULL,
    content JSONB,
    images TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample categories
INSERT INTO categories (category_id, name, description, image_url, is_active, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Electronics', 'Electronic devices and gadgets', 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Electronics', true, 1),
('550e8400-e29b-41d4-a716-446655440002', 'Clothing', 'Fashion and apparel', 'https://via.placeholder.com/300x200/10b981/ffffff?text=Clothing', true, 2),
('550e8400-e29b-41d4-a716-446655440003', 'Books', 'Books and literature', 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Books', true, 3),
('550e8400-e29b-41d4-a716-446655440004', 'Home & Garden', 'Home improvement and garden supplies', 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Home', true, 4)
ON CONFLICT (category_id) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (customer_id, name, email, phone, address, loyalty_points, total_orders, total_spent, status, password_hash, date_of_birth, gender) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Aisha Sharma', 'aisha.sharma@email.com', '+91-9876543210', '{"street": "123 MG Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001", "country": "India"}', 150, 5, 2500.00, 'active', 'sample_hash_001', '1990-05-15', 'female'),
('660e8400-e29b-41d4-a716-446655440002', 'John Doe', 'john.doe@email.com', '+91-9876543211', '{"street": "456 Park Street", "city": "Delhi", "state": "Delhi", "pincode": "110001", "country": "India"}', 200, 8, 4500.00, 'active', 'sample_hash_002', '1985-08-22', 'male'),
('660e8400-e29b-41d4-a716-446655440003', 'Jane Smith', 'jane.smith@email.com', '+91-9876543212', '{"street": "789 Brigade Road", "city": "Bangalore", "state": "Karnataka", "pincode": "560001", "country": "India"}', 75, 3, 1200.00, 'active', 'sample_hash_003', '1992-12-10', 'female'),
('660e8400-e29b-41d4-a716-446655440004', 'Mike Wilson', 'mike.wilson@email.com', '+91-9876543213', '{"street": "321 MG Road", "city": "Chennai", "state": "Tamil Nadu", "pincode": "600001", "country": "India"}', 300, 12, 8000.00, 'active', 'sample_hash_004', '1988-03-18', 'male'),
('660e8400-e29b-41d4-a716-446655440005', 'Sarah Johnson', 'sarah.johnson@email.com', '+91-9876543214', '{"street": "654 Commercial Street", "city": "Kolkata", "state": "West Bengal", "pincode": "700001", "country": "India"}', 100, 4, 1800.00, 'active', 'sample_hash_005', '1995-07-25', 'female'),
('660e8400-e29b-41d4-a716-446655440006', 'David Brown', 'david.brown@email.com', '+91-9876543215', '{"street": "987 Residency Road", "city": "Hyderabad", "state": "Telangana", "pincode": "500001", "country": "India"}', 50, 2, 800.00, 'active', 'sample_hash_006', '1993-11-08', 'male')
ON CONFLICT (customer_id) DO NOTHING;

-- Insert sample products
INSERT INTO products (product_id, name, description, price, category_id, sku, stock_quantity, min_stock_level, images, status, featured, rating, review_count) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'iPhone 15 Pro', 'Latest iPhone with advanced camera system', 99999.00, '550e8400-e29b-41d4-a716-446655440001', 'IPH15PRO-128', 50, 5, ARRAY['https://via.placeholder.com/400x400/000000/ffffff?text=iPhone+15+Pro'], 'active', true, 4.8, 150),
('770e8400-e29b-41d4-a716-446655440002', 'Samsung Galaxy S24', 'Premium Android smartphone', 79999.00, '550e8400-e29b-41d4-a716-446655440001', 'SGS24-256', 75, 5, ARRAY['https://via.placeholder.com/400x400/0000ff/ffffff?text=Galaxy+S24'], 'active', true, 4.6, 120),
('770e8400-e29b-41d4-a716-446655440003', 'MacBook Air M3', 'Ultra-thin laptop with M3 chip', 89999.00, '550e8400-e29b-41d4-a716-446655440001', 'MBA-M3-256', 30, 3, ARRAY['https://via.placeholder.com/400x400/808080/ffffff?text=MacBook+Air'], 'active', true, 4.9, 200),
('770e8400-e29b-41d4-a716-446655440004', 'Nike Air Max 270', 'Comfortable running shoes', 8999.00, '550e8400-e29b-41d4-a716-446655440002', 'NAM270-BLK-10', 100, 10, ARRAY['https://via.placeholder.com/400x400/ff0000/ffffff?text=Nike+Air+Max'], 'active', false, 4.5, 80),
('770e8400-e29b-41d4-a716-446655440005', 'Adidas Ultraboost 22', 'Premium running shoes', 12999.00, '550e8400-e29b-41d4-a716-446655440002', 'AUB22-WHT-9', 60, 5, ARRAY['https://via.placeholder.com/400x400/000000/ffffff?text=Ultraboost+22'], 'active', true, 4.7, 90),
('770e8400-e29b-41d4-a716-446655440006', 'The Great Gatsby', 'Classic American novel', 299.00, '550e8400-e29b-41d4-a716-446655440003', 'BOOK-GG-001', 200, 20, ARRAY['https://via.placeholder.com/400x400/8b4513/ffffff?text=Great+Gatsby'], 'active', false, 4.3, 45),
('770e8400-e29b-41d4-a716-446655440007', 'To Kill a Mockingbird', 'Harper Lee masterpiece', 399.00, '550e8400-e29b-41d4-a716-446655440003', 'BOOK-TKAM-001', 150, 15, ARRAY['https://via.placeholder.com/400x400/228b22/ffffff?text=Mockingbird'], 'active', true, 4.8, 120),
('770e8400-e29b-41d4-a716-446655440008', 'Kitchen Knife Set', 'Professional chef knife set', 2999.00, '550e8400-e29b-41d4-a716-446655440004', 'KKS-6PC-SIL', 40, 5, ARRAY['https://via.placeholder.com/400x400/c0c0c0/ffffff?text=Knife+Set'], 'active', false, 4.4, 60),
('770e8400-e29b-41d4-a716-446655440009', 'Garden Tools Set', 'Complete gardening toolkit', 1999.00, '550e8400-e29b-41d4-a716-446655440004', 'GTS-8PC-GRN', 80, 10, ARRAY['https://via.placeholder.com/400x400/228b22/ffffff?text=Garden+Tools'], 'active', false, 4.2, 35),
('770e8400-e29b-41d4-a716-446655440010', 'Wireless Headphones', 'Noise-cancelling wireless headphones', 15999.00, '550e8400-e29b-41d4-a716-446655440001', 'WH-NC-BLK', 25, 3, ARRAY['https://via.placeholder.com/400x400/000000/ffffff?text=Headphones'], 'active', true, 4.6, 110)
ON CONFLICT (product_id) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (order_id, customer_id, order_number, status, total_amount, shipping_cost, tax_amount, discount_amount, payment_status, payment_method, shipping_address, billing_address, notes) VALUES
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'ORD-2024-001', 'processing', 8099.00, 100.00, 819.90, 0.00, 'paid', 'credit_card', '{"street": "123 MG Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001", "country": "India"}', '{"street": "123 MG Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001", "country": "India"}', 'Please deliver after 6 PM'),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'ORD-2024-002', 'delivered', 12999.00, 150.00, 1314.90, 500.00, 'paid', 'upi', '{"street": "456 Park Street", "city": "Delhi", "state": "Delhi", "pincode": "110001", "country": "India"}', '{"street": "456 Park Street", "city": "Delhi", "state": "Delhi", "pincode": "110001", "country": "India"}', 'Gift wrapping requested'),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'ORD-2024-003', 'pending', 698.00, 50.00, 74.80, 0.00, 'pending', 'cod', '{"street": "789 Brigade Road", "city": "Bangalore", "state": "Karnataka", "pincode": "560001", "country": "India"}', '{"street": "789 Brigade Road", "city": "Bangalore", "state": "Karnataka", "pincode": "560001", "country": "India"}', ''),
('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'ORD-2024-004', 'shipped', 3299.00, 100.00, 339.90, 200.00, 'paid', 'credit_card', '{"street": "321 MG Road", "city": "Chennai", "state": "Tamil Nadu", "pincode": "600001", "country": "India"}', '{"street": "321 MG Road", "city": "Chennai", "state": "Tamil Nadu", "pincode": "600001", "country": "India"}', 'Handle with care'),
('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'ORD-2024-005', 'processing', 1999.00, 80.00, 207.90, 0.00, 'paid', 'upi', '{"street": "654 Commercial Street", "city": "Kolkata", "state": "West Bengal", "pincode": "700001", "country": "India"}', '{"street": "654 Commercial Street", "city": "Kolkata", "state": "West Bengal", "pincode": "700001", "country": "India"}', ''),
('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440006', 'ORD-2024-006', 'delivered', 15999.00, 200.00, 1619.90, 1000.00, 'paid', 'credit_card', '{"street": "987 Residency Road", "city": "Hyderabad", "state": "Telangana", "pincode": "500001", "country": "India"}', '{"street": "987 Residency Road", "city": "Hyderabad", "state": "Telangana", "pincode": "500001", "country": "India"}', 'Express delivery')
ON CONFLICT (order_id) DO NOTHING;

-- Insert sample order items
INSERT INTO order_items (item_id, order_id, product_id, quantity, unit_price, total_price) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440004', 1, 8999.00, 8999.00),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440005', 1, 12999.00, 12999.00),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440006', 1, 299.00, 299.00),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440007', 1, 399.00, 399.00),
('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440008', 1, 2999.00, 2999.00),
('990e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440009', 1, 1999.00, 1999.00),
('990e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440010', 1, 15999.00, 15999.00)
ON CONFLICT (item_id) DO NOTHING;

-- Insert sample catalog sections
INSERT INTO catalog_sections (id, section_type, title, content, images, is_active) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'hero', 'Hero Section', '{"message": "Welcome to our amazing store! Discover the latest trends and exclusive deals."}', '["https://via.placeholder.com/1200x400/3b82f6/ffffff?text=Hero+Image+1", "https://via.placeholder.com/1200x400/10b981/ffffff?text=Hero+Image+2", "https://via.placeholder.com/1200x400/8b5cf6/ffffff?text=Hero+Image+3"]', true),
('aa0e8400-e29b-41d4-a716-446655440002', 'showcase', 'Product Showcase', '{"title": "Featured Products", "description": "Check out our best-selling items"}', '["https://via.placeholder.com/600x400/f59e0b/ffffff?text=Showcase+1", "https://via.placeholder.com/600x400/ef4444/ffffff?text=Showcase+2"]', true)
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Sample data inserted successfully! Orders, Products, Customers, and Catalog data are ready.' as message;
