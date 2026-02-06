// utils/firestoreCollectionGroupUtils.ts (Revised for multiple constraints)
import { 
    collectionGroup, query, where, getDocs, writeBatch, 
    DocumentData, Query
} from 'firebase/firestore';
import { FirestoreResult, FirestoreListResult2, FirestoreConstraint } from '../types'; // Import the new interface
import { db } from '../firebase';
  
  
  /**
   * Helper function to apply all constraints to a query dynamically.
   */
  function applyConstraints(q: Query<DocumentData>, constraints: FirestoreConstraint[]): Query<DocumentData> {
      constraints.forEach(c => {
          q = query(q, where(c.field, c.operator, c.value));
      });
      return q;
  }
  
  
  /**
   * SELECT: Query all collections globally that match the dynamic 'collectionName' (X) and multiple constraints.
   * @param collectionName The name of the subcollection (e.g., 'tenants', 'reviews').
   * @param constraints An array of FirestoreConstraint objects.
   */
  export async function selectDocsInGroup<T extends DocumentData>(
    collectionName: string,
    constraints: FirestoreConstraint[] = [] // Array of constraints
  ): Promise<FirestoreListResult2<T>> {
    try {
      const groupRef = collectionGroup(db, collectionName);
      let q: Query<DocumentData> = query(groupRef);
  
      q = applyConstraints(q, constraints); // Apply all constraints
  
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(docSnap => ({ 
          id: docSnap.id, 
          refPath: docSnap.ref.path, 
          ...docSnap.data() as T 
      }));
  
      return { data, success: true, message: `Retrieved ${data.length} documents from group ${collectionName}.` };
  
    } catch (error) {
      console.error(`Error selecting documents from group ${collectionName}:`, error);
      return { data: [], success: false, message: 'Failed to retrieve documents.', error };
    }
  }
  
  /**
   * UPDATE: Update all documents globally that match the dynamic 'collectionName' (X) and multiple constraints.
   */
  export async function updateDocsInGroup(
    collectionName: string,
    constraints: FirestoreConstraint[], // Array of constraints
    updateData: Partial<DocumentData>
  ): Promise<FirestoreResult> {
    try {
      const groupRef = collectionGroup(db, collectionName);
      let q: Query<DocumentData> = query(groupRef);
  
      q = applyConstraints(q, constraints); // Apply all constraints
  
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return { success: true, message: 'No matching documents found to update.' };
      }
  
      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnap) => {
        batch.update(docSnap.ref, updateData);
      });
  
      await batch.commit();
      return { success: true, message: `Successfully updated ${snapshot.size} documents in group ${collectionName}.` };
  
    } catch (error) {
      // ... error handling ...
      return {
        success: false,
        message: "Error Updating data",
        error: error,
      }
    }
  }
  
  /**
   * DELETE: Delete all documents globally that match the dynamic 'collectionName' (X) and multiple constraints.
   */
  export async function deleteDocsInGroup(
    collectionName: string,
    constraints: FirestoreConstraint[] // Array of constraints
  ): Promise<FirestoreResult> {
    try {
      const groupRef = collectionGroup(db, collectionName);
      let q: Query<DocumentData> = query(groupRef);
  
      q = applyConstraints(q, constraints); // Apply all constraints
  
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return { success: true, message: 'No matching documents found to delete.' };
      }
  
      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
  
      await batch.commit();
      return { success: true, message: `Successfully deleted ${snapshot.size} documents in group ${collectionName}.` };
  
    } catch (error) {
      // ... error handling ...
      return {
        success: false,
        error,
      }
    }
  }
  