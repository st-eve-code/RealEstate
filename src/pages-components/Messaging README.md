# Messaging System Documentation

## Overview

The messaging system enables real-time communication between users (tenants, landlords) with support for multiple message types including text, images, files, audio, location, and property listings.

## Architecture

### Firestore Collections Structure

```
conversations/
  └── {conversationId}/
      ├── (document fields)
      └── messages/
          └── {messageId}/
              └── (message document)
```

### Firebase Storage Structure

```
messages/
  └── {conversationId}/
      └── {senderId}/
          ├── {timestamp}_{filename}          # Images
          ├── files/
          │   └── {timestamp}_{filename}      # File attachments
          └── audio/
              └── {timestamp}_{filename}      # Audio recordings
```

---

## Data Structures

### Conversation Document

**Collection**: `conversations`  
**Document ID**: Auto-generated

```typescript
{
  id: string;                          // Document ID
  participants: string[];              // Array of two user UIDs
  lastMessage?: {
    text: string;
    type: string;                      // "text" | "listing" | "location" | "image" | "audio"
    senderId: string;
    timestamp: Timestamp;
    readBy: string[];                  // Array of user UIDs who read it
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  propertyId?: string;                 // Optional: Links conversation to a property
}
```

### Message Document

**Collection**: `conversations/{conversationId}/messages`  
**Document ID**: Auto-generated

```typescript
{
  id: string;                          // Document ID
  senderId: string;                    // UID of message sender
  type: "text" | "listing" | "location" | "image" | "audio";
  text: string;                        // Message text content
  location: string;                    // Location string (for location type: "lat,lng")
  createdAt: Timestamp;
  updatedAt: Timestamp;
  readBy: [
    {
      uid: string;                     // User UID
      timestamp: Timestamp;            // When they read it
    }
  ];
  additional?: {
    // For image messages
    imageUrl?: string;
    
    // For listing messages (property sharing)
    title?: string;
    button?: [
      {
        text: string;
        link?: string;                 // Internal route
        url?: string;                  // External URL
        class?: string;
      }
    ];
    
    // For file attachments
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    
    // For location messages
    latitude?: number;
    longitude?: number;
    address?: string;                  // Reverse geocoded address
    mapUrl?: string;                   // Google Maps URL
    
    // For audio messages
    audioUrl?: string;
    audioDuration?: number;
  };
}
```

---

## Message Types & Data Requirements

### 1. Text Message

**Type**: `"text"`

**Required Data**:
- `text`: Message text content
- `senderId`: User UID
- `type`: `"text"`

**Storage**:
- Stored directly in Firestore message document
- No Firebase Storage upload required

**Example**:
```typescript
await sendMessage(conversationId, userId, {
  type: "text",
  text: "Hello!",
  location: "",
});
```

---

### 2. Image Message

**Type**: `"image"`

**Required Data**:
- `text`: Optional caption text
- `file`: Image File object (from file input)
- `type`: `"image"` (auto-set)

**Storage**:
- **Firebase Storage Path**: `messages/{conversationId}/{senderId}/{timestamp}_{filename}`
- **Firestore**: Stores `additional.imageUrl` (download URL)

**Process**:
1. User selects image file
2. File is uploaded to Firebase Storage
3. Download URL is obtained
4. Message created with `type: "image"` and `additional.imageUrl`

**Example**:
```typescript
await sendMessage(conversationId, userId, {
  type: "text",
  text: "Check out this photo!",
  location: "",
}, {
  type: "image",
  file: imageFile,  // File object
});
```

---

### 3. File Attachment

**Type**: `"text"` (message type, but includes file data)

**Required Data**:
- `text`: Optional message text
- `file`: File object (PDF, DOC, etc.)
- `type`: `"file"`

**Storage**:
- **Firebase Storage Path**: `messages/{conversationId}/{senderId}/files/{timestamp}_{filename}`
- **Firestore**: Stores in `additional`:
  - `fileUrl`: Download URL
  - `fileName`: Original filename
  - `fileSize`: File size in bytes
  - `fileType`: MIME type

**Example**:
```typescript
await sendMessage(conversationId, userId, {
  type: "text",
  text: "Here's the document",
  location: "",
}, {
  type: "file",
  file: documentFile,
});
```

---

