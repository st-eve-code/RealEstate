# MTN MoMo API Header Requirements

According to MTN documentation, the requesttopay endpoint requires:

## Required Headers:
1. Authorization: Bearer {access_token}
2. X-Reference-Id: {uuid}
3. X-Target-Environment: sandbox (or mtnliberia, mtnivorycoast, etc.)
4. Ocp-Apim-Subscription-Key: {subscription_key}
5. Content-Type: application/json

## Common Issues:

### Issue 1: Header Case Sensitivity
Some APIs are case-sensitive. Try:
- ✅ Ocp-Apim-Subscription-Key
- ❌ ocp-apim-subscription-key

### Issue 2: Target Environment
The X-Target-Environment must match your subscription:
- sandbox (default)
- mtncameroon
- mtnivorycoast
- mtnghana
etc.

### Issue 3: Subscription Key Location
Some MTN products require the key in:
- Header: Ocp-Apim-Subscription-Key
- Query param: subscription-key={key}

### Issue 4: Wrong Subscription Key
You might have multiple subscriptions. Check:
https://momodeveloper.mtn.com/products
- Collections (for receiving payments)
- Disbursements (for sending money)
- Remittances (for transfers)

Each has its OWN subscription key!
