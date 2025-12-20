import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function ConversationList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation 
}) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm">No conversations yet</p>
        <p className="text-xs mt-1 opacity-75">Start a new conversation to get started</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => {
        const isSelected = selectedConversation === conversation.id;
        const lastMessageTime = conversation.lastMessage?.timestamp?.toDate 
          ? conversation.lastMessage.timestamp.toDate() 
          : null;
        
        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`p-4 cursor-pointer transition-colors ${
              isSelected
                ? 'bg-blue-50 border-l-4 border-l-blue-600'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                {conversation.otherUser?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {conversation.otherUser?.displayName || 'Unknown User'}
                  </h3>
                  {conversation.unread && (
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 truncate mb-1">
                  {conversation.lastMessage?.text || 'No messages yet'}
                </p>
                
                {lastMessageTime && (
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(lastMessageTime, { addSuffix: true })}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

