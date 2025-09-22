// Simple server to test basic functionality
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
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      team: '/api/v1/admin/team/test',
      products: '/api/v1/admin/products',
      customers: '/api/v1/admin/customers',
      orders: '/api/v1/admin/orders',
      analytics: '/api/v1/admin/analytics'
    }
  });
});

// Team management test endpoint
app.get('/api/v1/admin/team/test', (req, res) => {
  res.json({
    success: true,
    message: 'Team management endpoints are working!',
    data: {
      availableEndpoints: [
        'POST /api/v1/admin/team/members - Create team member',
        'GET /api/v1/admin/team/members - Get all team members',
        'GET /api/v1/admin/team/members/:id - Get single team member',
        'PUT /api/v1/admin/team/members/:id - Update team member',
        'PUT /api/v1/admin/team/members/:id/status - Update member status',
        'DELETE /api/v1/admin/team/members/:id - Delete team member',
        'POST /api/v1/admin/team/roles - Create role',
        'GET /api/v1/admin/team/roles - Get all roles',
        'GET /api/v1/admin/team/roles/:id - Get single role',
        'PUT /api/v1/admin/team/roles/:id - Update role',
        'DELETE /api/v1/admin/team/roles/:id - Delete role',
        'GET /api/v1/admin/team/permissions - Get available permissions',
        'GET /api/v1/admin/team/audit-logs - Get audit logs',
        'GET /api/v1/admin/team/members/export - Export team data',
        'GET /api/v1/admin/team/stats - Get team statistics',
        'POST /api/v1/admin/team/initialize-roles - Initialize default roles'
      ]
    }
  });
});

// Mock endpoints for testing
app.get('/api/v1/admin/products', (req, res) => {
  res.json({
    success: true,
    message: 'Products endpoint is working!',
    data: { count: 0, products: [] }
  });
});

app.get('/api/v1/admin/customers', (req, res) => {
  res.json({
    success: true,
    message: 'Customers endpoint is working!',
    data: { count: 0, customers: [] }
  });
});

app.get('/api/v1/admin/orders', (req, res) => {
  res.json({
    success: true,
    message: 'Orders endpoint is working!',
    data: { count: 0, orders: [] }
  });
});

app.get('/api/v1/admin/analytics', (req, res) => {
  res.json({
    success: true,
    message: 'Analytics endpoint is working!',
    data: { overview: 'Analytics data available' }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Simple server running on http://localhost:${PORT}`);
  console.log(`🔗 Test the server: http://localhost:${PORT}`);
  console.log(`🔗 Test team endpoint: http://localhost:${PORT}/api/v1/admin/team/test`);
  console.log(`🔗 Test other endpoints: http://localhost:${PORT}/api/v1/admin/products`);
});