### 4. Property Listing (Landlord Only)

**Type**: `"listing"`

**Required Data**:
- `text`: Optional message text (auto-generated if not provided)
- `property`: Property object with:
  - `id`: Property ID
  - `title`: Property title
  - `price`: Price number
  - `period`: "Monthly" | "Yearly" | etc.
  - `images`: Array with at least one image URL

**Storage**:
- **Firestore**: Stores in `additional`:
  - `imageUrl`: First property image
  - `title`: Property title
  - `button`: Array with "Open Listing" button
    - `text`: "Open Listing"
    - `link`: `/dashboard/property/{propertyId}`
    - `url`: Can be used for external links

**Example**:
```typescript
await sendMessage(conversationId, userId, {
  type: "listing",
  text: "",  // Auto-generated if empty
  location: "",
}, {
  type: "property",
  property: {
    id: "property123",
    title: "Cozy 2-Bedroom Apartment",
    price: 150000,
    period: "Monthly",
    images: [{ category: "Parlor", urls: ["https://..."] }],
    // ... other property fields
  },
});
```

---

### 5. Location Message

**Type**: `"location"`

**Required Data**:
- `text`: Optional message text (auto-generated with coordinates/address if not provided)
- `location`: Object with:
  - `latitude`: number
  - `longitude`: number
  - `address`: string (optional, reverse geocoded)

**Storage**:
- **Firestore**: Stores in:
  - `location`: `"${latitude},${longitude}"` (string)
  - `additional`:
    - `latitude`: number
    - `longitude`: number
    - `address`: string (if available)
    - `mapUrl`: Google Maps URL

**Process**:
1. User clicks "Location" option
2. Browser requests geolocation permission
3. Gets current position using `navigator.geolocation`
4. Optionally reverse geocodes to get address
5. Message created with location data

**Example**:
```typescript
await sendMessage(conversationId, userId, {
  type: "location",
  text: "",  // Auto-generated with address or coordinates
  location: "6.4527,3.3898",  // Auto-generated from attachment
}, {
  type: "location",
  location: {
    latitude: 6.4527,
    longitude: 3.3898,
    address: "Lagos, Nigeria",  // Optional
  },
});
```

---

### 6. Audio Message

**Type**: `"audio"`

**Required Data**:
- `text`: Optional message text (defaults to "🎤 Audio message")
- `file`: Audio File object (WebM format from MediaRecorder)

**Storage**:
- **Firebase Storage Path**: `messages/{conversationId}/{senderId}/audio/{timestamp}_{filename}`
- **Firestore**: Stores in `additional`:
  - `audioUrl`: Download URL
  - `audioDuration`: Duration in seconds (optional, can be calculated client-side)

**Process**:
1. User clicks microphone icon
2. Browser requests microphone permission
3. Uses `MediaRecorder` API to record audio
4. Records as WebM format
5. On stop, creates blob and uploads to Storage
6. Message created with audio URL

**Example**:
```typescript
await sendMessage(conversationId, userId, {
  type: "audio",
  text: "🎤 Audio message",
  location: "",
}, {
  type: "audio",
  file: audioBlob,  // File object from MediaRecorder
});
```

---

## API Functions

### `getOrCreateConversation(currentUserId, otherUserId, propertyId?)`

**Purpose**: Get existing conversation or create a new one between two users.

**Parameters**:
- `currentUserId`: UID of the current user
- `otherUserId`: UID of the other participant
- `propertyId`: Optional property ID to link conversation

**Returns**: `Promise<string>` - Conversation ID

**Process**:
1. Searches for existing conversation with both user IDs as participants
2. If found, returns existing conversation ID
3. If not found, creates new conversation with:
   - `participants`: `[currentUserId, otherUserId]`
   - `propertyId`: Provided property ID or null
   - `createdAt`: Server timestamp
   - `updatedAt`: Server timestamp

**Example**:
```typescript
const conversationId = await getOrCreateConversation(
  "user123",
  "user456",
  "property789"  // Optional
);
```

---

### `subscribeToConversations(userId, callback)`

**Purpose**: Real-time subscription to all conversations for a user.

**Parameters**:
- `userId`: User UID
- `callback`: `(conversations: ConversationWithUser[]) => void`

**Returns**: Unsubscribe function

