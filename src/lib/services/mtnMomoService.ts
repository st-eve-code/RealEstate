/**
 * MTN Mobile Money Payment Service
 * 
 * Documentation: https://momodeveloper.mtn.com/
 * 
 * Setup Instructions:
 * 1. Create account at https://momodeveloper.mtn.com/
 * 2. Subscribe to Collections product
 * 3. Get your subscription key from the profile page
 * 4. Create API User and API Key (see createApiUser function)
 * 5. Add credentials to .env file
 */

import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Environment variables
const SUBSCRIPTION_KEY = process.env.MTN_MOMO_SUBSCRIPTION_KEY || '';
const API_USER = process.env.MTN_MOMO_API_USER || '';
const API_KEY = process.env.MTN_MOMO_API_KEY || '';
const ENVIRONMENT = process.env.MTN_MOMO_ENVIRONMENT || 'sandbox';
const TARGET_ENVIRONMENT = process.env.MTN_MOMO_TARGET_ENVIRONMENT || 'sandbox';
const CALLBACK_URL = process.env.MTN_MOMO_CALLBACK_URL || '';

// Base URLs
const SANDBOX_BASE_URL = 'https://sandbox.momodeveloper.mtn.com';
const PRODUCTION_BASE_URL = 'https://api.mtn.com'; // Update with actual production URL

const BASE_URL = ENVIRONMENT === 'production' ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL;

// API Endpoints
const COLLECTIONS_URL = `${BASE_URL}/collection/v1_0`;

export interface MTNPaymentRequest {
  amount: string;
  currency: string; // e.g., 'XAF' for Central African Franc
  externalId: string; // Your internal transaction ID
  payer: {
    partyIdType: 'MSISDN'; // Phone number
    partyId: string; // Phone number without country code (e.g., '677123456')
  };
  payerMessage: string;
  payeeNote: string;
}

export interface MTNPaymentResponse {
  success: boolean;
  referenceId?: string;
  status?: string;
  reason?: string;
  error?: string;
  message?: string;
}

export interface MTNTransactionStatus {
  amount: string;
  currency: string;
  financialTransactionId: string;
  externalId: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  reason?: string;
}

/**
 * Get OAuth 2.0 Access Token
 * Required for all API requests
 */
