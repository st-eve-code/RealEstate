import React from 'react';

function Notification({ isSidebarCollapsed }) {
  return (
    <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p>Send notifications to users, manage notification templates, and view notification history.</p>
        <ul className="mt-4 list-disc list-inside">
          <li>Create new notifications</li>
          <li>Schedule notifications</li>
          <li>View sent notifications</li>
          <li>Manage notification preferences</li>
        </ul>
      </div>
    </section>
  );
}

export default Notification;