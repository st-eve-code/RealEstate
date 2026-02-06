/**
 * Check MTN MoMo Configuration
 * 
 * Run this script to verify your MTN Mobile Money credentials are valid
 * 
 * Usage: node scripts/check-mtn-config.js
 */

// Load environment variables
require('dotenv').config();

const axios = require('axios');

const SUBSCRIPTION_KEY = process.env.MTN_MOMO_SUBSCRIPTION_KEY || '';
const API_USER = process.env.MTN_MOMO_API_USER || '';
const API_KEY = process.env.MTN_MOMO_API_KEY || '';
const ENVIRONMENT = process.env.MTN_MOMO_ENVIRONMENT || 'sandbox';

const BASE_URL = ENVIRONMENT === 'production' 
  ? 'https://api.mtn.com' 
  : 'https://sandbox.momodeveloper.mtn.com';

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                                                                ║');
console.log('║        MTN Mobile Money Configuration Check                    ║');
console.log('║                                                                ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Check 1: Subscription Key
console.log('📋 Configuration Summary:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`Environment: ${ENVIRONMENT}`);
console.log(`Base URL: ${BASE_URL}`);
console.log(`Subscription Key: ${SUBSCRIPTION_KEY ? `${SUBSCRIPTION_KEY.substring(0, 8)}...${SUBSCRIPTION_KEY.substring(24)}` : '❌ NOT SET'}`);
console.log(`API User: ${API_USER || '❌ NOT SET'}`);
console.log(`API Key: ${API_KEY ? `${API_KEY.substring(0, 4)}...` : '❌ NOT SET'}`);
console.log('\n');

// Validation checks
const checks = {
  subscriptionKey: false,
  apiUser: false,
  apiKey: false,
  apiUserExists: false,
  authentication: false,
};

console.log('🔍 Running Validation Checks:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check Subscription Key
if (SUBSCRIPTION_KEY && SUBSCRIPTION_KEY.length === 32) {
  console.log('✅ Subscription Key: Valid (32 characters)');
  checks.subscriptionKey = true;
} else {
  console.log('❌ Subscription Key: Missing or invalid length (should be 32 characters)');
}

// Check API User format
if (API_USER && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(API_USER)) {
  console.log('✅ API User: Valid UUID format');
  checks.apiUser = true;
} else {
  console.log('❌ API User: Missing or invalid UUID format');
}

// Check API Key
if (API_KEY && API_KEY.length > 10) {
  console.log('✅ API Key: Set');
  checks.apiKey = true;
} else {
  console.log('❌ API Key: Missing or too short');
}

console.log('\n');

// Advanced checks (require API calls)
async function runAdvancedChecks() {
  if (!checks.subscriptionKey) {
    console.log('⚠️  Cannot run advanced checks without Subscription Key\n');
    return;
  }

  console.log('🔬 Running Advanced Checks:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check if API User exists
  if (checks.apiUser) {
    try {
      console.log('Checking if API User exists in MTN system...');
      const response = await axios.get(
        `${BASE_URL}/v1_0/apiuser/${API_USER}`,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
            'X-Reference-Id': API_USER,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ API User exists in MTN system');
      console.log(`   Target Environment: ${response.data.targetEnvironment}`);
      console.log(`   Callback Host: ${response.data.providerCallbackHost}`);
      checks.apiUserExists = true;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('❌ API User not found in MTN system');
        console.log('   You need to create this API User first');
      } else if (error.response?.status === 401) {
        console.log('❌ Subscription Key is invalid');
      } else {
        console.log(`❌ Error checking API User: ${error.message}`);
      }
    }
  }

  // Test authentication
  if (checks.subscriptionKey && checks.apiUser && checks.apiKey) {
    try {
      console.log('\nTesting authentication with API User and Key...');
      const credentials = Buffer.from(`${API_USER}:${API_KEY}`).toString('base64');

      const response = await axios.post(
        `${BASE_URL}/collection/token/`,
        {},
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
          },
        }
      );

      if (response.data.access_token) {
        console.log('✅ Authentication successful!');
        console.log('   Access token received (valid for 1 hour)');
        console.log(`   Token: ${response.data.access_token.substring(0, 20)}...`);
        checks.authentication = true;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Authentication failed: Invalid API User or API Key');
        console.log('   Double-check your credentials in .env file');
      } else {
        console.log(`❌ Authentication error: ${error.message}`);
      }
    }
  } else {
    console.log('⚠️  Cannot test authentication - missing credentials');
  }

  console.log('\n');

  // Final summary
  console.log('📊 Final Results:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const allValid = checks.subscriptionKey && checks.apiUser && checks.apiKey && 
                   checks.apiUserExists && checks.authentication;

  if (allValid) {
    console.log('🎉 SUCCESS! All credentials are valid and working!\n');
    console.log('Your MTN Mobile Money integration is ready to use.');
    console.log('You can now process payments in your application.\n');
  } else {
    console.log('⚠️  CONFIGURATION INCOMPLETE\n');
    console.log('Issues found:');
    if (!checks.subscriptionKey) console.log('  • Set MTN_MOMO_SUBSCRIPTION_KEY in .env');
    if (!checks.apiUser) console.log('  • Set MTN_MOMO_API_USER in .env (must be a UUID)');
    if (!checks.apiKey) console.log('  • Set MTN_MOMO_API_KEY in .env');
    if (checks.apiUser && !checks.apiUserExists) console.log('  • Create API User using setup script');
    if (checks.apiUser && checks.apiKey && !checks.authentication) console.log('  • Verify API User and Key are correct');
    
    console.log('\nRefer to PAYMENT_SETUP.md for detailed setup instructions.\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run advanced checks
runAdvancedChecks().catch(console.error);
