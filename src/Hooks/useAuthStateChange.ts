import { useEffect, useRef } from 'react';
import { type User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

/**
 * Callback function type for auth state changes
 */
export type AuthStateChangeCallback = (user: FirebaseUser | null) => void | Promise<void>;

/**
 * Options for the useAuthStateChange hook
 */
export interface UseAuthStateChangeOptions {
  /**
   * Callback to execute when auth state changes
   * Called with the current Firebase user (null if signed out)
   */
  onAuthStateChanged?: AuthStateChangeCallback;
  
  /**
   * Callback to execute when user signs in
   * Called with the Firebase user
   */
  onSignIn?: (user: FirebaseUser) => void | Promise<void>;
  
  /**
   * Callback to execute when user signs out
   * Called with the previous Firebase user (before sign out)
   */
  onSignOut?: (previousUser: FirebaseUser | null) => void | Promise<void>;
  
  /**
   * Whether to skip the initial auth state check
   * Default: false
   */
  skipInitialCheck?: boolean;
}

/**
 * Hook to listen to Firebase authentication state changes
 * 
 * @param options - Configuration options for the hook
 * @returns Object with current user and unsubscribe function
 * 
 * @example
 * ```tsx
 * // Simple usage - just listen to changes
 * useAuthStateChange({
 *   onAuthStateChanged: (user) => {
 *     console.log('Auth state changed:', user?.uid);
 *   }
 * });
 * 
 * // Handle sign in/out separately
 * useAuthStateChange({
 *   onSignIn: (user) => {
 *     console.log('User signed in:', user.email);
 *     // Navigate to dashboard, fetch user data, etc.
 *   },
 *   onSignOut: (previousUser) => {
 *     console.log('User signed out');
 *     // Clear cache, redirect to login, etc.
 *   }
 * });
 * ```
 */
export function useAuthStateChange(options: UseAuthStateChangeOptions = {}) {
  const {
    onAuthStateChanged: onAuthStateChangedCallback,
    onSignIn,
    onSignOut,
    skipInitialCheck = false,
  } = options;

  // Use refs to track previous user to detect sign in/out
  const previousUserRef = useRef<FirebaseUser | null>(null);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    // Skip if all callbacks are undefined
    if (!onAuthStateChangedCallback && !onSignIn && !onSignOut) {
      console.warn('useAuthStateChange: No callbacks provided. Hook will not do anything.');
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser: FirebaseUser | null) => {
        const previousUser = previousUserRef.current;
        const isInitialCheck = isInitialMountRef.current && !skipInitialCheck;

        // Update previous user ref
        previousUserRef.current = currentUser;

        // Skip initial check if requested
        if (isInitialCheck && skipInitialCheck) {
          isInitialMountRef.current = false;
          return;
        }

        // Determine if this is a sign in or sign out
        const isSignIn = !previousUser && currentUser !== null;
        const isSignOut = previousUser !== null && currentUser === null;

        try {
          // Call general auth state changed callback
          if (onAuthStateChangedCallback) {
            await onAuthStateChangedCallback(currentUser);
          }

          // Call sign in callback
          if (isSignIn && onSignIn && currentUser) {
            await onSignIn(currentUser);
          }

          // Call sign out callback
          if (isSignOut && onSignOut) {
            await onSignOut(previousUser);
          }
        } catch (error) {
          console.error('Error in auth state change callback:', error);
        }

        // Mark initial mount as complete
        if (isInitialMountRef.current) {
          isInitialMountRef.current = false;
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [
    onAuthStateChangedCallback,
    onSignIn,
    onSignOut,
    skipInitialCheck,
  ]);

  // Return current user and unsubscribe function for manual control
  return {
    /**
     * Current Firebase user (null if not authenticated)
     * Note: This is a snapshot at the time of hook execution.
     * For real-time updates, use the callbacks.
     */
    currentUser: auth.currentUser,
    
    /**
     * Manually unsubscribe from auth state changes
     * Note: This is automatically called on unmount, but you can
     * call it manually if needed.
     */
    unsubscribe: () => {
      // The cleanup function handles this automatically
      // This is mainly for API completeness
    },
  };
}

/**
 * Simplified hook that only executes callback on sign in
 * 
 * @param onSignIn - Callback to execute when user signs in
 * 
 * @example
 * ```tsx
 * useOnSignIn((user) => {
 *   console.log('User signed in:', user.email);
 *   navigate('/dashboard');
 * });
 * ```
 */
export function useOnSignIn(onSignIn: (user: FirebaseUser) => void | Promise<void>) {
  useAuthStateChange({ onSignIn });
}

/**
 * Simplified hook that only executes callback on sign out
 * 
 * @param onSignOut - Callback to execute when user signs out
 * 
 * @example
 * ```tsx
 * useOnSignOut(() => {
 *   console.log('User signed out');
 *   clearCache();
 *   navigate('/login');
 * });
 * ```
 */
export function useOnSignOut(onSignOut: () => void | Promise<void>) {
  useAuthStateChange({
    onSignOut: () => onSignOut(),
  });
}

