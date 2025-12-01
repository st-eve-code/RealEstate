import { db } from "@/lib/firebase";
import { DocumentData, Firestore, QueryDocumentSnapshot, WhereFilterOp, addDoc, collection, getDocs, query, setDoc, doc, where, Query, writeBatch } from "firebase/firestore";
import { FirestoreConstraint, FirestoreListResult, FirestoreResult } from "../types";
import { applyConstraintsToCollection } from "../internal-firebase";

interface FirestoreInsertResult {
    success: boolean;
    message?: string;
    error?: unknown;
    newDocId?: string; 
}



/**
 * Inserts a new document into a collection with an auto-generated ID, 
 * and saves that generated ID as the 'id' field within the document data.
 * @param collectionPath The name of the Firestore collection.
 * @param data The initial data object for the new document.
 */
export async function setDocumentWithInternalId<T extends DocumentData>(
    collectionPath: string,
    data: Omit<T, 'id'> // Ensure the incoming data doesn't already have an 'id'
  ): Promise<FirestoreInsertResult> {
    try {
      const collRef = collection(db, collectionPath);
      
      const docRef = await addDoc(collRef, data);
      const finalDocId = docRef.id;
      await setDoc(docRef, { ...data, id: finalDocId } as unknown as T);
      
      return { 
          success: true, 
          message: `Document successfully added with ID: ${finalDocId} (and internal id set).`,
          newDocId: finalDocId
      };
  
    } catch (error) {
      console.error(`Error adding document to ${collectionPath}:`, error);
      return { success: false, message: 'Failed to add document.', error };
    }
}


/**
 * Inserts or overwrites a document using a specific custom ID,
 * and saves that custom ID as the 'id' field within the document data.
 * @param collectionPath The name of the Firestore collection.
 * @param docId The specific ID to use for the new document (e.g., a user's UID).
 * @param data The initial data object for the new document.
 */
export async function setDocumentWithId<T extends DocumentData>(
    collectionPath: string,
    docId: string,
    data: T // Ensure the incoming data doesn't already have an 'id'
  ): Promise<FirestoreInsertResult> {
    try {
      const docRef = doc(db, collectionPath, docId);
      await setDoc(docRef, data);
  
      return { 
          success: true, 
          message: `Document successfully set with ID: ${docId} (and internal id set).`,
          newDocId: docId
      };
    } catch (error) {
      console.error(`Error setting document ${docId} in ${collectionPath}:`, error);
      return { success: false, message: 'Failed to set document with specific ID.', error };
    }
  }


/**
 * SELECT: Selects multiple documents from a collection based on multiple constraints.
 * @param collectionPath The name of the Firestore collection (can be a subcollection path).
 * @param constraints An array of FirestoreConstraint objects.
 */
export async function selectDocumentsByConstraint<T extends DocumentData>(
  collectionPath: string,
  constraints: FirestoreConstraint[] = []
): Promise<FirestoreListResult<T>> {
  try {
    const collRef = collection(db, collectionPath);
    let q: Query<DocumentData> = query(collRef);

    q = applyConstraintsToCollection(q, constraints); // Apply all constraints

    const snapshot = await getDocs(q);

    const data: (T & { id: string })[] = snapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => {
        return { id: docSnap.id, ...docSnap.data() as T };
    });

    return { data, success: true, message: `Successfully retrieved ${data.length} documents.` };

  } catch (error) {
    console.error(`Error selecting documents by constraint in ${collectionPath}:`, error);
    return { data: [], success: false, message: 'Failed to retrieve documents by constraint.', error };
  }
}




  /**
 * UPDATE: Updates multiple documents in a collection based on multiple constraints.
 * Uses a batch write.
 */
export async function updateDocumentsByConstraint(
    collectionPath: string,
    constraints: FirestoreConstraint[],
    updateData: Partial<DocumentData>
  ): Promise<FirestoreResult> {
    try {
      const collRef = collection(db, collectionPath);
      let q: Query<DocumentData> = query(collRef);
  
      q = applyConstraintsToCollection(q, constraints); // Apply all constraints
  
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return { success: true, message: 'No matching documents found to update.' };
      }
  
      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnap) => {
        batch.update(docSnap.ref, updateData);
      });
  
      await batch.commit();
      return { success: true, message: `Successfully updated ${snapshot.size} documents in ${collectionPath}.` };
  
    } catch (error) {
      console.error(`Error updating documents by constraint in ${collectionPath}:`, error);
      return { success: false, message: 'Failed to update documents by constraint.', error };
    }
}
  




/**
 * DELETE: Deletes multiple documents in a collection based on multiple constraints.
 * Uses a batch delete.
 */
export async function deleteDocumentsByConstraint(
    collectionPath: string,
    constraints: FirestoreConstraint[]
  ): Promise<FirestoreResult> {
    try {
      const collRef = collection(db, collectionPath);
      let q: Query<DocumentData> = query(collRef);
      
      q = applyConstraintsToCollection(q, constraints); // Apply all constraints
  
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return { success: true, message: 'No matching documents found to delete.' };
      }
  
      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
  
      await batch.commit();
      return { success: true, message: `Successfully deleted ${snapshot.size} documents in ${collectionPath}.` };
  
    } catch (error) {
      console.error(`Error deleting documents by constraint in ${collectionPath}:`, error);
      return { success: false, message: 'Failed to delete documents by constraint.', error };
    }
}


export async function deleteField(
  collectionPath: string,
  field: string
) {
    
}