**Features**:
- Real-time updates when conversations are added/updated
- Automatically fetches other user's data
- Calculates unread message counts
- Sorted by `updatedAt` descending (most recent first)

**Data Enrichment**:
- Fetches `otherUser` data from `users` collection
- Counts unread messages for each conversation
- Adds `otherUserId` and `unreadCount` to each conversation

**Example**:
```typescript
const unsubscribe = subscribeToConversations(userId, (conversations) => {
  setConversations(conversations);
});

// Later, to unsubscribe:
unsubscribe();
```

---

### `subscribeToMessages(conversationId, callback, limitCount?)`

**Purpose**: Real-time subscription to messages in a conversation.

**Parameters**:
- `conversationId`: Conversation ID
- `callback`: `(messages: MessageWithId[]) => void`
- `limitCount`: Maximum messages to fetch (default: 50)

**Returns**: Unsubscribe function

**Features**:
- Real-time updates when new messages arrive
- Messages sorted by `createdAt` descending (newest first)
- Reversed for display (oldest first)
- Limited to most recent messages for performance

**Example**:
```typescript
const unsubscribe = subscribeToMessages(conversationId, (messages) => {
  setMessages(messages);
});

// Later, to unsubscribe:
unsubscribe();
```

---

### `sendMessage(conversationId, senderId, message, attachment?)`

**Purpose**: Send a message with optional attachment.

**Parameters**:
- `conversationId`: Conversation ID
- `senderId`: Sender's UID
- `message`: Message data object
- `attachment`: Optional attachment object

**Returns**: `Promise<string>` - Message document ID

**Process**:
1. **If attachment provided**:
   - **Image**: Uploads to Storage, gets URL, sets `type: "image"`
   - **File**: Uploads to Storage, stores metadata, keeps `type: "text"`
   - **Property**: Creates listing message with property data, sets `type: "listing"`
   - **Location**: Stores coordinates and address, sets `type: "location"`
   - **Audio**: Uploads to Storage, gets URL, sets `type: "audio"`

2. Creates message document with:
   - All message fields
   - `createdAt`: Server timestamp
   - `updatedAt`: Server timestamp
   - `readBy`: `[{uid: senderId, timestamp: Timestamp.now()}]` (sender marked as read)

3. Updates conversation:
   - `lastMessage`: Latest message preview
   - `updatedAt`: Server timestamp

**Example**:
```typescript
const messageId = await sendMessage(
  conversationId,
  userId,
  {
    type: "image",
    text: "Check this out!",
    location: "",
  },
  {
    type: "image",
    file: imageFile,
  }
);
```

---

### `markMessagesAsRead(conversationId, userId)`

**Purpose**: Mark all unread messages in a conversation as read.

**Parameters**:
- `conversationId`: Conversation ID
- `userId`: User UID marking messages as read

**Process**:
1. Fetches all messages where `senderId != userId`
2. Filters messages not yet read by user
3. Updates each message's `readBy` array with:
   - `uid`: User ID
   - `timestamp`: Current timestamp

**Important Notes**:
- Only marks messages from OTHER users (not your own)
- Uses `Timestamp.now()` instead of `serverTimestamp()` because Firestore doesn't support `serverTimestamp()` inside arrays
- Safely reconstructs `readBy` array to avoid including invalid data

**Example**:
```typescript
await markMessagesAsRead(conversationId, userId);
```

---

### `getMessages(conversationId, limitCount?)`

**Purpose**: Get messages for a conversation (one-time fetch, not real-time).

**Parameters**:
- `conversationId`: Conversation ID
- `limitCount`: Maximum messages to fetch (default: 50)

**Returns**: `Promise<MessageWithId[]>`

**Note**: For real-time updates, use `subscribeToMessages()` instead.

---

### `getConversations(userId)`

**Purpose**: Get all conversations for a user (one-time fetch, not real-time).

**Parameters**:
- `userId`: User UID

**Returns**: `Promise<ConversationWithUser[]>`

**Note**: For real-time updates, use `subscribeToConversations()` instead.

---

### `formatMessageTime(timestamp)`

**Purpose**: Format message timestamp to human-readable format.

**Returns**: Formatted string
- "Just now" - Less than 1 minute
- "5m ago" - Minutes ago
- "2h ago" - Hours ago
- "3d ago" - Days ago
- "Jan 15, 2:30 PM" - Older dates

