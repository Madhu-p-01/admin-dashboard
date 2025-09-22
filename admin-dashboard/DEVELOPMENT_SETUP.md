# Development Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

## Environment Setup

### 1. Backend Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Database Setup
1. Create a new Supabase project
2. Run the SQL schema from `backend/database/schema.sql` in your Supabase SQL editor
3. Update the environment variables with your Supabase credentials

## Running the Development Server

### Backend Server
```bash
cd backend
npm run dev
```
Server will run on http://localhost:3001

### Frontend Development
```bash
npm run dev
```

## API Endpoints

### Products
- `GET /api/v1/admin/products` - Get all products
- `GET /api/v1/admin/products/:id` - Get single product
- `POST /api/v1/admin/products` - Create product
- `PUT /api/v1/admin/products/:id` - Update product
- `DELETE /api/v1/admin/products/:id` - Delete product
- `PUT /api/v1/admin/products/:id/status` - Update product status
- `PUT /api/v1/admin/products/:id/featured` - Toggle featured status
- `PUT /api/v1/admin/products/:id/inventory` - Update inventory
- `PUT /api/v1/admin/products/:id/price` - Update price
- `PUT /api/v1/admin/products/bulk/inventory` - Bulk update inventory
- `PUT /api/v1/admin/products/bulk/prices` - Bulk update prices

### Customers
- `GET /api/v1/admin/customers` - Get all customers
- `GET /api/v1/admin/customers/:id` - Get single customer
- `PUT /api/v1/admin/customers/:id` - Update customer
- `DELETE /api/v1/admin/customers/:id` - Delete customer
- `PUT /api/v1/admin/customers/:id/status` - Update customer status
- `GET /api/v1/admin/customers/search` - Search customers
- `GET /api/v1/admin/customers/:id/orders` - Get customer orders
- `POST /api/v1/admin/customers/:id/loyalty/add` - Add loyalty points
- `POST /api/v1/admin/customers/:id/loyalty/redeem` - Redeem loyalty points
- `GET /api/v1/admin/customers/segments` - Get customer segments
- `GET /api/v1/admin/customers/export` - Export customers

### Discounts
- `GET /api/v1/admin/discounts` - Get all discounts
- `GET /api/v1/admin/discounts/:id` - Get single discount
- `POST /api/v1/admin/discounts` - Create discount
- `PUT /api/v1/admin/discounts/:id` - Update discount
- `DELETE /api/v1/admin/discounts/:id` - Delete discount

## Testing the API

You can test the API endpoints using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Any REST client

### Example curl commands:

```bash
# Get all products
curl http://localhost:3001/api/v1/admin/products

# Create a new product
curl -X POST http://localhost:3001/api/v1/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "A test product",
    "price": 99.99,
    "stock": 100,
    "category": "Electronics"
  }'

# Get all customers
curl http://localhost:3001/api/v1/admin/customers
```

## Project Structure

```
admin-dashboard/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # TypeScript models
│   │   ├── routes/          # API routes
│   │   └── index.ts         # Server entry point
│   ├── database/            # Database schema
│   └── package.json
├── src/                     # Frontend UI library
│   ├── components/          # React components
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── examples/                # Usage examples
└── docs/                    # Documentation
```

## Next Steps

1. Set up your Supabase project and environment variables
2. Start the backend server
3. Test the API endpoints
4. Build your frontend application using the UI components
5. Integrate the frontend with the backend API

