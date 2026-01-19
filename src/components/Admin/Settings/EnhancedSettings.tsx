'use client'

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  DollarSign, 
  Bell, 
  Shield, 
  HardDrive,
  Palette,
  Database
} from 'lucide-react';
import GeneralSettings from './GeneralSettings';
import PaymentSettings from './PaymentSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';

// Import existing settings components
import { usePathname } from 'next/navigation';

interface EnhancedSettingsProps {
  isSidebarCollapsed?: boolean;
}

type SettingsTab = 'general' | 'payment' | 'notification' | 'security' | 'storage' | 'theme' | 'database';

export default function EnhancedSettings({ isSidebarCollapsed }: EnhancedSettingsProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const settingsTabs = [
    { id: 'general' as SettingsTab, name: 'General', icon: Globe, description: 'Site and company information' },
    { id: 'payment' as SettingsTab, name: 'Payment', icon: DollarSign, description: 'Payment methods and transactions' },
    { id: 'notification' as SettingsTab, name: 'Notifications', icon: Bell, description: 'Notification preferences' },
    { id: 'security' as SettingsTab, name: 'Security', icon: Shield, description: 'Authentication and security' },
    { id: 'storage' as SettingsTab, name: 'Storage', icon: HardDrive, description: 'File storage settings' },
    { id: 'theme' as SettingsTab, name: 'Theme', icon: Palette, description: 'Appearance customization' },
    { id: 'database' as SettingsTab, name: 'Database', icon: Database, description: 'Database configuration' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'payment':
        return <PaymentSettings />;
      case 'notification':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'storage':
        return <StorageSettingsPlaceholder />;
      case 'theme':
        return <ThemeSettingsPlaceholder />;
      case 'database':
        return <DatabaseSettingsPlaceholder />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <section className={`bg-gray-50 min-h-screen max-md:mt-16 w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        </div>
        <p className="text-gray-600">Configure and manage your platform settings</p>
      </div>

      <div className="flex gap-6 max-md:flex-col">
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-72">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <ul className="space-y-1">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700 border-l-4 border-transparent'
                      }`}
                    >
                      <Icon size={20} className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'} />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{tab.name}</div>
                        <div className="text-xs text-gray-500">{tab.description}</div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="p-4 mt-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Quick Info</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <p>• Changes are saved to Firestore</p>
              <p>• Settings apply platform-wide</p>
              <p>• Some changes require restart</p>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </section>
  );
}

// Placeholder components for remaining settings
function StorageSettingsPlaceholder() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Storage Settings</h2>
      <p className="mb-4 text-gray-600">Configure file storage and CDN settings</p>
      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
        <p className="text-sm text-blue-800">
          Storage settings using the existing implementation. You can enhance this section with the new service.
        </p>
      </div>
    </div>
  );
}

function ThemeSettingsPlaceholder() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Theme Settings</h2>
      <p className="mb-4 text-gray-600">Customize platform appearance and branding</p>
      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
        <p className="text-sm text-blue-800">
          Theme settings using the existing implementation. You can enhance this section with the new service.
        </p>
      </div>
    </div>
  );
}

function DatabaseSettingsPlaceholder() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Database Settings</h2>
      <p className="mb-4 text-gray-600">Configure Firestore database settings</p>
      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
        <p className="text-sm text-blue-800">
          Database settings using the existing implementation. You can enhance this section with the new service.
        </p>
      </div>
    </div>
  );
}
