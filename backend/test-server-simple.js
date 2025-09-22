// Simple server test without database dependencies
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Test route for team management
app.get('/api/v1/admin/team/test', (req, res) => {
  res.json({
    success: true,
    message: 'Team management endpoint is working!',
    data: {
      availableEndpoints: [
        'POST /api/v1/admin/team/members',
        'GET /api/v1/admin/team/members',
        'GET /api/v1/admin/team/roles',
        'GET /api/v1/admin/team/permissions',
        'GET /api/v1/admin/team/stats'
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`🔗 Test the server: http://localhost:${PORT}`);
  console.log(`🔗 Test team endpoint: http://localhost:${PORT}/api/v1/admin/team/test`);
});
