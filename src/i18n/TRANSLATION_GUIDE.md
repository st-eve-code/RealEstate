# 🌍 Complete Translation System Guide

## Overview

This is a comprehensive, production-ready translation system (i18n) for your Next.js application. It supports multiple languages, locale-specific formatting, and provides an excellent developer experience.

## Features

✅ **Multi-language Support**: English, French, and Spanish out of the box
✅ **Automatic Language Detection**: Detects browser language on first visit
✅ **Persistent Preferences**: Stores user's language choice in localStorage
✅ **React Context API**: Efficient state management across the app
✅ **TypeScript Support**: Full type safety for translations
✅ **Locale Formatting**: Date, currency, and number formatting
✅ **Relative Time**: "2 hours ago" style formatting
✅ **Interpolation**: Dynamic variable replacement in translations
✅ **Nested Keys**: Organized translation structure
✅ **Fallback System**: Falls back to English if translation missing
✅ **SSR Compatible**: Works with Next.js server-side rendering
✅ **Language Switcher Component**: Ready-to-use UI component

## Quick Start

### 1. Wrap Your App with TranslationProvider

The provider is already set up in `src/app/layout.tsx`:

```tsx
import { TranslationProvider } from '@/i18n';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
```

### 2. Use Translations in Your Components

```tsx
'use client'

import { useTranslation } from '@/i18n';

export default function MyComponent() {
  const { t, language, changeLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button onClick={() => changeLanguage('fr')}>
        Switch to French
      </button>
      <p>Current language: {language}</p>
    </div>
  );
}
```

### 3. Add Language Switcher

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

// Compact variant (good for navbars)
<LanguageSwitcher variant="compact" />

// Default variant (full-featured)
<LanguageSwitcher variant="default" />
```

## Translation Hook API

### `useTranslation()`

Returns an object with:

- `t(key, params)` - Translate a key with optional interpolation
- `language` - Current language code (e.g., 'en', 'fr', 'es')
- `changeLanguage(lang)` - Change the current language
- `availableLanguages` - Array of available language codes
- `mounted` - Boolean indicating if component is mounted (for SSR)

### Examples

```tsx
const { t } = useTranslation();

// Simple translation
t('nav.home') // "Home"

// Nested keys
t('values.locateProperties.title') // "Locate Properties"

// With interpolation
t('welcome.message', { name: 'John' }) // If translation is "Hello {name}"

// Non-existent key (returns key itself)
t('nonexistent.key') // "nonexistent.key"
```

## Utility Functions

### Date Formatting

```tsx
import { useFormatDate } from '@/i18n';

const formatDate = useFormatDate();

formatDate(new Date()) // Formats according to current locale
formatDate(new Date(), { dateStyle: 'full' }) // "Friday, December 15, 2024"
formatDate(new Date(), { dateStyle: 'short' }) // "12/15/24"
```

### Currency Formatting

```tsx
import { useFormatCurrency } from '@/i18n';

const formatCurrency = useFormatCurrency();

formatCurrency(1234.56, 'USD') // "$1,234.56"
formatCurrency(1234.56, 'EUR') // "1 234,56 €" (in French locale)
```

### Number Formatting

```tsx
import { useFormatNumber } from '@/i18n';

const formatNumber = useFormatNumber();

formatNumber(1234567.89) // "1,234,567.89" (en) or "1 234 567,89" (fr)
```

### Relative Time

```tsx
import { useRelativeTime } from '@/i18n';

const getRelativeTime = useRelativeTime();

const twoHoursAgo = new Date(Date.now() - 3600000 * 2);
getRelativeTime(twoHoursAgo) // "2 hours ago"
```

### Pluralization

```tsx
import { usePluralize } from '@/i18n';

const pluralize = usePluralize();

pluralize(1, { one: '{count} item', other: '{count} items' }) // "1 item"
pluralize(5, { one: '{count} item', other: '{count} items' }) // "5 items"
```

## Adding a New Language

### Step 1: Create Translation File

Create `src/i18n/locales/de.js` for German:

```javascript
export const de = {
  nav: {
    home: 'Startseite',
    about: 'Über uns',
    // ... more translations
  },
  // ... other sections
};
```

### Step 2: Register Language

Update `src/i18n/TranslationContext.jsx`:

```javascript
import { de } from './locales/de';

