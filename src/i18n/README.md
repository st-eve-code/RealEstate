# 🌍 Translation System Documentation

## Overview

This project uses a custom-built i18n (internationalization) system that:
- ✅ Auto-detects browser language on first visit
- ✅ Saves user language preference in localStorage
- ✅ Supports English (en) and French (fr)
- ✅ Easy to add more languages

---

## Usage

### 1. Import the hook

```javascript
import { useTranslation } from '@/i18n';
```

### 2. Use in your component

```javascript
function MyComponent() {
  const { t, language, changeLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('hero.subtitle')}</p>
      
      {/* Change language */}
      <button onClick={() => changeLanguage('fr')}>Français</button>
      <button onClick={() => changeLanguage('en')}>English</button>
      
      {/* Current language */}
      <p>Current: {language}</p>
    </div>
  );
}
```

### 3. With Parameters (Interpolation)

```javascript
const name = 'John';
t('welcome.message', { name }); 
// Translation: "Welcome {name}!" → "Welcome John!"
```

---

## Translation Keys

### Navigation
- `nav.home` - Home
- `nav.about` - About
- `nav.blog` - Blog
- `nav.contact` - Contact
- `nav.login` - Login
- `nav.signup` - Sign Up

### Hero Section
- `hero.title` - Main title
- `hero.subtitle` - Subtitle
- `hero.searchPlaceholder` - Search input placeholder
- `hero.searchButton` - Search button

### Services
- `services.title` - Services section title
- `services.citeCleanig` - Cite Cleaning service
- `services.pickupsDeliveries` - Pickups/Deliveries
- `services.laundryServices` - Laundry Services

### Company Values
- `values.title` - Values section title
- `values.locateProperties.title` - Locate Properties title
- `values.locateProperties.description` - Description
- `values.rentProperties.title` - Rent Properties title
- `values.rentProperties.description` - Description
- `values.advertiseProperties.title` - Advertise Properties title
- `values.advertiseProperties.description` - Description

### Auth
- `auth.welcomeBack` - Login welcome message
- `auth.email` - Email field
- `auth.password` - Password field
- `auth.loginButton` - Login button
- `auth.signupButton` - Signup button

### Dashboard
- `dashboard.welcome` - Welcome message
- `dashboard.properties` - Properties
- `dashboard.messages` - Messages
- `dashboard.profile` - Profile
- `dashboard.settings` - Settings

### Common
- `common.loading` - Loading
- `common.save` - Save
- `common.cancel` - Cancel
- `common.search` - Search

---

## Adding New Languages

### 1. Create translation file

```javascript
// src/i18n/locales/es.js
export const es = {
  nav: {
    home: 'Inicio',
    about: 'Acerca de',
    // ... more translations
  },
};
```

### 2. Import in TranslationContext.jsx

```javascript
import { es } from './locales/es';

const translations = {
  en,
  fr,
  es, // Add here
};
```

### 3. Update constants

```javascript
// src/constants/navigation.js
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' }, // Add here
];
```

---

## Features

### Auto-detect Browser Language
On first visit, the system automatically detects the user's browser language.

### Persistent Language Preference
Selected language is saved in localStorage and remembered across sessions.

### Fallback to English
If a translation key is missing in the selected language, it falls back to English.

### SSR Compatible
Works with Next.js server-side rendering.

---

## API Reference

### `useTranslation()` Hook

Returns an object with:

```typescript
{
  language: string;           // Current language code ('en', 'fr')
  changeLanguage: (lang: string) => void;  // Change language
  t: (key: string, params?: object) => string;  // Translate function
  availableLanguages: string[];  // ['en', 'fr']
  mounted: boolean;           // True after client-side mount
}
```

---

## Example: Navbar with Language Switcher

```javascript
function Navbar() {
  const { t, language, changeLanguage } = useTranslation();

  return (
    <nav>
      <Link href="/">{t('nav.home')}</Link>
      <Link href="/about">{t('nav.about')}</Link>
      
      {/* Language Dropdown */}
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
    </nav>
  );
}
```

---

## Testing

```javascript
// Check current language
const { language } = useTranslation();
console.log(language); // 'en' or 'fr'

// Test translation
const { t } = useTranslation();
console.log(t('nav.home')); // 'Home' or 'Accueil'

// Test with params
console.log(t('welcome.user', { name: 'Alice' }));
// 'Welcome Alice!' or 'Bienvenue Alice!'
```

---

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Works with JavaScript disabled (falls back to default language)
- ✅ Mobile browsers
- ✅ SSR/SSG compatible

---

**Your translation system is ready to use!** 🎉
