import React, { useState } from 'react';
import { Smartphone, Clock, CheckCircle, XCircle, CreditCard, RefreshCw, AlertCircle, X, Calendar, User, Hash, Phone } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTransactions } from '@/Hooks/useTransactions';
import { toDate } from '@/lib/utils/timestampUtils';
import { Timestamp } from 'firebase/firestore';

function Transaction() {
  const { user } = useAuth();
  const { transactions, loading, error, refetch } = useTransactions(user?.uid, false);
  /**
   * @type {[Transaction, (t:Transaction)=>void]}
   */
  const [selectedTransaction, setSelectedTransaction] = useState();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  console.log("transactions:", transactions)
  
  const handleTransactionClick = (transaction) => {
    console.log('selected transaction', transaction, Timestamp.now())
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const formatDetailedDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = toDate(timestamp);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'failed':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const getPaymentIcon = (method, operator) => {
    const methodLower = method?.toLowerCase() || '';
    if(method.toLowerCase()=='momo'){
      if (operator.toLowerCase().includes('mtn')) {
        return (
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Smartphone size={16} className="text-yellow-900" />
          </div>
        );
      }
      if (operator.toLowerCase().includes('orange')) {
        return (
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <Smartphone size={16} className="text-white" />
          </div>
        );
      }
      if (operator.toLowerCase().includes('mobile') || operator.toLowerCase().includes('money')) {
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Smartphone size={16} className="text-white" />
          </div>
        );
      }
    }
    return (
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
        <CreditCard size={16} className="text-gray-700" />
      </div>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = toDate(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">View all your subscription payment history</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">View all your subscription payment history</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-red-800 font-semibold mb-1">Error Loading Transactions</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={refetch}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const paidTransactions = transactions.filter(t=>t.status=='paid');
  const totalSpent = paidTransactions.reduce((sum, t) => sum + (t.paid || 0), 0);
  const completedCount = paidTransactions.length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">View all your subscription payment history</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          title="Refresh transactions"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Statistics Summary - Only show if there are transactions */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">{totalSpent.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            onClick={() => handleTransactionClick(transaction)}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300">
            
            <div className="flex items-start gap-3">
              {/* Payment Method Icon */}
              <div className="flex-shrink-0 mt-1">
                {getPaymentIcon(transaction.payment.paymentType, transaction.payment.operator)}
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {transaction.planName || transaction.plan || 'Subscription Payment'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {transaction.payment.paymentType || 'N/A'}
                    </p>
                  </div>
                  
                  {/* Amount */}
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-gray-900 text-base sm:text-lg">
                      {transaction.paid?.toLocaleString() || '0'} FCFA
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Date, Transaction ID, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {transaction.id || transaction.transactionId || 'N/A'}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto ${getStatusColor(
                      transaction.status
                    )}`}>
                    {getStatusIcon(transaction.status)}
                    <span className="capitalize">{transaction.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {transactions.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={40} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Transactions</h3>
          <p className="text-sm text-gray-500">You haven't made any subscription payments yet</p>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Transaction Details</h2>
                  <p className="text-blue-100 text-sm">
                    {formatDetailedDate(selectedTransaction.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={`rounded-xl p-4 ${
                selectedTransaction.status === 'paid' ? 'bg-green-50 border-2 border-green-200' :
                selectedTransaction.status === 'pending' ? 'bg-yellow-50 border-2 border-yellow-200' :
                'bg-red-50 border-2 border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${
                    selectedTransaction.status === 'paid' ? 'bg-green-100' :
                    selectedTransaction.status === 'pending' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    {getStatusIcon(selectedTransaction.status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Transaction Status</p>
                    <p className={`text-lg font-bold capitalize ${
                      selectedTransaction.status === 'paid' ? 'text-green-700' :
                      selectedTransaction.status === 'pending' ? 'text-yellow-700' :
                      'text-red-700'
                    }`}>
                      {selectedTransaction.status}
                    </p>
                    {selectedTransaction.reason && (
                      <p className="text-sm text-gray-600 mt-1">
                        Reason: {selectedTransaction.reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <p className="text-sm text-blue-600 mb-2">Amount Paid</p>
                <p className="text-4xl font-bold text-blue-900">
                  {selectedTransaction.paid?.toLocaleString() || '0'} FCFA
                </p>
              </div>

              {/* Subscription Details */}
              {selectedTransaction.subscription && (
                <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                    <CreditCard size={20} />
                    Subscription Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Plan Name</span>
                      <span className="font-semibold text-gray-900">
                        {selectedTransaction.subscription.plan?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Plan Amount</span>
                      <span className="font-semibold text-gray-900">
                        {selectedTransaction.subscription.amount?.toLocaleString() || '0'} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Created At</span>
                      <span className="font-semibold text-gray-900">
                        {formatDetailedDate(selectedTransaction.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">Expires At</span>
                      <span className="font-semibold text-gray-900">
                        {formatDetailedDate(selectedTransaction.expiresAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                  <Smartphone size={20} />
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Payment Method</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {selectedTransaction.payment?.paymentType || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Operator</span>
                    <span className="font-semibold text-gray-900">
                      {selectedTransaction.payment?.operator || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Phone Number</span>
                    <span className="font-semibold text-gray-900 font-mono">
                      {selectedTransaction.payment?.phoneNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Transaction ID</span>
                    <span className="font-semibold text-gray-900 font-mono text-xs break-all">
                      {selectedTransaction.payment?.transactionId || selectedTransaction.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                  <User size={20} />
                  User Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Name</span>
                    <span className="font-semibold text-gray-900">
                      {selectedTransaction.userName || selectedTransaction.payment?.user?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Email</span>
                    <span className="font-semibold text-gray-900 text-sm break-all">
                      {selectedTransaction.payment?.user?.email || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">User ID</span>
                    <span className="font-semibold text-gray-900 font-mono text-xs break-all">
                      {selectedTransaction.uid || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction Metadata */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                  <Hash size={20} />
                  Transaction Metadata
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Transaction ID</span>
                    <span className="font-semibold text-gray-900 font-mono text-xs break-all">
                      {selectedTransaction.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Type</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {selectedTransaction.type || 'subscription'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 text-sm">Created</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {formatDetailedDate(selectedTransaction.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transaction;