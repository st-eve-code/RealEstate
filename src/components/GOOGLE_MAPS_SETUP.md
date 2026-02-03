# Google Maps Integration Setup Guide

## Current Setup

The property details page now includes an interactive map showing the property location with:
- ✅ Full address display
- ✅ Embedded Google Maps (requires API key)
- ✅ "Get Directions" button (opens Google Maps)
- ✅ "Copy Address" button
- ✅ Fallback UI if no API key is configured

## How It Works NOW (Without API Key)

Currently, the map shows a beautiful fallback UI with:
- Property address display
- "Open in Google Maps" button (works immediately)
- "Get Directions" button (works immediately)
- "Copy Address" button (works immediately)

**Users can still get directions and view the property on Google Maps - it just opens in a new tab instead of showing an embedded map.**

## Optional: Add Google Maps API Key (For Embedded Map)

If you want the map embedded directly on the page (instead of opening in a new tab), follow these steps:

### Step 1: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **"Maps Embed API"**
4. Go to **"Credentials"** → **"Create Credentials"** → **"API Key"**
5. Copy your API key

### Step 2: Restrict Your API Key (Important for Security)

1. Click on your API key to edit it
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domain(s): 
     - `localhost:*` (for development)
     - `yourdomain.com/*` (for production)
3. Under "API restrictions":
   - Select "Restrict key"
   - Select only "Maps Embed API"
4. Save changes

### Step 3: Add API Key to Your Code

Open `src/components/User_Dashboard/UserPropertyDetails.jsx` and find this line:

```javascript
src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(
```

Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:

```javascript
src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD1234567890abcdefghijklmnop&q=${encodeURIComponent(
```

### Step 4: Remove the Fallback Overlay (Optional)

Once you add your API key, you can remove the fallback overlay div that covers the map. Find this section and delete it:

```jsx
{/* Fallback if no API key - shows static message */}
<div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
  ...entire div content...
</div>
```

## Alternative: Use Environment Variables (Recommended)

For better security, store your API key in environment variables:

### Step 1: Create `.env.local` file

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Step 2: Update the component

```javascript
src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
```

### Step 3: Add to `.gitignore`

Make sure `.env.local` is in your `.gitignore` file (it should be by default in Next.js)

## Pricing

Google Maps Embed API is **FREE** for most use cases:
- **$0** for up to 28,500 map loads per month
- After that: $7 per 1,000 additional loads

For a typical property listing site, this should be more than enough.

## Alternative Free Solutions

If you don't want to use Google Maps API:

### 1. **OpenStreetMap (Free, No API Key Required)**

```jsx
<iframe
  width="100%"
  height="100%"
  style={{ border: 0 }}
  loading="lazy"
  src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`}
></iframe>
```

### 2. **Mapbox (Free Tier: 50,000 loads/month)**

Requires API token but has a generous free tier.

### 3. **Keep Current Setup (No API Key)**

The current setup works perfectly without any API key:
- Shows property address
- "Get Directions" opens Google Maps in new tab
- "Copy Address" copies to clipboard
- No cost, no API key needed

## Current Features Working Now

✅ **Full Address Display** - Shows street, city, country
✅ **Get Directions** - Opens Google Maps with directions
✅ **Copy Address** - Copies full address to clipboard
✅ **Beautiful Fallback UI** - Professional design even without API key
✅ **Mobile Responsive** - Works on all devices
✅ **No Cost** - Completely free without API key

## What Embedded Map Adds (With API Key)

- ✨ Interactive map directly on the page
- ✨ Zoom in/out functionality
- ✨ Street view option
- ✨ Satellite view option
- ✨ No need to open new tab

## Recommendation

**For Now:** Keep the current setup. It works perfectly and is completely free.

**Later:** Add Google Maps API key if you want the embedded interactive map.

## Support

- Google Maps Platform: https://developers.google.com/maps
- Google Cloud Console: https://console.cloud.google.com/
- Pricing Calculator: https://mapsplatform.google.com/pricing/

---

**Note:** The map feature is fully functional right now. Users can view the property location, get directions, and copy the address without any additional setup required!
