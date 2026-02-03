import { NextResponse } from 'next/server';
import { validateConfiguration, getConfigurationSummary } from '@/lib/services/mtnMomoUtils';

/**
 * Admin endpoint to check MTN MoMo configuration
 * GET /api/admin/mtn/check-config
 */
export async function GET() {
  try {
    const summary = getConfigurationSummary();
    const validation = await validateConfiguration();

    return NextResponse.json({
      success: true,
      summary,
      validation,
    });
  } catch (error) {
    console.error('Config check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check configuration',
      },
      { status: 500 }
    );
  }
}
