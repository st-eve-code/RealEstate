/**
 * Sample Last Viewed Units Data Generator
 * 
 * This script helps you add sample viewed units to Firestore for testing the My Store page.
 * Run this in your browser console on a page where Firebase is initialized.
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Make sure you're logged in to your app
 * 3. Copy and paste this entire script
 * 4. Call: addSampleViewedUnits('YOUR_USER_ID')
 *    OR: addSampleViewedUnits(firebase.auth().currentUser?.uid)
 */

async function addSampleViewedUnits(userId) {
  if (!userId) {
    console.error('❌ Please provide a userId');
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

  const sampleUnits = [
    {
      id: 'unit_001',
      viewedBy: {
        id: userId,
        name: user.displayName || 'Test User'
      },
      name: 'Chariot Hotel Luxury Suite',
      payment: {
        price: 500000,
        period: 'monthly',
        currency: 'XAF',
        tax: 0.1
      },
      location: {
        country: 'Cameroon',
        city: 'Malingo',
        address: '123 Main Street, Malingo District'
      },
      type: 'apartment',
      totalnumber: 5,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date('2025-01-01')),
      viewedAt: firebase.firestore.Timestamp.fromDate(new Date('2025-01-25'))
    },
    {
      id: 'unit_002',
      viewedBy: {
        id: userId,
        name: user.displayName || 'Test User'
      },
      name: 'Italio Hostel - Student Accommodation',
      payment: {
        price: 450000,
        period: 'yearly',
        currency: 'XAF',
        tax: 0.05
      },
      location: {
        country: 'Cameroon',
        city: 'South',
        address: '456 University Road, South District'
      },
      type: 'hostel',
      totalnumber: 20,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date('2024-12-15')),
      viewedAt: firebase.firestore.Timestamp.fromDate(new Date('2025-01-26'))
    },
    {
      id: 'unit_003',
      viewedBy: {
        id: userId,
        name: user.displayName || 'Test User'
      },
      name: 'Evan Studio - Modern Living',
      payment: {
        price: 800000,
        period: 'monthly',
        currency: 'XAF',
        tax: 0.15
      },
      location: {
        country: 'Cameroon',
        city: 'Checkpoint',
        address: '789 Studio Avenue, Checkpoint'
      },
      type: 'studio',
      totalnumber: 1,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date('2025-01-10')),
      viewedAt: firebase.firestore.Timestamp.fromDate(new Date('2025-01-28'))
    },
    {
      id: 'unit_004',
      viewedBy: {
        id: userId,
        name: user.displayName || 'Test User'
      },
      name: 'Akansas Hostel Complex',
      payment: {
        price: 320000,
        period: 'monthly',
        currency: 'XAF'
      },
      location: {
        country: 'Cameroon',
        city: 'South',
        address: '321 Hostel Lane, South District'
      },
      type: 'hostel',
      totalnumber: 15,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date('2024-11-20')),
      viewedAt: firebase.firestore.Timestamp.fromDate(new Date('2025-01-29'))
    },
    {
      id: 'unit_005',
      viewedBy: {
        id: userId,
        name: user.displayName || 'Test User'
      },
      name: 'Paradise Studio Apartments',
      payment: {
        price: 650000,
        period: 'monthly',
        currency: 'XAF',
        tax: 0.1
      },
      location: {
        country: 'Cameroon',
        city: 'Douala',
        address: '555 Paradise Road, Bonanjo'
      },
      type: 'studio',
      totalnumber: 3,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date('2025-01-05')),
      viewedAt: firebase.firestore.Timestamp.now()
    }
  ];

  console.log('📝 Adding sample viewed units...');
  
  try {
    const batch = db.batch();
    
    sampleUnits.forEach((unit) => {
      const docRef = db.collection('users').doc(userId).collection('LastViewedUnits').doc(unit.id);
      batch.set(docRef, unit);
    });
    
    await batch.commit();
    
    console.log('✅ Successfully added', sampleUnits.length, 'sample viewed units!');
    console.log('🔍 Unit details:');
    sampleUnits.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.name} - ${u.payment.price.toLocaleString()} ${u.payment.currency} (${u.type})`);
    });
    console.log('\n💡 Navigate to /dashboard/store to see your viewed properties!');
    
  } catch (error) {
    console.error('❌ Error adding viewed units:', error);
    console.log('Make sure your Firestore rules allow writes to the LastViewedUnits subcollection.');
  }
}

// Helper function to clear all viewed units
async function clearViewedUnits(userId) {
  if (!userId) {
    console.error('❌ Please provide a userId');
    return;
  }

  const db = firebase.firestore();
  
  console.log('🗑️ Clearing all viewed units...');
  
  try {
    const snapshot = await db.collection('users').doc(userId).collection('LastViewedUnits').get();
    
    if (snapshot.empty) {
      console.log('ℹ️ No viewed units to clear');
      return;
    }
    
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`✅ Successfully cleared ${snapshot.size} viewed units!`);
    
  } catch (error) {
    console.error('❌ Error clearing viewed units:', error);
  }
}

// Instructions
console.log('='.repeat(60));
console.log('🏠 Sample Last Viewed Units Generator');
console.log('='.repeat(60));
console.log('\nTo add sample viewed units, run:');
console.log('  addSampleViewedUnits("YOUR_USER_ID")');
console.log('\nTo get your current user ID, run:');
console.log('  firebase.auth().currentUser?.uid');
console.log('\nQuick command:');
console.log('  addSampleViewedUnits(firebase.auth().currentUser?.uid)');
console.log('\nTo clear all viewed units:');
console.log('  clearViewedUnits(firebase.auth().currentUser?.uid)');
console.log('='.repeat(60));
