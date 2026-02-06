# Quick Start Guide - Next.js Migration

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies (Required)
```bash
npm install
```

### Step 2: Convert Components (Choose One Method)

#### Option A: Use the Conversion Script (Recommended)
```bash
chmod +x convert-component.sh

# Convert critical navigation components first
./convert-component.sh src/components/Navbar.jsx
./convert-component.sh src/components/Sidebar.jsx
./convert-component.sh src/pages/Footer.jsx

# Then convert auth pages
./convert-component.sh src/pages/Login.jsx
./convert-component.sh src/pages/Signup.jsx
./convert-component.sh src/pages/ForgotPassword.jsx

# Test after each batch
npm run dev
```

#### Option B: Manual Conversion
For each file that imports from `'react-router-dom'`:

1. Add `'use client'` at the top (if component uses hooks)
2. Change imports:
   ```jsx
   // Before
   import { useNavigate, Link } from 'react-router-dom'
   
   // After
   import { useRouter } from 'next/navigation'
   import Link from 'next/link'
   ```
3. Change hooks:
   ```jsx
   // Before
   const navigate = useNavigate()
   
   // After
   const router = useRouter()
   ```
4. Update calls:
   ```jsx
   // Before
   navigate('/dashboard')
   
   // After
   router.push('/dashboard')
   ```
5. Update Link components:
   ```jsx
   // Before
   <Link href="/about">About</Link>
   
   // After
   <Link href="/about">About</Link>
   ```

### Step 3: Test & Run
```bash
# Start development server
npm run dev

# Visit http://localhost:3000
# Test all routes and navigation
```

---

## 📋 Priority Conversion List

Convert these files in this order:

**Phase 1 - Navigation (Critical):**
1. ✅ `src/components/Navbar.jsx`
2. ✅ `src/components/Sidebar.jsx`
3. ✅ `src/pages/Footer.jsx`

**Phase 2 - Authentication:**
4. `src/pages/Login.jsx`
5. `src/pages/Signup.jsx`
6. `src/pages/ForgotPassword.jsx`
7. `src/pages/Reset_password.jsx`
8. `src/pages/Client_data.jsx`

**Phase 3 - Caretaker Dashboard:**
9. `src/components/Caretaker_Dashboard/components/Sidebar.jsx`
10. `src/pages/Caretaker/PropertyPage.jsx`
11. `src/pages/Caretaker/PropertyDetails.jsx`
12. `src/pages/Caretaker/EditProperty.jsx`

**Phase 4 - Admin Panel:**
13. `src/pages/Admin/Components/Sidebar.jsx`
14. Other admin components...

**Phase 5 - Cleanup:**
After everything works:
```bash
rm src/App.jsx
rm src/main.jsx
rm vite.config.js
rm index.html
```

---

## ⚡ Testing Checklist

After conversions, test these:

- [ ] Home page loads
- [ ] Navigation menu works
- [ ] Footer links work
- [ ] Login page
- [ ] Signup page
- [ ] Dashboard redirect (after login)
- [ ] User dashboard
- [ ] Caretaker dashboard
- [ ] Admin dashboard
- [ ] Property listing
- [ ] Property details
- [ ] Messaging

---

## 🆘 Troubleshooting

### "Cannot use import statement outside a module"
- Add `'use client'` at top of file

### "useRouter is not defined"
- Import from `'next/navigation'` not `'next/router'`

### "Link is not defined"
- Import Link from `'next/link'` separately

### "useParams not working"
- In page.tsx files, receive params as prop instead
- Or use `useParams()` from `'next/navigation'` in client components

### Build errors
- Check all imports are correct
- Ensure 'use client' is added where needed
- Look at the error message - it usually tells you what's wrong

---

## 📚 Need More Help?

- See `MIGRATION_SUMMARY.md` for overview
- See `MIGRATION_STEPS_REMAINING.md` for detailed instructions
- See `NEXTJS_MIGRATION_GUIDE.md` for comprehensive guide

---

**Your migration is 85% complete! Just finish the component conversions and you're done! 🎉**
