import { NextResponse } from 'next/server';
import axios from 'axios';

/**
 * MTN MoMo Configuration Diagnostics
 * GET /api/payment/mtn/diagnose
 * 
 * Returns detailed information about your MTN configuration
 * Helps diagnose issues without making actual payment requests
 */
export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.MTN_MOMO_ENVIRONMENT || 'not set',
    checks: {},
    issues: [],
    recommendations: [],
  };

  // Check 1: Subscription Key
  const subKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY || '';
  if (!subKey) {
    diagnostics.checks.subscriptionKey = {
      status: 'MISSING',
      value: null,
    };
    diagnostics.issues.push('MTN_MOMO_SUBSCRIPTION_KEY is not set');
    diagnostics.recommendations.push('Add MTN_MOMO_SUBSCRIPTION_KEY to your .env file');
  } else if (subKey.length !== 32) {
    diagnostics.checks.subscriptionKey = {
      status: 'INVALID_LENGTH',
      value: `${subKey.substring(0, 8)}... (${subKey.length} chars)`,
      expected: '32 characters',
    };
    diagnostics.issues.push(`Subscription Key has ${subKey.length} characters, expected 32`);
    diagnostics.recommendations.push('Get the correct key from https://momodeveloper.mtn.com/profile');
  } else if (!/^[0-9a-f]{32}$/i.test(subKey)) {
    diagnostics.checks.subscriptionKey = {
      status: 'INVALID_FORMAT',
      value: `${subKey.substring(0, 8)}...`,
      expected: 'Hexadecimal (0-9, a-f)',
    };
    diagnostics.issues.push('Subscription Key contains invalid characters');
  } else {
    diagnostics.checks.subscriptionKey = {
      status: 'OK',
      value: `${subKey.substring(0, 8)}...${subKey.substring(24)}`,
    };
  }

  // Check 2: API User
  const apiUser = process.env.MTN_MOMO_API_USER || '';
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!apiUser) {
    diagnostics.checks.apiUser = {
      status: 'MISSING',
      value: null,
    };
    diagnostics.issues.push('MTN_MOMO_API_USER is not set');
    diagnostics.recommendations.push('Run: node scripts/setup-mtn-credentials.js');
  } else if (apiUser === 'your_mtn_api_user_uuid') {
    diagnostics.checks.apiUser = {
      status: 'PLACEHOLDER',
      value: apiUser,
    };
    diagnostics.issues.push('MTN_MOMO_API_USER is still a placeholder value');
    diagnostics.recommendations.push('Replace with actual UUID from setup script');
  } else if (!uuidRegex.test(apiUser)) {
    diagnostics.checks.apiUser = {
      status: 'INVALID_FORMAT',
      value: apiUser,
      expected: 'UUID format (e.g., a1b2c3d4-e5f6-7890-abcd-ef1234567890)',
    };
    diagnostics.issues.push('MTN_MOMO_API_USER is not a valid UUID');
  } else {
    diagnostics.checks.apiUser = {
      status: 'OK',
      value: `${apiUser.substring(0, 8)}...`,
      fullValue: apiUser,
    };
  }

  // Check 3: API Key
  const apiKey = process.env.MTN_MOMO_API_KEY || '';
  
  if (!apiKey) {
    diagnostics.checks.apiKey = {
      status: 'MISSING',
      value: null,
    };
    diagnostics.issues.push('MTN_MOMO_API_KEY is not set');
  } else if (apiKey === 'your_mtn_api_key') {
    diagnostics.checks.apiKey = {
      status: 'PLACEHOLDER',
      value: apiKey,
    };
    diagnostics.issues.push('MTN_MOMO_API_KEY is still a placeholder value');
  } else {
    diagnostics.checks.apiKey = {
      status: 'OK',
      value: `${apiKey.substring(0, 4)}... (${apiKey.length} chars)`,
    };
  }

  // Check 4: Try to authenticate (if all credentials present)
  if (diagnostics.checks.subscriptionKey?.status === 'OK' && 
      diagnostics.checks.apiUser?.status === 'OK' && 
      diagnostics.checks.apiKey?.status === 'OK') {
    
    try {
      const credentials = Buffer.from(`${apiUser}:${apiKey}`).toString('base64');
      const baseUrl = process.env.MTN_MOMO_ENVIRONMENT === 'production' 
        ? 'https://api.mtn.com' 
        : 'https://sandbox.momodeveloper.mtn.com';

      const response = await axios.post(
        `${baseUrl}/collection/v1_0/token/`,
        {},
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Ocp-Apim-Subscription-Key': subKey,
          },
          timeout: 10000,
        }
      );

      diagnostics.checks.authentication = {
        status: 'SUCCESS',
        message: 'Successfully obtained access token',
        tokenPreview: response.data.access_token.substring(0, 20) + '...',
      };
      diagnostics.recommendations.push('✅ All credentials are working! You can process payments.');
      
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        
        diagnostics.checks.authentication = {
          status: 'FAILED',
          httpStatus: status,
          error: error.response?.statusText,
          details: error.response?.data,
        };

        if (status === 401) {
          diagnostics.issues.push('Authentication failed: Invalid API User or API Key');
          diagnostics.recommendations.push('Your credentials are incorrectly paired. Run setup script to generate new ones.');
        } else if (status === 404) {
          diagnostics.issues.push('API User not found on MTN servers');
          diagnostics.recommendations.push('This API User was never created. Run: node scripts/setup-mtn-credentials.js');
        } else {
          diagnostics.issues.push(`Authentication error: ${status} ${error.response?.statusText}`);
        }
      } else {
        diagnostics.checks.authentication = {
          status: 'ERROR',
          message: error.message,
        };
        diagnostics.issues.push('Network or connection error');
        diagnostics.recommendations.push('Check your internet connection');
      }
    }
  } else {
    diagnostics.checks.authentication = {
      status: 'SKIPPED',
      reason: 'Cannot test authentication - missing or invalid credentials',
    };
  }

  // Check 5: Other environment variables
  diagnostics.checks.otherConfig = {
    environment: process.env.MTN_MOMO_ENVIRONMENT || 'not set (defaults to sandbox)',
    targetEnvironment: process.env.MTN_MOMO_TARGET_ENVIRONMENT || 'not set (defaults to sandbox)',
    callbackUrl: process.env.MTN_MOMO_CALLBACK_URL || 'not set',
  };

  // Overall status
  diagnostics.overallStatus = diagnostics.issues.length === 0 ? 'READY' : 'NEEDS_CONFIGURATION';

  return NextResponse.json(diagnostics, { 
    status: diagnostics.overallStatus === 'READY' ? 200 : 500,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}
