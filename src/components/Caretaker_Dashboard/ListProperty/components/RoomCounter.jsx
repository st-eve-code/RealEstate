import React from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * RoomCounter Component
 * 
 * A reusable counter component for incrementing/decrementing room counts
 * Used for bedrooms, bathrooms, parlors, and kitchens
 * 
 * @param {string} label - The label for the counter (e.g., "No of Bedrooms")
 * @param {number} value - Current count value
 * @param {function} onChange - Callback function when value changes
 * @param {number} min - Minimum allowed value (default: 0)
 * @param {number} max - Maximum allowed value (default: 20)
 */
function RoomCounter({ label, value, onChange, min = 0, max = 20 }) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} ({value})
      </label>
      <div className="flex items-center gap-3">
        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            value <= min
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
          }`}
        >
          <Minus className="w-5 h-5" />
        </button>

        {/* Display Value */}
        <div className="w-16 text-center">
          <span className="text-lg font-semibold text-gray-900">{value}</span>
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            value >= max
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
          }`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default RoomCounter;

