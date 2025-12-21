
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
// console.log(import.meta.env)
// Initialize Firebase
const instance = getApps();

const app = instance.length? instance[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let analytics = null;
/* try{
  analytics = getAnalytics(app);
}catch(e){} */


export { db, auth, app, firebaseConfig };

/* 
okay so given u read the @Messaging README.md , im sure u can create now the functionalities.

Another thing, when i set the conversation in popup mode and go to another directory,
it dissapears can u arrange that,
i mean make it be at top level in the app not just the Caretaker,
cause the functionality will be used by users and admins too

ANY UPLOAD FUNCTION SHOULD USE THE NEW UPLOAD SERVICE IN @/lib/services/mediaUploadService (JS implementation)
*/