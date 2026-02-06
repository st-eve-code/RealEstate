'use client'

import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';

export default function MessageList({ messages, currentUserId }) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-lg font-medium">No messages yet</p>
        <p className="text-sm mt-1 opacity-75">Start the conversation by sending a message</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-1 bg-gray-50"
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} currentUserId={currentUserId} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

