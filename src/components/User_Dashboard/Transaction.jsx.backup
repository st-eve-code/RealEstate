import React from 'react';
import { Smartphone, Clock, CheckCircle, XCircle, CreditCard } from 'lucide-react';

function Transaction() {
  const transactions = [
    {
      id: 1,
      plan: 'Premium Plan',
      amount: 5000,
      date: '2025-10-15',
      status: 'completed',
      paymentMethod: 'MTN Mobile Money',
      transactionId: 'MTN-2510150001'
    },
    {
      id: 2,
      plan: 'Basic Plan',
      amount: 2000,
      date: '2025-10-10',
      status: 'completed',
      paymentMethod: 'Orange Money',
      transactionId: 'ORG-2510100012'
    },
    {
      id: 3,
      plan: 'Premium Plan',
      amount: 5000,
      date: '2025-10-05',
      status: 'pending',
      paymentMethod: 'MTN Mobile Money',
      transactionId: 'MTN-2510050023'
    },
    {
      id: 4,
      plan: 'Standard Plan',
      amount: 3500,
      date: '2025-09-28',
      status: 'failed',
      paymentMethod: 'Orange Money',
      transactionId: 'ORG-2509280034'
    },
    {
      id: 5,
      plan: 'Basic Plan',
      amount: 2000,
      date: '2025-09-20',
      status: 'completed',
      paymentMethod: 'MTN Mobile Money',
      transactionId: 'MTN-2509200045'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
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
      case 'completed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'failed':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const getPaymentIcon = (method) => {
    if (method.includes('MTN')) {
      return (
        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <Smartphone size={16} className="text-yellow-900" />
        </div>
      );
    }
    if (method.includes('Orange')) {
      return (
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <Smartphone size={16} className="text-white" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
        <CreditCard size={16} className="text-gray-700" />
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Transactions</h1>
        <p className="text-sm text-gray-500 mt-1">View all your subscription payment history</p>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            
            <div className="flex items-start gap-3">
              {/* Payment Method Icon */}
              <div className="flex-shrink-0 mt-1">
                {getPaymentIcon(transaction.paymentMethod)}
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {transaction.plan}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {transaction.paymentMethod}
                    </p>
                  </div>
                  
                  {/* Amount */}
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-gray-900 text-base sm:text-lg">
                      {transaction.amount.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Date, Transaction ID, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {transaction.transactionId}
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
    </div>
  );
}

export default Transaction;