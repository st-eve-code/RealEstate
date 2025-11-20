import React from 'react';

function Caretakers() {
  return (
    <section className="bg-white min-h-screen max-md:mt-16 w-full mx-auto shadow-md p-6">
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