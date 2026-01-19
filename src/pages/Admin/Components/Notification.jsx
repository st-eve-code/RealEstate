'use client'

import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc,
  doc,
  Timestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { 
  Search, 
  Plus, 
  Eye, 
  X, 
  Send, 
  Clock, 
  Calendar, 
  Users, 
  Bell, 
  Filter,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle,
  Zap,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

function Notification({ isSidebarCollapsed }) {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
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
  }, [searchTerm, filterStatus, filterType, notifications]);

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
      filtered = filtered.filter(n => n.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message) {
      alert('Please fill in title and message');
      return;
    }

    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        status: formData.scheduleNow ? 'sent' : 'scheduled',
        recipients: formData.type === 'all' ? 'all' : formData.type,
        createdAt: Timestamp.now(),
        sentAt: formData.scheduleNow ? Timestamp.now() : null,
        scheduledAt: !formData.scheduleNow && formData.scheduledAt 
          ? Timestamp.fromDate(new Date(formData.scheduledAt))
          : null
      };

      await addDoc(collection(db, 'notifications'), notificationData);
      alert('Notification created successfully');
      setShowModal(false);
      resetForm();
      await fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Failed to create notification');
    }
  };

  const openDeleteModal = (notification) => {
    setNotificationToDelete(notification);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!notificationToDelete) return;

    try {
      await deleteDoc(doc(db, 'notifications', notificationToDelete.id));
      alert('Notification deleted successfully');
      await fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification');
    } finally {
      setNotificationToDelete(null);
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

  const getTypeConfig = (type) => {
    const configs = {
      all: { icon: Users, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-100', text: 'text-blue-700' },
      landlord: { icon: Bell, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-100', text: 'text-purple-700' },
      user: { icon: MessageCircle, color: 'from-green-400 to-green-600', bg: 'bg-green-100', text: 'text-green-700' },
      admin: { icon: Zap, color: 'from-orange-400 to-orange-600', bg: 'bg-orange-100', text: 'text-orange-700' }
    };
    return configs[type] || configs.all;
  };

  const getStatusConfig = (status) => {
    const configs = {
      sent: { color: 'from-green-400 to-green-600', icon: CheckCircle, label: 'Sent' },
      scheduled: { color: 'from-blue-400 to-blue-600', icon: Clock, label: 'Scheduled' },
      draft: { color: 'from-gray-400 to-gray-600', icon: AlertCircle, label: 'Draft' }
    };
    return configs[status] || configs.draft;
  };

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length,
    draft: notifications.filter(n => n.status === 'draft').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-16 lg:ml-16' : 'md:ml-64 lg:ml-64'
    }`}>
      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Bell size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Notifications Management</h1>
                <p className="text-gray-600">Send and manage system notifications</p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <Plus size={20} />
              <span>New Notification</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Total Notifications</div>
              <Bell size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">All notifications</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Sent</div>
              <CheckCircle size={20} className="text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.sent}</div>
            <div className="text-xs text-gray-500 mt-1">Delivered</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Scheduled</div>
              <Clock size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.scheduled}</div>
            <div className="text-xs text-gray-500 mt-1">Pending send</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-gray-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Drafts</div>
              <AlertCircle size={20} className="text-gray-500" />
            </div>
            <div className="text-3xl font-bold text-gray-600">{stats.draft}</div>
            <div className="text-xs text-gray-500 mt-1">Not sent</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Users</option>
                <option value="landlord">Landlords</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <Bell size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first notification'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
              >
                <Plus size={20} />
                <span>Create First Notification</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const typeConfig = getTypeConfig(notification.type);
              const statusConfig = getStatusConfig(notification.status);
              const TypeIcon = typeConfig.icon;
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={notification.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left: Type Indicator */}
                    <div className={`md:w-2 bg-gradient-to-b ${typeConfig.color}`}></div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Title and Badges */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-2 rounded-xl ${typeConfig.bg}`}>
                              <TypeIcon size={24} className={typeConfig.text} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {notification.title}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {/* Status Badge */}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm bg-gradient-to-r ${statusConfig.color} text-white`}>
                                  <StatusIcon size={14} />
                                  {statusConfig.label}
                                </span>
                                {/* Type Badge */}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${typeConfig.bg} ${typeConfig.text}`}>
                                  <TypeIcon size={14} />
                                  {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Message Preview */}
                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {notification.message}
                          </p>

                          {/* Meta Info */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} />
                              <span>Created: {notification.createdAt?.toDate ? new Date(notification.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            {notification.scheduledAt && (
                              <div className="flex items-center gap-1.5">
                                <Clock size={14} />
                                <span>Scheduled: {new Date(notification.scheduledAt.toDate()).toLocaleString()}</span>
                              </div>
                            )}
                            {notification.sentAt && (
                              <div className="flex items-center gap-1.5">
                                <Send size={14} />
                                <span>Sent: {new Date(notification.sentAt.toDate()).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openViewModal(notification)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(notification)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600 text-center">
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </div>
      </div>

      {/* Create Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Create New Notification</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Notification title"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  placeholder="Notification message"
                  required
                />
              </div>

              {/* Recipient Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send To
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="landlord">Landlords Only</option>
                  <option value="user">Users Only</option>
                  <option value="admin">Admins Only</option>
                </select>
              </div>

              {/* Scheduling */}
              <div>
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.scheduleNow}
                    onChange={(e) => setFormData({ ...formData, scheduleNow: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Send immediately</span>
                </label>

                {!formData.scheduleNow && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule For
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md font-medium"
                >
                  <Send size={20} />
                  <span>{formData.scheduleNow ? 'Send Now' : 'Schedule'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Notification Details</h2>
              <button
                onClick={() => { setShowViewModal(false); setSelectedNotification(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <p className="text-lg font-semibold text-gray-900">{selectedNotification.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl">
                  {selectedNotification.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${getStatusConfig(selectedNotification.status).color} text-white`}>
                    {React.createElement(getStatusConfig(selectedNotification.status).icon, { size: 14 })}
                    {selectedNotification.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getTypeConfig(selectedNotification.type).bg} ${getTypeConfig(selectedNotification.type).text}`}>
                    {React.createElement(getTypeConfig(selectedNotification.type).icon, { size: 14 })}
                    {selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                  <p className="text-gray-900">
                    {selectedNotification.createdAt?.toDate ? new Date(selectedNotification.createdAt.toDate()).toLocaleString() : 'N/A'}
                  </p>
                </div>
                {selectedNotification.sentAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Sent</label>
                    <p className="text-gray-900">
                      {new Date(selectedNotification.sentAt.toDate()).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => { setShowViewModal(false); setSelectedNotification(null); }}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setNotificationToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Notification"
        message={`Are you sure you want to delete "${notificationToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </section>
  );
}

export default Notification;
