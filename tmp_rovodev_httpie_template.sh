#!/bin/bash
# Example HTTPie command structure for MTN MoMo

# This is what the command SHOULD look like:
echo "Expected HTTPie command structure:"
echo ""
echo "http POST https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay \\"
echo "  Authorization:'Bearer {access_token}' \\"
echo "  X-Reference-Id:{uuid} \\"
echo "  X-Target-Environment:sandbox \\"
echo "  Ocp-Apim-Subscription-Key:{subscription_key} \\"
echo "  Content-Type:application/json \\"
echo "  amount=100 \\"
echo "  currency=EUR \\"
echo "  externalId=test123 \\"
echo "  payer:='{\"partyIdType\":\"MSISDN\",\"partyId\":\"46733123454\"}' \\"
echo "  payerMessage='Test payment' \\"
echo "  payeeNote='Test note'"
echo ""
echo "Please share YOUR HTTPie command that gave the 'missing subscription key' error"
