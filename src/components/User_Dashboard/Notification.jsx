'use client'

import React, { useState } from 'react';
import { Bell, Trash2, BellOff, Home, Heart, MessageSquare, AlertCircle } from 'lucide-react';

function Notification() {
  // Demo notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'property',
      icon: Home,
      title: 'New Property Available',
      message: 'A new 2-bedroom apartment has been added in Molyko',
      time: '2 days ago',
      read: false
    },
    {
      id: 2,
      type: 'favorite',
      icon: Heart,
      title: 'Property Liked',
      message: 'Someone liked your property listing "Sunny Villa Apartments"',
      time: '3 days ago',
      read: false
    },
    {
      id: 3,
      type: 'message',
      icon: MessageSquare,
      title: 'New Message',
      message: 'You have a new inquiry about Mountain View Residence',
      time: '5 days ago',
      read: true
    },
    {
      id: 4,
      type: 'alert',
      icon: AlertCircle,
      title: 'Rent Due Reminder',
      message: 'Your rent payment is due in 5 days',
      time: '1 week ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      setNotifications([]);
    }
  };

  const handleDeleteOne = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getIconColor = (type) => {
    const colors = {
      property: 'text-blue-500 bg-blue-100',
      favorite: 'text-red-500 bg-red-100',
      message: 'text-green-500 bg-green-100',
      alert: 'text-orange-500 bg-orange-100'
    };
    return colors[type] || 'text-gray-500 bg-gray-100';
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-bold text-xl sm:text-2xl text-gray-700">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            You have {unreadCount} {unreadCount === 1 ? 'new notification' : 'new notifications'}
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors shadow-sm hover:shadow-md self-start sm:self-auto">
            <Trash2 size={18} />
            <span>Delete All</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border p-4 transition-all hover:shadow-md ${
                  !notification.read ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
                }`}>
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`}>
                    <IconComponent size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white self-start">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {notification.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteOne(notification.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <BellOff size={48} className="sm:w-16 sm:h-16 text-gray-300" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            No Notifications
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-md px-4">
            You're all caught up! Check back later for new updates about your properties and activities.
          </p>
        </div>
      )}
    </section>
  );
}

export default Notification;