async function getAccessToken(): Promise<string> {
  try {
    // Validate credentials before making request
    if (!SUBSCRIPTION_KEY) {
      throw new Error('[MTN Config Error] MTN_MOMO_SUBSCRIPTION_KEY is not set in environment variables');
    }
    if (!API_USER) {
      throw new Error('[MTN Config Error] MTN_MOMO_API_USER is not set in environment variables');
    }
    if (!API_KEY) {
      throw new Error('[MTN Config Error] MTN_MOMO_API_KEY is not set in environment variables');
    }

    // Validate API_USER format (must be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(API_USER)) {
      throw new Error(
        `[MTN Config Error] MTN_MOMO_API_USER has invalid format. Expected UUID, got: "${API_USER}". ` +
        `If you see "your_mtn_api_user_uuid", you need to replace it with actual credentials. ` +
        `Run: node scripts/setup-mtn-credentials.js`
      );
    }

    // Validate SUBSCRIPTION_KEY format (should be 32 hex characters)
    if (SUBSCRIPTION_KEY.length !== 32 || !/^[0-9a-f]{32}$/i.test(SUBSCRIPTION_KEY)) {
      throw new Error(
        `[MTN Config Error] MTN_MOMO_SUBSCRIPTION_KEY has invalid format. ` +
        `Expected 32 hexadecimal characters, got ${SUBSCRIPTION_KEY.length} characters. ` +
        `Get your key from: https://momodeveloper.mtn.com/profile`
      );
    }

    const credentials = Buffer.from(`${API_USER}:${API_KEY}`).toString('base64');

    console.log('[MTN Auth] Requesting access token...');
    console.log('[MTN Auth] API User:', API_USER.substring(0, 8) + '...');
    console.log('[MTN Auth] Subscription Key:', SUBSCRIPTION_KEY.substring(0, 8) + '...');

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
    console.log('Access token response: ', response.data);

    console.log('[MTN Auth] ✅ Access token obtained successfully');
    return response.data.access_token;
  } catch (error) {
    // Enhanced error logging
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const statusText = error.response?.statusText;
      const data = error.response?.data;

      console.error('[MTN Auth Error] Failed to get access token');
      console.error('[MTN Auth Error] Status:', status, statusText);
      console.error('[MTN Auth Error] Response:', JSON.stringify(data, null, 2));
      console.error('[MTN Auth Error] URL:', `${COLLECTIONS_URL}/token/`);
      console.error('[MTN Auth Error] Subscription Key:', SUBSCRIPTION_KEY ? 'SET (' + SUBSCRIPTION_KEY.length + ' chars)' : 'NOT SET');
      console.error('[MTN Auth Error] API User:', API_USER ? (uuidRegex.test(API_USER) ? 'SET (valid UUID)' : `SET (INVALID: ${API_USER})`) : 'NOT SET');
      console.error('[MTN Auth Error] API Key:', API_KEY ? 'SET' : 'NOT SET');

      // Specific error messages based on status code
      if (status === 401) {
        throw new Error(
          `[MTN Auth Failed] 401 Unauthorized - Invalid credentials. ` +
          `This usually means:\n` +
          `1. Your API User (${API_USER.substring(0, 8)}...) doesn't exist on MTN servers\n` +
          `2. Your API Key doesn't match this API User\n` +
          `3. Your Subscription Key changed\n` +
          `Solution: Run "node scripts/setup-mtn-credentials.js" to create new credentials`
        );
      } else if (status === 404) {
        throw new Error(
          `[MTN Auth Failed] 404 Not Found - API User doesn't exist. ` +
          `The API User "${API_USER}" was not found on MTN servers. ` +
          `Create it by running: node scripts/setup-mtn-credentials.js`
        );
      } else if (status === 500) {
        throw new Error(
          `[MTN Server Error] 500 Internal Server Error - MTN's servers are having issues. ` +
          `Try again in a few minutes.`
        );
      } else {
        throw new Error(
          `[MTN Auth Failed] ${status} ${statusText} - ${JSON.stringify(data)}`
        );
      }
    }

    // If error has a message from validation, throw it directly
    if (error instanceof Error && error.message.startsWith('[MTN')) {
      throw error;
    }

    console.error('[MTN Auth Error] Unexpected error:', error);
    throw new Error(
      `[MTN Auth Failed] Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
      `Check console logs for details.`
    );
  }
}

/**
 * Request payment from customer
 * This initiates a payment request that the customer must approve on their phone
 */
export async function requestPayment(
  paymentData: MTNPaymentRequest
): Promise<MTNPaymentResponse> {
  try {

    // Validate environment variables
    if (!SUBSCRIPTION_KEY || !API_USER || !API_KEY) {
      const missing = [];
      if (!SUBSCRIPTION_KEY) missing.push('MTN_MOMO_SUBSCRIPTION_KEY');
      if (!API_USER) missing.push('MTN_MOMO_API_USER');
      if (!API_KEY) missing.push('MTN_MOMO_API_KEY');
      
      throw new Error(
        `[MTN Config Error] Missing credentials: ${missing.join(', ')}. ` +
        `Add these to your .env file. See PAYMENT_SETUP.md for instructions.`
      );
    }

    // Get access token
    const accessToken = await getAccessToken();

    // Generate unique reference ID for this transaction
    const referenceId = uuidv4();

    // Make payment request
    const response = await axios.post(
      `${COLLECTIONS_URL}/requesttopay`,
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': TARGET_ENVIRONMENT,
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    // If request is accepted (202), return reference ID
    if (response.status === 202) {
      return {
        success: true,
        referenceId: referenceId,
        status: 'PENDING',
        message: 'Payment request sent. Please check your phone to approve the transaction.',
      };
    }

    return {
      success: false,
      error: 'Unexpected response from payment gateway',
    };
  } catch (error) {
    // Log detailed error for developers
    console.error('==========================================');
    console.error('[MTN Payment Error] Payment request failed');
    console.error('==========================================');
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Response Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Request URL:', error.config?.url);
      console.error('Request Headers:', JSON.stringify(error.config?.headers, null, 2));
    } else {
      console.error('Error:', error);
    }
    console.error('==========================================');
    
    return handleMTNError(error);
  }
}

/**
 * Check payment status
 * Poll this endpoint to check if the customer has approved the payment
 */
export async function getTransactionStatus(
  referenceId: string
): Promise<MTNPaymentResponse> {
  try {
    if (!SUBSCRIPTION_KEY || !API_USER || !API_KEY) {
      throw new Error('MTN MoMo credentials not configured');
    }

    const accessToken = await getAccessToken();

    const response = await axios.get<MTNTransactionStatus>(
      `${COLLECTIONS_URL}/requesttopay/${referenceId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': TARGET_ENVIRONMENT,
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
        },
      }
    );

    const transaction = response.data;

    return {
      success: true,
      referenceId: referenceId,
      status: transaction.status,
      reason: transaction.reason,
      message: getStatusMessage(transaction.status),
    };
  } catch (error) {
    // Log detailed error for developers
    console.error('==========================================');
    console.error('[MTN Status Check Error] Failed to get transaction status');
    console.error('==========================================');
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Response Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Request URL:', error.config?.url);
    } else {
      console.error('Error:', error);
    }
    console.error('==========================================');
    
    return handleMTNError(error);
  }
}

