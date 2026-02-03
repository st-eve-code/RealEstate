/**
 * MTN Mobile Money API Credentials Setup
 * 
 * This script creates API User and API Key for MTN MoMo sandbox
 * 
 * Usage: node scripts/setup-mtn-credentials.js
 */

require('dotenv').config();
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const SUBSCRIPTION_KEY = process.env.MTN_MOMO_SUBSCRIPTION_KEY || '';
const ENVIRONMENT = process.env.MTN_MOMO_ENVIRONMENT || 'sandbox';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const BASE_URL = ENVIRONMENT === 'production' 
  ? 'https://api.mtn.com' 
  : 'https://sandbox.momodeveloper.mtn.com';

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                                                                ║');
console.log('║        MTN Mobile Money API Credentials Setup                  ║');
console.log('║                                                                ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Check subscription key
if (!SUBSCRIPTION_KEY) {
  console.error('❌ ERROR: MTN_MOMO_SUBSCRIPTION_KEY not found in .env file\n');
  console.log('Please add your subscription key to .env:');
  console.log('MTN_MOMO_SUBSCRIPTION_KEY=your_subscription_key_here\n');
  console.log('Get it from: https://momodeveloper.mtn.com/\n');
  process.exit(1);
}

console.log('📋 Configuration:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`Environment: ${ENVIRONMENT}`);
console.log(`Base URL: ${BASE_URL}`);
console.log(`Subscription Key: ${SUBSCRIPTION_KEY.substring(0, 8)}...${SUBSCRIPTION_KEY.substring(24)}`);
console.log(`Callback Host: ${APP_URL}\n`);

async function createApiUser() {
  try {
    const apiUser = uuidv4();
    console.log('🔄 Step 1: Creating API User...');
    console.log(`   Generated UUID: ${apiUser}\n`);

    await axios.post(
      `${BASE_URL}/v1_0/apiuser`,
      {
        providerCallbackHost: APP_URL,
      },
      {
        headers: {
          'X-Reference-Id': apiUser,
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ API User created successfully!\n');
    return apiUser;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 409) {
        console.log('⚠️  API User already exists (409 Conflict)');
        console.log('   This is normal if you ran this script before.\n');
        return null;
      } else if (error.response.status === 401) {
        console.error('❌ ERROR: Invalid Subscription Key (401 Unauthorized)\n');
        console.log('Please check your MTN_MOMO_SUBSCRIPTION_KEY in .env file\n', SUBSCRIPTION_KEY);
        process.exit(1);
      }
      console.error(`❌ Error creating API User: ${error.response.status} - ${error.response.statusText}`);
      if (error.response.data) {
        console.error('   Response:', JSON.stringify(error.response.data, null, 2));
      }
    } else {
      console.error('❌ Error creating API User:', error.message);
    }
    throw error;
  }
}

async function createApiKey(apiUser) {
  try {
    console.log('🔄 Step 2: Creating API Key...\n');

    const response = await axios.post(
      `${BASE_URL}/v1_0/apiuser/${apiUser}/apikey`,
      {},
      {
        headers: {
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
        },
      }
    );

    const apiKey = response.data.apiKey;
    console.log('✅ API Key created successfully!\n');
    return apiKey;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        console.error('❌ ERROR: API User not found (404)\n');
        console.log('The API User might not have been created properly.\n');
      } else if (error.response.status === 401) {
        console.error('❌ ERROR: Invalid Subscription Key (401 Unauthorized)\n');
      }
      console.error(`   Status: ${error.response.status} - ${error.response.statusText}`);
      if (error.response.data) {
        console.error('   Response:', JSON.stringify(error.response.data, null, 2));
      }
    } else {
      console.error('❌ Error creating API Key:', error.message);
    }
    throw error;
  }
}

async function verifyCredentials(apiUser, apiKey) {
  try {
    console.log('🔄 Step 3: Verifying credentials...\n');

    const credentials = Buffer.from(`${apiUser}:${apiKey}`).toString('base64');

    const response = await axios.post(
      `${BASE_URL}/collection/v1_0/token/`,
      {},
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
        },
      }
    );

    if (response.data.access_token) {
      console.log('✅ Credentials verified! Authentication successful!\n');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Failed to verify credentials');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
    }
    return false;
  }
}

async function setup() {
  try {
    const apiUser = await createApiUser();
    
    if (!apiUser) {
      console.log('❌ Could not create API User. Please try again or create manually.\n');
      return;
    }

    // Wait a bit for the API User to be fully created
    console.log('⏳ Waiting 2 seconds for API User to be fully created...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`apiUser: ${apiUser}`)

    const apiKey = await createApiKey(apiUser);

    if (!apiKey) {
      console.log('❌ Could not create API Key.\n');
      return;
    }

    // Verify credentials work
    await verifyCredentials(apiUser, apiKey);

    // Display results
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                ║');
    console.log('║                    ✅ SETUP COMPLETE!                          ║');
    console.log('║                                                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('📝 Add these to your .env file:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`MTN_MOMO_API_USER=${apiUser}`);
    console.log(`MTN_MOMO_API_KEY=${apiKey}\n`);

    console.log('📋 Your complete MTN MoMo configuration:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`MTN_MOMO_SUBSCRIPTION_KEY=${SUBSCRIPTION_KEY}`);
    console.log(`MTN_MOMO_API_USER=${apiUser}`);
    console.log(`MTN_MOMO_API_KEY=${apiKey}`);
    console.log('MTN_MOMO_ENVIRONMENT=sandbox');
    console.log('MTN_MOMO_TARGET_ENVIRONMENT=sandbox');
    console.log(`MTN_MOMO_CALLBACK_URL=${APP_URL}/api/payment/callback\n`);

    console.log('✨ Next Steps:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('1. Copy the API_USER and API_KEY to your .env file');
    console.log('2. Restart your development server');
    console.log('3. Test payments with sandbox phone numbers');
    console.log('4. Run: node scripts/check-mtn-config.js to verify\n');

    console.log('📚 Resources:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('• Setup Guide: PAYMENT_SETUP.md');
    console.log('• MTN Portal: https://momodeveloper.mtn.com/');
    console.log('• Test Numbers: 46733123450 (success), 46733123470 (fail)\n');

  } catch (error) {
    console.error('\n❌ Setup failed. Please check the error messages above.\n');
    console.log('💡 Troubleshooting:');
    console.log('  1. Verify your Subscription Key is correct');
    console.log('  2. Make sure you have internet connection');
    console.log('  3. Check PAYMENT_SETUP.md for detailed instructions');
    console.log('  4. Try creating credentials manually (see guide)\n');
  }
}

// Run setup
console.log('🚀 Starting MTN MoMo credentials setup...\n');
setup();
