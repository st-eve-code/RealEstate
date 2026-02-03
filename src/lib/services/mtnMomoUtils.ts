/**
 * MTN Mobile Money Utilities
 * 
 * Utilities to manage and check API users and keys
 */

import axios from 'axios';

const SUBSCRIPTION_KEY = process.env.MTN_MOMO_SUBSCRIPTION_KEY || '';
const ENVIRONMENT = process.env.MTN_MOMO_ENVIRONMENT || 'sandbox';

const SANDBOX_BASE_URL = 'https://sandbox.momodeveloper.mtn.com';
const PRODUCTION_BASE_URL = 'https://api.mtn.com';

const BASE_URL = ENVIRONMENT === 'production' ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL;

/**
 * Get API User Details
 * Check if an API User exists and get its details
 */
export async function getApiUserDetails(apiUser: string): Promise<{
  exists: boolean;
  details?: {
    targetEnvironment: string;
    providerCallbackHost: string;
  };
  error?: string;
}> {
  try {
    if (!SUBSCRIPTION_KEY) {
      return {
        exists: false,
        error: 'MTN_MOMO_SUBSCRIPTION_KEY not configured',
      };
    }

    const response = await axios.get(
      `${BASE_URL}/v1_0/apiuser/${apiUser}`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
        },
      }
    );

    return {
      exists: true,
      details: response.data,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          exists: false,
          error: 'API User not found',
        };
      }
    }

    return {
      exists: false,
      error: error.message || 'Failed to get API user details',
    };
  }
}

/**
 * Test API User Authentication
 * Check if API User and API Key are valid by attempting to get a token
 */
export async function testApiUserAuth(
  apiUser: string,
  apiKey: string
): Promise<{
  valid: boolean;
  message: string;
  accessToken?: string;
}> {
  try {
    if (!SUBSCRIPTION_KEY) {
      return {
        valid: false,
        message: 'MTN_MOMO_SUBSCRIPTION_KEY not configured',
      };
    }

    if (!apiUser || !apiKey) {
      return {
        valid: false,
        message: 'API User or API Key not provided',
      };
    }

    // Attempt to get access token
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
      return {
        valid: true,
        message: 'API User and Key are valid! Authentication successful.',
        accessToken: response.data.access_token,
      };
    }

    return {
      valid: false,
      message: 'Could not authenticate',
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return {
          valid: false,
          message: 'Invalid API User or API Key. Authentication failed.',
        };
      }
    }

    return {
      valid: false,
      message: error.message || 'Authentication test failed',
    };
  }
}

/**
 * Validate MTN MoMo Configuration
 * Check if all required environment variables are set and valid
 */
export async function validateConfiguration(): Promise<{
  valid: boolean;
  checks: {
    subscriptionKey: boolean;
    apiUser: boolean;
    apiKey: boolean;
    authentication: boolean;
  };
  messages: string[];
}> {
  const checks = {
    subscriptionKey: false,
    apiUser: false,
    apiKey: false,
    authentication: false,
  };
  const messages: string[] = [];

  // Check subscription key
  if (SUBSCRIPTION_KEY && SUBSCRIPTION_KEY.length === 32) {
    checks.subscriptionKey = true;
    messages.push('✅ Subscription Key is set');
  } else {
    messages.push('❌ Subscription Key is missing or invalid (should be 32 characters)');
  }

  // Check API User
  const apiUser = process.env.MTN_MOMO_API_USER || '';
  if (apiUser && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(apiUser)) {
    checks.apiUser = true;
    messages.push('✅ API User is set and has valid UUID format');

    // Check if API User exists
    const userDetails = await getApiUserDetails(apiUser);
    if (userDetails.exists) {
      messages.push('✅ API User exists in MTN system');
    } else {
      messages.push(`⚠️  API User may not exist: ${userDetails.error}`);
    }
  } else {
    messages.push('❌ API User is missing or not a valid UUID');
  }

  // Check API Key
  const apiKey = process.env.MTN_MOMO_API_KEY || '';
  if (apiKey && apiKey.length > 10) {
    checks.apiKey = true;
    messages.push('✅ API Key is set');
  } else {
    messages.push('❌ API Key is missing or too short');
  }

  // Test authentication if all credentials are present
  if (checks.subscriptionKey && checks.apiUser && checks.apiKey) {
    const authTest = await testApiUserAuth(apiUser, apiKey);
    if (authTest.valid) {
      checks.authentication = true;
      messages.push('✅ Authentication successful! All credentials are working.');
    } else {
      messages.push(`❌ Authentication failed: ${authTest.message}`);
    }
  } else {
    messages.push('⚠️  Cannot test authentication - missing credentials');
  }

  const allValid = checks.subscriptionKey && checks.apiUser && checks.apiKey && checks.authentication;

  return {
    valid: allValid,
    checks,
    messages,
  };
}

/**
 * Get Configuration Summary
 * Display current configuration status
 */
export function getConfigurationSummary(): {
  environment: string;
  subscriptionKey: string;
  apiUser: string;
  apiKey: string;
  targetEnvironment: string;
  callbackUrl: string;
} {
  return {
    environment: ENVIRONMENT,
    subscriptionKey: SUBSCRIPTION_KEY ? `${SUBSCRIPTION_KEY.substring(0, 8)}...${SUBSCRIPTION_KEY.substring(24)}` : 'NOT SET',
    apiUser: process.env.MTN_MOMO_API_USER || 'NOT SET',
    apiKey: process.env.MTN_MOMO_API_KEY ? `${process.env.MTN_MOMO_API_KEY.substring(0, 4)}...` : 'NOT SET',
    targetEnvironment: process.env.MTN_MOMO_TARGET_ENVIRONMENT || 'NOT SET',
    callbackUrl: process.env.MTN_MOMO_CALLBACK_URL || 'NOT SET',
  };
}
