'use client'

import React, { useEffect, useState } from 'react';
import { subscribeToConversations, subscribeToMessages, sendMessage, markMessagesAsRead } from '@/lib/messaging';
import { useAuth } from '@/lib/auth-context';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to conversations
  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    const unsub = subscribeToConversations(user.uid, (convs) => {
      setConversations(convs);
      setLoading(false);
    });
    
    return () => unsub && unsub();
  }, [user]);

  // Subscribe to messages when conversation is selected
  useEffect(() => {
    let unsub;
    if (selectedConversation && user) {
      unsub = subscribeToMessages(selectedConversation, (msgs) => {
        setMessages(msgs);
        // Mark messages as read when viewing
        markMessagesAsRead(selectedConversation, user.uid).catch(console.error);
      });
    } else {
      setMessages([]);
    }
    return () => unsub && unsub();
  }, [selectedConversation, user]);

  const handleSend = async ({ text, file }) => {
    if (!selectedConversation || !user) return;
    
    const msg = { type: 'text', text: text.trim() };
    let attachment;
    
    if (file) {
      const attachmentType = file.type.startsWith('image') ? 'image' : 'file';
      attachment = { type: attachmentType, file };
    }
    
    try {
      await sendMessage(selectedConversation, user.uid, msg, attachment);
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] min-h-[600px] flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Conversations Sidebar */}
        <aside className="w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              <div className="text-sm text-gray-500">
                {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
              </div>
            </div>
          </div>
          
          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
          </div>
        </aside>

        {/* Messages Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {selectedConversation ? (
            <>
              {/* Messages Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <h3 className="text-lg font-semibold text-gray-900">
                  {conversations.find(c => c.id === selectedConversation)?.otherUser?.displayName || 'Conversation'}
                </h3>
              </div>
              
              {/* Messages List */}
              <MessageList messages={messages} currentUserId={user?.uid} />
              
              {/* Message Input */}
              <MessageInput onSend={handleSend} disabled={!selectedConversation} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-8">
                <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the sidebar to view messages</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

