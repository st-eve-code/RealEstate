import { updateDocumentById } from "../internal-firebase";
import { FirestoreResult, PaymentCard, PaymentMOMO, Plan, Subscription, Transaction, User } from "../types";
import Cookies from "js-cookie";
import { setDocumentWithInternalId, selectDocumentsByConstraint } from "../utils/firestoreDocumentOperation";
import { Timestamp } from "firebase/firestore";

const cookiesName = {
    'momo': "momoDetails",
    'card': "cardDetails"
}


export default async function CompleteSubscription({selectedPlan, paymentMethod, user}: {selectedPlan: Omit<Plan, "state">, paymentMethod: PaymentCard|PaymentMOMO, user: User}) {
    if(!['momo', 'card'].includes(paymentMethod.paymentType)) throw "Invalid Payment Type";
    let amount = selectedPlan.price + (selectedPlan.tax || 0) * selectedPlan.price;

    const transaction: Transaction = {
        id: "1",
        uid: user.uid,
        userName: user.fullName || user.displayName,
        subscription: {plan:selectedPlan, createdAt: Timestamp.now(), amount, expiresAt: Timestamp.fromMillis(Date.now()+selectedPlan.constraints.duration)},
        type: 'subscription',
        payment: paymentMethod,
        paid: amount,
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromMillis(Date.now() + selectedPlan.constraints.duration)
    }
    
    CookiePaymentDetail({paymentDetail: paymentMethod})
    console.log('Auth user:', user)
    setDocumentWithInternalId(`users/${user.uid}/Transactions`, transaction);
    return updateDocumentById('users', user.uid, {subscription: transaction})
}


export async function getTransactions({userId}: {userId: string}) {
    const { data, success, error } = await selectDocumentsByConstraint<Transaction>(
        `users/${userId}/Transactions`,
        [
            {
                field: "uid",
                operator: "==",
                value: userId
            }
        ]
    );
    if (!success) throw error || 'Could not fetch subscription transactions';

    return data;
}

export async function getSubscriptions({userId}: {userId: string}) {
    const { data, success, error } = await selectDocumentsByConstraint<Transaction>(
        `users/${userId}/Transactions`,
        [
            {
                field: "uid",
                operator: "==",
                value: userId
            },
            {
                field: "type",
                operator: "==",
                value: 'subscription'
            }
        ]
    );
    if (!success) throw error || 'Could not fetch subscription transactions';

    const subscriptions = data.filter(t => t.subscription.plan.type === 'subscription');
    return subscriptions;
}


export async function getPaymentMethods({userId, filter}: {userId: string, filter?: 'momo'|'card'}) {
    const { data, success, error } = await selectDocumentsByConstraint<PaymentCard|PaymentMOMO>(
        `users/${userId}/PaymentDetails`,
    );
    if (!success) throw error || 'Could not fetch subscription transactions';
    return filter?data.filter(d=>d.paymentType==filter):data;
}

export async function SavePaymentMethod({paymentDetail, userId}: {paymentDetail: any, userId: string}) {
    if(!['momo', 'card'].includes(paymentDetail.paymentType)) throw "Invalid Payment Type";
    const result = await setDocumentWithInternalId(`users/${userId}/PaymentDetails`, paymentDetail);
    if( !result.success || result.error) throw (result.error||'An error occured');
    CookiePaymentDetail({paymentDetail, newDocId: result.newDocId})

}

export function CookiePaymentDetail({paymentDetail, newDocId}: {paymentDetail:any, newDocId?: string}) {
    const cookieName = cookiesName[paymentDetail.paymentType as ('momo'|'card')];
    const paymentMethods:any[] = JSON.parse(Cookies.get(cookieName)|| '[]');
    // if payment already in skip (if momo and number the same else if card and card number the same, update other card data)
    // Check if payment method already exists (momo: same phoneNumber, card: same cardNumber)
    let foundIndex = -1;
    if (paymentDetail.paymentType === "momo") {
        foundIndex = paymentMethods.findIndex(
            p => p.paymentType === "momo" && p.phoneNumber === paymentDetail.phoneNumber
        );
    } else if (paymentDetail.paymentType === "card") {
        foundIndex = paymentMethods.findIndex(
            p => p.paymentType === "card" && p.cardNumber === paymentDetail.cardNumber
        );
    }

    if (foundIndex !== -1) {
        // Update the existing payment method (merge details, preserve id if present)
        paymentMethods[foundIndex] = {
            ...paymentMethods[foundIndex],
            ...paymentDetail,
            id: paymentMethods[foundIndex].id || (newDocId || `payment-${foundIndex}`)
        };
        Cookies.set(cookieName, JSON.stringify(paymentMethods), {
            expires: 30,
            secure: true,
            sameSite: "Lax"
        });
        return; // skip pushing duplicate
    }

    paymentMethods.push({ ...paymentDetail, id: newDocId || paymentDetail.id || `payment-${paymentMethods.length}` });
    Cookies.set(cookieName, JSON.stringify(paymentMethods), {
        expires: 30,
        secure: true,
        sameSite: "Lax"
    })
}