import { collection, query, where, getDocs, addDoc, serverTimestamp, onSnapshot, orderBy, limit, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { uploadFile, uploadFiles } from '@/lib/services/mediaUploadService';

export async function getOrCreateConversation(currentUserId: string, otherUserId: string, propertyId?: string) {
  // Look for conversation that has both participants
  const conversationsRef = collection(db, 'conversations');
  const q = query(conversationsRef, where('participants', 'array-contains', currentUserId));
  const snapshot = await getDocs(q);
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const participants: string[] = data.participants || [];
    if (participants.includes(otherUserId)) {
      return docSnap.id;
    }
  }

  // Create a new conversation
  const newConv = await addDoc(conversationsRef, {
    participants: [currentUserId, otherUserId],
    propertyId: propertyId || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return newConv.id;
}

export function subscribeToConversations(userId: string, callback: (convs: any[]) => void) {
  const conversationsRef = collection(db, 'conversations');
  const q = query(conversationsRef, where('participants', 'array-contains', userId), orderBy('updatedAt', 'desc')) as any;
  const unsub = onSnapshot(q, async (snap) => {
    const convs: any[] = [];
    for (const d of snap.docs) {
      const data = { id: d.id, ...d.data() } as any;
      // compute basic unread indicator from lastMessage
      const lastMessage = data.lastMessage || null;
      data.unread = lastMessage && (!lastMessage.readBy || !(lastMessage.readBy || []).some((r: any) => r.uid === userId));
      
      // Fetch other user's data
      const participants: string[] = data.participants || [];
      const otherUserId = participants.find((p: string) => p !== userId);
      if (otherUserId) {
        try {
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          if (userDoc.exists()) {
            data.otherUser = { id: userDoc.id, ...userDoc.data() };
          } else {
            data.otherUser = { id: otherUserId, displayName: 'Unknown User' };
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          data.otherUser = { id: otherUserId, displayName: 'Unknown User' };
        }
      }
      
      convs.push(data);
    }
    callback(convs);
  });
  return unsub;
}

export function subscribeToMessages(conversationId: string, callback: (messages: any[]) => void, limitCount = 50) {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(limitCount)) as any;
  const unsub = onSnapshot(q, (snap) => {
    const messages: any[] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // reverse to chronological
    callback(messages.reverse());
  });
  return unsub;
}

export async function sendMessage(conversationId: string, senderId: string, message: any, attachment?: { type: string; file?: File | File[]; property?: any }) {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  let additional: any = {};

  if (attachment) {
    if (attachment.type === 'image' && attachment.file instanceof File) {
      const res = await uploadFile(attachment.file as File, conversationId, 'message', 'image');
      if (res.success) additional.imageUrl = res.url;
      else additional.error = res.error;
    }

    if (attachment.type === 'file' && attachment.file instanceof File) {
      const res = await uploadFile(attachment.file as File, conversationId, 'files', 'file');
      if (res.success) {
        additional.fileUrl = res.url;
        additional.fileName = res.fileName;
        additional.fileSize = attachment.file.size;
        additional.fileType = attachment.file.type;
      } else {
        additional.error = res.error;
      }
    }

    if (attachment.type === 'audio' && attachment.file instanceof File) {
      const res = await uploadFile(attachment.file as File, conversationId, 'audio', 'file');
      if (res.success) additional.audioUrl = res.url;
      else additional.error = res.error;
    }

    if (attachment.type === 'property' && attachment.property) {
      // Embed property info directly into additional
      const p = attachment.property;
      additional.imageUrl = p.images && p.images.length ? p.images[0].urls[0] : null;
      additional.title = p.title;
      additional.button = [{ text: 'Open Listing', link: `/dashboard/property/${p.id}` }];
    }
  }

  const docRef = await addDoc(messagesRef, {
    senderId,
    type: message.type || 'text',
    text: message.text || '',
    location: message.location || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    readBy: [],
    additional
  });

  // Update conversation lastMessage
  const convRef = doc(db, 'conversations', conversationId);
  await updateDoc(convRef, {
    lastMessage: {
      text: message.text || (additional && additional.title) || '',
      type: message.type || 'text',
      senderId,
      timestamp: serverTimestamp(),
      readBy: []
    },
    updatedAt: serverTimestamp()
  });

  return docRef.id;
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, where('senderId', '!=', userId)) as any;
  const snap = await getDocs(q);
  const updates: Promise<any>[] = [];
  snap.forEach((d) => {
    const data = d.data();
    const already = (data.readBy || []).some((r: any) => r.uid === userId);
    if (!already) {
      updates.push(updateDoc(d.ref, { readBy: [...(data.readBy || []), { uid: userId, timestamp: serverTimestamp() }] }));
    }
  });
  await Promise.all(updates);
}

export async function getMessages(conversationId: string, limitCount = 50) {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(limitCount)) as any;
  const snap = await getDocs(q);
  const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() })).reverse();
  return messages;
}

export async function getConversations(userId: string) {
  const conversationsRef = collection(db, 'conversations');
  const q = query(conversationsRef, where('participants', 'array-contains', userId), orderBy('updatedAt', 'desc')) as any;
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
