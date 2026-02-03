import { doc, getDoc, setDoc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UnitView, LastViewedUnit, User, Transaction, Subscription } from '@/lib/types';
import { unde_find } from '../utils/filter';

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
 * @param userData - Complete user object from auth context (avoids redundant Firestore read)
 * @param unitId - ID of the property being viewed
 */
export async function trackPropertyView(
  userData: User,
  unitId: string
): Promise<{ success: boolean; message: string; alreadyViewed: boolean }> {
  try {
    const userId = userData.uid;
    const userName = userData.displayName || 'Unknown User';
    
    console.log('[View Tracking] Starting view tracking for:', { userId, unitId, userName });

    // 1. Check if user has already viewed this unit in lastViewedUnits
    const lastViewedRef = doc(db, 'users', userId, 'lastViewedUnits', unitId);
    const lastViewedSnap = await getDoc(lastViewedRef);
    const alreadyViewed = lastViewedSnap.exists();

    console.log('[View Tracking] Already viewed?', alreadyViewed);

    // 2. Increment property views count in units collection
    const unitRef = doc(db, 'units', unitId);
    const unitSnap = await getDoc(unitRef);
    
    if (!unitSnap.exists()) {
      console.error('[View Tracking] Unit not found:', unitId);
      return { success: false, message: 'Property not found', alreadyViewed: false };
    }

    const unitData = unitSnap.data();
    await updateDoc(unitRef, {
      views: increment(1)
    });
    console.log('[View Tracking] ✅ Incremented unit views');

    // 3. Create/Update UnitView document
    const unitViewId = `${userId}_${unitId}_${Date.now()}`;
    const unitViewRef = doc(db, 'unitViews', unitViewId);
    const unitViewData: UnitView = {
      id: unitViewId,
      uid: userId,
      unit: unitId,
      createdAt: Timestamp.now()
    };
    await setDoc(unitViewRef, unitViewData);
    console.log('[View Tracking] ✅ Created UnitView document');

    // 4. Add to lastViewedUnits if not already there
    if (!alreadyViewed) {
      const lastViewedUnit: LastViewedUnit = unde_find({
        id: unitId,
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
        viewedAt: Timestamp.now()
      });

      await setDoc(lastViewedRef, lastViewedUnit);
      console.log('[View Tracking] ✅ Added to lastViewedUnits');
    } else {
      // Update viewedAt timestamp
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
        viewedAt: Timestamp.now()
      }));
      console.log('[View Tracking] ✅ Updated viewedAt in lastViewedUnits');
    }

    // 5. Update user's subscription.subscription.viewed count (only if first time viewing)
    if (!alreadyViewed) {
      const userTransaction = userData.transaction;

      if (userTransaction && userTransaction.subscription) {
        // Check if subscription is still active
        const now = new Date();
        const expiresAt = userTransaction.expiresAt?.toDate();

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
            subscription: updatedTransaction
          });

          console.log('[View Tracking] ✅ Incremented user.subscription.subscription.viewed count');

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
