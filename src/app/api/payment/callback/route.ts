import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Payment Callback Handler
 * MTN MoMo will call this endpoint when payment status changes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Payment callback received:', body);

    // Extract payment details from callback
    const { referenceId, status, externalId, financialTransactionId } = body;

    if (!referenceId || !status) {
      return NextResponse.json(
        { success: false, message: 'Invalid callback data' },
        { status: 400 }
      );
    }

    // Update transaction in Firestore
    if (externalId) {
      try {
        const transactionRef = doc(db, 'transactions', externalId);
        
        await updateDoc(transactionRef, {
          status: status.toLowerCase(),
          mtnReferenceId: referenceId,
          mtnFinancialTransactionId: financialTransactionId,
          updatedAt: Timestamp.now(),
          callbackReceivedAt: Timestamp.now(),
        });

        console.log(`Transaction ${externalId} updated with status: ${status}`);
      } catch (error) {
        console.error('Error updating transaction:', error);
      }
    }

    // Return success response to MTN
    return NextResponse.json(
      { success: true, message: 'Callback processed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing callback' },
      { status: 500 }
    );
  }
}
