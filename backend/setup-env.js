// Environment Setup Helper Script
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔧 Supabase Environment Setup Helper\n');

// Generate a random JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

const envContent = `# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=${jwtSecret}

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

const envPath = path.join(__dirname, '.env');

try {
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    console.log('📝 Please update the following values in your .env file:');
    console.log('   - SUPABASE_URL: Your Supabase project URL');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY: Your service role secret key');
    console.log(`   - JWT_SECRET: ${jwtSecret}`);
  } else {
    // Create .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📝 Please update the following values:');
    console.log('   - SUPABASE_URL: Your Supabase project URL');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY: Your service role secret key');
    console.log(`   - JWT_SECRET: ${jwtSecret} (already generated)`);
  }

  console.log('\n🔗 Next Steps:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Copy your Project URL and Service Role Key');
  console.log('3. Update the .env file with your actual values');
  console.log('4. Run: npm run dev');
  console.log('5. Test your endpoints!');

} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
}

