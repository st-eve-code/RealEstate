import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

function Settings({ isSidebarCollapsed }) {
  const location = useLocation();

  const settingsItems = [
    { name: 'Profile', path: '/admin/dashboard/settings/profile', description: 'Manage your profile settings' },
    { name: 'Tables', path: '/admin/dashboard/settings/tables', description: 'Database configuration' },
    { name: 'Storage', path: '/admin/dashboard/settings/storage', description: 'Storage settings' },
    { name: 'Api Gateway', path: '/admin/dashboard/settings/api-gateway', description: 'API Gateway management' },
    { name: 'Theme', path: '/admin/dashboard/settings/theme', description: 'Theme customization' },
  ];

  return (
    <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="flex max-md:flex-wrap gap-6">
        <nav className="w-full md:w-1/4">
          <ul className="flex flex-wrap gap-2 md:flex-col md:gap-0 md:space-y-2">
            {settingsItems.map((item) => (
              <li key={item.name} className="flex-1 md:flex-none">
                <Link
                  to={item.path}
                  className={`block p-3 rounded-lg transition-colors text-center md:text-left ${
                    location.pathname === item.path ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
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
    <div className="bg-gray-50 p-4 rounded-lg">
      <p>Configure system settings, manage API access, and customize platform preferences.</p>
      <p className="mt-4">Select a setting from the menu to get started.</p>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      <p>Manage your profile information here.</p>
    </div>
  );
}

function TablesSettings() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Database Configuration</h2>
      <p>Configure database settings and tables.</p>
    </div>
  );
}

function StorageSettings() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Storage Settings</h2>
      <p>Manage storage configurations.</p>
    </div>
  );
}

function ApiGatewaySettings() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">API Gateway Management</h2>
      <p>Configure API Gateway settings.</p>
    </div>
  );
}

function ThemeSettings() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Theme Customization</h2>
      <p>Customize the platform theme.</p>
    </div>
  );
}

export default Settings;