import { NextRequest, NextResponse } from 'next/server';
import { requestPayment, validateAccount, MTNPaymentRequest } from '@/lib/services/mtnMomoService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { phoneNumber, amount, currency, externalId, payerMessage, payeeNote } = body;

    // Validate required fields
    if (!phoneNumber || !amount || !externalId) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_FIELDS',
          message: 'Phone number, amount, and transaction ID are required',
        },
        { status: 400 }
      );
    }

    // Validate phone number format (9 digits for Cameroon)
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!/^[6-9]\d{8}$/.test(cleanPhone)) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_PHONE',
          message: 'Please enter a valid 9-digit phone number starting with 6, 7, 8, or 9',
        },
        { status: 400 }
      );
    }

    // Optional: Validate account before making payment request
    // const accountValidation = await validateAccount(cleanPhone);
    // if (!accountValidation.valid) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: 'INVALID_ACCOUNT',
    //       message: accountValidation.message,
    //     },
    //     { status: 400 }
    //   );
    // }

    // Prepare payment request
    // MTN Sandbox only supports EUR, so convert XAF to EUR if needed
    let finalAmount = amount.toString();
    let finalCurrency = currency || 'EUR';
    
    if (currency === 'XAF' || !currency) {
      // Convert XAF to EUR (1 EUR = 655.957 XAF)
      const amountInEUR = /* Math.ceil */(parseFloat(amount.toString()) / 655.957).toFixed(2);
      finalAmount = amountInEUR.toString();
      finalCurrency = 'EUR';
      console.log(`[Payment] Converting ${amount} XAF to ${finalAmount} EUR`);
    }
    
    const paymentRequest: MTNPaymentRequest = {
      amount: finalAmount,
      currency: finalCurrency,
      externalId: externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: cleanPhone,
      },
      payerMessage: payerMessage || 'Subscription payment',
      payeeNote: payeeNote || 'Thank you for your subscription',
    };

    // Request payment
    const result = await requestPayment(paymentRequest);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Payment request error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'An error occurred while processing your payment request',
      },
      { status: 500 }
    );
  }
}
