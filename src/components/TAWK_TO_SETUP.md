# Tawk.to Chat Integration Setup Guide

## What is Tawk.to?

Tawk.to is a free live chat application that lets you monitor and chat with visitors on your website. It's perfect for user-caretaker communication and the admin can track all conversations from the Tawk.to dashboard.

## Features

- ✅ **Free Forever** - No credit card required
- ✅ **Admin Dashboard** - Track all conversations in one place
- ✅ **Mobile Apps** - iOS and Android apps for agents
- ✅ **Visitor Monitoring** - See who's on your site in real-time
- ✅ **Chat History** - All conversations are saved
- ✅ **File Sharing** - Share images and documents
- ✅ **Customizable Widget** - Match your brand colors
- ✅ **Multi-agent Support** - Multiple team members can respond

## Setup Instructions

### Step 1: Create a Tawk.to Account

1. Go to [https://www.tawk.to/](https://www.tawk.to/)
2. Click **"Sign Up Free"**
3. Fill in your details:
   - Name
   - Email
   - Password
4. Verify your email address

### Step 2: Add Your Property

1. After logging in, click **"Add Property"**
2. Enter your website details:
   - Property Name: e.g., "RealEstate Platform"
   - Website URL: Your website URL
3. Click **"Add Property"**

### Step 3: Get Your Widget Code

1. In your Tawk.to dashboard, click on **"Administration"** → **"Channels"**
2. Click on **"Chat Widget"**
3. You'll see a code snippet that looks like this:

```javascript
<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->
```


4. Copy the **PROPERTY_ID** and **WIDGET_ID** from the URL

### Step 4: Update the Code

1. Open `src/components/TawkToChat.tsx`
2. Find this line:
   ```typescript
   script.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID'
   ```
3. Replace `YOUR_PROPERTY_ID` and `YOUR_WIDGET_ID` with your actual IDs

**Example:**
```typescript
script.src = 'https://embed.tawk.to/65f4a3b2a0c6737bd1290f8e/1hk7l2m3n'
```

### Step 5: Customize Your Widget (Optional)

In Tawk.to dashboard:

1. Go to **"Administration"** → **"Appearance"**
2. Customize:
   - Widget color
   - Widget position
   - Welcome message
   - Offline message
   - Bubble icon

### Step 6: Add Agents/Team Members

1. Go to **"Administration"** → **"Agents"**
2. Click **"Add Agent"**
3. Enter agent details:
   - Name
   - Email
   - Role (Admin, Agent, etc.)
4. They'll receive an invitation email

### Step 7: Set Up Departments (Optional)

For multiple caretakers/properties:

1. Go to **"Administration"** → **"Departments"**
2. Create departments like:
   - Property Management
   - Sales
   - Support
3. Assign agents to departments

## How It Works

### For Users:

1. User visits property details page
2. Green chat bubble appears in bottom-right corner
3. User clicks bubble to start chat
4. User can chat with property manager in real-time

### For Property Managers:

1. Install Tawk.to mobile app or use web dashboard
2. Receive notifications when users message
3. Respond to messages in real-time
4. View chat history and user information

### For Admin:

1. Login to Tawk.to dashboard at [https://dashboard.tawk.to/](https://dashboard.tawk.to/)
2. View all conversations from all properties
3. Monitor agent performance
4. View analytics and reports
5. Export chat transcripts

## Advanced Features

### Set Visitor Attributes

You can pass user information to Tawk.to for better tracking:

```typescript
window.Tawk_API.setAttributes({
  name: user.name,
  email: user.email,
  propertyId: propertyId,
  propertyName: propertyName,
}, function(error) {
  // Handle error
})
```

### Trigger Chat Programmatically

The "Chat with Manager" button already does this:

```typescript
window.Tawk_API.maximize() // Opens the chat widget
```

### Hide/Show Widget

```typescript
window.Tawk_API.hideWidget() // Hide widget
window.Tawk_API.showWidget() // Show widget
```

## Mobile Apps

Download Tawk.to mobile apps for agents:

- **iOS**: [App Store](https://apps.apple.com/app/tawk-to/id1036319382)
- **Android**: [Google Play](https://play.google.com/store/apps/details?id=com.tawk.app)

## Alternative Free Chat Services

If you prefer other services:

1. **Crisp.chat** - Similar to Tawk.to, free tier available
2. **Tidio** - Free for 3 agents
3. **Chatra** - Free tier available
4. **LiveChat** - Paid service with trial

## Troubleshooting

### Widget not showing?

1. Check that you've replaced `YOUR_PROPERTY_ID` and `YOUR_WIDGET_ID`
2. Clear browser cache
3. Check browser console for errors
4. Verify widget is enabled in Tawk.to dashboard

### Chat not opening?

1. Check that `window.Tawk_API` is defined
2. Wait for widget to fully load before calling methods
3. Use `window.Tawk_API.onLoad` callback

### Want to test without real Tawk.to account?

The widget won't show until you add real credentials, but the rest of the property details page will work fine.

## Support

- Tawk.to Documentation: [https://help.tawk.to/](https://help.tawk.to/)
- Tawk.to Support: Available via their chat widget on tawk.to
- Video Tutorials: [https://www.youtube.com/c/tawkto](https://www.youtube.com/c/tawkto)

---

**Note:** Once you set up Tawk.to, all conversations between users and property managers will be tracked and can be monitored by the admin from the Tawk.to dashboard. This is perfect for quality control and training purposes.