---

## Read Receipts System

### How It Works

1. **When Message is Sent**:
   - Sender is automatically added to `readBy` array with current timestamp
   - `readBy: [{uid: senderId, timestamp: Timestamp.now()}]`

2. **When Message is Read**:
   - `markMessagesAsRead()` is called
   - Adds recipient to `readBy` array
   - Only updates messages from other users

3. **Reading Status**:
   - Check if user ID exists in `readBy` array
   - If yes, message has been read by that user

### Implementation Details

- **Array Structure**: `readBy: [{uid: string, timestamp: Timestamp}[]]`
- **Timestamp Handling**: Uses `Timestamp.now()` instead of `serverTimestamp()` because Firestore doesn't support `serverTimestamp()` inside arrays
- **Safety**: Validates timestamp is a proper `Timestamp` instance before including in updates

---

## Real-Time Updates

### Conversations Subscription

```typescript
useEffect(() => {
  if (!user.uid) return;

  const unsubscribe = subscribeToConversations(user.uid, (conversations) => {
    setConversations(conversations);
  });

  return () => unsubscribe();
}, [user.uid]);
```

**Updates When**:
- New conversation created
- Conversation `updatedAt` changes (new message)
- `lastMessage` changes
- Participant data changes

---

### Messages Subscription

```typescript
useEffect(() => {
  if (!selectedConversation || !user.uid) return;

  const unsubscribe = subscribeToMessages(
    selectedConversation.id,
    (messages) => {
      setMessages(messages);
    }
  );

  return () => unsubscribe();
}, [selectedConversation?.id, user.uid]);
```

**Updates When**:
- New message added to conversation
- Message `readBy` array is updated
- Message content is modified (rare)

---

## UI Components

### MessageInput Component

**Location**: `components/MessageInput.tsx`

**Features**:
- Text input field
- Attachment dropdown (Image, File, Property, Location)
- Audio recording with microphone button
- Preview attachments before sending
- Delete/remove attachment functionality

**Attachment Types Supported**:
- **Image**: File picker for images
- **File**: File picker for documents
- **Property**: Dialog to select from landlord's properties (landlords only)
- **Location**: Uses browser geolocation API
- **Audio**: Uses MediaRecorder API

---

### MessageList Component

**Location**: `components/MessageList.tsx`

**Features**:
- Displays messages in chronological order
- Shows sender avatars/initials
- Renders different message types:
  - Text: Plain text display
  - Image: Clickable image with preview
  - File: Download link with file info
  - Property: Property card with image, title, price, and button
  - Location: Embedded map with "Get directions" button
  - Audio: HTML5 audio player
- Shows read receipts (checkmarks)
- Auto-scrolls to latest message

---

### ConversationList Component

**Location**: `components/ConversationList.tsx`

**Features**:
- Lists all conversations
- Shows other user's avatar and name
- Displays last message preview
- Shows unread count badge
- Search/filter functionality
- Highlights selected conversation

---

## URL Parameters

### Opening Specific Conversation

The messages page supports opening a specific conversation via URL parameter:

```
/dashboard/messages?conversationId={conversationId}
```

**Implementation**:
- Checks for `conversationId` query parameter
- Auto-selects conversation when conversations are loaded
- Used by `MessageButton` component to navigate directly to a conversation

---

## Error Handling

### Location Errors

**Error Code 1 (PERMISSION_DENIED)**:
- User denied location permission
- Solution: Enable in browser settings

**Error Code 2 (POSITION_UNAVAILABLE)**:
- Permission granted but location unavailable
- Common causes:
  - GPS disabled at device level
  - Poor GPS signal
  - Location services disabled
- Solution: Enable GPS/Location Services on device

**Error Code 3 (TIMEOUT)**:
- Location request took too long
- Solution: Check location settings and retry

### Audio Recording Errors

**NotAllowedError**:
- Microphone permission denied
- Solution: Enable microphone access in browser settings

### File Upload Errors

- Network errors during upload
- Storage quota exceeded
- Invalid file type (for images)

All errors are caught and displayed via toast notifications.

---

## Security Considerations

### Permissions

