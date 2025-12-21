import React, { useEffect, useState, useRef } from 'react';
import { subscribeToConversations, subscribeToMessages, sendMessage, markMessagesAsRead } from '@/lib/messaging';
import { useAuth } from '@/lib/auth-context';
import { useMessaging } from './MessagingProvider';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ConversationPopup({ isOpen, conversationId, onClose }) {
  const { user } = useAuth();
  const { openConversation } = useMessaging();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(conversationId);

  useEffect(() => {
    let unsubC;
    if (user) {
      unsubC = subscribeToConversations(user.uid, (convs) => setConversations(convs));
    }
    return () => unsubC && unsubC();
  }, [user]);

  useEffect(() => {
    if (conversationId) {
      setSelectedConversation(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    let unsubM;
    if (selectedConversation && user) {
      unsubM = subscribeToMessages(selectedConversation, (msgs) => {
        setMessages(msgs);
        markMessagesAsRead(selectedConversation, user.uid).catch(console.error);
      });
    }
    return () => unsubM && unsubM();
  }, [selectedConversation, user]);

  if (!isOpen) return null;

  const handleSend = async ({ text, file }) => {
    if (!selectedConversation || !user) return;
    
    const msg = { type: 'text', text: text.trim() };
    const attachment = file ? { type: file.type.startsWith('image') ? 'image' : 'file', file } : undefined;
    
    try {
      await sendMessage(selectedConversation, user.uid, msg, attachment);
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message');
    }
  };

  const handleSelectConversation = (id) => {
    setSelectedConversation(id);
    openConversation(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Conversations Sidebar */}
          <aside className="w-80 border-r border-gray-200 flex flex-col bg-white overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
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
    </div>
  );
}

