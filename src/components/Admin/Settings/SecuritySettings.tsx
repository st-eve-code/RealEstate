'use client'

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Shield, Lock, Key, AlertTriangle, Clock, Plus, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { 
  fetchSettings, 
  updateSettings, 
  resetSettings,
  SecuritySettings as SecuritySettingsType 
} from '@/lib/services/settingsService';

export default function SecuritySettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SecuritySettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ipInput, setIpInput] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await fetchSettings();
      setSettings(data.security);
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
      await updateSettings('security', settings, user.uid, user.displayName || user.email);
      alert('Security settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset to default security settings?')) return;

    try {
      setSaving(true);
      await resetSettings('security');
      await loadSettings();
      alert('Settings reset to defaults');
    } catch (error) {
      console.error('Error resetting settings:', error);
      alert('Failed to reset settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddIp = () => {
    if (!settings || !ipInput.trim()) return;
    
    // Basic IP validation
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(ipInput.trim())) {
      alert('Please enter a valid IP address');
      return;
    }

    setSettings({
      ...settings,
      ipWhitelist: [...settings.ipWhitelist, ipInput.trim()],
    });
    setIpInput('');
  };

  const handleRemoveIp = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      ipWhitelist: settings.ipWhitelist.filter((_, i) => i !== index),
    });
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
          <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
          <p className="text-sm text-gray-600">Configure authentication and security policies</p>
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
        {/* Authentication Settings */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
            <Key size={20} className="text-blue-600" />
            Authentication
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.enableTwoFactor}
                onChange={(e) => setSettings({ ...settings, enableTwoFactor: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-green-600" />
                  <span className="font-medium text-gray-900">Two-Factor Authentication (2FA)</span>
                </div>
                <p className="text-sm text-gray-600">Require users to enable 2FA for enhanced security</p>
              </div>
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  <Clock size={14} className="inline mr-1" />
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="1440"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Automatically log out inactive users</p>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  <AlertTriangle size={14} className="inline mr-1" />
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Lock account after failed attempts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Password Policy */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
            <Lock size={20} className="text-blue-600" />
            Password Policy
          </h3>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Minimum Password Length
            </label>
            <input
              type="number"
              min="6"
              max="32"
              value={settings.passwordMinLength}
              onChange={(e) => setSettings({ ...settings, passwordMinLength: Number(e.target.value) })}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.requireSpecialChars}
                onChange={(e) => setSettings({ ...settings, requireSpecialChars: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Require Special Characters</span>
                <p className="text-sm text-gray-600">Password must contain at least one special character (!@#$%^&*)</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.requireNumbers}
                onChange={(e) => setSettings({ ...settings, requireNumbers: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Require Numbers</span>
                <p className="text-sm text-gray-600">Password must contain at least one number (0-9)</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.requireUppercase}
                onChange={(e) => setSettings({ ...settings, requireUppercase: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Require Uppercase Letters</span>
                <p className="text-sm text-gray-600">Password must contain at least one uppercase letter (A-Z)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Additional Security */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
            <Shield size={20} className="text-blue-600" />
            Additional Security
          </h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.enableCaptcha}
                onChange={(e) => setSettings({ ...settings, enableCaptcha: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Enable CAPTCHA</span>
                <p className="text-sm text-gray-600">Require CAPTCHA verification on login and registration</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={settings.enableAuditLog}
                onChange={(e) => setSettings({ ...settings, enableAuditLog: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Enable Audit Logging</span>
                <p className="text-sm text-gray-600">Track all admin actions and system changes</p>
              </div>
            </label>
          </div>
        </div>

        {/* IP Whitelist */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">IP Whitelist (Admin Access)</h3>
          <p className="mb-3 text-sm text-gray-600">
            Restrict admin dashboard access to specific IP addresses. Leave empty to allow all IPs.
          </p>

          <div className="mb-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIp())}
                placeholder="e.g., 192.168.1.1"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddIp}
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Add IP
              </button>
            </div>
          </div>

          {settings.ipWhitelist.length > 0 ? (
            <div className="space-y-2">
              {settings.ipWhitelist.map((ip, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <span className="font-mono text-sm text-gray-900">{ip}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIp(index)}
                    className="text-red-600 transition-colors hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center border border-gray-200 border-dashed rounded-lg">
              <p className="text-sm text-gray-500">No IP restrictions configured (all IPs allowed)</p>
            </div>
          )}
        </div>

        {/* Security Summary */}
        <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="flex-shrink-0 text-yellow-600" />
            <div>
              <h4 className="font-semibold text-gray-900">Security Summary</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• Two-Factor Auth: <strong>{settings.enableTwoFactor ? 'Enabled' : 'Disabled'}</strong></li>
                <li>• Session Timeout: <strong>{settings.sessionTimeout} minutes</strong></li>
                <li>• Min Password Length: <strong>{settings.passwordMinLength} characters</strong></li>
                <li>• CAPTCHA: <strong>{settings.enableCaptcha ? 'Enabled' : 'Disabled'}</strong></li>
                <li>• IP Restrictions: <strong>{settings.ipWhitelist.length > 0 ? `${settings.ipWhitelist.length} IPs` : 'None'}</strong></li>
              </ul>
            </div>
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