const translations = {
  en,
  fr,
  es,
  de, // Add new language
};
```

Update `src/i18n/index.js`:

```javascript
export { de } from './locales/de';
```

### Step 3: Update Language Switcher

Update `src/components/LanguageSwitcher.tsx`:

```typescript
const languageData: Record<string, LanguageData> = {
  en: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
  fr: { name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  es: { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  de: { name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
};
```

## Translation File Structure

```javascript
export const en = {
  // Navigation
  nav: {
    home: 'Home',
    about: 'About',
    // ...
  },

  // Hero section
  hero: {
    title: 'Your Title',
    subtitle: 'Your Subtitle',
  },

  // Authentication
  auth: {
    welcomeBack: 'Welcome Back',
    email: 'Email',
    // ...
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome',
    properties: 'Properties',
    // ...
  },

  // Properties
  properties: {
    title: 'Properties',
    viewDetails: 'View Details',
    // ...
  },

  // Common actions
  common: {
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    // ...
  },

  // Error messages
  errors: {
    required: 'This field is required',
    invalidEmail: 'Invalid email',
    // ...
  },

  // Success messages
  success: {
    saved: 'Saved successfully',
    updated: 'Updated successfully',
    // ...
  },
};
```

## Best Practices

### 1. Use Semantic Keys

✅ Good:
```javascript
t('auth.loginButton')
t('errors.invalidEmail')
t('dashboard.totalProperties')
```

❌ Bad:
```javascript
t('button1')
t('error_msg')
t('text123')
```

### 2. Keep Translations Organized

Group related translations together:
- `nav.*` - Navigation items
- `auth.*` - Authentication
- `dashboard.*` - Dashboard
- `properties.*` - Property-related
- `common.*` - Reusable texts
- `errors.*` - Error messages
- `success.*` - Success messages

### 3. Use Interpolation for Dynamic Content

```javascript
// In translation file
greeting: 'Hello {name}, you have {count} messages'

// In component
t('greeting', { name: 'John', count: 5 })
// Output: "Hello John, you have 5 messages"
```

### 4. Handle Client-Side Only

Always use `'use client'` directive when using translation hooks:

```tsx
'use client'

import { useTranslation } from '@/i18n';

export default function MyComponent() {
  const { t } = useTranslation();
  // ...
}
```

### 5. Check if Mounted (for SSR)

```tsx
const { t, mounted } = useTranslation();

if (!mounted) {
  return <div>Loading...</div>;
}

return <div>{t('nav.home')}</div>;
```

## Advanced Features

### Custom Locale Settings

```javascript
import { getLocaleSettings } from '@/i18n';

const settings = getLocaleSettings('fr');
// {
//   dateFormat: 'DD/MM/YYYY',
//   timeFormat: '24h',
//   firstDayOfWeek: 1,
//   currency: 'EUR',
//   direction: 'ltr'
// }
```

### Language Direction

```javascript
import { getLanguageDirection } from '@/i18n';

const direction = getLanguageDirection('ar'); // 'rtl'
const direction = getLanguageDirection('en'); // 'ltr'
```

### Browser Language Detection

```javascript
import { getBestMatchingLocale } from '@/i18n';

const bestLocale = getBestMatchingLocale(['en', 'fr', 'es']);
// Returns best match from browser languages
```

## Testing

Visit the demo page to see all features in action:

```
http://localhost:3000/translation-demo
```

This page demonstrates:
- Language switching
- All translation categories
- Date/currency formatting
- Error and success messages
- Interpolation examples
- Usage instructions

## Troubleshooting

### Translation not updating

Make sure you're using the `'use client'` directive:

```tsx
'use client'

import { useTranslation } from '@/i18n';
```

### Key not found

The system will return the key itself if translation is missing. Check:
1. Key exists in translation file
2. Key path is correct (e.g., `nav.home` not `nav.Home`)
3. Language file is properly imported

### SSR Hydration Errors

Use the `mounted` flag:

```tsx
const { t, mounted } = useTranslation();

if (!mounted) return null;

return <div>{t('nav.home')}</div>;
```

## File Structure

```
src/i18n/
├── index.js                    # Main exports
├── TranslationContext.jsx      # Context provider and hook
├── hooks.js                    # Custom formatting hooks
├── utils.js                    # Utility functions
├── README.md                   # Basic documentation
├── TRANSLATION_GUIDE.md        # This file
└── locales/
    ├── en.js                   # English translations
    ├── fr.js                   # French translations
    └── es.js                   # Spanish translations

src/components/
├── LanguageSwitcher.jsx        # Language switcher (JS)
└── LanguageSwitcher.tsx        # Language switcher (TS)

src/app/
├── layout.tsx                  # TranslationProvider wrapper
└── translation-demo/
    └── page.tsx                # Demo page
```

## Support

For questions or issues:
1. Check this guide
2. Review the demo page at `/translation-demo`
3. Check the README.md in `src/i18n/`
4. Review existing translation files for examples

## License

Part of the RentSpot application.
