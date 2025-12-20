"use client"

import type React from "react"

import { createContext, use, useContext, useEffect, useState } from "react"
import { type User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User } from "./types"
import { createUser, userExists } from "./internal-firebase"

import Cookies from "js-cookie";

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

  const fetchUserData = async (uid: string) => {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData as User
    }
    return null
  }


  const refreshUser = async () => {
    if (firebaseUser) {
      try {
        const existingUser = await userExists({uid: firebaseUser.uid});
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
            survey: []
          }
          await createUser(user);
        }
  
        const userData = await fetchUserData(firebaseUser.uid)
        setUser(userData)
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
              survey: []
            }
            await createUser(user);
          }
  
          const userData = await fetchUserData(firebaseUser.uid)
          setUser(userData)
        } catch (error) {
          console.error('loading user error', error)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  console.log("AuthContext", { user, firebaseUser})

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
    setFirebaseUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loadingUser: loading, authError, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
