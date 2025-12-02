import React from 'react';

function Members({ isSidebarCollapsed }) {
  return (
    <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <h1 className="text-2xl font-bold mb-6">Members Management</h1>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p>Manage platform members, handle memberships, and oversee member activities.</p>
        <ul className="mt-4 list-disc list-inside">
          <li>View all members</li>
          <li>Manage membership levels</li>
          <li>Handle member complaints</li>
          <li>Monitor member engagement</li>
        </ul>
      </div>
    </section>
  );
}

export default Members;