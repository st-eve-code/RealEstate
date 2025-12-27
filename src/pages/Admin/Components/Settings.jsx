import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../lib/auth-context';
import { updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Save, Database, HardDrive, Globe, Palette, User, Key, Server } from 'lucide-react';

function Settings({ isSidebarCollapsed }) {
  const location = useLocation();

  const settingsItems = [
    { name: 'Profile', path: '/dashboard/settings/profile', description: 'Manage your profile settings', icon: User },
    { name: 'Tables', path: '/dashboard/settings/tables', description: 'Database configuration', icon: Database },
    { name: 'Storage', path: '/dashboard/settings/storage', description: 'Storage settings', icon: HardDrive },
    { name: 'Api Gateway', path: '/dashboard/settings/api-gateway', description: 'API Gateway management', icon: Globe },
    { name: 'Theme', path: '/dashboard/settings/theme', description: 'Theme customization', icon: Palette },
  ];

  return (
    <section className={`bg-gray-50 min-h-screen max-md:mt-16 w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      <div className="flex gap-6 max-md:flex-wrap">
        <nav className="w-full md:w-1/4">
          <ul className="flex flex-wrap gap-2 md:flex-col md:gap-0 md:space-y-2">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name} className="flex-1 md:flex-none">
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 block p-3 rounded-lg transition-colors text-center md:text-left ${
                      location.pathname === item.path ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="w-full md:w-3/4">
          <Routes>
            <Route index element={<DefaultSettings />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="tables" element={<TablesSettings />} />
            <Route path="storage" element={<StorageSettings />} />
            <Route path="api-gateway" element={<ApiGatewaySettings />} />
            <Route path="theme" element={<ThemeSettings />} />
          </Routes>
        </div>
      </div>
    </section>
  );
}

function DefaultSettings() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Settings Overview</h2>
      <p className="mb-4 text-gray-600">Configure system settings, manage API access, and customize platform preferences.</p>
      <p className="text-gray-600">Select a setting from the menu to get started.</p>
    </div>
  );
}

function ProfileSettings() {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.displayName || '',
        phoneNumber: user.phoneNumber || '',
        imageUrl: user.imageUrl || ''
      });
    }
  }, [user]);

  /**
   * 
   * @param {React.FormEvent} e 
   * @returns 
   */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fullName: formData.fullName,
        displayName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        imageUrl: formData.imageUrl,
        updatedAt: Timestamp.now()
      });
      await refreshUser();
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-6 bg-white rounded-lg shadow-sm">Please log in to view profile settings.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Profile Settings</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-3 py-2 text-gray-500 bg-gray-100 border border-gray-300 rounded-lg"
          />
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Profile Image URL</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

function TablesSettings() {
  const [settings, setSettings] = useState({
    maxConnections: '100',
    connectionTimeout: '30',
    queryTimeout: '60',
    enableBackup: true,
    backupFrequency: 'daily'
  });
  const [loading, setLoading] = useState(false);

  /**
   * 
   * @param {React.FormEvent} e 
   */
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, you'd save to a settings collection
    setTimeout(() => {
      setLoading(false);
      alert('Database settings saved successfully');
    }, 1000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Database Configuration</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Max Connections</label>
            <input
              type="number"
              value={settings.maxConnections}
              onChange={(e) => setSettings({ ...settings, maxConnections: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Connection Timeout (seconds)</label>
            <input
              type="number"
              value={settings.connectionTimeout}
              onChange={(e) => setSettings({ ...settings, connectionTimeout: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Query Timeout (seconds)</label>
          <input
            type="number"
            value={settings.queryTimeout}
            onChange={(e) => setSettings({ ...settings, queryTimeout: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.enableBackup}
              onChange={(e) => setSettings({ ...settings, enableBackup: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Enable Automatic Backups</span>
          </label>
        </div>
        {settings.enableBackup && (
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Backup Frequency</label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

function StorageSettings() {
  const [settings, setSettings] = useState({
    maxStorageSize: '100',
    storageType: 'firebase',
    enableCDN: true,
    compressionEnabled: true
  });
  const [loading, setLoading] = useState(false);

  /**
   * 
   * @param {React.FormEvent} e 
   */
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Storage settings saved successfully');
    }, 1000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Storage Settings</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Max Storage Size (GB)</label>
          <input
            type="number"
            value={settings.maxStorageSize}
            onChange={(e) => setSettings({ ...settings, maxStorageSize: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Storage Provider</label>
          <select
            value={settings.storageType}
            onChange={(e) => setSettings({ ...settings, storageType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="firebase">Firebase Storage</option>
            <option value="aws">AWS S3</option>
            <option value="azure">Azure Blob</option>
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.enableCDN}
              onChange={(e) => setSettings({ ...settings, enableCDN: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Enable CDN</span>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.compressionEnabled}
              onChange={(e) => setSettings({ ...settings, compressionEnabled: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Enable Image Compression</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

function ApiGatewaySettings() {
  const [settings, setSettings] = useState({
    apiKey: '',
    rateLimit: '1000',
    enableCaching: true,
    cacheTTL: '3600',
    enableLogging: true
  });
  const [loading, setLoading] = useState(false);

  /**
   * 
   * @param {React.FormEvent} e 
   */
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('API Gateway settings saved successfully');
    }, 1000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">API Gateway Management</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">API Key</label>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter API key"
            />
            <Key size={20} className="text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Rate Limit (requests per hour)</label>
          <input
            type="number"
            value={settings.rateLimit}
            onChange={(e) => setSettings({ ...settings, rateLimit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.enableCaching}
              onChange={(e) => setSettings({ ...settings, enableCaching: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Enable Response Caching</span>
          </label>
        </div>
        {settings.enableCaching && (
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Cache TTL (seconds)</label>
            <input
              type="number"
              value={settings.cacheTTL}
              onChange={(e) => setSettings({ ...settings, cacheTTL: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.enableLogging}
              onChange={(e) => setSettings({ ...settings, enableLogging: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Enable API Logging</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

function ThemeSettings() {
  const [settings, setSettings] = useState({
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    theme: 'light',
    fontSize: 'medium'
  });
  const [loading, setLoading] = useState(false);

  /**
   * 
   * @param {React.FormEvent} e 
   */
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Theme settings saved successfully');
    }, 1000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Theme Customization</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Primary Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
              className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.primaryColor}
              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Secondary Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
              className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.secondaryColor}
              onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Theme Mode</label>
          <select
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Font Size</label>
          <select
            value={settings.fontSize}
            onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Theme'}
        </button>
      </form>
    </div>
  );
}

export default Settings;