import React from 'react';

function Notification() {
  return (
    <section className="bg-white min-h-screen max-md:mt-16 w-full mx-auto shadow-md p-6">
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