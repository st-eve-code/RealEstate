'use client'

import React from 'react';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Archive, 
  Trash2, 
  MessageSquare, 
  Star,
  AlertTriangle,
  FileText
} from 'lucide-react';
import Link from 'next/link';

const STATUS_CONFIG = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    label: 'Pending',
  },
  approved: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    label: 'Approved',
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Rejected',
  },
  archived: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    label: 'Archived',
  },
};

export default function UnitTable({ 
  units, 
  onApprove, 
  onReject, 
  onArchive, 
  onDelete,
  onViewReports,
  onViewReviews,
  onAddRemark,
  onViewDetails
}) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const formatLocation = (location) => {
    if (!location) return 'N/A';
    if (typeof location === 'string') return location;
    const parts = [location.address, location.city, location.country].filter(Boolean);
    return parts.join(', ') || 'N/A';
  };

  if (units.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No units found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reports</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Views</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => {
              const statusConfig = STATUS_CONFIG[unit.status] || STATUS_CONFIG.pending;
              const hasHighReports = (unit.reportCount || 0) > 5;

              return (
                <tr 
                  key={unit.id} 
                  className={`border-b border-gray-200 hover:bg-gray-50 ${
                    hasHighReports ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-gray-900">{unit.name || 'N/A'}</div>
                    {unit.remark && (
                      <div className={`text-xs mt-1 ${
                        unit.remark.type === 'danger' ? 'text-red-600' :
                        unit.remark.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        {unit.remark.text}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatLocation(unit.location)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                    {unit.type || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {unit.payment?.currency || 'USD'} {unit.payment?.price || '0'}
                    {unit.payment?.period && `/${unit.payment.period}`}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={hasHighReports ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                        {unit.reportCount || 0}
                      </span>
                      {hasHighReports && (
                        <AlertTriangle size={14} className="text-red-600" title="High reports" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {unit.views || 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatDate(unit.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* View Details */}
                      <Link
                        href={`/dashboard/properties/${unit.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>

                      {/* View Reports */}
                      <Link
                        href={`/dashboard/properties/reports/${unit.id}`}
                        className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                        title="View Reports"
                      >
                        <FileText size={16} />
                      </Link>

                      {/* View Reviews */}
                      <button
                        onClick={() => onViewReviews(unit.id)}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        title="View Reviews"
                      >
                        <Star size={16} />
                      </button>

                      {/* Add Remark */}
                      <button
                        onClick={() => onAddRemark(unit)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Add Remark"
                      >
                        <MessageSquare size={16} />
                      </button>

                      {/* Approve (only for pending) */}
                      {unit.status === 'pending' && (
                        <button
                          onClick={() => onApprove(unit)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                      {/* Reject (only for pending or approved) */}
                      {(unit.status === 'pending' || unit.status === 'approved') && (
                        <button
                          onClick={() => onReject(unit)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      )}

                      {/* Archive */}
                      {unit.status !== 'archived' && (
                        <button
                          onClick={() => onArchive(unit)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Archive"
                        >
                          <Archive size={16} />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(unit)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

