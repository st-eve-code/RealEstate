import React from 'react';

function HouseAgents({ isSidebarCollapsed }) {
  return (
    <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <h1 className="text-2xl font-bold mb-6">House Agents Management</h1>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p>Manage house agent registrations, verify credentials, and oversee agent activities.</p>
        <ul className="mt-4 list-disc list-inside">
          <li>Review agent applications</li>
          <li>Approve or reject agents</li>
          <li>Monitor agent listings</li>
          <li>Handle agent complaints</li>
        </ul>
      </div>
    </section>
  );
}

export default HouseAgents;