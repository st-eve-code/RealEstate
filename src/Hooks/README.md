# Custom Hooks

This directory contains reusable React hooks for the application.

## useAuthStateChange

A hook for listening to Firebase authentication state changes.

### Features

- Listen to all auth state changes
- Separate callbacks for sign in and sign out events
- Automatic cleanup on unmount
- Option to skip initial auth state check
- TypeScript support

### Usage Examples

#### Basic Usage - Listen to All Changes

```tsx
import { useAuthStateChange } from '@/Hooks/useAuthStateChange';

function MyComponent() {
  useAuthStateChange({
    onAuthStateChanged: (user) => {
      if (user) {
        console.log('User is signed in:', user.email);
      } else {
        console.log('User is signed out');
      }
    }
  });

  return <div>My Component</div>;
}
```

#### Handle Sign In Only

```tsx
import { useOnSignIn } from '@/Hooks/useAuthStateChange';
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  useOnSignIn((user) => {
    console.log('User signed in:', user.email);
    // Navigate to dashboard
    navigate('/dashboard');
    // Fetch user data, update UI, etc.
  });

  return <div>My Component</div>;
}
```

#### Handle Sign Out Only

```tsx
import { useOnSignOut } from '@/Hooks/useAuthStateChange';
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  useOnSignOut(() => {
    console.log('User signed out');
    // Clear cache, reset state, etc.
    localStorage.clear();
    navigate('/login');
  });

  return <div>My Component</div>;
}
```

#### Handle Both Sign In and Sign Out

```tsx
import { useAuthStateChange } from '@/Hooks/useAuthStateChange';
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  useAuthStateChange({
    onSignIn: (user) => {
      console.log('User signed in:', user.email);
      navigate('/dashboard');
      // Fetch user data
    },
    onSignOut: (previousUser) => {
      console.log('User signed out');
      // Clear cache
      localStorage.clear();
      navigate('/login');
    }
  });

  return <div>My Component</div>;
}
```

#### Skip Initial Check

Useful when you only want to react to future changes, not the initial auth state:

```tsx
import { useAuthStateChange } from '@/Hooks/useAuthStateChange';

function MyComponent() {
  useAuthStateChange({
    onSignIn: (user) => {
      console.log('User just signed in:', user.email);
    },
    skipInitialCheck: true // Won't trigger on mount if user is already signed in
  });

  return <div>My Component</div>;
}
```

### API Reference

#### `useAuthStateChange(options)`

**Parameters:**

- `options.onAuthStateChanged` (optional): Callback function called whenever auth state changes
  - Receives: `(user: FirebaseUser | null) => void | Promise<void>`
  
- `options.onSignIn` (optional): Callback function called when user signs in
  - Receives: `(user: FirebaseUser) => void | Promise<void>`
  
- `options.onSignOut` (optional): Callback function called when user signs out
  - Receives: `(previousUser: FirebaseUser | null) => void | Promise<void>`
  
- `options.skipInitialCheck` (optional): Skip the initial auth state check on mount
  - Type: `boolean`
  - Default: `false`

**Returns:**

- `currentUser`: Current Firebase user (snapshot at hook execution time)

#### `useOnSignIn(onSignIn)`

Simplified hook for sign in events only.

**Parameters:**

- `onSignIn`: Callback function called when user signs in
  - Receives: `(user: FirebaseUser) => void | Promise<void>`

#### `useOnSignOut(onSignOut)`

Simplified hook for sign out events only.

**Parameters:**

- `onSignOut`: Callback function called when user signs out
  - Receives: `() => void | Promise<void>`

### Notes

- The hook automatically cleans up the subscription when the component unmounts
- Callbacks can be async functions
- Errors in callbacks are caught and logged to console
- The hook detects sign in/out by comparing previous and current user state
- Use `skipInitialCheck: true` if you only want to react to future changes

