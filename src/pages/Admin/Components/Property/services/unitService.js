import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  Timestamp,
  query,
  where,
  orderBy,
  getDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Fetch all units with optional filtering
 */
export async function fetchUnits(filters = {}) {
  try {
    const unitsRef = collection(db, 'units');
    let q = unitsRef;

    // Apply status filter if provided
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    // Apply sorting
    if (filters.sortBy) {
      q = query(q, orderBy(filters.sortBy, filters.sortOrder || 'asc'));
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching units:', error);
    throw error;
  }
}

/**
 * Fetch a single unit by ID
 */
export async function fetchUnitById(unitId) {
  try {
    const unitRef = doc(db, 'units', unitId);
    const unitSnap = await getDoc(unitRef);
    
    if (unitSnap.exists()) {
      return { id: unitSnap.id, ...unitSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching unit:', error);
    throw error;
  }
}

/**
 * Approve a unit
 */
export async function approveUnit(unitId, adminId, adminName, reason = '') {
  try {
    const unitRef = doc(db, 'units', unitId);
    await updateDoc(unitRef, {
      status: 'approved',
      isVerified: true,
      updatedAt: Timestamp.now(),
    });

    // Create listing status record
    const listingStatusRef = collection(db, 'units', unitId, 'ListingStatus');
    await addDoc(listingStatusRef, {
      unitId,
      status: 'approved',
      reviewedBy: { id: adminId, name: adminName },
      reviewedReason: reason || 'Approved by admin',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error('Error approving unit:', error);
    throw error;
  }
}

/**
 * Reject a unit
 */
export async function rejectUnit(unitId, adminId, adminName, reason) {
  if (!reason) {
    throw new Error('Rejection reason is required');
  }

  try {
    const unitRef = doc(db, 'units', unitId);
    await updateDoc(unitRef, {
      status: 'rejected',
      isVerified: false,
      updatedAt: Timestamp.now(),
    });

    // Create listing status record
    const listingStatusRef = collection(db, 'units', unitId, 'ListingStatus');
    await addDoc(listingStatusRef, {
      unitId,
      status: 'rejected',
      reviewedBy: { id: adminId, name: adminName },
      reviewedReason: reason,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error('Error rejecting unit:', error);
    throw error;
  }
}

/**
 * Archive a unit
 */
export async function archiveUnit(unitId, adminId, adminName, reason = '') {
  try {
    const unitRef = doc(db, 'units', unitId);
    await updateDoc(unitRef, {
      status: 'archived',
      visible: false,
      updatedAt: Timestamp.now(),
    });

    // Create listing status record
    const listingStatusRef = collection(db, 'units', unitId, 'ListingStatus');
    await addDoc(listingStatusRef, {
      unitId,
      status: 'archived',
      reviewedBy: { id: adminId, name: adminName },
      reviewedReason: reason || 'Archived by admin',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error('Error archiving unit:', error);
    throw error;
  }
}

/**
 * Delete a unit
 */
export async function deleteUnit(unitId) {
  try {
    const unitRef = doc(db, 'units', unitId);
    await deleteDoc(unitRef);
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
}

/**
 * Add remark to a unit
 */
export async function addRemarkToUnit(unitId, remark) {
  try {
    const unitRef = doc(db, 'units', unitId);
    await updateDoc(unitRef, {
      remark: {
        type: remark.type || 'info',
        text: remark.text,
      },
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error('Error adding remark:', error);
    throw error;
  }
}

/**
 * Fetch reports for a unit
 */
export async function fetchUnitReports(unitId) {
  try {
    const reportsRef = collection(db, 'units', unitId, 'Reports');
    const q = query(reportsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
}

/**
 * Fetch reviews for a unit
 */
export async function fetchUnitReviews(unitId) {
  try {
    const reviewsRef = collection(db, 'units', unitId, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

/**
 * Fetch listing status history for a unit
 */
export async function fetchUnitListingStatus(unitId) {
  try {
    const statusRef = collection(db, 'units', unitId, 'ListingStatus');
    const q = query(statusRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching listing status:', error);
    throw error;
  }
}

