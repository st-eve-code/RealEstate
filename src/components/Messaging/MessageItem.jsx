'use client'

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function MessageItem({ message, currentUserId }) {
  const isMine = message.senderId === currentUserId;
  const timestamp = message.createdAt?.toDate ? message.createdAt.toDate() : null;
  
  return (
    <div className={`flex mb-4 ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[75%] md:max-w-[60%] ${isMine ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
        {/* Avatar placeholder */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${
          isMine 
            ? 'from-blue-500 to-blue-600' 
            : 'from-gray-400 to-gray-500'
        } flex items-center justify-center text-white text-sm font-semibold`}>
          {isMine ? 'You' : 'U'}
        </div>
        
        {/* Message content */}
        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-2xl px-4 py-2 shadow-sm ${
            isMine
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          }`}>
            {/* Text content */}
            {message.text && (
              <p className={`text-sm ${isMine ? 'text-white' : 'text-gray-900'} whitespace-pre-wrap break-words`}>
                {message.text}
              </p>
            )}
            
            {/* Image attachment */}
            {message.additional?.imageUrl && (
              <div className="mt-2 rounded-lg overflow-hidden">
                <img 
                  src={message.additional.imageUrl} 
                  alt="attachment" 
                  className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.additional.imageUrl, '_blank')}
                />
              </div>
            )}
            
            {/* File attachment */}
            {message.additional?.fileUrl && (
              <div className={`mt-2 p-2 rounded-lg border ${
                isMine 
                  ? 'bg-blue-500 border-blue-400' 
                  : 'bg-white border-gray-300'
              }`}>
                <a 
                  href={message.additional.fileUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className={`text-xs flex items-center gap-2 hover:underline ${
                    isMine ? 'text-blue-100' : 'text-blue-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate max-w-[200px]">
                    {message.additional.fileName || 'Download file'}
                  </span>
                  {message.additional.fileSize && (
                    <span className="text-xs opacity-75">
                      ({(message.additional.fileSize / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </a>
              </div>
            )}
            
            {/* Audio attachment */}
            {message.additional?.audioUrl && (
              <div className="mt-2">
                <audio 
                  controls 
                  src={message.additional.audioUrl}
                  className="w-full max-w-xs"
                />
              </div>
            )}
            
            {/* Property listing */}
            {message.additional?.title && message.additional?.button && (
              <div className={`mt-2 rounded-lg overflow-hidden border ${
                isMine 
                  ? 'bg-blue-500 border-blue-400' 
                  : 'bg-white border-gray-300'
              }`}>
                {message.additional.imageUrl && (
                  <img 
                    src={message.additional.imageUrl} 
                    alt={message.additional.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-3">
                  <h4 className={`font-semibold text-sm mb-1 ${
                    isMine ? 'text-white' : 'text-gray-900'
                  }`}>
                    {message.additional.title}
                  </h4>
                  {message.additional.button?.[0]?.link && (
                    <a
                      href={message.additional.button[0].link}
                      className={`inline-block mt-2 px-3 py-1 rounded text-xs font-medium transition-colors ${
                        isMine
                          ? 'bg-white text-blue-600 hover:bg-blue-50'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {message.additional.button[0].text || 'View Property'}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          {timestamp && (
            <span className={`text-xs mt-1 px-2 text-gray-500`}>
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

