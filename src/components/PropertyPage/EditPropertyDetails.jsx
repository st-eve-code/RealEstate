import { useState } from 'react';

const EditPropertyDetails = () => {
  const [files, setFiles] = useState([]);
  const [propertyName, setPropertyName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSave = () => {
    if (!propertyName.trim()) {
      setError('invalid owner name');
      return;
    }
    // Save logic here
    setError('');
    alert('Property details saved.');
  };

  return (
    <section className="bg-white rounded-lg p-6 shadow-sm max-w-lg">
      <h2 className="text-lg font-bold mb-1 text-gray-900">Edit Property Details</h2>
      <p className="text-gray-500 mb-6">edit property information</p>

      <label
        htmlFor="file-upload"
        className="flex justify-center items-center border border-dashed border-gray-400 rounded-lg h-28 mb-6 cursor-pointer hover:bg-gray-100 transition"
      >
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-center mt-2">Upload {files.length > 0 ? `${files.length} File(s)` : '4 File(s)'}</p>
        </div>
      </label>

      <div className="mb-6 max-h-32 overflow-auto bg-gray-100 rounded-md p-2 space-y-1 text-xs text-gray-700 font-mono">
        {files.length > 0
          ? files.map((file, idx) => <div key={idx}>{file.name}</div>)
          : Array(4)
              .fill('TJdFwX4anfNzW2WIgU4veq/rentspot?node-id=48-53&t=Mi65pzrp5CyHpjrY-0')
              .map((f, i) => <div key={i}>{f}</div>)}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Edit Details</h3>
        <p className="text-xs mb-3 text-red-600">{error}</p>
        <input
          type="text"
          placeholder="Enter new property name"
          value={propertyName}
          onChange={(e) => setPropertyName(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Enter new price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
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

export default EditPropertyDetails;