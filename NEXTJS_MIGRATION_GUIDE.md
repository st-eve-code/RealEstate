# Next.js Migration Guide

## Migration Status

This project has been **partially migrated** from React + Vite to Next.js 15 with App Router.

### ✅ Completed

1. **Next.js Configuration**
   - Created `next.config.mjs`
   - Updated `tsconfig.json` for Next.js
   - Updated `tailwind.config.js` to include App Router paths
   - Maintained `postcss.config.js`

2. **Environment Variables**
   - Created `.env.local` with NEXT_PUBLIC_* variables
   - Updated `src/lib/firebase.ts` to use `process.env.NEXT_PUBLIC_*`

3. **Package.json**
   - Added Next.js dependencies
   - Removed Vite and React Router dependencies
   - Updated scripts (dev, build, start, lint)

4. **App Router Structure**
   - Created `src/app/layout.tsx` (root layout with providers)
   - Created pages for all public routes (home, about, blog, contact, etc.)
   - Created dashboard layout with role-based routing:
     - `/dashboard/user/*` - User dashboard
     - `/dashboard/caretaker/*` - Landlord/Caretaker dashboard
     - `/dashboard/admin/*` - Admin dashboard

5. **Middleware**
   - Created `src/middleware.ts` for route protection

6. **Firebase Configuration**
   - Updated to work with Next.js (client-side only for now)

### 🔄 Remaining Work

#### 1. Convert React Router to Next.js Navigation (31 files)

**Key Changes Needed:**
- Replace `import { useNavigate, Link } from 'react-router-dom'` with:
  ```tsx
  import { useRouter } from 'next/navigation'
  import Link from 'next/link'
  ```
- Replace `useNavigate()` with `useRouter()`
- Replace `navigate('/path')` with `router.push('/path')`
- Replace `<Navigate to="/path" />` with `redirect('/path')` (from 'next/navigation')
- Update `<Link to="/path">` to `<Link href="/path">`
- Remove `<Outlet />` components (handled by layouts)

**Files to Convert:**
```
src/App.jsx - Can be deleted (replaced by app/layout.tsx)
src/components/Navbar.jsx
src/components/Sidebar.jsx
src/components/Caretaker_Dashboard/components/Sidebar.jsx
src/components/Caretaker_Dashboard/CaretakerLayout.jsx
src/pages/Footer.jsx
src/pages/Signup.jsx
src/pages/Login.jsx
src/pages/ForgotPassword.jsx
src/pages/Contact_us.jsx
src/pages/Client_data.jsx
src/pages/Reset_password.jsx
src/pages/Caretaker/PropertyDetails.jsx
src/pages/Caretaker/PropertyPage.jsx
src/pages/Caretaker/EditProperty.jsx
src/pages/Admin/Admin.jsx
src/pages/Admin/Components/Property/*.jsx
src/pages/Admin/Components/Sidebar.jsx
... (and 11 more files)
```

#### 2. Convert to 'use client' Directives

All components using React hooks need `'use client'` at the top:
- Components with useState, useEffect, useContext
- Event handlers (onClick, onChange, etc.)
- Forms and interactive components

#### 3. Update Image Components

Replace `<img>` with Next.js `<Image>` for optimization:
```tsx
import Image from 'next/image'

// Before
<img src={Logo} alt="Logo" />

// After
<Image src={Logo} alt="Logo" width={100} height={100} />
```

#### 4. Handle Dynamic Routes

Components using `useParams()` need updates:
```tsx
// Before (React Router)
import { useParams } from 'react-router-dom'
const { id } = useParams()

// After (Next.js)
// In page.tsx, receive params as prop
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params
}
```

#### 5. Remove Old Files

After migration is complete:
- Delete `src/App.jsx`
- Delete `src/main.jsx`
- Delete `vite.config.js`
- Delete `index.html`
- Delete `src/components/Dashboard/ProtectedRoute.jsx` (handled by layouts)
- Delete `src/components/Caretaker_Dashboard/ProtectedCaretakerRoute.jsx`
- Delete `src/components/UserDashboardLayout.jsx`

### 📝 Quick Conversion Script for Individual Files

```bash
# For a single file, apply these transformations:

# 1. Add 'use client' if needed
echo "'use client'\n" | cat - file.jsx > temp && mv temp file.jsx

# 2. Replace imports
sed -i "s/from 'react-router-dom'/from 'next\/navigation'/g" file.jsx
sed -i "s/import { Link }/import Link from 'next\/link'/g" file.jsx

# 3. Replace hooks
sed -i 's/useNavigate/useRouter/g' file.jsx
sed -i 's/const navigate =/const router =/g' file.jsx
sed -i 's/navigate(/router.push(/g' file.jsx

# 4. Replace Link props
sed -i 's/ to=/ href=/g' file.jsx
```

### 🚀 Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### ⚠️ Known Issues

1. **React Router dependencies still present** - Need to manually convert all navigation
2. **Some components may throw errors** - Need 'use client' directive
3. **Dynamic routes need param prop** - useParams() won't work in App Router pages
4. **Layouts need Outlet removal** - Use children prop instead

### 🔧 Testing Priority

Test these flows after completing conversions:
1. ✅ Public pages (home, about, blog, contact)
2. ✅ Auth flow (signup, login, forgot password)
3. ✅ Dashboard routing (user/caretaker/admin)
4. 🔄 Navigation between pages
5. 🔄 Protected routes
6. 🔄 Property listing and details
7. 🔄 Messaging system
8. 🔄 Admin panel

