import React from 'react';

function Clients({ isSidebarCollapsed }) {
  return (
    <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <h1 className="text-2xl font-bold mb-6">Clients Management</h1>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p>Manage client accounts, view client details, and handle client-related operations.</p>
        <ul className="mt-4 list-disc list-inside">
          <li>View all clients</li>
          <li>Add new clients</li>
          <li>Edit client information</li>
          <li>Deactivate clients</li>
        </ul>
      </div>
    </section>
  );
}

export default Clients;