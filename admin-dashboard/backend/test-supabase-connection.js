// Supabase Connection Test Script
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

console.log('🧪 Testing Supabase Connection\n');

// Check environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables!');
  console.log('📝 Please check your .env file:');
  console.log('   - SUPABASE_URL');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`🔗 Supabase URL: ${supabaseUrl}`);
console.log(`🔑 Service Key: ${supabaseKey.substring(0, 20)}...`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔍 Testing database connection...');
    
    // Test 1: Check if we can connect to the database
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('customer_id, name, email')
      .limit(5);

    if (customersError) {
      console.log('❌ Database connection failed:', customersError.message);
      return;
    }

    console.log('✅ Database connection successful!');
    console.log(`📊 Found ${customers.length} customers`);

    // Test 2: Check if our tables exist
    console.log('\n🔍 Checking for required tables...');
    
    const requiredTables = [
      'customers', 'orders', 'products', 'order_items', 
      'payments', 'order_notes', 'refunds', 'flagged_orders'
    ];

    // Test each table
    let existingTables = [];
    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (!error) {
          existingTables.push(table);
        }
      } catch (e) {
        // Table doesn't exist
      }
    }

    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.log('⚠️  Missing tables:', missingTables.join(', '));
      console.log('📝 Please run the database schema files in Supabase SQL Editor');
    } else {
      console.log('✅ All required tables found!');
    }

    // Test 3: Check sample data
    console.log('\n🔍 Checking sample data...');
    
    if (customers && customers.length > 0) {
      console.log(`✅ Found ${customers.length} customers`);
      customers.forEach(customer => {
        console.log(`   - ${customer.name} (${customer.email})`);
      });
    } else {
      console.log('⚠️  No customers found');
    }

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('order_id, status, total_amount')
      .limit(3);

    if (ordersError) {
      console.log('⚠️  Could not fetch orders:', ordersError.message);
    } else {
      console.log(`✅ Found ${orders.length} orders`);
      orders.forEach(order => {
        console.log(`   - Order ${order.order_id.slice(-4)}: ${order.status} (₹${order.total_amount})`);
      });
    }

    console.log('\n🎉 Supabase connection test completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Database connection working');
    console.log('   ✅ Environment variables configured');
    console.log('   ✅ Ready to test API endpoints');

  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
  }
}

// Run the test
testConnection();
