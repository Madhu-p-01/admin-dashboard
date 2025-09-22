-- Additional tables for Order Management System
-- Run this after the main schema.sql

-- Order Notes Table
CREATE TABLE IF NOT EXISTS order_notes (
    note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_by UUID REFERENCES admin_members(member_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refunds Table
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

-- Flagged Orders Table (Fraud Detection)
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

-- Add archived column to orders table if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;

-- Add notes column to orders table if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_order_notes_order_id ON order_notes(order_id);
CREATE INDEX IF NOT EXISTS idx_order_notes_created_at ON order_notes(created_at);
CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);
CREATE INDEX IF NOT EXISTS idx_flagged_orders_order_id ON flagged_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_flagged_orders_status ON flagged_orders(status);
CREATE INDEX IF NOT EXISTS idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_tracking_number ON order_tracking(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_archived ON orders(archived);

-- Sample data for testing
INSERT INTO order_notes (note_id, order_id, note, created_by, created_at) VALUES
('note_001', '750e8400-e29b-41d4-a716-446655440001', 'Customer requested gift packaging', NULL, NOW()),
('note_002', '750e8400-e29b-41d4-a716-446655440001', 'Order confirmed and ready for shipping', NULL, NOW()),
('note_003', '750e8400-e29b-41d4-a716-446655440002', 'Payment received, processing order', NULL, NOW());

INSERT INTO refunds (refund_id, order_id, amount, reason, status, created_at) VALUES
('refund_001', '750e8400-e29b-41d4-a716-446655440005', 1550.00, 'Customer requested cancellation', 'completed', NOW());

INSERT INTO flagged_orders (flag_id, order_id, reason, flagged_by, status, created_at) VALUES
('flag_001', '750e8400-e29b-41d4-a716-446655440004', 'Multiple failed payment attempts', NULL, 'active', NOW());

INSERT INTO order_tracking (tracking_id, order_id, carrier, tracking_number, estimated_delivery, status, created_at) VALUES
('track_001', '750e8400-e29b-41d4-a716-446655440001', 'BlueDart', 'BD123456789', '2025-09-20', 'in_transit', NOW()),
('track_002', '750e8400-e29b-41d4-a716-446655440009', 'DTDC', 'DTDC987654321', '2025-09-18', 'delivered', NOW());
