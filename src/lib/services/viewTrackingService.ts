import { doc, getDoc, setDoc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UnitView, LastViewedUnit, User, Transaction, Subscription, Unit } from '@/lib/types';
import { unde_find } from '../utils/filter';
import { toDate } from '../utils/timestampUtils';

/**
 * Track property view and update all related collections
 * 
 * This function:
 * 1. Increments property views count in units collection
 * 2. Creates/updates UnitView document
 * 3. Adds to user's lastViewedUnits if not already there
 * 4. Increments user.subscription.subscription.viewed count if not already viewed
 * 5. Updates user document with updated subscription
 * 
 * @param userData - Complete user object from auth context (no Firestore read needed!)
 * @param unitId - ID of the property being viewed
 * @param unitData - Property data already loaded in the component (no Firestore read needed!)
 */
export async function trackPropertyView(
  userData: User,
  /* unitId: string, */
  unitData: Unit // Property data from component
): Promise<{ success: boolean; message: string; alreadyViewed: boolean }> {
  try {
    const userId = userData.uid;
    const userName = userData.displayName || 'Unknown User';
    
    console.log('[View Tracking] Starting view tracking for:', { userId, unit:unitData, userName });

    // 1. Check if user has already viewed this unit in lastViewedUnits
    const lastViewedRef = doc(db, 'users', userId, 'lastViewedUnits', unitData.id);
    const lastViewedSnap = await getDoc(lastViewedRef);
    let alreadyViewed = lastViewedSnap.exists();

    console.log('[View Tracking] Already viewed?', alreadyViewed);

    // 2. Increment property views count in units collection
    const unitRef = doc(db, 'units', unitData.id);
    await updateDoc(unitRef, {
      views: increment(1)
    });
    console.log('[View Tracking] ✅ Incremented unit views');

    // 3. Create UnitView document as SUBCOLLECTION of the unit
    const unitViewId = `${userId}_${Date.now()}`;
    const unitViewRef = doc(db, 'units', unitData.id, 'unitViews', unitViewId);
    const unitViewData = {
      id: unitViewId,
      uid: userId,
      unit: unitData.id,
      createdAt: Timestamp.now()
    };
    await setDoc(unitViewRef, unitViewData);
    console.log('[View Tracking] ✅ Created UnitView document in units/{id}/unitViews subcollection');

    // 4. Add to lastViewedUnits with transactionId tracking
    const userTransaction = userData.transaction;
    const currentTransactionId = userTransaction?.id || null; // Firestore doesn't support undefined, use null

    if (!alreadyViewed) {
      const lastViewedUnit = unde_find({
        id: unitData.id,
        viewedBy: {
          id: userId,
          name: userName
        },
        name: unitData.name || 'Untitled Property',
        payment: {
          price: unitData.payment?.price || 0,
          period: unitData.payment?.period || 'monthly',
          currency: unitData.payment?.currency || 'XAF',
          tax: unitData.payment?.tax
        },
        location: {
          country: unitData.location?.country || 'Cameroon',
          city: unitData.location?.city || '',
          address: unitData.location?.address || ''
        },
        type: unitData.type || 'apartment',
        totalnumber: unitData.totalnumber || 1,
        createdAt: unitData.createdAt || Timestamp.now(),
        viewedAt: Timestamp.now(),
        transactionId: currentTransactionId // Track which subscription this view belongs to
      });

      await setDoc(lastViewedRef, lastViewedUnit);
      console.log('[View Tracking] ✅ Added to lastViewedUnits with transactionId:', currentTransactionId);
    } else {
      // Check if transactionId changed (new subscription period)
      const existingData = lastViewedSnap.data() as LastViewedUnit;
      const previousTransactionId = existingData.transactionId;
      const shouldCountAsNewView = previousTransactionId !== currentTransactionId;
      
      // Update viewedAt timestamp, property details, and transactionId
      await updateDoc(lastViewedRef, unde_find({
        name: unitData.name || 'Untitled Property',
        payment: {
          price: unitData.payment?.price || 0,
          period: unitData.payment?.period || 'monthly',
          currency: unitData.payment?.currency || 'XAF',
          tax: unitData.payment?.tax
        },
        type: unitData.type || 'apartment',
        totalnumber: unitData.totalnumber || 1,
        viewedAt: Timestamp.now(),
        transactionId: currentTransactionId
      }));
      
      console.log('[View Tracking] ✅ Updated lastViewedUnits');
      console.log('[View Tracking] Previous transactionId:', previousTransactionId);
      console.log('[View Tracking] Current transactionId:', currentTransactionId);
      console.log('[View Tracking] Should count as new view?', shouldCountAsNewView);
      
      // Update alreadyViewed flag if transactionId changed
      if (shouldCountAsNewView) {
        alreadyViewed = false;
        console.log('[View Tracking] 🔄 Different subscription period - counting as new view');
      }
    }

    // 5. Update user's subscription.subscription.viewed count (only if first time viewing)
    if (!alreadyViewed) {
      const userTransaction = userData.transaction;

      if (userTransaction && userTransaction.subscription) {
        // Check if subscription is still active
        const now = new Date();
        const expiresAt = toDate(userTransaction.expiresAt);

        if (expiresAt && expiresAt > now) {
          // Increment viewed count in the subscription object
          const updatedSubscription: Subscription = unde_find({
            ...userTransaction.subscription,
            viewed: (userTransaction.subscription.viewed || 0) + 1,
            updatedAt: Timestamp.now()
          });

          // Update the transaction with the new subscription data
          const updatedTransaction: Transaction = unde_find({
            ...userTransaction,
            subscription: updatedSubscription,
            updatedAt: Timestamp.now()
          });

          // Update user document with the modified transaction
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, {
            transaction: updatedTransaction
          });

          console.log('[View Tracking] ✅ Incremented user.transaction.subscription.viewed count');

          return {
            success: true,
            message: 'View tracked successfully',
            alreadyViewed: false
          };
        } else {
          console.log('[View Tracking] ⚠️ Subscription expired, not incrementing view count');
        }
      } else {
        console.log('[View Tracking] ⚠️ No active subscription found');
      }
    }

    return {
      success: true,
      message: alreadyViewed ? 'View tracked (already viewed)' : 'View tracked successfully',
      alreadyViewed
    };

  } catch (error) {
    console.error('[View Tracking] ❌ Error tracking view:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to track view',
      alreadyViewed: false
    };
  }
}

