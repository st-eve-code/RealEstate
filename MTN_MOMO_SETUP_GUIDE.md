# MTN Mobile Money Integration Setup Guide

## 📋 Overview

This guide will help you set up MTN Mobile Money payments for your real estate platform.

---

## 🚀 Quick Start

### Step 1: Register for MTN MoMo Developer Account

1. Go to [MTN MoMo Developer Portal](https://momodeveloper.mtn.com/)
2. Click "Register" and create an account
3. Verify your email address
4. Complete your profile

### Step 2: Subscribe to Collections Product

1. Login to the developer portal
2. Navigate to "Products"
3. Subscribe to **"Collections"** product (for receiving payments)
4. Choose "Sandbox" for testing

### Step 3: Get Your Subscription Key

1. Go to your profile page
2. Find "Primary Key" under the Collections subscription
3. Copy this key - you'll need it for `MTN_MOMO_SUBSCRIPTION_KEY`

---

## 🔑 Generate API Credentials (Sandbox Only)

For sandbox testing, you need to create API User and API Key:

### Option 1: Using the Provided Script

1. Add your subscription key to `.env`:
   ```
   MTN_MOMO_SUBSCRIPTION_KEY=your_subscription_key_here
   ```

2. Run the setup script (create this file):
   ```javascript
   // scripts/setup-mtn-credentials.js
   import { createApiUser, createApiKey } from '../src/lib/services/mtnMomoService';

   async function setup() {
     try {
       // Create API User
       const userResult = await createApiUser();
       console.log('✅ API User created:', userResult.apiUser);
       console.log('Add to .env: MTN_MOMO_API_USER=' + userResult.apiUser);

       // Create API Key
       const keyResult = await createApiKey(userResult.apiUser);
       console.log('✅ API Key created:', keyResult.apiKey);
       console.log('Add to .env: MTN_MOMO_API_KEY=' + keyResult.apiKey);

     } catch (error) {
       console.error('❌ Setup failed:', error);
     }
   }

   setup();
   ```

3. Run: `node scripts/setup-mtn-credentials.js`

### Option 2: Using Postman/cURL

**Create API User:**
```bash
curl -X POST \
  https://sandbox.momodeveloper.mtn.com/v1_0/apiuser \
  -H 'Content-Type: application/json' \
  -H 'Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY' \
  -H 'X-Reference-Id: YOUR_GENERATED_UUID' \
  -d '{
    "providerCallbackHost": "your-domain.com"
  }'
```

**Create API Key:**
```bash
curl -X POST \
  https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/YOUR_API_USER_UUID/apikey \
  -H 'Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY'
```

---

## 🔧 Environment Configuration

### 1. Copy Example File
```bash
cp .env.example .env
```

### 2. Fill in MTN MoMo Credentials

```env
# MTN Mobile Money Configuration
MTN_MOMO_SUBSCRIPTION_KEY=your_subscription_key_from_profile
MTN_MOMO_API_USER=your_generated_api_user_uuid
MTN_MOMO_API_KEY=your_generated_api_key
MTN_MOMO_ENVIRONMENT=sandbox
MTN_MOMO_TARGET_ENVIRONMENT=sandbox
MTN_MOMO_CALLBACK_URL=https://yourdomain.com/api/payment/callback
```

### 3. For Production

When moving to production:
- Change `MTN_MOMO_ENVIRONMENT=production`
- Change `MTN_MOMO_TARGET_ENVIRONMENT` to your target country (e.g., `mtncameroon`)
- Get production credentials from MTN
- Update `MTN_MOMO_CALLBACK_URL` to your production domain

---

## 📱 Testing in Sandbox

### Test Phone Numbers

MTN provides test phone numbers for sandbox:
- **Success**: `46733123450` to `46733123459`
- **Pending**: `46733123460` to `46733123469`
- **Failed**: `46733123470` to `46733123479`

### Test Credentials

For sandbox, you can use any 9-digit number starting with 6, 7, 8, or 9 in the format: `6XXXXXXXX`

---

## 🔌 API Integration

### 1. Request Payment

**Endpoint**: `POST /api/payment/mtn/request`

**Request Body**:
```json
{
  "phoneNumber": "677123456",
  "amount": 5000,
  "currency": "XAF",
  "externalId": "txn_123456789",
  "payerMessage": "Subscription payment for Premium Plan",
  "payeeNote": "Thank you for subscribing"
}
```

**Success Response**:
```json
{
  "success": true,
  "referenceId": "uuid-reference-id",
  "status": "PENDING",
  "message": "Payment request sent. Please check your phone to approve the transaction."
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "INVALID_PHONE",
  "message": "Please enter a valid 9-digit phone number"
}
```

### 2. Check Payment Status

**Endpoint**: `GET /api/payment/mtn/status/{referenceId}`

**Response**:
```json
{
  "success": true,
  "referenceId": "uuid-reference-id",
  "status": "SUCCESSFUL",
  "message": "Payment completed successfully!"
}
```

**Possible Status Values**:
- `PENDING` - Payment request sent, waiting for user approval
- `SUCCESSFUL` - Payment completed
- `FAILED` - Payment failed or rejected

---

## 🔄 Payment Flow

1. **User selects plan and enters phone number**
2. **Frontend calls** `POST /api/payment/mtn/request`
3. **Backend requests payment from MTN API**
4. **MTN sends push notification to user's phone**
5. **User approves/rejects on their phone**
6. **Frontend polls** `GET /api/payment/mtn/status/{referenceId}` every 3-5 seconds
7. **Status updates from PENDING → SUCCESSFUL or FAILED**
8. **Frontend shows success/failure modal**

---

## 🛡️ Error Handling

The integration handles various error scenarios:

### Common Errors

| Error Code | Description | User Message |
|------------|-------------|--------------|
| `MISSING_FIELDS` | Required fields not provided | Please fill in all required fields |
| `INVALID_PHONE` | Phone number format invalid | Please enter a valid 9-digit phone number |
| `INVALID_ACCOUNT` | Number not registered for MoMo | This phone number is not registered for Mobile Money |
| `AUTHENTICATION_FAILED` | API credentials invalid | Payment system error. Please contact support |
| `NETWORK_ERROR` | No internet connection | Unable to connect. Check your internet connection |
| `INSUFFICIENT_FUNDS` | User has insufficient balance | Insufficient balance. Please top up and try again |
| `TIMEOUT` | User didn't approve in time | Payment request timed out. Please try again |
| `CANCELLED` | User rejected payment | Payment was cancelled |

---

## 🧪 Testing Checklist

### Sandbox Testing

- [ ] Request payment with test phone number
- [ ] Verify user receives notification in sandbox
- [ ] Test successful payment flow
- [ ] Test failed payment scenario
- [ ] Test pending/timeout scenario
- [ ] Check transaction status polling
- [ ] Verify Firestore transaction updates
- [ ] Test with different amounts
- [ ] Test error handling (invalid phone, etc.)

### Production Testing

- [ ] Test with real MTN phone number
- [ ] Verify actual money movement (small amount)
- [ ] Test callback URL receives notifications
- [ ] Monitor transaction logs
- [ ] Test with different countries (if multi-country)

---

## 📊 Monitoring & Logs

### What to Monitor

1. **Payment Success Rate**: Track successful vs failed payments
2. **Response Times**: Monitor API response times
3. **Error Rates**: Track types of errors
4. **Transaction Status**: Monitor PENDING transactions that don't resolve

### Logging

All payment requests and responses are logged to console. In production:
- Use proper logging service (e.g., Sentry, LogRocket)
- Log all payment attempts
- Track referenceId for each transaction
- Monitor callback reception

---

## 🔐 Security Best Practices

1. **Never expose API credentials in frontend**
   - Keep all API calls server-side
   - Use Next.js API routes

2. **Validate all inputs**
   - Phone number format
   - Amount ranges
   - Currency codes

3. **Implement rate limiting**
   - Prevent payment spam
   - Limit requests per user

4. **Verify callback authenticity**
   - Check callback source
   - Validate signature if provided

5. **Use HTTPS only**
   - Especially for callbacks
   - SSL certificate required

---

## 🆘 Troubleshooting

### "Authentication Failed"
- Check subscription key is correct
- Verify API User and API Key are valid
- Ensure environment is set to 'sandbox'

### "Payment Request Not Received"
- Verify phone number format (9 digits, starts with 6-9)
- Check if number is registered for Mobile Money
- Try with test phone numbers in sandbox

### "Transaction Status Always Pending"
- In sandbox, some numbers always return PENDING
- Try different test phone numbers
- Check if user approved on their phone

### "Callback Not Received"
- Ensure callback URL is publicly accessible
- Check if HTTPS is enabled
- Verify firewall/security settings

---

## 📚 Additional Resources

- [MTN MoMo API Documentation](https://momodeveloper.mtn.com/api-documentation/)
- [MTN Developer Portal](https://momodeveloper.mtn.com/)
- [Postman Collection](https://momodeveloper.mtn.com/products) - Available on developer portal
- [Support](https://momodeveloper.mtn.com/support) - Contact MTN support

---

## 🎯 Next Steps

After MTN MoMo is working:

1. ✅ Test thoroughly in sandbox
2. ✅ Request production credentials from MTN
3. ✅ Update environment variables
4. ✅ Test with small real transaction
5. ✅ Go live!
6. 🔄 Implement Orange Money (similar process)

---

## 📞 Support

If you need help:
- MTN Support: Check developer portal for contact
- Technical Issues: Review error logs
- Integration Questions: Check API documentation

---

**Ready to integrate Orange Money next? Let me know!** 🚀
