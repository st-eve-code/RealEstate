# 💳 Payment Integration Setup Guide

Complete guide to set up MTN Mobile Money and Orange Money payment integrations for your Real Estate platform.

---

## 📋 Table of Contents

1. [MTN Mobile Money Setup](#mtn-mobile-money-setup)
2. [Orange Money Setup](#orange-money-setup)
3. [Environment Variables](#environment-variables)
4. [Testing](#testing)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

---

## 🟡 MTN Mobile Money Setup

### Step 1: Create MTN MoMo Developer Account

1. **Visit the Developer Portal**
   - Go to: [https://momodeveloper.mtn.com/](https://momodeveloper.mtn.com/)
   - Click **"Sign Up"** button in the top right

2. **Register Your Account**
   - Fill in your details:
     - First Name
     - Last Name
     - Email Address
     - Password (strong password required)
     - Country (select your country)
   - Check "I agree to Terms & Conditions"
   - Click **"Register"**

3. **Verify Your Email**
   - Check your email inbox
   - Click the verification link sent by MTN
   - Your account is now active!

4. **Complete Your Profile**
   - Login to the portal
   - Go to **Profile** → **Edit Profile**
   - Add your phone number and company details (optional for sandbox)

---

### Step 2: Subscribe to Collections Product

1. **Navigate to Products**
   - After logging in, click **"Products"** in the menu
   - You'll see available products list

2. **Subscribe to Collections**
   - Find **"Collections"** product (this is for receiving payments)
   - Click **"Subscribe"**
   - Choose **"Sandbox"** environment for testing
   - Click **"Subscribe"** to confirm

3. **Get Your Subscription Key**
   - After subscribing, you'll see the product in **"My Subscriptions"**
   - Click on **"Collections"**
   - You'll see:
     - **Primary Key** ← This is your `MTN_MOMO_SUBSCRIPTION_KEY`
     - **Secondary Key** (backup)
   - Copy the Primary Key and save it securely

   ```
   Example: 1234567890abcdef1234567890abcdef
   ```

---

### Step 3: Generate API User and API Key (Sandbox Only)

For sandbox testing, you need to create API credentials. There are two methods:

#### Method A: Using Postman (Recommended for Beginners)

1. **Download Postman**
   - Visit: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
   - Install and open Postman

2. **Import MTN Collection**
   - MTN provides a Postman collection
   - Go to: [https://momodeveloper.mtn.com/api-documentation/](https://momodeveloper.mtn.com/api-documentation/)
   - Download the Postman collection
   - In Postman, click **Import** and select the downloaded file

3. **Create API User**
   - In Postman, find the request: **POST Create API User**
   - In Headers, add:
     ```
     Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
     X-Reference-Id: [Generate a UUID - use https://www.uuidgenerator.net/]
     ```
   - In Body, add:
     ```json
     {
       "providerCallbackHost": "your-domain.com"
     }
     ```
   - Click **Send**
   - If you get `201 Created`, success! Save the X-Reference-Id (this is your API User)

4. **Create API Key**
   - Find the request: **POST Create API Key**
   - In Headers:
     ```
     Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
     ```
   - In the URL, replace `{apiUser}` with your API User from step 3
   - Click **Send**
   - Copy the `apiKey` from the response

   ```json
   {
     "apiKey": "abcd1234efgh5678ijkl"
   }
   ```

#### Method B: Using cURL (Advanced)

1. **Generate a UUID**
   - Visit: [https://www.uuidgenerator.net/](https://www.uuidgenerator.net/)
   - Generate and copy a UUID (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

2. **Create API User**
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

   - If successful, you'll get HTTP 201
   - Your API User = The UUID you used in X-Reference-Id

3. **Create API Key**
   ```bash
   curl -X POST \
     https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/YOUR_API_USER/apikey \
     -H 'Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY'
   ```

   - Response will contain:
   ```json
   {
     "apiKey": "your-generated-api-key"
   }
   ```

---

### Step 4: Add MTN Credentials to .env

1. **Copy .env.example to .env**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env file and add your credentials:**
   ```env
   # MTN Mobile Money Configuration
   MTN_MOMO_SUBSCRIPTION_KEY=your_primary_subscription_key_from_step_2
   MTN_MOMO_API_USER=your_api_user_uuid_from_step_3
   MTN_MOMO_API_KEY=your_api_key_from_step_3
   MTN_MOMO_ENVIRONMENT=sandbox
   MTN_MOMO_TARGET_ENVIRONMENT=sandbox
   MTN_MOMO_CALLBACK_URL=http://localhost:3000/api/payment/callback
   ```

3. **Example with real values:**
   ```env
   MTN_MOMO_SUBSCRIPTION_KEY=1234567890abcdef1234567890abcdef
   MTN_MOMO_API_USER=a1b2c3d4-e5f6-7890-abcd-ef1234567890
   MTN_MOMO_API_KEY=abcd1234efgh5678ijkl
   MTN_MOMO_ENVIRONMENT=sandbox
   MTN_MOMO_TARGET_ENVIRONMENT=sandbox
   MTN_MOMO_CALLBACK_URL=http://localhost:3000/api/payment/callback
   ```

---

### Step 5: Test MTN Integration

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Navigate to subscription page**
   - Go to: `http://localhost:3000/dashboard/subscription`
   - Select a plan
   - Click "Continue to Payment"

3. **Use Test Phone Numbers**
   MTN provides these test numbers for sandbox:
   
   **For Success:**
   - `46733123450` to `46733123459`
   
   **For Pending (will timeout):**
   - `46733123460` to `46733123469`
   
   **For Failure:**
   - `46733123470` to `46733123479`

4. **Complete Test Payment**
   - Select "MTN Mobile Money"
   - Enter one of the test numbers (e.g., `46733123450`)
   - Fill in other details
   - Click "Submit Order" → "Confirm & Pay"
   - Wait for status to change to SUCCESSFUL

---

## 🟠 Orange Money Setup

### Step 1: Create Orange Developer Account

1. **Visit Orange Developer Portal**
   - Go to: [https://developer.orange.com/](https://developer.orange.com/)
   - Click **"Register"** or **"Sign Up"**

2. **Register Your Account**
   - Fill in your details:
     - Email
     - Password
     - Company name (optional)
     - Country
   - Accept Terms of Service
   - Click **"Create Account"**

3. **Verify Your Email**
   - Check your email
   - Click verification link
   - Login to the portal

---

### Step 2: Create an Application

1. **Go to "My Apps"**
   - After login, click **"My Apps"**
   - Click **"Add a new app"**

2. **Fill Application Details**
   - Application Name: "Real Estate Platform"
   - Description: "Payment integration for property subscriptions"
   - Redirect URL: `https://yourdomain.com/api/payment/callback`
   - Click **"Create"**

3. **Subscribe to Orange Money API**
   - In your app dashboard, find **"APIs"**
   - Search for **"Orange Money"** or **"Web Payment"**
   - Click **"Subscribe"**
   - Choose **"Sandbox"** environment

---

### Step 3: Get API Credentials

1. **View Your App Details**
   - Click on your app name
   - You'll see:
     - **Client ID** ← This is `ORANGE_MONEY_CLIENT_ID`
     - **Client Secret** ← This is `ORANGE_MONEY_CLIENT_SECRET`
   - Copy both values

2. **Get Merchant Key** (if required)
   - Some implementations require a merchant key
   - This is usually provided in the API documentation
   - Or contact Orange support to get it

---

### Step 4: Add Orange Credentials to .env

Edit your `.env` file:

```env
# Orange Money Configuration
ORANGE_MONEY_CLIENT_ID=your_client_id_from_app
ORANGE_MONEY_CLIENT_SECRET=your_client_secret_from_app
ORANGE_MONEY_MERCHANT_KEY=your_merchant_key_if_provided
ORANGE_MONEY_ENVIRONMENT=sandbox
```

Example:
```env
ORANGE_MONEY_CLIENT_ID=abcd1234efgh5678
ORANGE_MONEY_CLIENT_SECRET=secret9876wxyz5432
ORANGE_MONEY_MERCHANT_KEY=merchant_key_12345
ORANGE_MONEY_ENVIRONMENT=sandbox
```

---

### Step 5: Test Orange Money (Coming Soon)

Orange Money integration is similar to MTN but with different API endpoints. The integration will be added next!

---

## 🔐 Environment Variables

### Complete .env File

Here's what your complete `.env` file should look like:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# MTN Mobile Money API Configuration
MTN_MOMO_SUBSCRIPTION_KEY=1234567890abcdef1234567890abcdef
MTN_MOMO_API_USER=a1b2c3d4-e5f6-7890-abcd-ef1234567890
MTN_MOMO_API_KEY=abcd1234efgh5678ijkl
MTN_MOMO_ENVIRONMENT=sandbox
MTN_MOMO_TARGET_ENVIRONMENT=sandbox
MTN_MOMO_CALLBACK_URL=http://localhost:3000/api/payment/callback

# Orange Money API Configuration
ORANGE_MONEY_CLIENT_ID=your_orange_client_id
ORANGE_MONEY_CLIENT_SECRET=your_orange_client_secret
ORANGE_MONEY_MERCHANT_KEY=your_orange_merchant_key
ORANGE_MONEY_ENVIRONMENT=sandbox

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🧪 Testing

### MTN Mobile Money Test Cases

1. **Successful Payment**
   ```
   Phone: 46733123450
   Amount: Any amount
   Expected: Payment succeeds
   ```

2. **Failed Payment**
   ```
   Phone: 46733123470
   Amount: Any amount
   Expected: Payment fails
   ```

3. **Pending Payment (Timeout)**
   ```
   Phone: 46733123460
   Amount: Any amount
   Expected: Status remains PENDING, eventually times out
   ```

### Testing Checklist

- [ ] MTN payment request sent successfully
- [ ] User receives notification (in sandbox, simulated)
- [ ] Payment status polling works
- [ ] Success modal displays correctly
- [ ] Failure modal displays correctly
- [ ] Transaction saved to Firestore
- [ ] Error handling works (invalid phone, network error, etc.)

---

## 🚀 Production Deployment

### MTN Mobile Money Production

1. **Request Production Access**
   - Login to MTN Developer Portal
   - Go to your Collections subscription
   - Click **"Request Production Access"**
   - Fill in the form with:
     - Business details
     - Expected transaction volume
     - Use case description
   - Submit and wait for approval (1-2 weeks)

2. **Get Production Credentials**
   - Once approved, you'll get production credentials
   - Production doesn't use API User/Key like sandbox
   - You'll get different authentication mechanism

3. **Update Environment Variables**
   ```env
   MTN_MOMO_ENVIRONMENT=production
   MTN_MOMO_TARGET_ENVIRONMENT=mtncameroon  # or your target country
   MTN_MOMO_CALLBACK_URL=https://yourdomain.com/api/payment/callback
   ```

4. **Test with Real Money**
   - Start with small amounts (100 FCFA)
   - Test with your own phone number
   - Verify money is deducted and received
   - Check transaction logs

### Orange Money Production

1. **Request Production Access**
   - Contact Orange support
   - Provide business details
   - Sign merchant agreement
   - Get production credentials

2. **Update Environment Variables**
   ```env
   ORANGE_MONEY_ENVIRONMENT=production
   ```

---

## 🆘 Troubleshooting

### MTN Issues

#### "Subscription Key is Invalid"
- **Problem**: Wrong subscription key
- **Solution**: 
  - Check you copied the entire key from the portal
  - Make sure you're using the Primary Key, not Secondary
  - Key should be 32 characters (hexadecimal)

#### "401 Unauthorized"
- **Problem**: API User or API Key is wrong
- **Solution**:
  - Verify API User is a valid UUID format
  - Check API Key was generated for that specific API User
  - Try regenerating API Key

#### "404 Not Found"
- **Problem**: Wrong endpoint or environment
- **Solution**:
  - Check `MTN_MOMO_ENVIRONMENT` is set to `sandbox`
  - Check `MTN_MOMO_TARGET_ENVIRONMENT` is set to `sandbox`
  - Verify API URLs in the service file

#### "Payment Request Not Sent"
- **Problem**: Network or configuration issue
- **Solution**:
  - Check internet connection
  - Verify all environment variables are set
  - Check server logs for error details
  - Test with Postman first

#### "Phone Number Not Valid"
- **Problem**: Wrong format or not registered
- **Solution**:
  - Use 9-digit format: `6XXXXXXXX` or `7XXXXXXXX`
  - Try MTN test numbers for sandbox
  - For production, number must be registered for Mobile Money

### Orange Money Issues

#### "Client ID/Secret Invalid"
- **Problem**: Wrong credentials
- **Solution**:
  - Re-check credentials from Orange portal
  - Make sure you're using the right app
  - Try regenerating credentials

#### "API Not Found"
- **Problem**: Not subscribed to Orange Money API
- **Solution**:
  - Go to your app in Orange portal
  - Check subscriptions
  - Subscribe to Orange Money/Web Payment API

---

## 📞 Support Contacts

### MTN MoMo Support
- **Developer Portal**: [https://momodeveloper.mtn.com/support](https://momodeveloper.mtn.com/support)
- **Email**: Check developer portal for contact
- **Documentation**: [https://momodeveloper.mtn.com/api-documentation/](https://momodeveloper.mtn.com/api-documentation/)

### Orange Money Support
- **Developer Portal**: [https://developer.orange.com/](https://developer.orange.com/)
- **Support**: Available through developer portal
- **Documentation**: Check portal for API docs

---

## ✅ Setup Verification

Use this checklist to verify your setup:

### MTN Mobile Money
- [ ] Created MTN developer account
- [ ] Subscribed to Collections product
- [ ] Got Subscription Key
- [ ] Generated API User (UUID)
- [ ] Generated API Key
- [ ] Added all credentials to .env
- [ ] Tested with sandbox phone numbers
- [ ] Payment requests work
- [ ] Status polling works
- [ ] Success/failure handling works

### Orange Money
- [ ] Created Orange developer account
- [ ] Created application
- [ ] Subscribed to Orange Money API
- [ ] Got Client ID and Secret
- [ ] Added credentials to .env
- [ ] Ready for integration (coming soon)

---

## 🎯 Quick Start Summary

**For MTN (5 minutes setup):**
1. Register at momodeveloper.mtn.com
2. Subscribe to Collections → Get Subscription Key
3. Use Postman to create API User & Key
4. Add 3 values to .env
5. Test with `46733123450`

**For Orange (Coming Soon):**
1. Register at developer.orange.com
2. Create app → Get Client ID & Secret
3. Add to .env
4. Test with Orange sandbox

---

## 📚 Additional Resources

- [MTN MoMo API Documentation](https://momodeveloper.mtn.com/api-documentation/)
- [MTN Developer Community](https://momodeveloper.mtn.com/community)
- [Orange Developer Portal](https://developer.orange.com/)
- [UUID Generator](https://www.uuidgenerator.net/)
- [Postman Download](https://www.postman.com/downloads/)

---

**Need help? Check the troubleshooting section or review the detailed setup guide!**

Good luck with your payment integration! 🚀💳
