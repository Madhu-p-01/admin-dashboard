# 🚀 Complete Supabase Setup Guide

## Step 1: Create Supabase Account and Project

### 1.1 Sign Up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up using:
   - GitHub (recommended)
   - Google
   - Email

### 1.2 Create New Project
1. Once logged in, click **"New Project"**
2. Fill in the project details:
   - **Name**: `admin-dashboard-ecommerce` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location (e.g., `Asia Pacific (Mumbai)` for India)
   - **Pricing Plan**: Select **Free** for development

3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

## Step 2: Get Your Supabase Credentials

### 2.1 Get Project URL and API Keys
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role secret key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ⚠️ **Keep this secret!**

### 2.2 Get Database Connection String
1. Go to **Settings** → **Database**
2. Under **Connection string**, copy the **URI** connection string
3. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres`

## Step 3: Set Up Database Schema

### 3.1 Access SQL Editor
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**

### 3.2 Run Main Database Schema
Copy and paste the entire content from `backend/database/schema.sql` and run it.

### 3.3 Run Order Management Schema
Copy and paste the entire content from `backend/database/order_management_schema.sql` and run it.

## Step 4: Configure Environment Variables

### 4.1 Create Environment File
Create a `.env` file in your `backend` directory with the following content:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key_here

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

### 4.2 Replace the Values
Replace the following with your actual Supabase values:
- `https://your-project-id.supabase.co` → Your actual Project URL
- `your_service_role_secret_key_here` → Your actual service_role secret key
- `your_jwt_secret_key_here` → Generate a random JWT secret

## Step 5: Test the Connection

### 5.1 Start the Server
```bash
cd backend
npm run dev
```

### 5.2 Test the Endpoints
```bash
# Test basic server
curl http://localhost:3001/

# Test orders endpoint (will require auth)
curl http://localhost:3001/api/v1/admin/orders
```

## Step 6: Verify Database Setup

### 6.1 Check Tables in Supabase
1. Go to **Table Editor** in your Supabase dashboard
2. You should see all these tables:
   - `categories`
   - `products`
   - `product_variants`
   - `customers`
   - `addresses`
   - `carts`
   - `cart_items`
   - `wishlists`
   - `orders`
   - `order_items`
   - `payments`
   - `discounts`
   - `reviews`
   - `notifications`
   - `analytics_logs`
   - `admin_members`
   - `blacklisted_customers`
   - `suspended_customers`
   - `loyalty_points_history`
   - `order_notes`
   - `refunds`
   - `flagged_orders`
   - `order_tracking`

### 6.2 Check Sample Data
1. Click on the `customers` table
2. You should see 5 sample customers
3. Click on the `orders` table
4. You should see 10 sample orders

## Step 7: Test Order Management Endpoints

### 7.1 Run the Test Script
```bash
cd backend
node test-order-endpoints.js
```

### 7.2 Manual Testing
```bash
# Get all orders
curl "http://localhost:3001/api/v1/admin/orders" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get single order
curl "http://localhost:3001/api/v1/admin/orders/750e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Common Issues:

1. **Connection Error**: Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
2. **Table Not Found**: Make sure you ran both SQL schema files
3. **Authentication Error**: Verify your service_role key is correct
4. **Port Already in Use**: Change PORT in .env file or kill existing process

### Getting Help:
- Check Supabase logs in the dashboard
- Verify environment variables are correct
- Ensure all SQL scripts ran successfully

## Next Steps

Once Supabase is set up:
1. Test all endpoints with real data
2. Set up authentication for your frontend
3. Deploy to production
4. Set up monitoring and backups

Your Order Management API is now ready to use! 🚀

