# Property Listing Component Structure

This directory contains a modular, well-organized property listing system for caretakers.

## 📁 Directory Structure

```
ListProperty/
├── README.md (this file)
├── ProgressIndicator.jsx          # Progress stepper component
├── BasicInformationStep.jsx       # Step 1: Property details form
├── UploadMediaStep.jsx            # Step 2: Media upload form (smart category display)
├── ReviewListingStep.jsx          # Step 3: Preview and publish
├── components/                    # Reusable UI components
│   ├── RoomCounter.jsx            # Counter for room numbers
│   ├── AmenitySelector.jsx        # Amenity selection with search
│   └── MediaUploadBox.jsx         # Image/video upload with drag-drop
├── config/                        # Configuration files
│   └── categoryMapping.js         # Maps room types to media categories
├── validation/                    # Validation logic
│   └── stepValidation.js          # Step-by-step validation functions
└── utils/                         # Utility functions
    └── formData.js                # Form data structure & database formatting
```

## 🎯 Component Overview

### Main Component
- **ListProperty.jsx** - Main container that manages the 3-step flow and form state

### Step Components
1. **BasicInformationStep** - Collects property type, rooms, location, pricing, description, rules, and amenities
2. **UploadMediaStep** - Handles walkthrough video and category-based media uploads
   - **Smart Category Display**: Only shows categories for rooms with count > 0
   - Dynamically shows: Parlor (if parlors > 0), Kitchen (if kitchens > 0), Toilet (if bathrooms > 0)
   - Always shows: Parking (always required)
3. **ReviewListingStep** - Shows preview of all entered data before publishing

### Reusable Components
- **ProgressIndicator** - Visual progress stepper showing current step
- **RoomCounter** - Increment/decrement counter for room counts
- **AmenitySelector** - Searchable amenity selector with tags
- **MediaUploadBox** - Drag-and-drop media uploader for images and videos

### Configuration
- **categoryMapping.js** - Maps room types to media categories
  - `bathrooms` → `toilet` category
  - `parlors` → `parlor` category
  - `kitchens` → `kitchen` category
  - `bedrooms` → no specific category (uses general property images)
  - `parking` → always required

### Validation
- **stepValidation.js** - Contains validation logic for each step
  - `validateBasicInformation()` - Validates Step 1
  - `validateMediaUpload()` - Validates Step 2 (only checks required categories)
  - `validateStep()` - Main router function

### Utilities
- **formData.js** - Contains:
  - `getInitialFormData()` - Returns initial form structure
  - `formatFormDataForDatabase()` - Formats data for Firebase storage

## 🔄 Data Flow

1. User fills out **BasicInformationStep** → data stored in `formData.basic`
2. User uploads media in **UploadMediaStep** → data stored in `formData.media`
   - Only categories for rooms with count > 0 are shown and validated
3. User reviews in **ReviewListingStep** → can publish or discard
4. On publish → data is validated and formatted for database

## 📝 Form Data Structure

```javascript
{
  basic: {
    propertyType: string,
    propertyStatus: string,
    rooms: { bedrooms, bathrooms, parlors, kitchens },
    location: { country, city, address },
    rentalPeriod: string,
    rentalFee: string,
    propertyName: string,
    description: string,
    houseRules: string,
    amenitiesIncluded: array,
    amenitiesExtra: array
  },
  media: {
    walkthroughVideo: file,
    categories: {
      parlor: { images: [], videos: [] },
      kitchen: { images: [], videos: [] },
      toilet: { images: [], videos: [] },
      parking: { images: [], videos: [] }
    }
  }
}
```

## 🎨 Styling

- Uses Tailwind CSS with purple accent color (`purple-600`, `purple-100`, etc.)
- Responsive design with mobile-first approach
- Consistent spacing and typography

## ✅ Validation Rules

### Step 1 (Basic Information)
- Property type is required
- Location (country, city, address) is required
- Rental fee must be a positive number
- Property name must be at least 3 characters
- Description must be at least 20 characters
- At least one room type must be specified

### Step 2 (Upload Media)
- **Smart Validation**: Only validates categories for rooms with count > 0
  - If `parlors = 1`, validates "parlor" category
  - If `bathrooms = 0`, does NOT validate "toilet" category
  - If `kitchens = 0`, does NOT validate "kitchen" category
  - "Parking" is always validated (always required)
- Each required category must have:
  - At least 2 images
  - At least 1 video
- Walkthrough video is optional, but if provided, must be < 100MB

## 🚀 Usage

```jsx
import ListProperty from '@/pages/Caretaker/ListProperty';

// In your route
<Route path="list-property" element={<ListProperty />} />
```

## 🔧 Key Features

### Smart Category Display
The system intelligently shows and validates only the media categories that correspond to rooms specified in Step 1:

- **Example 1**: User sets `parlors = 1`, `bathrooms = 0`, `kitchens = 0`
  - Shows: Parlor, Parking
  - Validates: Parlor, Parking
  - Hides: Kitchen, Toilet

- **Example 2**: User sets `parlors = 2`, `bathrooms = 1`, `kitchens = 1`
  - Shows: Parlor, Kitchen, Toilet, Parking
  - Validates: All four categories

## 📚 File Organization

The code is organized into clear, logical folders:

- **Root level**: Main step components
- **components/**: Reusable UI components
- **config/**: Configuration and mappings
- **validation/**: Validation logic (separated from data utilities)
- **utils/**: Data structure and formatting utilities

This separation makes the codebase easier to understand, maintain, and extend.
