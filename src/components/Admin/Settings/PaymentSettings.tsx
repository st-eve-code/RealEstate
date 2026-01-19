'use client'

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, DollarSign, CreditCard, Percent, Key, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { 
  fetchSettings, 
  updateSettings, 
  resetSettings,
  PaymentSettings as PaymentSettingsType 
} from '@/lib/services/settingsService';
import AlertModal, { AlertType } from './AlertModal';
import ConfirmModal from './ConfirmModal';

export default function PaymentSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PaymentSettingsType | null>(null);
  const [originalSettings, setOriginalSettings] = useState<PaymentSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState({
    momo: false,
    orange: false,
    paypal: false,
    stripe: false,
  });
  const [alert, setAlert] = useState<{ isOpen: boolean; type: AlertType; title: string; message: string }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await fetchSettings();
      setSettings(data.payment);
      setOriginalSettings(data.payment);
    } catch (error) {
      console.error('Error loading settings:', error);
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Error Loading Settings',
        message: 'Failed to load payment settings. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    if (!settings || !originalSettings) return false;
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !user || !hasChanges()) return;

    try {
      setSaving(true);
      await updateSettings('payment', settings, user.uid, user.displayName || user.email);
      setOriginalSettings(settings);
      setAlert({
        isOpen: true,
        type: 'success',
        title: 'Settings Saved',
        message: 'Payment settings have been saved successfully!',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save payment settings. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      await resetSettings('payment');
      await loadSettings();
      setAlert({
        isOpen: true,
        type: 'success',
        title: 'Settings Reset',
        message: 'Payment settings have been reset to defaults successfully!',
      });
    } catch (error) {
      console.error('Error resetting settings:', error);
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Reset Failed',
        message: 'Failed to reset payment settings. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalSettings) {
      setSettings(originalSettings);
    }
  };

  const toggleApiKeyVisibility = (key: keyof typeof showApiKeys) => {
    setShowApiKeys({ ...showApiKeys, [key]: !showApiKeys[key] });
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
    <>
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
      <ConfirmModal
        isOpen={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleReset}
        title="Reset Payment Settings?"
        message="Are you sure you want to reset all payment settings to their default values? This will clear all API keys and payment configurations."
        confirmText="Yes, Reset"
        cancelText="No, Keep Current"
        type="warning"
      />
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Settings</h2>
          <p className="text-sm text-gray-600">Configure payment methods and transaction settings</p>
        </div>
        <button
          onClick={() => setConfirmReset(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <RefreshCw size={16} />
          Reset to Defaults
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Currency Settings */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
            <DollarSign size={20} className="text-blue-600" />
            Currency Settings
          </h3>
          <div className="max-w-xs">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Default Currency *
            </label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="XAF">XAF (CFA Franc)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="GBP">GBP (British Pound)</option>
            </select>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
            <CreditCard size={20} className="text-blue-600" />
            Payment Methods
          </h3>
          
          <div className="space-y-6">
            {/* Mobile Money */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.momo}
                  onChange={(e) => setSettings({
                    ...settings,
                    paymentMethods: { ...settings.paymentMethods, momo: e.target.checked }
                  })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">MTN Mobile Money</span>
                  <p className="text-sm text-gray-600">Enable MTN Mobile Money payments</p>
                </div>
              </label>
              {settings.paymentMethods.momo && (
                <div className="relative">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    <Key size={14} className="inline mr-1" />
                    MTN MoMo API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKeys.momo ? 'text' : 'password'}
                      value={settings.momoApiKey || ''}
                      onChange={(e) => setSettings({ ...settings, momoApiKey: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your MTN MoMo API key"
                    />
                    <button
                      type="button"
                      onClick={() => toggleApiKeyVisibility('momo')}
                      className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                    >
                      {showApiKeys.momo ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Orange Money */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.orangeMoney}
                  onChange={(e) => setSettings({
                    ...settings,
                    paymentMethods: { ...settings.paymentMethods, orangeMoney: e.target.checked }
                  })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Orange Money</span>
                  <p className="text-sm text-gray-600">Enable Orange Money payments</p>
                </div>
              </label>
              {settings.paymentMethods.orangeMoney && (
                <div className="relative">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    <Key size={14} className="inline mr-1" />
                    Orange Money API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKeys.orange ? 'text' : 'password'}
                      value={settings.orangeApiKey || ''}
                      onChange={(e) => setSettings({ ...settings, orangeApiKey: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your Orange Money API key"
                    />
                    <button
                      type="button"
                      onClick={() => toggleApiKeyVisibility('orange')}
                      className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                    >
                      {showApiKeys.orange ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PayPal */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.paypal}
                  onChange={(e) => setSettings({
                    ...settings,
                    paymentMethods: { ...settings.paymentMethods, paypal: e.target.checked }
                  })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">PayPal</span>
                  <p className="text-sm text-gray-600">Enable PayPal payments</p>
                </div>
              </label>
              {settings.paymentMethods.paypal && (
                <div className="relative">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    <Key size={14} className="inline mr-1" />
                    PayPal Client ID
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKeys.paypal ? 'text' : 'password'}
                      value={settings.paypalClientId || ''}
                      onChange={(e) => setSettings({ ...settings, paypalClientId: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your PayPal Client ID"
                    />
                    <button
                      type="button"
                      onClick={() => toggleApiKeyVisibility('paypal')}
                      className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                    >
                      {showApiKeys.paypal ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Stripe */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.stripe}
                  onChange={(e) => setSettings({
                    ...settings,
                    paymentMethods: { ...settings.paymentMethods, stripe: e.target.checked }
                  })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Stripe</span>
                  <p className="text-sm text-gray-600">Enable Stripe card payments</p>
                </div>
              </label>
              {settings.paymentMethods.stripe && (
                <div className="space-y-3">
                  <div className="relative">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      <Key size={14} className="inline mr-1" />
                      Stripe Public Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKeys.stripe ? 'text' : 'password'}
                        value={settings.stripePublicKey || ''}
                        onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="pk_..."
                      />
                      <button
                        type="button"
                        onClick={() => toggleApiKeyVisibility('stripe')}
                        className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                      >
                        {showApiKeys.stripe ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      <Key size={14} className="inline mr-1" />
                      Stripe Secret Key
                    </label>
                    <input
                      type="password"
                      value={settings.stripeSecretKey || ''}
                      onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="sk_..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Settings */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
            <Percent size={20} className="text-blue-600" />
            Transaction Settings
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Commission Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.commissionRate}
                onChange={(e) => setSettings({ ...settings, commissionRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Platform commission on each transaction</p>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Tax applied to transactions</p>
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Additional Options</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.enableAutoRefund}
                onChange={(e) => setSettings({ ...settings, enableAutoRefund: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Enable Automatic Refunds</span>
                <p className="text-sm text-gray-600">Automatically process refunds for failed transactions</p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving || !hasChanges()}
            className="flex items-center gap-2 px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={!hasChanges()}
            className="px-6 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
