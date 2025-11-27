"use client"

import { doc, getDoc, query, collection, getDocs, where, setDoc, orderBy, startAfter, limit, DocumentData } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { HandlerParams, HandlerResult, User } from "./types"

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


export const createUser = (user: Omit<User, 'id'>) => {
    return setDoc(doc(db, "users", user.uid), user);
}

export default async function handler<T = DocumentData>({ 
  pageSize = 10, 
  lastCreatedAt, 
  regex, 
  table = "users" 
}: HandlerParams): Promise<HandlerResult<T>> {

  try {
    // Build Firestore query
    let q = query(collection(db, table), orderBy("createdAt"), limit(Number(pageSize)));

    if (lastCreatedAt) {
      q = query(collection(db, table), orderBy("createdAt"), startAfter(lastCreatedAt), limit(Number(pageSize)));
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    // Apply regex filtering (on the current page's data)
    const pattern = regex ? new RegExp(regex, "i") : null;
    const filtered = pattern
      ? docs.filter(doc => pattern.test(doc.data().name || doc.data().fullName)) // Check potential 'name' fields
      : docs;

    // Prepare next page cursor (using the last doc of the raw fetch, not filtered)
    const lastVisible = docs.length > 0 ? docs[docs.length - 1].data().createdAt?.toDate() : null;

    return {
      results: filtered.map(doc => ({ id: doc.id, ...doc.data() } as T)),
      nextCursor: lastVisible,
    };
  } catch (error: any) {
    console.error("Firestore handler error:", error);
    return { error: error?.message || 'An unknown error occurred' };
  }
}

export async function handler2({ pageSize = 10, lastCreatedAt, regex, table = "users" }:{
  pageSize?: number,
  lastCreatedAt: any,
  regex:string,
  table: string,
  
}) {
  // const { pageSize = 10, lastCreatedAt, regex } = req;

  try {
    // Build Firestore query
    let q = query(collection(db, table), orderBy("createdAt"), limit(Number(pageSize)));

    if (lastCreatedAt) {
      const lastDate = new Date(lastCreatedAt);
      q = query(collection(db, table), orderBy("createdAt"), startAfter(lastDate), limit(Number(pageSize)));
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    // Apply regex filtering
    const pattern = regex ? new RegExp(regex, "i") : null;
    const filtered = pattern
      ? docs.filter(doc => pattern.test(doc.data().name))
      : docs;

    // Prepare next page cursor
    const lastVisible = docs.length > 0 ? docs[docs.length - 1].data().createdAt.toDate() : null;

    return {
      results: filtered.map(doc => ({ id: doc.id, ...doc.data() })),
      nextCursor: lastVisible,
    };
  } catch (error: any) {
    return { error: error?.message||'' };
  }
}