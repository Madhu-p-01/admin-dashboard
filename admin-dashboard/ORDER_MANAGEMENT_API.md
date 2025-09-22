# Order Management API Documentation

## 🎯 Overview
Complete implementation of the Order Management API based on the specification from [Ecommerce API Documentation](https://github.com/Shubh7854/Ecommerce-API-Documentation/blob/main/Admin%20side%20APIs/admin-orders-API-docs.md).

## 🚀 Base URL
```
http://localhost:3001/api/v1/admin/orders
```

## 🔐 Authentication
- Requires Admin JWT (role: "admin")
- Header: `Authorization: Bearer YOUR_TOKEN`

---

## 📋 API Endpoints

### 1. Get All Orders (with Filters & Pagination)
**GET** `/orders?status=pending&paymentStatus=paid&date_from=2025-09-01&date_to=2025-09-16&page=1&limit=20&sort=date_desc`

#### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `status` - Filter by order status (pending, confirmed, shipped, delivered, cancelled, returned)
- `paymentStatus` - Filter by payment status (pending, paid, failed, refunded)
- `date_from` - Filter orders from date (ISO 8601)
- `date_to` - Filter orders to date (ISO 8601)
- `sort` - Sort order (date_desc, date_asc, amount_desc, amount_asc, status)
- `search` - Search in order ID, customer name, or email
- `min_amount` - Minimum order amount
- `max_amount` - Maximum order amount
- `customer_id` - Filter by specific customer

#### Response
```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": [
    {
      "id": "ord_1005",
      "orderNumber": "#1005",
      "customer": {
        "id": "cus_201",
        "name": "Ravi Kumar",
        "email": "ravi@example.com"
      },
      "total": 4717.6,
      "currency": "INR",
      "paymentStatus": "paid",
      "fulfillmentStatus": "pending",
      "date": "2025-09-16T09:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 250,
    "totalPages": 13
  }
}
```

### 2. Get Single Order Details
**GET** `/orders/{id}`

#### Response
```json
{
  "success": true,
  "message": "Order details fetched successfully",
  "data": {
    "id": "ord_1005",
    "orderNumber": "#1005",
    "customer": {
      "id": "cus_201",
      "name": "Ravi Kumar",
      "email": "ravi@example.com"
    },
    "items": [
      {
        "productId": "prd_101",
        "name": "Denim Jacket",
        "qty": 2,
        "price": 2499,
        "subtotal": 4998,
        "variant": {
          "size": "L",
          "color": "Blue"
        }
      }
    ],
    "subtotal": 5897,
    "discount": {
      "code": "SAVE20",
      "type": "percentage",
      "value": 20
    },
    "total": 4717.6,
    "paymentStatus": "paid",
    "fulfillmentStatus": "pending",
    "deliveryStatus": "not_shipped",
    "shippingAddress": {
      "name": "Ravi Kumar",
      "address": "123 Street",
      "city": "Delhi",
      "pincode": "110001",
      "country": "India"
    },
    "tracking": {
      "carrier": "BlueDart",
      "trackingNumber": "BD123456789",
      "estimatedDelivery": "2025-09-20"
    },
    "notes": [
      {
        "noteId": "nt_101",
        "note": "Customer requested gift packaging",
        "createdBy": "admin_01",
        "date": "2025-09-16"
      }
    ],
    "createdAt": "2025-09-16T09:30:00Z",
    "updatedAt": "2025-09-16T09:30:00Z"
  }
}
```

### 3. Update Order Status

#### Update Payment Status
**PUT** `/orders/{id}/payment`
```json
{
  "paymentStatus": "paid"
}
```

#### Update Fulfillment Status
**PUT** `/orders/{id}/fulfillment`
```json
{
  "fulfillmentStatus": "shipped"
}
```

#### Update Tracking Info
**PUT** `/orders/{id}/tracking`
```json
{
  "carrier": "BlueDart",
  "trackingNumber": "BD123456789",
  "estimatedDelivery": "2025-09-20"
}
```

### 4. Cancel an Order (Admin Action)
**PUT** `/orders/{id}/cancel`

#### Request
```json
{
  "reason": "Out of stock"
}
```

#### Response
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "orderId": "ord_1005",
  "status": "cancelled"
}
```

### 5. Refund an Order
**POST** `/orders/{id}/refund`

#### Request
```json
{
  "amount": 2000,
  "reason": "Customer returned item"
}
```

#### Response
```json
{
  "success": true,
  "message": "Refund processed",
  "refundId": "ref_301",
  "status": "completed"
}
```

### 6. Bulk Actions
**POST** `/orders/bulk`

#### Request
```json
{
  "action": "mark_as_shipped",
  "orderIds": ["ord_1005", "ord_1006", "ord_1007"]
}
```

#### Available Actions
- `mark_as_shipped` - Mark orders as shipped
- `mark_as_delivered` - Mark orders as delivered
- `mark_as_cancelled` - Mark orders as cancelled

#### Response
```json
{
  "success": true,
  "message": "3 orders updated successfully"
}
```

### 7. Export Orders
**GET** `/orders/export?format=csv&status=paid&date_from=2025-09-01&date_to=2025-09-16`

#### Query Parameters
- `format` - Export format (csv, excel)
- `status` - Filter by order status
- `paymentStatus` - Filter by payment status
- `date_from` - Filter from date
- `date_to` - Filter to date

#### Response
Returns a downloadable CSV file with order data.

### 8. Order Notes (Internal Admin Notes)

#### Add Note
**POST** `/orders/{id}/notes`
```json
{
  "note": "Customer requested gift packaging"
}
```

#### Get Notes
**GET** `/orders/{id}/notes`

#### Response
```json
{
  "success": true,
  "message": "Notes fetched successfully",
  "data": [
    {
      "noteId": "nt_101",
      "note": "Customer requested gift packaging",
      "createdBy": "admin_01",
      "date": "2025-09-16"
    }
  ]
}
```

### 9. Flag Suspicious Orders (Fraud Detection)
**POST** `/orders/{id}/flag`

#### Request
```json
{
  "reason": "Multiple failed payment attempts"
}
```

#### Response
```json
{
  "success": true,
  "message": "Order flagged successfully",
  "data": {
    "flag_id": "flag_001",
    "order_id": "ord_1005",
    "reason": "Multiple failed payment attempts",
    "flagged_by": "admin_01",
    "created_at": "2025-09-16T10:00:00Z"
  }
}
```

### 10. Archive Order (Keep for Records, Not Active)
**PUT** `/orders/{id}/archive`

#### Request
```json
{
  "archived": true
}
```

#### Response
```json
{
  "success": true,
  "message": "Order archived successfully",
  "data": {
    "order_id": "ord_1005",
    "archived": true,
    "updated_at": "2025-09-16T10:00:00Z"
  }
}
```

### 11. Get Order Statistics
**GET** `/orders/stats/overview`

#### Response
```json
{
  "success": true,
  "message": "Order statistics fetched successfully",
  "data": {
    "total_orders": 1250,
    "total_revenue": 1250000.50,
    "pending_orders": 45,
    "confirmed_orders": 120,
    "shipped_orders": 85,
    "delivered_orders": 950,
    "cancelled_orders": 30,
    "returned_orders": 20,
    "average_order_value": 1000.00
  }
}
```

---

## 🗄️ Database Schema

### Additional Tables Created

#### Order Notes
```sql
CREATE TABLE order_notes (
    note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_by UUID REFERENCES admin_members(member_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Refunds
```sql
CREATE TABLE refunds (
    refund_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id),
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    processed_by UUID REFERENCES admin_members(member_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Flagged Orders
```sql
CREATE TABLE flagged_orders (
    flag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id),
    reason TEXT NOT NULL,
    flagged_by UUID REFERENCES admin_members(member_id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Order Tracking
```sql
CREATE TABLE order_tracking (
    tracking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id),
    carrier VARCHAR(100) NOT NULL,
    tracking_number VARCHAR(255) NOT NULL,
    estimated_delivery DATE,
    status VARCHAR(50) DEFAULT 'in_transit',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🧪 Testing

### Test Script
Run the comprehensive test script:
```bash
node test-order-endpoints.js
```

### Manual Testing Examples

#### Get All Orders
```bash
curl "http://localhost:3001/api/v1/admin/orders?status=pending&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update Order Status
```bash
curl -X PUT "http://localhost:3001/api/v1/admin/orders/ord_1005/fulfillment" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"fulfillmentStatus": "shipped"}'
```

#### Bulk Actions
```bash
curl -X POST "http://localhost:3001/api/v1/admin/orders/bulk" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "action": "mark_as_shipped",
    "orderIds": ["ord_1005", "ord_1006"]
  }'
```

---

## 📊 Features Implemented

### ✅ Core Features
- [x] Get all orders with advanced filtering and pagination
- [x] Get single order with complete details
- [x] Update payment status
- [x] Update fulfillment status
- [x] Update tracking information
- [x] Cancel orders with reason
- [x] Process refunds
- [x] Bulk actions for multiple orders
- [x] Export orders to CSV
- [x] Add and retrieve order notes
- [x] Flag suspicious orders
- [x] Archive orders
- [x] Order statistics and analytics

### 🔧 Technical Features
- [x] TypeScript models and interfaces
- [x] Request validation with express-validator
- [x] Authentication middleware
- [x] Error handling
- [x] Database schema design
- [x] Comprehensive testing
- [x] API documentation

### 🚀 Ready for Production
- [x] All endpoints implemented according to specification
- [x] Database schema ready for Supabase
- [x] Authentication and authorization
- [x] Input validation and sanitization
- [x] Error handling and logging
- [x] Comprehensive testing suite

---

## 🎯 Next Steps

1. **Set up Supabase project**
2. **Run the database schema** (`order_management_schema.sql`)
3. **Configure environment variables**
4. **Test with real data**
5. **Deploy to production**

The Order Management API is now **completely implemented** and ready for integration! 🚀