/**
 * Validate customer's phone number and account
 * Check if the number is registered for Mobile Money
 */
export async function validateAccount(
  phoneNumber: string
): Promise<{ valid: boolean; message: string }> {
  try {
    if (!SUBSCRIPTION_KEY || !API_USER || !API_KEY) {
      return {
        valid: false,
        message: 'Payment system not configured',
      };
    }

    const accessToken = await getAccessToken();

    const response = await axios.get(
      `${COLLECTIONS_URL}/accountholder/msisdn/${phoneNumber}/active`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': TARGET_ENVIRONMENT,
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
        },
      }
    );

    if (response.data.result === true) {
      return {
        valid: true,
        message: 'Account is valid and active',
      };
    }

    return {
      valid: false,
      message: 'This phone number is not registered for Mobile Money',
    };
  } catch (error) {
    console.error('Error validating account:', error);
    return {
      valid: false,
      message: 'Unable to validate account. Please check the phone number.',
    };
  }
}

/**
 * Handle MTN API errors with user-friendly messages
 */
function handleMTNError(error: unknown): MTNPaymentResponse {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    // Network or connection errors
    if (!axiosError.response) {
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Unable to connect to payment service. Please check your internet connection.',
      };
    }

    const status = axiosError.response.status;
    const errorData = axiosError.response.data;

    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        return {
          success: false,
          error: 'INVALID_REQUEST',
          message: 'Invalid payment details. Please check your information and try again.',
        };
      
      case 401:
        return {
          success: false,
          error: 'AUTHENTICATION_FAILED',
          message: 'Payment system authentication failed. Please contact support.',
        };
      
      case 404:
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'Transaction not found. Please try again.',
        };
      
      case 409:
        return {
          success: false,
          error: 'DUPLICATE_TRANSACTION',
          message: 'This transaction is already being processed.',
        };
      
      case 500:
        return {
          success: false,
          error: 'SERVER_ERROR',
          message: 'Payment service is temporarily unavailable. Please try again later.',
        };
      
      default:
        return {
          success: false,
          error: 'UNKNOWN_ERROR',
          message: errorData?.message || 'An unexpected error occurred. Please try again.',
        };
    }
  }

  // Non-Axios errors
  return {
    success: false,
    error: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
  };
}

/**
 * Get user-friendly status message
 */
function getStatusMessage(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Payment is pending. Please check your phone to approve the transaction.';
    case 'SUCCESSFUL':
      return 'Payment completed successfully!';
    case 'FAILED':
      return 'Payment failed. Please try again or use a different payment method.';
    default:
      return 'Payment status unknown. Please contact support.';
  }
}

/**
 * Utility: Create API User (One-time setup)
 * Run this once to create API user credentials
 * Only needed in sandbox environment
 */
export async function createApiUser(): Promise<{ apiUser: string; message: string }> {
  try {
    const apiUser = uuidv4();
    const providerCallbackHost = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    await axios.post(
      `${BASE_URL}/v1_0/apiuser`,
      {
        providerCallbackHost: providerCallbackHost,
      },
      {
        headers: {
          'X-Reference-Id': apiUser,
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      apiUser: apiUser,
      message: 'API User created successfully. Save this API User ID in your .env file.',
    };
  } catch (error) {
    console.error('Error creating API user:', error);
    throw new Error('Failed to create API user');
  }
}

/**
 * Utility: Create API Key (One-time setup)
 * Run this after creating API user
 */
export async function createApiKey(apiUser: string): Promise<{ apiKey: string; message: string }> {
  try {
    const response = await axios.post(
      `${BASE_URL}/v1_0/apiuser/${apiUser}/apikey`,
      {},
      {
        headers: {
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
        },
      }
    );

    return {
      apiKey: response.data.apiKey,
      message: 'API Key created successfully. Save this API Key in your .env file.',
    };
  } catch (error) {
    console.error('Error creating API key:', error);
    throw new Error('Failed to create API key');
  }
}

// Validate configuration on module load
export function validateMTNConfig(): { valid: boolean; message: string } {
  if (!SUBSCRIPTION_KEY) {
    return {
      valid: false,
      message: 'MTN_MOMO_SUBSCRIPTION_KEY is not configured',
    };
  }

  if (!API_USER) {
    return {
      valid: false,
      message: 'MTN_MOMO_API_USER is not configured',
    };
  }

  if (!API_KEY) {
    return {
      valid: false,
      message: 'MTN_MOMO_API_KEY is not configured',
    };
  }

  return {
    valid: true,
    message: 'MTN MoMo configuration is valid',
  };
}