/**
 * Check if user has already viewed a property
 */
export async function hasUserViewedProperty(
  userId: string,
  unitId: string
): Promise<boolean> {
  try {
    const lastViewedRef = doc(db, 'users', userId, 'lastViewedUnits', unitId);
    const lastViewedSnap = await getDoc(lastViewedRef);
    return lastViewedSnap.exists();
  } catch (error) {
    console.error('[View Tracking] Error checking if user viewed property:', error);
    return false;
  }
}

/**
 * Get user's view count for current subscription
 */
export function getUserViewCount(userData: User): number {
  try {
    const transaction = userData.transaction;
    if (transaction && transaction.subscription) {
      return transaction.subscription.viewed || 0;
    }
    return 0;
  } catch (error) {
    console.error('[View Tracking] Error getting user view count:', error);
    return 0;
  }
}

/**
 * Check if user has reached view limit
 */
export function hasReachedViewLimit(userData: User): { reached: boolean; current: number; limit: number } {
  try {
    const transaction = userData.transaction;

    if (transaction && transaction.subscription && transaction.subscription.plan) {
      const subscription = transaction.subscription;
      const viewLimit = subscription.plan.constraints?.viewLimits;
      const currentViews = subscription.viewed || 0;

      if (viewLimit) {
        return {
          reached: currentViews >= viewLimit,
          current: currentViews,
          limit: viewLimit
        };
      }
    }

    // No limit or no subscription
    return {
      reached: false,
      current: 0,
      limit: Infinity
    };
  } catch (error) {
    console.error('[View Tracking] Error checking view limit:', error);
    return {
      reached: false,
      current: 0,
      limit: Infinity
    };
  }
}
