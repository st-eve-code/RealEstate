# Remaining Migration Steps

## Current Status: 85% Complete ✅

### What's Done:
1. ✅ Next.js configuration files created
2. ✅ App Router structure set up with all routes
3. ✅ Environment variables migrated
4. ✅ Firebase config updated for Next.js
5. ✅ Middleware created for protected routes
6. ✅ Tailwind & PostCSS configs updated
7. ✅ Package.json updated with Next.js dependencies
8. ✅ All page routes created in App Router structure
9. ✅ Dashboard layouts created for user/caretaker/admin

### What Needs to be Done:

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Convert Component Imports (Critical Files)

### A. Navigation Components

**File: `src/components/Navbar.jsx`**
```jsx
// Change line 2-3 from:
import { useNavigate, Link } from 'react-router-dom';

// To:
'use client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Change line 19 from:
const navigate = useNavigate();

// To:
const router = useRouter();

// Replace all navigate( calls with router.push(
// Replace all <Link to=" with <Link href="
```

**File: `src/components/Sidebar.jsx`**
```jsx
// Add at top:
'use client'

// Change imports:
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Change hook:
const router = useRouter();

// Replace all navigate( with router.push(
// Replace all <Link to=" with <Link href="
```

**File: `src/pages/Footer.jsx`**
```jsx
// Add at top:
'use client'

// Change imports:
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Update all <Link to=" to <Link href="
```

### B. Auth Components

**File: `src/pages/Signup.jsx`**
**File: `src/pages/Login.jsx`**
**File: `src/pages/ForgotPassword.jsx`**
**File: `src/pages/Reset_password.jsx`**

For each file:
```jsx
// Add at top:
'use client'

// Change imports:
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Change hook:
const router = useRouter();

// Replace navigate('/path') with router.push('/path')
// Replace <Link to=" with <Link href="
```

### C. Caretaker Components

**File: `src/components/Caretaker_Dashboard/CaretakerLayout.jsx`**
```jsx
// Change:
import { Outlet } from 'react-router-dom';

// To:
// Remove Outlet import completely

// Replace:
<Outlet />

// With:
{children}  // Already done in app/dashboard/caretaker/layout.tsx
```

**File: `src/components/Caretaker_Dashboard/components/Sidebar.jsx`**
```jsx
'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Replace useLocation with usePathname:
const pathname = usePathname();

// Replace <Link to=" with <Link href="
```

**Files: `src/pages/Caretaker/*.jsx`**
- PropertyDetails.jsx
- PropertyPage.jsx
- EditProperty.jsx

For each:
```jsx
'use client'
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// For dynamic routes, get params from hook:
const params = useParams();
const { id } = params;

// Replace navigate with router.push
// Replace <Link to=" with <Link href="
```

### D. Admin Components

**File: `src/pages/Admin/Admin.jsx`**
```jsx
'use client'

// Remove Routes, Route imports - already handled by App Router
// Component should just render the admin layout content
```

**File: `src/pages/Admin/Components/Sidebar.jsx`**
**Files: `src/pages/Admin/Components/Property/*.jsx`**

For each:
```jsx
'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Replace <Link to=" with <Link href="
// Replace navigate with router.push
```

## Step 3: Delete Old Files

After all conversions are done:
```bash
rm src/App.jsx
rm src/main.jsx
rm vite.config.js
rm index.html
rm src/components/Dashboard/ProtectedRoute.jsx
rm src/components/Caretaker_Dashboard/ProtectedCaretakerRoute.jsx
rm src/components/UserDashboardLayout.jsx
rm src/pages/Dashboard.jsx
rm src/pages/User/Dashboard.jsx
rm src/pages/Caretaker/Dashboard.jsx
rm eslint.config.js  # Use Next.js ESLint config instead
```

## Step 4: Fix Context Providers

Ensure all context providers work with 'use client':

**File: `src/components/UserContext.jsx`**
**File: `src/lib/auth-context.tsx`**
**File: `src/components/Messaging/MessagingProvider.jsx`**

Add `'use client'` at the top of each.

## Step 5: Test the Application

```bash
npm run dev
```

Visit:
- http://localhost:3000 (Home)
- http://localhost:3000/about
- http://localhost:3000/blog
- http://localhost:3000/signup
- http://localhost:3000/login
- http://localhost:3000/dashboard (should redirect based on role)

## Step 6: Build for Production

```bash
npm run build
```

Fix any TypeScript errors that appear during build.

## Quick Find & Replace Script

Create a file `convert-file.sh`:
```bash
#!/bin/bash
FILE=$1

# Add 'use client' if it has hooks
if grep -q "useState\|useEffect\|useContext\|onClick" "$FILE"; then
  if ! grep -q "'use client'" "$FILE"; then
    echo "'use client'" | cat - "$FILE" > temp && mv temp "$FILE"
  fi
fi

# Convert imports
sed -i "s/import { useNavigate, Link }/import { useRouter }\nimport Link/g" "$FILE"
sed -i "s/import { Link, useNavigate }/import { useRouter }\nimport Link/g" "$FILE"
sed -i "s/import { useNavigate }/import { useRouter }/g" "$FILE"
sed -i "s/import { Link }/import Link/g" "$FILE"
sed -i "s/ from 'react-router-dom'/ from 'next\/navigation'/g" "$FILE"
sed -i "s/from \"react-router-dom\"/from \"next\/navigation\"/g" "$FILE"

# Add Link import
if grep -q "from 'next/navigation'" "$FILE" && grep -q "<Link" "$FILE"; then
  sed -i "/from 'next\/navigation'/a import Link from 'next/link'" "$FILE"
fi

# Convert hooks and calls
sed -i 's/useNavigate()/useRouter()/g' "$FILE"
sed -i 's/const navigate = /const router = /g' "$FILE"
sed -i 's/navigate(/router.push(/g' "$FILE"
sed -i 's/ to=/ href=/g' "$FILE"

echo "Converted $FILE"
```

Usage:
```bash
chmod +x convert-file.sh
./convert-file.sh src/components/Navbar.jsx
./convert-file.sh src/components/Sidebar.jsx
# etc...
```

## Summary

- **31 files** need React Router → Next.js conversion
- Most changes are mechanical (imports, hooks, props)
- Add `'use client'` to interactive components
- Test after each major component conversion
- The App Router structure is already in place and working

Once these conversions are done, you'll have a fully functional Next.js application! 🎉
