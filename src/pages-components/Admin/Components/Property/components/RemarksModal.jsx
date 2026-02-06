import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const REMARK_TYPES = [
  { value: 'basic', label: 'Basic', color: 'bg-blue-100 text-blue-700' },
  { value: 'info', label: 'Info', color: 'bg-blue-100 text-blue-700' },
  { value: 'warning', label: 'Warning', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'danger', label: 'Danger', color: 'bg-red-100 text-red-700' },
];

export default function RemarksModal({ isOpen, onClose, unit, onAddRemark }) {
  const [type, setType] = useState('info');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !unit) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('Please enter a remark');
      return;
    }

    setLoading(true);
    try {
      await onAddRemark(unit.id, { type, text: text.trim() });
      setText('');
      setType('info');
      onClose();
    } catch (error) {
      console.error('Error adding remark:', error);
      alert('Failed to add remark');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setText('');
    setType('info');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Remark to Unit</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Unit:</span> {unit.name || unit.id}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remark Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {REMARK_TYPES.map((remarkType) => (
                <option key={remarkType.value} value={remarkType.value}>
                  {remarkType.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remark Text *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your remark..."
            />
          </div>

          {/* Preview */}
          {text && (
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <div className={`p-2 rounded ${REMARK_TYPES.find(t => t.value === type)?.color}`}>
                {text}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {loading ? 'Adding...' : 'Add Remark'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

