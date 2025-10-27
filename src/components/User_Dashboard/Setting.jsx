import React, { useState } from 'react';
import { Moon, Sun, Monitor, FileText, Shield, Cookie, Database, Users, MessageSquare, Bug, Trash2, Share2, Copy, Check, ChevronRight } from 'lucide-react';

export default function Setting() {
  const [theme, setTheme] = useState('light');
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [bugReport, setBugReport] = useState('');
  const [expandedLegal, setExpandedLegal] = useState(null);
  
  const referralLink = "https://app.example.com/ref/USER123ABC";

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

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ];

  const legalItems = [
    { 
      icon: FileText, 
      label: 'Terms of Service', 
      content: 'These Terms of Service govern your use of our platform and services. By accessing or using our services, you agree to be bound by these terms. We reserve the right to modify these terms at any time, and continued use of the service constitutes acceptance of any changes. Users must be at least 18 years old to use this service. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. We provide our services on an "as is" basis without warranties of any kind.'
    },
    { 
      icon: Shield, 
      label: 'Privacy Policy', 
      content: 'We are committed to protecting your privacy and personal information. This policy explains how we collect, use, and safeguard your data. We collect information you provide directly, such as account details and usage data. Your information is used to provide and improve our services, communicate with you, and ensure security. We do not sell your personal data to third parties. We use industry-standard encryption and security measures to protect your information. You have the right to access, modify, or delete your personal data at any time by contacting our support team.'
    },
    { 
      icon: Cookie, 
      label: 'Cookie Policy', 
      content: 'Our website uses cookies to enhance your browsing experience and provide personalized content. Cookies are small text files stored on your device that help us understand how you use our services. We use essential cookies for basic functionality, analytics cookies to understand user behavior, and preference cookies to remember your settings. You can control cookie preferences through your browser settings. Disabling certain cookies may limit some functionality of our services. Third-party services we integrate may also use cookies in accordance with their own policies.'
    },
    { 
      icon: Database, 
      label: 'Data Protection', 
      content: 'We implement comprehensive data protection measures in compliance with international regulations including GDPR and CCPA. Your data is stored on secure servers with encryption both in transit and at rest. We conduct regular security audits and vulnerability assessments. Access to personal data is restricted to authorized personnel only. We maintain data backup systems to prevent loss. In the event of a data breach, we will notify affected users within 72 hours. You have the right to request data portability, allowing you to transfer your information to another service provider.'
    },
    { 
      icon: Users, 
      label: 'User Policy', 
      content: 'All users must conduct themselves respectfully and lawfully when using our platform. Prohibited activities include harassment, spamming, distribution of malware, unauthorized access attempts, and any form of illegal activity. Users must not impersonate others or create multiple accounts without authorization. Content posted must not infringe on intellectual property rights or contain harmful material. We reserve the right to suspend or terminate accounts that violate these policies. Users are responsible for the content they share and must ensure they have appropriate permissions. Report violations to our moderation team for review.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </div>

        {/* Theme Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sun className="w-5 h-5 text-blue-600" />
            </div>
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
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    theme === option.value ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <p className={`text-sm font-medium ${
                    theme === option.value ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legal & Compliance */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            Legal & Compliance
          </h2>
          <div className="space-y-2">
            {legalItems.map((item, index) => {
              const Icon = item.icon;
              const isExpanded = expandedLegal === index;
              return (
                <div key={item.label} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedLegal(isExpanded ? null : index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700 font-medium">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`} />
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 bg-blue-50/50">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support & Help */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            Support & Help
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                  Send Feedback
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
            <button
              onClick={() => setShowBugModal(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Bug className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                  Report a Bug
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Referral System */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Share2 className="w-6 h-6" />
            Refer a Friend
          </h2>
          <p className="text-blue-100 mb-4">Share your unique referral link and earn rewards!</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 border border-white/30 min-w-0"
            />
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            Danger Zone
          </h2>
          <p className="text-gray-600 mb-4">Once you delete your account, there is no going back.</p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-2">Delete Account?</h3>
            <p className="text-gray-600 text-center mb-6">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-2">Send Feedback</h3>
            <p className="text-gray-600 text-center mb-4">
              We'd love to hear your thoughts!
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your feedback..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none mb-4 resize-none"
              rows="4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendFeedback}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bug Report Modal */}
      {showBugModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bug className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-2">Report a Bug</h3>
            <p className="text-gray-600 text-center mb-4">
              Help us improve by reporting issues
            </p>
            <textarea
              value={bugReport}
              onChange={(e) => setBugReport(e.target.value)}
              placeholder="Describe the bug you encountered..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none mb-4 resize-none"
              rows="4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowBugModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReportBug}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}