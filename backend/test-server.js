// Test server script - Run this to test the server without Supabase
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Test routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Admin Dashboard API Server is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/api/v1/admin/products',
      customers: '/api/v1/admin/customers',
      discounts: '/api/v1/admin/discounts'
    }
  });
});

// Mock API routes for testing
app.get('/api/v1/admin/products', (req, res) => {
  res.json({
    success: true,
    message: 'Products endpoint is working',
    data: {
      data: [],
      meta: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      }
    }
  });
});

app.get('/api/v1/admin/customers', (req, res) => {
  res.json({
    success: true,
    message: 'Customers endpoint is working',
    data: {
      data: [],
      meta: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      }
    }
  });
});

app.get('/api/v1/admin/discounts', (req, res) => {
  res.json({
    success: true,
    message: 'Discounts endpoint is working',
    data: {
      data: [],
      meta: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  / - Server status`);
  console.log(`   GET  /api/v1/admin/products - Products endpoint`);
  console.log(`   GET  /api/v1/admin/customers - Customers endpoint`);
  console.log(`   GET  /api/v1/admin/discounts - Discounts endpoint`);
  console.log(`\n🔧 To test with curl:`);
  console.log(`   curl http://localhost:${PORT}/`);
  console.log(`   curl http://localhost:${PORT}/api/v1/admin/products`);
});

