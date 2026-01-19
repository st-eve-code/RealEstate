'use client'

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Bell, Mail, MessageSquare, Send, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { 
  fetchSettings, 
  updateSettings, 
  resetSettings,
  NotificationSettings as NotificationSettingsType 
} from '@/lib/services/settingsService';

export default function NotificationSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await fetchSettings();
      setSettings(data.notification);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !user) return;

    try {
      setSaving(true);
      await updateSettings('notification', settings, user.uid, user.displayName || user.email);
      alert('Notification settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset to default notification settings?')) return;

    try {
      setSaving(true);
      await resetSettings('notification');
      await loadSettings();
      alert('Settings reset to defaults');
    } catch (error) {
      console.error('Error resetting settings:', error);
      alert('Failed to reset settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      // In a real implementation, this would send a test email
      setTestEmailSent(true);
      setTimeout(() => setTestEmailSent(false), 3000);
      alert('Test email functionality will be implemented with email service');
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Failed to send test email');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <p className="text-red-600">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
          <p className="text-sm text-gray-600">Configure notification channels and preferences</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <RefreshCw size={16} />
          Reset to Defaults
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notification Channels */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
            <Bell size={20} className="text-blue-600" />
            Notification Channels
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.enablePushNotifications}
                onChange={(e) => setSettings({ ...settings, enablePushNotifications: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-blue-600" />
                  <span className="font-medium text-gray-900">Push Notifications</span>
                </div>
                <p className="text-sm text-gray-600">Send browser push notifications to users</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.enableEmailNotifications}
                onChange={(e) => setSettings({ ...settings, enableEmailNotifications: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-blue-600" />
                  <span className="font-medium text-gray-900">Email Notifications</span>
                </div>
                <p className="text-sm text-gray-600">Send email notifications to users and admins</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.enableSmsNotifications}
                onChange={(e) => setSettings({ ...settings, enableSmsNotifications: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-blue-600" />
                  <span className="font-medium text-gray-900">SMS Notifications</span>
                </div>
                <p className="text-sm text-gray-600">Send SMS notifications for critical events (requires SMS service)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Event Notifications */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Event Notifications</h3>
          <p className="mb-4 text-sm text-gray-600">Choose which events trigger notifications to admins</p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.notifyOnNewProperty}
                onChange={(e) => setSettings({ ...settings, notifyOnNewProperty: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">New Property Listings</span>
                <p className="text-sm text-gray-600">Notify when a new property is listed on the platform</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.notifyOnNewUser}
                onChange={(e) => setSettings({ ...settings, notifyOnNewUser: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">New User Registrations</span>
                <p className="text-sm text-gray-600">Notify when a new user registers</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.notifyOnSubscription}
                onChange={(e) => setSettings({ ...settings, notifyOnSubscription: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Subscription Changes</span>
                <p className="text-sm text-gray-600">Notify when users subscribe or update their plans</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.notifyOnTransaction}
                onChange={(e) => setSettings({ ...settings, notifyOnTransaction: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Payment Transactions</span>
                <p className="text-sm text-gray-600">Notify on successful or failed payment transactions</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.notifyOnReport}
                onChange={(e) => setSettings({ ...settings, notifyOnReport: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">User Reports & Issues</span>
                <p className="text-sm text-gray-600">Notify when users report properties or submit issues</p>
              </div>
            </label>
          </div>
        </div>

        {/* Report Settings */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Daily Reports</h3>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Daily Report Email Address
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                value={settings.dailyReportEmail}
                onChange={(e) => setSettings({ ...settings, dailyReportEmail: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
              />
              <button
                type="button"
                onClick={handleTestEmail}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 transition-colors border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                {testEmailSent ? (
                  <>
                    <Check size={18} />
                    Sent
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Test
                  </>
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Receive daily summary reports at this email address</p>
          </div>
        </div>

        {/* Notification Preview */}
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h4 className="mb-3 font-semibold text-gray-900">Active Notification Channels</h4>
          <div className="flex flex-wrap gap-2">
            {settings.enablePushNotifications && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 border border-blue-200 rounded-full">
                <Bell size={14} />
                Push
              </span>
            )}
            {settings.enableEmailNotifications && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-green-800 bg-green-100 border border-green-200 rounded-full">
                <Mail size={14} />
                Email
              </span>
            )}
            {settings.enableSmsNotifications && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 border border-purple-200 rounded-full">
                <MessageSquare size={14} />
                SMS
              </span>
            )}
            {!settings.enablePushNotifications && !settings.enableEmailNotifications && !settings.enableSmsNotifications && (
              <span className="text-sm text-gray-600">No notification channels enabled</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            type="button"
            onClick={loadSettings}
            className="px-6 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
