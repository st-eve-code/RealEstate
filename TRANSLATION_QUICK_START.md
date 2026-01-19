# 🚀 Translation System - Quick Start Guide

## ⚡ 5-Minute Setup

Your translation system is **already set up and working!** Here's how to use it:

## 1️⃣ Basic Usage (Copy & Paste)

```tsx
'use client'

import { useTranslation } from '@/i18n';

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <button>{t('common.save')}</button>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}
```

## 2️⃣ Add Language Switcher (Copy & Paste)

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

// In your navbar or settings page:
<LanguageSwitcher variant="compact" />
```

## 3️⃣ Common Translation Keys

### Navigation
```tsx
t('nav.home')        // Home
t('nav.about')       // About
t('nav.blog')        // Blog
t('nav.contact')     // Contact
t('nav.properties')  // Properties
t('nav.login')       // Login
t('nav.signup')      // Sign Up
```

### Buttons & Actions
```tsx
t('common.save')      // Save
t('common.cancel')    // Cancel
t('common.delete')    // Delete
t('common.edit')      // Edit
t('common.search')    // Search
t('common.submit')    // Submit
t('common.back')      // Back
```

### Dashboard
```tsx
t('dashboard.welcome')          // Welcome
t('dashboard.overview')         // Overview
t('dashboard.properties')       // Properties
t('dashboard.messages')         // Messages
t('dashboard.settings')         // Settings
t('dashboard.totalProperties')  // Total Properties
```

### Properties
```tsx
t('properties.title')          // Title
t('properties.viewDetails')    // View Details
t('properties.bedrooms')       // Bedrooms
t('properties.bathrooms')      // Bathrooms
t('properties.price')          // Price
t('properties.available')      // Available
```

### Authentication
```tsx
t('auth.welcomeBack')        // Welcome Back
t('auth.email')              // Email
t('auth.password')           // Password
t('auth.loginButton')        // Log In
t('auth.forgotPassword')     // Forgot Password?
```

### Messages
```tsx
t('success.saved')          // Saved successfully
t('success.updated')        // Updated successfully
t('errors.required')        // This field is required
t('errors.invalidEmail')    // Invalid email address
```

## 4️⃣ Change Language Programmatically

```tsx
const { changeLanguage } = useTranslation();

<button onClick={() => changeLanguage('en')}>English</button>
<button onClick={() => changeLanguage('fr')}>Français</button>
<button onClick={() => changeLanguage('es')}>Español</button>
```

## 5️⃣ Format Dates & Currency

```tsx
import { useFormatDate, useFormatCurrency } from '@/i18n';

const formatDate = useFormatDate();
const formatCurrency = useFormatCurrency();

// In your component:
<p>{formatDate(new Date())}</p>           // January 8, 2026
<p>{formatCurrency(1234.56, 'USD')}</p>   // $1,234.56
```

## 📋 Available Languages

- 🇬🇧 English (`en`)
- 🇫🇷 French (`fr`)
- 🇪🇸 Spanish (`es`)

## 🎯 Quick Examples

### Login Form
```tsx
'use client'
import { useTranslation } from '@/i18n';

export default function LoginForm() {
  const { t } = useTranslation();

  return (
    <form>
      <h1>{t('auth.welcomeBack')}</h1>
      
      <input 
        type="email" 
        placeholder={t('auth.email')}
      />
      
      <input 
        type="password" 
        placeholder={t('auth.password')}
      />
      
      <button>{t('auth.loginButton')}</button>
      
      <a href="#">{t('auth.forgotPassword')}</a>
    </form>
  );
}
```

### Property Card
```tsx
'use client'
import { useTranslation, useFormatCurrency } from '@/i18n';

export default function PropertyCard({ property }) {
  const { t } = useTranslation();
  const formatCurrency = useFormatCurrency();

  return (
    <div>
      <h3>{property.name}</h3>
      <p>{t('properties.price')}: {formatCurrency(property.price, 'USD')}</p>
      <p>{t('properties.bedrooms')}: {property.bedrooms}</p>
      <p>{t('properties.bathrooms')}: {property.bathrooms}</p>
      <button>{t('properties.viewDetails')}</button>
    </div>
  );
}
```

### Dashboard Stats
```tsx
'use client'
import { useTranslation } from '@/i18n';

export default function DashboardStats({ stats }) {
  const { t } = useTranslation();

  return (
    <div>
      <div>
        <h4>{t('dashboard.totalProperties')}</h4>
        <p>{stats.total}</p>
      </div>
      
      <div>
        <h4>{t('dashboard.activeListings')}</h4>
        <p>{stats.active}</p>
      </div>
    </div>
  );
}
```

## 🎨 See It In Action

Visit these pages to see the translation system working:

1. **Demo Page**: `/translation-demo` - Complete interactive demo
2. **Navbar**: Already translated with language switcher
3. **Example Component**: See `src/components/TranslationExample.tsx`

## 📚 Full Documentation

- **Complete Guide**: `src/i18n/TRANSLATION_GUIDE.md`
- **Implementation Summary**: `TRANSLATION_SYSTEM_README.md`
- **Translation Files**: `src/i18n/locales/`

## 💡 Pro Tips

1. **Always use `'use client'`** at the top when using translations
2. **Use semantic keys**: `auth.loginButton` not `button1`
3. **Keep it simple**: Just call `t('key.name')`
4. **Check the demo**: Visit `/translation-demo` for live examples

## ⚠️ Common Mistakes

❌ **Don't do this:**
```tsx
// Missing 'use client'
import { useTranslation } from '@/i18n';

export default function MyComponent() {
  const { t } = useTranslation(); // ERROR!
  // ...
}
```

✅ **Do this:**
```tsx
'use client'  // Add this!

import { useTranslation } from '@/i18n';

export default function MyComponent() {
  const { t } = useTranslation(); // Works!
  // ...
}
```

## 🎉 That's It!

You're ready to use translations throughout your app. Just:

1. Add `'use client'`
2. Import `useTranslation`
3. Call `t('your.key')`

**Simple, powerful, and fully functional!** 🚀
