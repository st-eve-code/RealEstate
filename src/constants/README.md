# Constants Directory

This directory contains all centralized constants for the application, promoting code reusability, maintainability, and cleaner component code.

## Structure

```
src/constants/
├── index.js          # Central export point - import everything from here
├── team.js           # Team member data
├── home.js           # Home page constants (company values, features)
├── navigation.js     # Navigation-related constants
├── footer.js         # Footer-related constants
└── README.md         # This file
```

## Usage

### Import from Central Location (Recommended)

```javascript
import { TEAM_MEMBERS, COMPANY_VALUES, NAV_LINKS } from '@/constants';
```

### Import from Specific Module

```javascript
import { FOOTER_CONTACT } from '@/constants/footer';
import { SERVICE_LINKS } from '@/constants/navigation';
```

## Available Constants

### Team (`team.js`)
- **TEAM_MEMBERS**: Array of team member objects with name, position, social links

### Home (`home.js`)
- **COMPANY_VALUES**: Array of company features/values with icons and descriptions

### Navigation (`navigation.js`)
- **SERVICE_LINKS**: Service menu items
- **ACCOUNT_LINKS**: Account/user menu items
- **LANGUAGES**: Language selection options
- **NAV_LINKS**: Main navigation links

### Footer (`footer.js`)
- **FOOTER_COMPANY_LINKS**: Quick links (Home, About, Contact, etc.)
- **FOOTER_LEGAL_LINKS**: Legal page links (Terms, Privacy, etc.)
- **FOOTER_LOCATIONS**: Location-specific pages
- **FOOTER_CONTACT**: Contact information (phone, email)
- **FOOTER_SOCIAL**: Social media links

## Benefits

1. **Single Source of Truth**: Update data in one place, reflect everywhere
2. **Cleaner Components**: Components focus on logic and UI, not data
3. **Easy Maintenance**: Find and update all constants quickly
4. **Type Safety**: Can easily add TypeScript types if needed
5. **Reusability**: Import same constants across multiple components
6. **Scalability**: Easy to add new constant categories

## Adding New Constants

1. Create a new file or add to existing file in `src/constants/`
2. Export your constants with clear, descriptive names (use UPPER_SNAKE_CASE)
3. Add to `index.js` for central export:
   ```javascript
   export * from './your-new-file';
   ```
4. Import and use in your components

## Example

```javascript
// src/constants/products.js
export const PRODUCT_CATEGORIES = [
  { id: 1, name: 'Electronics', icon: 'laptop' },
  { id: 2, name: 'Clothing', icon: 'shirt' }
];

// src/constants/index.js
export * from './products';

// src/components/ProductList.jsx
import { PRODUCT_CATEGORIES } from '@/constants';

function ProductList() {
  return (
    <div>
      {PRODUCT_CATEGORIES.map(cat => (
        <div key={cat.id}>{cat.name}</div>
      ))}
    </div>
  );
}
```

## Best Practices

1. Use descriptive, UPPER_SNAKE_CASE names for constants
2. Group related constants in the same file
3. Add comments to explain complex data structures
4. Keep constants immutable (avoid mutation in components)
5. Use TypeScript for better type safety (optional)
6. Document any constants that aren't self-explanatory

---

**Created as part of code optimization and modularization effort**
