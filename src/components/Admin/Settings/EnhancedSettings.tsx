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
  Database,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import GeneralSettings from './GeneralSettings';
import PaymentSettings from './PaymentSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';

interface EnhancedSettingsProps {
  isSidebarCollapsed?: boolean;
  activeTab?: SettingsTab;
}

type SettingsTab = 'general' | 'payment' | 'notification' | 'security' | 'storage' | 'theme' | 'database';

export default function EnhancedSettings({ isSidebarCollapsed, activeTab: initialTab }: EnhancedSettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab || 'general');
  const router = useRouter();

  const settingsTabs = [
    { id: 'general' as SettingsTab, name: 'General', icon: Globe, description: 'Site and company information', color: 'blue', route: '/dashboard/settings/general' },
    { id: 'payment' as SettingsTab, name: 'Payment', icon: DollarSign, description: 'Payment methods and transactions', color: 'green', route: '/dashboard/settings/payment' },
    { id: 'notification' as SettingsTab, name: 'Notifications', icon: Bell, description: 'Notification preferences', color: 'yellow', route: '/dashboard/settings/notification' },
    { id: 'security' as SettingsTab, name: 'Security', icon: Shield, description: 'Authentication and security', color: 'red', route: '/dashboard/settings/security' },
    { id: 'storage' as SettingsTab, name: 'Storage', icon: HardDrive, description: 'File storage settings', color: 'purple', route: null },
    { id: 'theme' as SettingsTab, name: 'Theme', icon: Palette, description: 'Appearance customization', color: 'pink', route: null },
    { id: 'database' as SettingsTab, name: 'Database', icon: Database, description: 'Database configuration', color: 'indigo', route: null },
  ];

  const handleTabClick = (tab: typeof settingsTabs[0]) => {
    if (tab.route) {
      router.push(tab.route);
    } else {
      setActiveTab(tab.id);
    }
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: any = {
      blue: isActive ? 'bg-blue-50 text-blue-700 border-blue-500' : 'hover:bg-blue-50',
      green: isActive ? 'bg-green-50 text-green-700 border-green-500' : 'hover:bg-green-50',
      yellow: isActive ? 'bg-yellow-50 text-yellow-700 border-yellow-500' : 'hover:bg-yellow-50',
      red: isActive ? 'bg-red-50 text-red-700 border-red-500' : 'hover:bg-red-50',
      purple: isActive ? 'bg-purple-50 text-purple-700 border-purple-500' : 'hover:bg-purple-50',
      pink: isActive ? 'bg-pink-50 text-pink-700 border-pink-500' : 'hover:bg-pink-50',
      indigo: isActive ? 'bg-indigo-50 text-indigo-700 border-indigo-500' : 'hover:bg-indigo-50',
    };
    return colors[color] || colors.blue;
  };

  const getIconColorClass = (color: string) => {
    const colors: any = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      red: 'text-red-600',
      purple: 'text-purple-600',
      pink: 'text-pink-600',
      indigo: 'text-indigo-600',
    };
    return colors[color] || colors.blue;
  };

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
    <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen max-md:mt-14 w-full transition-all duration-300 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-200 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Premium Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <SettingsIcon size={32} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-600 mt-1">Configure and manage your platform settings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Premium Sidebar Navigation */}
          <nav className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles size={18} />
                  <h3 className="font-semibold">Settings Menu</h3>
                </div>
              </div>
              <ul className="p-2">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <li key={tab.id} className="mb-1">
                      <button
                        onClick={() => handleTabClick(tab)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? `${getColorClasses(tab.color, true)} shadow-md border-l-4 transform scale-[1.02]`
                            : `${getColorClasses(tab.color, false)} text-gray-700 border-l-4 border-transparent hover:shadow-md hover:transform hover:scale-[1.02]`
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white shadow-sm' : 'bg-gray-50 group-hover:bg-white'}`}>
                          <Icon 
                            size={20} 
                            className={isActive ? getIconColorClass(tab.color) : 'text-gray-400 group-hover:text-gray-600'} 
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-sm">{tab.name}</div>
                          <div className="text-xs opacity-75">{tab.description}</div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Premium Info Card */}
              <div className="m-3 p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-2 mb-2">
                  <Sparkles size={16} className="text-blue-600 mt-0.5" />
                  <h4 className="text-sm font-semibold text-gray-800">Quick Info</h4>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Changes saved to Firestore</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>Settings apply platform-wide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-0.5">•</span>
                    <span>Some changes may require restart</span>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Premium Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {renderTabContent()}
            </div>
          </div>
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
