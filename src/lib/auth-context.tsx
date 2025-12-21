"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { type User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"
import { doc, getDoc, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User } from "./types"
import { createUser, userExists } from "./internal-firebase"
import { getDeviceInfo } from "./utils/deviceInfo"

import Cookies from "js-cookie";
import { unde_find } from "./utils/filter"

interface AuthError {
  text: string
}

// const dbPermissionError:string[] = []; 

interface AuthContextType {
  authError?: AuthError | null
  user: User | null
  firebaseUser: FirebaseUser | null
  loadingUser: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loadingUser: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setError] = useState<AuthError|null|undefined>();
  const currentDeviceTokenRef = useRef<string | null>(null);
  const deviceTokenUnsubscribeRef = useRef<(() => void) | null>(null);

  const fetchUserData = async (uid: string) => {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData as User
    }
    return null
  }

  /**
   * Update device info when user signs in
   */
  const updateDeviceInfo = async (uid: string) => {
    try {
      const deviceInfo = getDeviceInfo();

      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        deviceInfo: unde_find(deviceInfo),
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Set local token reference AFTER Firestore update completes
      // This prevents false positives in the device token listener
      currentDeviceTokenRef.current = deviceInfo.currentDeviceToken;

      console.log('[Auth] Device info updated:', deviceInfo);
    } catch (error) {
      console.error('[Auth] Error updating device info:', error);
    }
  }

  /**
   * Internal sign out handler (used by device token listener)
   */
  const handleSignOut = async () => {
    // Cleanup device token listener
    if (deviceTokenUnsubscribeRef.current) {
      deviceTokenUnsubscribeRef.current();
      deviceTokenUnsubscribeRef.current = null;
    }
    currentDeviceTokenRef.current = null;
    
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  
  };

  /**
   * Setup snapshot listener for device token changes
   * This detects if the user signed in on another device
   */
  const setupDeviceTokenListener = (uid: string) => {
    // Cleanup previous listener
    if (deviceTokenUnsubscribeRef.current) {
      deviceTokenUnsubscribeRef.current();
      deviceTokenUnsubscribeRef.current = null;
    }

    const userRef = doc(db, "users", uid);
    
    const unsubscribe = onSnapshot(userRef, async (userDoc) => {
      if (!userDoc.exists()) return;

      const userData = userDoc.data() as User;
      const remoteDeviceToken = userData.deviceInfo?.currentDeviceToken;
      const localDeviceToken = currentDeviceTokenRef.current;

      // Skip initial load (when local token is null) or if tokens match
      if (!localDeviceToken || remoteDeviceToken === localDeviceToken) {
        return;
      }

      // Device token changed - user signed in on another device
      if (remoteDeviceToken && remoteDeviceToken !== localDeviceToken) {
        console.warn('[Auth] Device token mismatch detected. Signing out...');
        alert('Your account was signed in on another device. You are being signed out for security.');
        
        // Sign out the current user
        await handleSignOut();
      }
    }, (error) => {
      console.error('[Auth] Error in device token listener:', error);
    });

    deviceTokenUnsubscribeRef.current = unsubscribe;
  }


  const refreshUser = async () => {
    if (firebaseUser) {
      try {
        const existingUser = await userExists({uid: firebaseUser.uid});
        
        // Get device info
        const deviceInfo = unde_find(getDeviceInfo());
        
        if(!existingUser) {
          const name = firebaseUser.displayName || `user-${Math.floor(Math.random()*1000 + 1)}-${Date.now()}`;
          const userType = Cookies.get("userType") || "tenant";
  
          const user = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            fullName: name,
            displayName: name,
            role: userType === "tenant" ? { role: "user" } : { role: "landlord" },
            numberOfProperties: 0,
            createdAt: new Date(),
            lastLogin: new Date(),
            fA2: false,
            inAppNotification: [],
            emailSubscription: [],
            survey: [],
            deviceInfo: deviceInfo // Include device info
          }
          await createUser(user);
          // Set local token reference after creating user
          currentDeviceTokenRef.current = deviceInfo.currentDeviceToken;
        } else {
          // Update device info for existing user
          await updateDeviceInfo(firebaseUser.uid);
        }
  
        const userData = await fetchUserData(firebaseUser.uid)
        setUser(userData)
        
        // Ensure local token reference is set (fallback if not set above)
        if (userData?.deviceInfo?.currentDeviceToken && !currentDeviceTokenRef.current) {
          currentDeviceTokenRef.current = userData.deviceInfo.currentDeviceToken;
        }
        
        // Setup device token listener
        setupDeviceTokenListener(firebaseUser.uid);
      } catch (error) {
        console.error('refreshError', error)
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed", firebaseUser);
      setFirebaseUser(firebaseUser)
      
      if (firebaseUser) {
        try {
          const existingUser = await userExists({uid: firebaseUser.uid});
          
          // Get device info before creating/updating user
          const deviceInfo = unde_find(getDeviceInfo());
          
          if(!existingUser) {
            const name = firebaseUser.displayName || `user-${Math.floor(Math.random()*1000 + 1)}-${Date.now()}`;
            const userType = Cookies.get("userType") || "tenant";
  
            const user = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              fullName: name,
              displayName: name,
              role: userType === "tenant" ? { role: "user" } : { role: "landlord" },
              numberOfProperties: 0,
              createdAt: new Date(),
              lastLogin: new Date(),
              fA2: false,
              inAppNotification: [],
              emailSubscription: [],
              survey: [],
              deviceInfo: deviceInfo // Include device info when creating user
            }
            await createUser(user);
          } else {
            // Update device info for existing user
            await updateDeviceInfo(firebaseUser.uid);
          }
  
          const userData = await fetchUserData(firebaseUser.uid)
          setUser(userData)

          // Setup device token listener to detect multi-device sign-ins
          setupDeviceTokenListener(firebaseUser.uid);
        } catch (error) {
          console.error('loading user error', error)
        }
      } else {
        // Cleanup device token listener on sign out
        if (deviceTokenUnsubscribeRef.current) {
          deviceTokenUnsubscribeRef.current();
          deviceTokenUnsubscribeRef.current = null;
        }
        currentDeviceTokenRef.current = null;
        setUser(null)
      }

      setLoading(false)
    })

    return () => {
      unsubscribe();
      // Cleanup device token listener
      if (deviceTokenUnsubscribeRef.current) {
        deviceTokenUnsubscribeRef.current();
        deviceTokenUnsubscribeRef.current = null;
      }
    }
  }, [])

  console.log("AuthContext", { user, firebaseUser})

  const signOut = handleSignOut;

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loadingUser: loading, authError, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
