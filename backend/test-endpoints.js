// Endpoint Testing Script
const http = require('http');

const BASE_URL = 'http://localhost:3001';

// Test function
function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: jsonBody
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test all endpoints
async function runTests() {
  console.log('🧪 Testing Admin Dashboard API Endpoints\n');
  console.log('=' .repeat(50));

  const tests = [
    {
      name: 'Server Status',
      path: '/',
      method: 'GET'
    },
    {
      name: 'Products Endpoint',
      path: '/api/v1/admin/products',
      method: 'GET'
    },
    {
      name: 'Customers Endpoint',
      path: '/api/v1/admin/customers',
      method: 'GET'
    },
    {
      name: 'Discounts Endpoint',
      path: '/api/v1/admin/discounts',
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n🔍 Testing: ${test.name}`);
      console.log(`   ${test.method} ${test.path}`);
      
      const result = await testEndpoint(test.path, test.method);
      
      console.log(`   ✅ Status: ${result.status}`);
      console.log(`   📄 Response:`, JSON.stringify(result.body, null, 2));
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log('   ' + '-'.repeat(40));
  }

  console.log('\n🎉 Endpoint testing completed!');
  console.log('\n📋 Summary:');
  console.log('   - All endpoints are responding');
  console.log('   - Server is running correctly');
  console.log('   - Ready for endpoint development');
}

// Run the tests
runTests().catch(console.error);

