"use client"

import { doc, getDoc, query, collection, getDocs, orderBy, startAfter, limit, DocumentData, QueryDocumentSnapshot, OrderByDirection,
  where, setDoc, updateDoc, deleteDoc, Query
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { HandlerParams, HandlerResult, FirestoreResult, FirestoreSingleResult, FirestoreListResult, FirestoreConstraint } from "./types"
// import { Query } from "@tanstack/react-query"

export const userExists = async ({uid, email}: {uid?: string, email?:string}) => {
    if(!uid && !email) throw "invalid search param";
    try {
        if(uid) {
            // const userRef = doc(db, "users", uid);
            // console.log("Checking if user exists", userRef, userRef.path);
            // if user not found
            
            const userDoc = await getDoc(doc(db, "users", uid));
            return userDoc.exists()?true:false
        }
        if(email){
            // confirm user by email
            // const { collection, query, where, getDocs } = await import("firebase/firestore");
            const q = query(collection(db, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        }
    } catch (error) {
        console.error("Error checking if user exists", error);
        throw error;
    }
}


export const createUser = (user: any) => {
    return setDoc(doc(db, "users", user.uid), user);
}

export default async function handler<T = DocumentData>({ 
  pageSize = 10, 
  lastVisibleDocData, // We now pass back the raw data points of the last doc
  regex, 
  table = "users",
  sortConfig // New dynamic sort parameter
}: HandlerParams): Promise<HandlerResult<T>> {

  try {
    let q = collection(db, table) as any; // Cast for dynamic query building

    // --- 1. Build the OrderBy clauses ---
    sortConfig.forEach(sort => {
      q = query(q, orderBy(sort.field, sort.direction));
    });
    
    // Crucial: Add __name__ (document ID) as the final sort order for unique cursors
    q = query(q, orderBy("__name__", sortConfig[0]?.direction || 'asc'));


    // --- 2. Build the StartAfter cursor (if provided) ---
    if (lastVisibleDocData) {
      // We need to provide the exact values that match our orderBy clauses
      const cursorValues = sortConfig.map(sort => lastVisibleDocData[sort.field]);
      
      // Add the last document ID to the cursor values
      cursorValues.push(lastVisibleDocData.id); 

      q = query(q, startAfter(...cursorValues));
    }
    
    // --- 3. Add the Limit ---
    q = query(q, limit(Number(pageSize)));


    // --- 4. Execute the query and filter ---
    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    const pattern = regex ? new RegExp(regex, "i") : null;
    const filtered = pattern
      ? docs.filter(doc => pattern.test((doc.data() as any).name || (doc.data() as any).fullName))
      : docs;

    // Prepare next page cursor data (send back the necessary data points)
    const lastDoc = docs.length > 0 ? docs[docs.length - 1] : null;
    // The cursor object for the next fetch
    const nextCursorData = lastDoc ? { ...lastDoc.data() as any, id: lastDoc.id } : null;

    return {
      results: filtered.map(doc => ({ id: doc.id, ...(doc.data() as any) } as T)),
      // We return the object needed to reconstruct the *next* startAfter call
      nextCursor: nextCursorData, 
    };
  } catch (error: any) {
    console.error("Firestore handler error:", error);
    return {
      results: [],
      nextCursor: null,
      error: error?.message || 'An unknown error occurred'
    };
  }
}

export function applyConstraintsToCollection(q: Query<DocumentData>, constraints: FirestoreConstraint[]): Query<DocumentData> {
  constraints.forEach(c => {
      q = query(q, where(c.field, c.operator, c.value));
  });
  return q;
}


/**
 * i) Selects a single document from a collection using its unique document ID.
 * @param collectionPath The name of the Firestore collection (e.g., 'users', 'units').
 * @param docId The unique ID of the document to retrieve.
 */
export async function selectDocumentById<T extends DocumentData>(
  collectionPath: string,
  docId: string
): Promise<FirestoreSingleResult<T>> {
  try {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Add the ID to the data object for consistency
      const data = { ...docSnap.data() } as T;
      return { data, success: true };
    } else {
      return { data: null, success: false, message: 'No such document exists.' };
    }
  } catch (error) {
    console.error(`Error selecting document ${docId} in ${collectionPath}:`, error);
    return { data: null, success: false, message: 'Failed to retrieve document by ID.', error };
  }
}


/**
 * i) Updates a document in a specific collection using its unique document ID.
 * @param collectionPath The name of the Firestore collection (e.g., 'users', 'units').
 * @param docId The unique ID of the document to update.
 * @param data The partial data object to merge into the existing document.
 */
export async function updateDocumentById(
  collectionPath: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<FirestoreResult> {
  try {
    const docRef = doc(db, collectionPath, docId);
    // console.log('step1 done = ', docRef, "=", ...arguments)
    // updateDoc merges the new data with existing data
    await updateDoc(docRef, data);
    return { success: true, message: `Document ${docId} successfully updated.` };
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionPath}:`, error);
    return { success: false, message: 'Failed to update document by ID.', error };
  }
}


/**
 * i) Deletes a single document from a specific collection using its unique document ID.
 * @param collectionPath The name of the Firestore collection (e.g., 'users', 'units').
 * @param docId The unique ID of the document to delete.
 */
export async function deleteDocumentById(
  collectionPath: string,
  docId: string
): Promise<FirestoreResult> {
  try {
    const docRef = doc(db, collectionPath, docId);
    await deleteDoc(docRef);
    return { success: true, message: `Document ${docId} successfully deleted.` };
  } catch (error) {
    console.error(`Error deleting document ${docId} in ${collectionPath}:`, error);
    return { success: false, message: 'Failed to delete document by ID.', error };
  }
}