import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  unit, 
  onApprove, 
  onReject,
  adminId,
  adminName 
}) {
  const [action, setAction] = useState(null); // 'approve' or 'reject'
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !unit) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!action) return;
    if (action === 'reject' && !reason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setLoading(true);
    try {
      if (action === 'approve') {
        await onApprove(unit.id, adminId, adminName, reason);
      } else {
        await onReject(unit.id, adminId, adminName, reason);
      }
      setAction(null);
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAction(null);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Review Unit</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Unit Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">{unit.name}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Type:</span> {unit.type || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Location:</span> {
                unit.location 
                  ? (typeof unit.location === 'string' 
                    ? unit.location 
                    : `${unit.location.city || ''}, ${unit.location.country || ''}`)
                  : 'N/A'
              }
            </div>
            <div>
              <span className="font-medium">Price:</span> {
                unit.payment 
                  ? `${unit.payment.currency || 'USD'} ${unit.payment.price || '0'}`
                  : 'N/A'
              }
            </div>
            <div>
              <span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                unit.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                unit.status === 'approved' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {unit.status || 'pending'}
              </span>
            </div>
          </div>
          {unit.description && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Description:</span> {unit.description}
            </div>
          )}
        </div>

        {/* Action Selection */}
        {!action ? (
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setAction('approve')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <CheckCircle size={20} />
              Approve Unit
            </button>
            <button
              onClick={() => setAction('reject')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <XCircle size={20} />
              Reject Unit
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {action === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason *'}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                required={action === 'reject'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  action === 'approve' 
                    ? 'Add any notes about this approval...'
                    : 'Please provide a reason for rejection...'
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  action === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? 'Processing...' : action === 'approve' ? 'Approve' : 'Reject'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAction(null);
                  setReason('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

