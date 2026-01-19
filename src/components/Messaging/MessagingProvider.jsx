'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import ConversationPopup from './ConversationPopup';
import { useAuth } from '@/lib/auth-context';
import { getOrCreateConversation } from '@/lib/messaging';

const MessagingContext = createContext();

export const useMessaging = () => useContext(MessagingContext);

export function MessagingProvider({ children }) {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const openConversationWithUser = useCallback(async (otherUserId, propertyId) => {
    if (!user) return null;
    const id = await getOrCreateConversation(user.uid, otherUserId, propertyId);
    setConversationId(id);
    setShowPopup(true);
    return id;
  }, [user]);

  const openConversation = useCallback((id) => {
    setConversationId(id);
    setShowPopup(true);
  }, []);

  const close = useCallback(() => {
    setShowPopup(false);
    setConversationId(null);
  }, []);

  return (
    <MessagingContext.Provider value={{ showPopup, conversationId, openConversationWithUser, openConversation, close, setShowPopup }}>
      {children}
      <ConversationPopup isOpen={showPopup} conversationId={conversationId} onClose={close} />
    </MessagingContext.Provider>
  );
}

export default MessagingContext;

