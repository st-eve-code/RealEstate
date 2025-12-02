import React from 'react';

function Caretakers({ isSidebarCollapsed }) {
  return (
    <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <h1 className="text-2xl font-bold mb-6">Caretakers Management</h1>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p>Manage caretaker accounts, assign properties, and monitor caretaker activities.</p>
        <ul className="mt-4 list-disc list-inside">
          <li>View all caretakers</li>
          <li>Register new caretakers</li>
          <li>Assign properties to caretakers</li>
          <li>Track caretaker performance</li>
        </ul>
      </div>
    </section>
  );
}

export default Caretakers;