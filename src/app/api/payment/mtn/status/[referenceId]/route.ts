import { NextRequest, NextResponse } from 'next/server';
import { getTransactionStatus } from '@/lib/services/mtnMomoService';

export async function GET(
  request: NextRequest,
  { params }: { params: { referenceId: string } }
) {
  try {
    const { referenceId } = params;

    if (!referenceId) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_REFERENCE_ID',
          message: 'Transaction reference ID is required',
        },
        { status: 400 }
      );
    }

    const result = await getTransactionStatus(referenceId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'An error occurred while checking transaction status',
      },
      { status: 500 }
    );
  }
}
