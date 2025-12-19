import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Search, Plus, Eye, X, Send, Clock, Calendar, Users, Bell, Filter } from 'lucide-react';

function Notification({ isSidebarCollapsed }) {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'all',
    scheduledAt: '',
    scheduleNow: true
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [searchTerm, filterStatus, notifications]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const notificationsRef = collection(db, 'notifications');
      const q = query(notificationsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const notificationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(notif => notif.status === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(notif =>
        notif.title.toLowerCase().includes(term) ||
        notif.message.toLowerCase().includes(term)
      );
    }

    setFilteredNotifications(filtered);
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        status: formData.scheduleNow ? 'sent' : 'scheduled',
        createdAt: Timestamp.now(),
        scheduledAt: formData.scheduleNow ? undefined : Timestamp.fromDate(new Date(formData.scheduledAt)),
        sentAt: formData.scheduleNow ? Timestamp.now() : undefined,
        recipients: Math.floor(Math.random() * 1000) + 100 // Mock recipients count
      };

      await addDoc(collection(db, 'notifications'), notificationData);
      await fetchNotifications();
      setShowModal(false);
      resetForm();
      alert('Notification created successfully');
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Failed to create notification');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'all',
      scheduledAt: '',
      scheduleNow: true
    });
  };

  const openViewModal = (notification) => {
    setSelectedNotification(notification);
    setShowViewModal(true);
  };

  if (loading) {
    return (
      <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
      }`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Notifications Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Create Notification
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notifications found
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div key={notification.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.status === 'sent' 
                          ? 'bg-green-100 text-green-800' 
                          : notification.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notification.status}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {notification.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {notification.recipients || 0} recipients
                      </span>
                      {notification.scheduledAt && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          Scheduled: {notification.scheduledAt.toDate ? new Date(notification.scheduledAt.toDate()).toLocaleString() : 'N/A'}
                        </span>
                      )}
                      {notification.sentAt && (
                        <span className="flex items-center gap-1">
                          <Send size={14} />
                          Sent: {notification.sentAt.toDate ? new Date(notification.sentAt.toDate()).toLocaleString() : 'N/A'}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Created: {notification.createdAt.toDate ? new Date(notification.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openViewModal(notification)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors ml-4"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </div>
      </div>

      {/* Create Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Notification</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateNotification}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                    <option value="all">All Users</option>
                    <option value="user">Users Only</option>
                    <option value="landlord">Landlords Only</option>
                    <option value="admin">Admins Only</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.scheduleNow}
                      onChange={(e) => setFormData({ ...formData, scheduleNow: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Send immediately</span>
                  </label>
                </div>
                {!formData.scheduleNow && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date & Time</label>
                    <input
                      type="datetime-local"
                      required={!formData.scheduleNow}
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Send size={16} className="inline mr-2" />
                  {formData.scheduleNow ? 'Send Now' : 'Schedule'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Notification Modal */}
      {showViewModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Notification Details</h2>
              <button onClick={() => { setShowViewModal(false); setSelectedNotification(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900">{selectedNotification.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedNotification.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Type</label>
                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {selectedNotification.type}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  selectedNotification.status === 'sent' 
                    ? 'bg-green-100 text-green-800' 
                    : selectedNotification.status === 'scheduled'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedNotification.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                <p className="text-gray-900">{selectedNotification.recipients || 0}</p>
              </div>
              {selectedNotification.scheduledAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled At</label>
                  <p className="text-gray-900">
                    {selectedNotification.scheduledAt.toDate ? new Date(selectedNotification.scheduledAt.toDate()).toLocaleString() : 'N/A'}
                  </p>
                </div>
              )}
              {selectedNotification.sentAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sent At</label>
                  <p className="text-gray-900">
                    {selectedNotification.sentAt.toDate ? new Date(selectedNotification.sentAt.toDate()).toLocaleString() : 'N/A'}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <button
                onClick={() => { setShowViewModal(false); setSelectedNotification(null); }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Notification;