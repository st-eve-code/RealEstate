import { useState } from 'react';

const OwnerDetails = () => {
  const [ownerName, setOwnerName] = useState('');
  const [ownerLocation, setOwnerLocation] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!ownerName.trim()) {
      setError('invalid owner name');
      return;
    }
    // Save logic here
    setError('');
    alert('Owner information saved.');
  };

  return (
    <section className="bg-white rounded-lg p-6 shadow-sm mb-6 max-w-lg">
      <h2 className="text-lg font-bold mb-1 text-gray-900">Owner Details</h2>
      <p className="text-gray-500 mb-6">Property owner details</p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6 text-gray-700">
        <div>
          <p className="font-semibold">Owner Name</p>
          <p>Francklin Rodrick</p>
        </div>
        <div>
          <p className="font-semibold">Location</p>
          <p>Buea, South West</p>
        </div>
        <div>
          <p className="font-semibold">Email</p>
          <p>FrancklinR@gmail.com</p>
        </div>
        <div>
          <p className="font-semibold">Phone Number</p>
          <p>680255409</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Edit Information</h3>
        <p className="text-xs mb-3 text-red-600">{error}</p>
        <input
          type="text"
          placeholder="Enter new owner name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Enter new owner location"
          value={ownerLocation}
          onChange={(e) => setOwnerLocation(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Enter new owner phone number"
          value={ownerPhone}
          onChange={(e) => setOwnerPhone(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Enter new owner email"
          value={ownerEmail}
          onChange={(e) => setOwnerEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </section>
  );
};

export default OwnerDetails;