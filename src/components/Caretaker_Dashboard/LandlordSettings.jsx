'use client'

import React, { useState } from 'react';
import { 
  Moon, Sun, Monitor, FileText, Shield, Cookie, Database, Users, 
  MessageSquare, Bug, Trash2, Share2, Copy, Check, ChevronRight,
  Key, Bell, Lock, Eye, EyeOff, Download, Upload, Mail, Phone,
  CreditCard, Settings as SettingsIcon, Globe, Smartphone,
  Gift
} from 'lucide-react';

export default function LandlordSettings() {
  const [theme, setTheme] = useState('light');
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [bugReport, setBugReport] = useState('');
  const [expandedLegal, setExpandedLegal] = useState(null);
  
  // Landlord-specific permissions
  const [permissions, setPermissions] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    tenantMessages: true,
    maintenanceAlerts: true,
    paymentReminders: true,
    propertyAnalytics: true,
    dataSharing: false,
    locationTracking: false,
    autoRespond: false
  });

  // Cookie preferences
  const [cookiePrefs, setCookiePrefs] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    personalization: true,
    thirdParty: false
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    timezone: 'UTC'
  });

  const referralLink = "https://app.example.com/ref/LANDLORD123";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteAccount = () => {
    console.log('Account deletion initiated');
    setShowDeleteModal(false);
  };

  const handleSendFeedback = () => {
    console.log('Feedback sent:', feedback);
    setFeedback('');
    setShowFeedbackModal(false);
  };

  const handleReportBug = () => {
    console.log('Bug reported:', bugReport);
    setBugReport('');
    setShowBugModal(false);
  };

  const handleExportData = () => {
    console.log('Exporting user data...');
  };

  const togglePermission = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCookie = (key) => {
    if (key === 'essential') return;
    setCookiePrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ];

  const legalItems = [
    { 
      icon: FileText, 
      label: 'Terms of Service', 
      content: 'These Terms of Service govern your use of our platform as a landlord/property manager.'
    },
    { 
      icon: Shield, 
      label: 'Privacy Policy', 
      content: 'We are committed to protecting your privacy and the privacy of your tenants.'
    },
    { 
      icon: Cookie, 
      label: 'Cookie Policy', 
      content: 'Our website uses cookies to enhance your property management experience.'
    },
    { 
      icon: Database, 
      label: 'Data Protection', 
      content: 'As a landlord, you are a data controller for tenant information.'
    }
  ];

  const permissionGroups = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
        { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Get text message alerts' },
        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
        { key: 'tenantMessages', label: 'Tenant Messages', desc: 'Notifications for tenant messages' },
        { key: 'maintenanceAlerts', label: 'Maintenance Alerts', desc: 'Alert for maintenance requests' },
        { key: 'paymentReminders', label: 'Payment Reminders', desc: 'Rent payment notifications' }
      ]
    },
    {
      title: 'Privacy & Data',
      icon: Lock,
      items: [
        { key: 'dataSharing', label: 'Data Sharing', desc: 'Share analytics with partners' },
        { key: 'locationTracking', label: 'Location Tracking', desc: 'Track property visit locations' },
        { key: 'propertyAnalytics', label: 'Property Analytics', desc: 'Enable detailed analytics' }
      ]
    },
    {
      title: 'Communication',
      icon: MessageSquare,
      items: [
        { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional content' },
        { key: 'autoRespond', label: 'Auto-respond', desc: 'Automatic responses to inquiries' }
      ]
    }
  ];

  const cookieTypes = [
    { key: 'essential', label: 'Essential Cookies', desc: 'Required for basic functionality', required: true },
    { key: 'analytics', label: 'Analytics Cookies', desc: 'Help us understand usage patterns', required: false },
    { key: 'marketing', label: 'Marketing Cookies', desc: 'Used for targeted advertising', required: false },
    { key: 'personalization', label: 'Personalization', desc: 'Remember your preferences', required: false },
    { key: 'thirdParty', label: 'Third-party Cookies', desc: 'From external services', required: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Landlord Settings
          </h1>
          <p className="text-gray-600">Manage your premium account preferences, permissions, and privacy settings</p>
        </div>

        {/* Permissions Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Key className="w-6 h-6 text-indigo-600" />
            </div>
            Permissions & Access Control
          </h2>
          
          <div className="space-y-6">
            {permissionGroups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <div key={group.title} className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <GroupIcon className="w-5 h-5 text-indigo-500" />
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.items.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors border border-gray-200"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => togglePermission(item.key)}
                          className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            permissions[item.key] ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              permissions[item.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cookie Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Cookie className="w-6 h-6 text-purple-600" />
            </div>
            Cookie Preferences
          </h2>
          
          <div className="space-y-3">
            {cookieTypes.map((cookie) => (
              <div
                key={cookie.key}
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                  cookie.required 
                    ? 'bg-gray-100 border-gray-300' 
                    : 'bg-gray-50 hover:bg-purple-50 border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {cookie.label}
                    {cookie.required && <span className="ml-2 text-xs text-gray-500">(Required)</span>}
                  </p>
                  <p className="text-sm text-gray-600">{cookie.desc}</p>
                </div>
                <button
                  onClick={() => toggleCookie(cookie.key)}
                  disabled={cookie.required}
                  className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    cookiePrefs[cookie.key] ? 'bg-purple-600' : 'bg-gray-300'
                  } ${cookie.required ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      cookiePrefs[cookie.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-blue-600" />
            </div>
            General Preferences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select 
                value={preferences.language}
                onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select 
                value={preferences.currency}
                onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 text-blue-600" />
            Display Theme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{option.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Database className="w-6 h-6 text-green-600" />
            Data Management
          </h2>
          
          <button
            onClick={handleExportData}
            className="w-full p-4 rounded-xl bg-green-50 hover:bg-green-100 border-2 border-green-200 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Export Your Data</p>
                <p className="text-sm text-gray-600">Download all your information</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-green-600" />
          </button>
        </div>

        {/* Legal & Documentation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-600" />
            Legal & Documentation
          </h2>
          
          <div className="space-y-3">
            {legalItems.map((item, index) => {
              const Icon = item.icon;
              const isExpanded = expandedLegal === index;
              
              return (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedLegal(isExpanded ? null : index)}
                    className="w-full p-4 bg-orange-50 hover:bg-orange-100 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {isExpanded && (
                    <div className="p-4 bg-white border-t">
                      <p className="text-gray-700">{item.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Referral Program - Link to Full Page */}
        <a 
          href="/dashboard/referrals"
          className="block bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <Share2 className="w-6 h-6" />
                Referral Program
              </h2>
              <p className="mb-3 text-indigo-100">Invite other landlords, track your referrals, and earn premium rewards!</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>View Your Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  <span>Track Rewards</span>
                </div>
                <div className="flex items-center gap-2">
                  <Copy className="w-5 h-5" />
                  <span>Share Your Code</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </div>
        </a>

        {/* Feedback & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="p-6 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all"
          >
            <MessageSquare className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Send Feedback</h3>
            <p className="text-gray-600 text-sm">Help us improve</p>
          </button>

          <button
            onClick={() => setShowBugModal(true)}
            className="p-6 rounded-2xl bg-white border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all"
          >
            <Bug className="w-6 h-6 text-red-600 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Report a Bug</h3>
            <p className="text-gray-600 text-sm">Let us know about issues</p>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-2xl shadow-lg p-6 border-2 border-red-200">
          <h2 className="text-2xl font-semibold text-red-900 mb-4 flex items-center gap-2">
            <Trash2 className="w-6 h-6" />
            Danger Zone
          </h2>
          <p className="text-red-700 mb-4">
            Once you delete your account, there is no going back.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Modals */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <Trash2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-center mb-2">Delete Account?</h3>
            <p className="text-gray-600 text-center mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-center mb-4">Send Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your feedback..."
              className="w-full p-3 border rounded-xl min-h-[120px] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSendFeedback}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {showBugModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <Bug className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-center mb-4">Report a Bug</h3>
            <textarea
              value={bugReport}
              onChange={(e) => setBugReport(e.target.value)}
              placeholder="Describe the bug..."
              className="w-full p-3 border rounded-xl min-h-[120px] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowBugModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReportBug}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
