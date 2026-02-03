const axios = require('axios');
require('dotenv').config();

const SUBSCRIPTION_KEY = process.env.MTN_MOMO_SUBSCRIPTION_KEY;
const API_USER = process.env.MTN_MOMO_API_USER;
const API_KEY = process.env.MTN_MOMO_API_KEY;

console.log('Environment Variables Check:');
console.log('SUBSCRIPTION_KEY:', SUBSCRIPTION_KEY ? `${SUBSCRIPTION_KEY.substring(0, 10)}... (${SUBSCRIPTION_KEY.length} chars)` : 'NOT SET');
console.log('API_USER:', API_USER ? API_USER : 'NOT SET');
console.log('API_KEY:', API_KEY ? `${API_KEY.substring(0, 8)}... (${API_KEY.length} chars)` : 'NOT SET');
console.log('');

// Test with HTTPie-style request
async function testPaymentHeaders() {
  const BASE_URL = 'https://sandbox.momodeveloper.mtn.com';
  
  // First get token
  const credentials = Buffer.from(`${API_USER}:${API_KEY}`).toString('base64');
  
  try {
    console.log('Step 1: Getting access token...');
    const tokenResponse = await axios.post(
      `${BASE_URL}/collection/token/`,
      {},
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;
    console.log('✅ Token obtained:', accessToken.substring(0, 20) + '...\n');
    
    // Now make payment with EXACT headers
    const { v4: uuidv4 } = require('uuid');
    const referenceId = uuidv4();
    
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': 'sandbox',
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      'Content-Type': 'application/json',
    };
    
    console.log('Step 2: Making payment request...');
    console.log('Headers being sent:');
    console.log(JSON.stringify({
      ...headers,
      'Authorization': 'Bearer ' + accessToken.substring(0, 10) + '...',
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY.substring(0, 10) + '...',
    }, null, 2));
    console.log('');
    
    const payload = {
      amount: "100",
      currency: "EUR",
      externalId: "test-" + Date.now(),
      payer: {
        partyIdType: "MSISDN",
        partyId: "46733123454"
      },
      payerMessage: "Test",
      payeeNote: "Test"
    };
    
    const paymentResponse = await axios.post(
      `${BASE_URL}/collection/v1_0/requesttopay`,
      payload,
      { headers }
    );
    
    console.log('✅ Payment request successful!');
    console.log('Status:', paymentResponse.status);
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Error Response:');
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testPaymentHeaders();
