import React from 'react';

function HouseAgents() {
  return (
    <section className="bg-white min-h-screen max-md:mt-16 w-full mx-auto shadow-md p-6">
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