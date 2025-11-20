import React from 'react';

function Clients() {
  return (
    <section className="bg-white min-h-screen max-md:mt-16 w-full mx-auto shadow-md p-6">
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