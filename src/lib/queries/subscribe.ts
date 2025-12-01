import { updateDocumentById } from "../internal-firebase";
import { FirestoreResult, PaymentCard, PaymentMOMO, Subscription, Transaction, User } from "../types";
import Cookies from "js-cookie";
import { setDocumentWithInternalId, selectDocumentsByConstraint } from "../utils/firestoreDocumentOperation";

const cookiesName = {
    'momo': "momoDetails",
    'card': "cardDetails"
}


export default async function CompleteSubscription({selectedPlan, paymentMethod, user}: {selectedPlan: Omit<Subscription, "state">, paymentMethod: any, user: User}) {
    if(!['momo', 'card'].includes(paymentMethod.paymentType)) throw "Invalid Payment Type";
    let now = new Date();

    const transaction = {
        id: "1",
        uid: user.uid,
        subscription: selectedPlan,
        payment: paymentMethod,
        paid: selectedPlan.amount + (selectedPlan.tax || 0) * selectedPlan.amount,
        createdAt: now,
        expiresAt: new Date(now.getTime() + selectedPlan.constraints.duration)
    }
    
    CookiePaymentDetail({paymentDetail: paymentMethod})
    console.log('Auth user:', user)
    setDocumentWithInternalId(`users/${user.uid}/Transactions`, transaction);
    return updateDocumentById('users', user.uid, {subscription: transaction})
}


export async function getTransactions({userId}: {userId: string}) {
    const { data, success, error } = await selectDocumentsByConstraint<Transaction>(
        `users/${userId}/Transactions`,
    );
    if (!success) throw error || 'Could not fetch subscription transactions';

    return data;
}

export async function getSubscriptions({userId}: {userId: string}) {
    const { data, success, error } = await selectDocumentsByConstraint<Transaction>(
        `users/${userId}/Transactions`,
    );
    if (!success) throw error || 'Could not fetch subscription transactions';

    const subscriptions = data.filter(t => t.subscription.type === 'subscription');
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