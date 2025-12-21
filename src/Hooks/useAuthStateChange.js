import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

/**
 * Hook to listen to Firebase authentication state changes
 * 
 * @param {Object} options - Configuration options
 * @param {Function} options.onAuthStateChanged - Callback when auth state changes (receives user or null)
 * @param {Function} options.onSignIn - Callback when user signs in (receives user)
 * @param {Function} options.onSignOut - Callback when user signs out (receives previous user)
 * @param {boolean} options.skipInitialCheck - Skip the initial auth state check
 * 
 * @returns {Object} Object with current user
 * 
 * @example
 * // Simple usage - listen to all changes
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
 *     navigate('/dashboard');
 *   },
 *   onSignOut: () => {
 *     console.log('User signed out');
 *     navigate('/login');
 *   }
 * });
 */
export function useAuthStateChange(options = {}) {
  const {
    onAuthStateChanged: onAuthStateChangedCallback,
    onSignIn,
    onSignOut,
    skipInitialCheck = false,
  } = options;

  // Use refs to track previous user to detect sign in/out
  const previousUserRef = useRef(null);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    // Skip if all callbacks are undefined
    if (!onAuthStateChangedCallback && !onSignIn && !onSignOut) {
      console.warn('useAuthStateChange: No callbacks provided. Hook will not do anything.');
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
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

  // Return current user for convenience
  return {
    currentUser: auth.currentUser,
  };
}

/**
 * Simplified hook that only executes callback on sign in
 * 
 * @param {Function} onSignIn - Callback to execute when user signs in
 * 
 * @example
 * useOnSignIn((user) => {
 *   console.log('User signed in:', user.email);
 *   navigate('/dashboard');
 * });
 */
export function useOnSignIn(onSignIn) {
  useAuthStateChange({ onSignIn });
}

/**
 * Simplified hook that only executes callback on sign out
 * 
 * @param {Function} onSignOut - Callback to execute when user signs out
 * 
 * @example
 * useOnSignOut(() => {
 *   console.log('User signed out');
 *   clearCache();
 *   navigate('/login');
 * });
 */
export function useOnSignOut(onSignOut) {
  useAuthStateChange({
    onSignOut: () => onSignOut(),
  });
}

