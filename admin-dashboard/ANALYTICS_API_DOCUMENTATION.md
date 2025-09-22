# Admin Analytics API Documentation (v1) - Implemented

This document details the implemented Analytics API endpoints for the Admin Dashboard, providing comprehensive business intelligence and reporting capabilities.

## Base URL

All API endpoints are prefixed with: `http://localhost:3001/api/v1/admin/analytics`

## Authentication

- Requires Admin JWT (role: "admin"). The `supabaseAdminAuth` middleware is applied to all routes.

---

## 1. Sales Overview

**GET** `/sales`

### Query Parameters
- `from`: (Optional) ISO8601 date string. Start date for analysis.
- `to`: (Optional) ISO8601 date string. End date for analysis.
- `groupBy`: (Optional) Group results by `day`, `week`, `month`, or `year`. Default: `day`.

### Response
```json
{
  "success": true,
  "message": "Sales overview fetched successfully",
  "data": {
    "totalRevenue": 450000,
    "totalOrders": 1200,
    "avgOrderValue": 375,
    "currency": "INR",
    "breakdown": [
      { "date": "2025-09-01", "revenue": 20000, "orders": 50 },
      { "date": "2025-09-02", "revenue": 18000, "orders": 45 }
    ]
  }
}
```

---

## 2. Product Performance

**GET** `/products/performance`

### Query Parameters
- `from`: (Optional) ISO8601 date string.
- `to`: (Optional) ISO8601 date string.
- `sort`: (Optional) Sort by `top_selling`, `revenue`, or `growth`. Default: `top_selling`.
- `limit`: (Optional) Number of results (1-100). Default: 20.

### Response
```json
{
  "success": true,
  "message": "Product performance fetched successfully",
  "data": [
    {
      "productId": "prd_001",
      "name": "Denim Jacket",
      "unitsSold": 300,
      "revenue": 749700
    },
    {
      "productId": "prd_002",
      "name": "Cotton T-Shirt",
      "unitsSold": 500,
      "revenue": 449500
    }
  ]
}
```

---

## 3. Order Insights

**GET** `/orders/insights`

### Query Parameters
- `from`: (Optional) ISO8601 date string.
- `to`: (Optional) ISO8601 date string.

### Response
```json
{
  "success": true,
  "message": "Order insights fetched successfully",
  "data": {
    "totalOrders": 1200,
    "pending": 150,
    "shipped": 900,
    "delivered": 1000,
    "cancelled": 50,
    "returned": 30,
    "avgFulfillmentTime": "2.5 days",
    "orderStatusDistribution": [
      { "status": "delivered", "count": 1000, "percentage": "83.3" },
      { "status": "shipped", "count": 900, "percentage": "75.0" }
    ]
  }
}
```

---

## 4. Customer Insights

**GET** `/customers/insights`

### Query Parameters
- `from`: (Optional) ISO8601 date string.
- `to`: (Optional) ISO8601 date string.

### Response
```json
{
  "success": true,
  "message": "Customer insights fetched successfully",
  "data": {
    "totalCustomers": 3000,
    "newCustomers": 200,
    "returningCustomers": 800,
    "loyalCustomers": 150,
    "churnRate": 5.2,
    "avgLifetimeValue": 15000,
    "customerSegments": [
      { "segment": "New", "count": 200, "percentage": 6.7, "avgOrderValue": 500 },
      { "segment": "Returning", "count": 800, "percentage": 26.7, "avgOrderValue": 1200 },
      { "segment": "Loyal", "count": 150, "percentage": 5.0, "avgOrderValue": 2500 }
    ]
  }
}
```

---

## 5. Inventory Insights

**GET** `/inventory/insights`

### Response
```json
{
  "success": true,
  "message": "Inventory insights fetched successfully",
  "data": {
    "totalProducts": 500,
    "totalValue": 1250000,
    "lowStock": [
      { "productId": "prd_003", "name": "Smartphone", "stock": 5, "minThreshold": 10, "category": "Electronics" }
    ],
    "outOfStock": [
      { "productId": "prd_505", "name": "Summer Shorts", "stock": 0, "lastSold": "2025-09-15", "category": "Clothing" }
    ],
    "topSelling": [
      { "productId": "prd_001", "name": "Denim Jacket", "unitsSold": 4, "revenue": 9996, "category": "Clothing" }
    ]
  }
}
```

---

## 6. Marketing Campaign Performance

**GET** `/campaigns/performance`

### Query Parameters
- `campaignId`: (Optional) Specific campaign ID to analyze.

### Response
```json
{
  "success": true,
  "message": "Campaign performance fetched successfully",
  "data": {
    "campaignId": "cmp_501",
    "name": "Diwali Sale Blast",
    "sent": 5000,
    "openRate": 60,
    "clickRate": 25,
    "conversions": 300,
    "revenueGenerated": 450000,
    "cost": 50000,
    "roi": 800
  }
}
```

---

## 7. Revenue by Market

**GET** `/markets/revenue`

### Query Parameters
- `from`: (Optional) ISO8601 date string.
- `to`: (Optional) ISO8601 date string.

