/**
 * Referrer Data Recovery Script
 * 
 * Use this script to restore lost referrer information in your user document.
 * Run this in your browser console on a page where Firebase is initialized.
 * 
 * IMPORTANT: You need to know:
 * 1. The UID of the person who referred you
 * 2. Their name
 * 3. Their referral code
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Make sure you're logged in to your app
 * 3. Copy and paste this entire script
 * 4. Call: restoreReferrerData('REFERRER_UID', 'Referrer Name', 'REFERRAL_CODE')
 */

async function restoreReferrerData(referrerUid, referrerName, referralCode) {
  if (!referrerUid || !referrerName || !referralCode) {
    console.error('❌ Please provide all required information: referrerUid, referrerName, referralCode');
    return;
  }

  // Check if Firebase is available
  if (typeof firebase === 'undefined' && typeof window.firebase === 'undefined') {
    console.error('❌ Firebase is not initialized. Make sure you run this on a page with Firebase loaded.');
    return;
  }

  const db = firebase.firestore();
  const user = firebase.auth().currentUser;
  
  if (!user) {
    console.error('❌ No user is currently logged in.');
    return;
  }

  const userId = user.uid;

  console.log('🔄 Restoring referrer data...');
  console.log('   Your UID:', userId);
  console.log('   Referrer UID:', referrerUid);
  console.log('   Referrer Name:', referrerName);
  console.log('   Referral Code:', referralCode);

  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error('❌ User document not found');
      return;
    }

    const userData = userDoc.data();
    
    // Prepare update data
    const updateData = {
      referredBy: referrerUid,
      referredByName: referrerName,
      referredByCode: referralCode,
    };

    // If referralData exists, also update it
    if (userData.referralData) {
      updateData.referralData = {
        ...userData.referralData,
        referredBy: referrerUid,
        referredByName: referrerName,
        referredByCode: referralCode,
        updatedAt: firebase.firestore.Timestamp.now()
      };
    }

    // Update the document
    await userRef.update(updateData);

    console.log('✅ Successfully restored referrer data!');
    console.log('📊 Updated fields:');
    console.log('   - referredBy:', referrerUid);
    console.log('   - referredByName:', referrerName);
    console.log('   - referredByCode:', referralCode);
    if (userData.referralData) {
      console.log('   - referralData (also updated)');
    }
    console.log('\n💡 Refresh the referrals page to see the changes!');

    // Also add to referrer's referrals subcollection if not already there
    try {
      const referrerSubcollectionRef = db.collection('users').doc(referrerUid).collection('referrals').doc(userId);
      const referrerSubDoc = await referrerSubcollectionRef.get();

      if (!referrerSubDoc.exists) {
        console.log('🔄 Adding you to referrer\'s referrals list...');
        await referrerSubcollectionRef.set({
          displayName: userData.displayName || 'User',
          email: userData.email || '',
          hasSubscription: userData.subscription?.status === 'active' || false,
          joinedAt: userData.createdAt || firebase.firestore.Timestamp.now(),
          subscriptionDate: userData.subscription?.startDate || null
        });
        console.log('✅ Added to referrer\'s referrals list');

        // Update referrer's referral count
        const referrerRef = db.collection('users').doc(referrerUid);
        const referrerDoc = await referrerRef.get();
        if (referrerDoc.exists) {
          const referrerData = referrerDoc.data();
          if (referrerData.referralData) {
            await referrerRef.update({
              'referralData.referralCount': firebase.firestore.FieldValue.increment(1),
              'referralData.updatedAt': firebase.firestore.Timestamp.now()
            });
            console.log('✅ Updated referrer\'s referral count');
          }
        }
      } else {
        console.log('ℹ️ Already in referrer\'s referrals list');
      }
    } catch (subErr) {
      console.warn('⚠️ Could not update referrer\'s subcollection (may not have permission):', subErr.message);
    }

  } catch (error) {
    console.error('❌ Error restoring referrer data:', error);
    console.log('Make sure your Firestore rules allow you to update your own user document.');
  }
}

// Helper function to find referrer by code
async function findReferrerByCode(referralCode) {
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase is not initialized');
    return;
  }

  const db = firebase.firestore();
  
  console.log('🔍 Searching for referrer with code:', referralCode);

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef
      .where('referralData.referralCode', '==', referralCode)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log('❌ No user found with that referral code');
      return null;
    }

    const referrerDoc = snapshot.docs[0];
    const referrerData = referrerDoc.data();

    console.log('✅ Found referrer:');
    console.log('   UID:', referrerDoc.id);
    console.log('   Name:', referrerData.displayName);
    console.log('   Code:', referralCode);
    console.log('\nTo restore your referrer data, run:');
    console.log(`restoreReferrerData("${referrerDoc.id}", "${referrerData.displayName}", "${referralCode}")`);

    return {
      uid: referrerDoc.id,
      name: referrerData.displayName,
      code: referralCode
    };
  } catch (error) {
    console.error('❌ Error searching for referrer:', error);
    return null;
  }
}

// Instructions
console.log('='.repeat(60));
console.log('🔧 Referrer Data Recovery Tool');
console.log('='.repeat(60));
console.log('\nIf you know the referral code:');
console.log('  findReferrerByCode("REFERRAL_CODE")');
console.log('\nTo restore referrer data:');
console.log('  restoreReferrerData("REFERRER_UID", "Name", "CODE")');
console.log('\nExample:');
console.log('  restoreReferrerData("abc123xyz", "John Doe", "JOHN123ABC")');
console.log('='.repeat(60));