- Users can only access conversations where they are a participant
- Queries filter by `participants` array containing user ID
- Attachment uploads are scoped to conversation and sender

### Data Validation

- Conversation participants array must contain exactly 2 user IDs
- Message `senderId` must be a valid participant
- Attachment types are validated before processing

### Storage Security

- Files stored in user-specific paths: `messages/{conversationId}/{senderId}/...`
- Firebase Storage security rules should restrict access to conversation participants only

---

## Performance Optimizations

### Pagination

- Messages limited to 50 most recent (configurable)
- Conversations loaded in batches if needed
- Older messages can be loaded on scroll (future enhancement)

### Real-Time Efficiency

- Unsubscribes from listeners on component unmount
- Uses `onSnapshot` for efficient real-time updates
- Caches user data to reduce Firestore reads

### Read Receipts

- Only updates messages not already read
- Batch updates for multiple messages
- Uses efficient array filtering

---

## Usage Examples

### Starting a Conversation

```typescript
import { getOrCreateConversation } from "@/lib/messaging";

// From property page - initiate conversation with landlord
const conversationId = await getOrCreateConversation(
  currentUser.uid,
  landlordUid,
  propertyId  // Optional: link to property
);

// Navigate to messages with conversation
router.push(`/dashboard/messages?conversationId=${conversationId}`);
```

### Sending Different Message Types

```typescript
// Text message
await sendMessage(conversationId, userId, {
  type: "text",
  text: "Hello!",
  location: "",
});

// Image message
await sendMessage(conversationId, userId, {
  type: "text",
  text: "Check this out",
  location: "",
}, {
  type: "image",
  file: imageFile,
});

// Location message
await sendMessage(conversationId, userId, {
  type: "location",
  text: "",
  location: "",
}, {
  type: "location",
  location: {
    latitude: 6.4527,
    longitude: 3.3898,
    address: "Lagos, Nigeria",
  },
});
```

### Subscribing to Real-Time Updates

```typescript
// Subscribe to conversations
useEffect(() => {
  const unsubscribe = subscribeToConversations(userId, (conversations) => {
    setConversations(conversations);
  });
  return unsubscribe;
}, [userId]);

// Subscribe to messages
useEffect(() => {
  if (!conversationId) return;
  
  const unsubscribe = subscribeToMessages(conversationId, (messages) => {
    setMessages(messages);
  });
  
  return unsubscribe;
}, [conversationId]);
```

---

## Environment Variables

### Required

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: For reverse geocoding (optional but recommended for location messages)

### Firebase Configuration

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## Future Enhancements

Potential improvements:
- [ ] Message pagination/infinite scroll
- [ ] Voice message transcription
- [ ] Message search within conversation
- [ ] Message reactions
- [ ] Message forwarding
- [ ] Group conversations (multiple participants)
- [ ] Message editing/deletion
- [ ] Typing indicators
- [ ] Delivery status (sent/delivered/read)
- [ ] Message encryption

---

## Troubleshooting

### Messages Not Appearing

1. Check user authentication
2. Verify user is participant in conversation
3. Check Firestore rules allow read access
4. Verify real-time subscriptions are active

### Attachments Not Uploading

1. Check Firebase Storage rules
2. Verify file size limits
3. Check network connectivity
4. Verify Storage bucket configuration

### Location Not Working

1. Check browser geolocation support
2. Verify location permissions granted
3. Ensure GPS/Location Services enabled on device
4. Check for GPS signal (move to better location)

### Audio Recording Issues

1. Check microphone permissions
2. Verify MediaRecorder API support
3. Check browser compatibility (Chrome, Firefox, Safari)
4. Ensure HTTPS (required for MediaRecorder)

---

## Related Files

- **Messaging Library**: `src/lib/messaging.ts`
- **Messages Page**: `src/app/[locale]/(dashboards)/dashboard/messages/page.tsx`
- **MessageInput Component**: `src/app/[locale]/(dashboards)/dashboard/messages/components/MessageInput.tsx`
- **MessageList Component**: `src/app/[locale]/(dashboards)/dashboard/messages/components/MessageList.tsx`
- **ConversationList Component**: `src/app/[locale]/(dashboards)/dashboard/messages/components/ConversationList.tsx`
- **MessageButton Component**: `src/components/shared/MessageButton.tsx`