### Response
```json
{
  "success": true,
  "message": "Market revenue fetched successfully",
  "data": [
    {
      "market": "India",
      "revenue": 300000,
      "orders": 800,
      "avgOrderValue": 375,
      "growth": 15.5
    },
    {
      "market": "USA",
      "revenue": 150000,
      "orders": 400,
      "avgOrderValue": 375,
      "growth": 8.2
    }
  ]
}
```

---

## 8. Refunds & Returns Report

**GET** `/refunds`

### Query Parameters
- `from`: (Optional) ISO8601 date string.
- `to`: (Optional) ISO8601 date string.

### Response
```json
{
  "success": true,
  "message": "Refunds report fetched successfully",
  "data": {
    "totalRefunds": 50,
    "amountRefunded": 12000,
    "avgRefundAmount": 240,
    "reasons": {
      "size_issue": 20,
      "damaged": 10,
      "wrong_item": 5,
      "not_as_described": 10,
      "other": 5
    },
    "trends": []
  }
}
```

---

## 9. Traffic & Conversion

**GET** `/traffic`

### Query Parameters
- `from`: (Optional) ISO8601 date string.
- `to`: (Optional) ISO8601 date string.

### Response
```json
{
  "success": true,
  "message": "Traffic insights fetched successfully",
  "data": {
    "visits": 25000,
    "uniqueVisitors": 18000,
    "cartAdditions": 5000,
    "ordersPlaced": 1200,
    "conversionRate": 4.8,
    "bounceRate": 35.2,
    "avgSessionDuration": "3m 45s",
    "topPages": [
      { "page": "/products", "visits": 8000, "conversions": 400, "conversionRate": 5.0 }
    ],
    "trafficSources": [
      { "source": "Organic Search", "visits": 12000, "conversions": 600, "conversionRate": 5.0 }
    ]
  }
}
```

---

## 10. Export Analytics

**GET** `/export`

### Query Parameters
- `report`: (Required) Report type: `sales`, `products`, `orders`, `customers`, `inventory`, `campaigns`, `markets`, `refunds`, `traffic`.
- `format`: (Optional) Export format: `csv`, `excel`, `json`. Default: `json`.
- `from`: (Optional) ISO8601 date string.
- `to`: (Optional) ISO8601 date string.

### Response
- **CSV**: Returns downloadable CSV file
- **JSON/Excel**: Returns JSON response with export data

---

## 11. Dashboard Overview

**GET** `/dashboard/overview`

### Response
```json
{
  "success": true,
  "message": "Dashboard overview fetched successfully",
  "data": {
    "sales": {
      "today": 15000,
      "yesterday": 12000,
      "thisWeek": 105000,
      "lastWeek": 98000,
      "thisMonth": 450000,
      "lastMonth": 420000,
      "growth": 25.0
    },
    "orders": {
      "today": 25,
      "yesterday": 20,
      "thisWeek": 175,
      "lastWeek": 160,
      "thisMonth": 750,
      "lastMonth": 700,
      "growth": 7.1
    },
    "customers": {
      "total": 3000,
      "new": 50,
      "returning": 900,
      "growth": 12.5
    },
    "products": {
      "total": 500,
      "active": 450,
      "lowStock": 25,
      "outOfStock": 5
    },
    "conversion": {
      "rate": 4.8,
      "trend": "up"
    }
  }
}
```

---

## Technical Implementation Summary

### Files Created/Modified:
- `src/models/Analytics.ts`: Comprehensive TypeScript interfaces for all analytics data structures
- `src/controllers/AnalyticsController.ts`: Complete business logic for all analytics endpoints with Supabase integration
- `src/routes/analyticsRoutes.ts`: Express.js routes with validation and authentication
- `src/index.ts`: Updated to include analytics routes
- `database/schema.sql`: Fixed and enhanced with sample data for testing
- `test-analytics-endpoints.js`: Comprehensive test script for all analytics endpoints

### Key Features:
- **Comprehensive Analytics**: Sales, products, orders, customers, inventory, campaigns, markets, refunds, traffic
- **Flexible Date Ranges**: All endpoints support custom date filtering
- **Multiple Export Formats**: CSV, Excel, JSON export capabilities
- **Real-time Dashboard**: Overview endpoint for key metrics
- **Advanced Filtering**: Sort, limit, and group by options
- **Robust Validation**: All requests validated with express-validator
- **Authentication**: Secured with admin JWT middleware
- **Type Safety**: Full TypeScript implementation

### Current Status:
- **All analytics endpoints are implemented** and ready for use
- **Database schema is fixed** and includes sample data
- **Test scripts are available** for comprehensive testing
- **Ready for Supabase integration** once database is set up

### Next Steps:
1. **Run the fixed database schema** in Supabase
2. **Test analytics endpoints** with real data
3. **Integrate with Google Analytics** (optional)
4. **Set up automated reporting** (optional)

The Analytics API is now fully implemented and provides comprehensive business intelligence capabilities for your admin dashboard! 🚀

