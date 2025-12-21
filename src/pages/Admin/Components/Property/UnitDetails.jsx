import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Star,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Archive,
  Trash2,
  MessageSquare,
  Building2
} from 'lucide-react';
import { fetchUnitById, approveUnit, rejectUnit, archiveUnit, deleteUnit } from './services/unitService';
import { useAuth } from '@/lib/auth-context';
import ReviewModal from './components/ReviewModal';

export default function UnitDetails({ isSidebarCollapsed }) {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    loadUnit();
  }, [unitId]);

  const loadUnit = async () => {
    try {
      setLoading(true);
      const unitData = await fetchUnitById(unitId);
      setUnit(unitData);
    } catch (error) {
      console.error('Error loading unit:', error);
      alert('Failed to load unit details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  const formatLocation = (location) => {
    if (!location) return 'N/A';
    if (typeof location === 'string') return location;
    const parts = [location.address, location.city, location.country].filter(Boolean);
    return parts.join(', ') || 'N/A';
  };

  const handleApprove = async (id, adminId, adminName, reason) => {
    try {
      await approveUnit(id, adminId, adminName, reason);
      alert('Unit approved successfully');
      await loadUnit();
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error approving unit:', error);
      alert(error.message || 'Failed to approve unit');
      throw error;
    }
  };

  const handleReject = async (id, adminId, adminName, reason) => {
    try {
      await rejectUnit(id, adminId, adminName, reason);
      alert('Unit rejected successfully');
      await loadUnit();
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error rejecting unit:', error);
      alert(error.message || 'Failed to reject unit');
      throw error;
    }
  };

  const handleArchive = async () => {
    if (!confirm(`Are you sure you want to archive "${unit?.name}"?`)) return;
    try {
      await archiveUnit(unit.id, user?.uid || '', user?.displayName || 'Admin');
      alert('Unit archived successfully');
      await loadUnit();
    } catch (error) {
      console.error('Error archiving unit:', error);
      alert('Failed to archive unit');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${unit?.name}"? This action cannot be undone.`)) return;
    try {
      await deleteUnit(unit.id);
      alert('Unit deleted successfully');
      navigate('/dashboard/properties');
    } catch (error) {
      console.error('Error deleting unit:', error);
      alert('Failed to delete unit');
    }
  };

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

  if (loading) {
    return (
      <section
        className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
        }`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading unit details...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!unit) {
    return (
      <section
        className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
        }`}
      >
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unit Not Found</h2>
          <p className="text-gray-600 mb-6">The unit you're looking for doesn't exist.</p>
          <Link
            to="/dashboard/properties"
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Properties
          </Link>
        </div>
      </section>
    );
  }

  const statusConfig = STATUS_CONFIG[unit.status] || STATUS_CONFIG.pending;
  const avgRating = unit.rating?.total > 0 
    ? (unit.rating.value / unit.rating.total).toFixed(1)
    : '0.0';

  return (
    <section
      className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard/properties"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Properties
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">{unit.name || 'Untitled Unit'}</h1>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={18} />
                  <span>{formatLocation(unit.location)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* View Reports */}
                <Link
                  to={`/dashboard/properties/reports/${unit.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                  title="View Reports"
                >
                  <FileText size={18} />
                  <span className="hidden sm:inline">Reports</span>
                  {unit.reportCount > 0 && (
                    <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {unit.reportCount}
                    </span>
                  )}
                </Link>

                {/* View Reviews */}
                <Link
                  to={`/dashboard/properties/reviews/${unit.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  title="View Reviews"
                >
                  <Star size={18} />
                  <span className="hidden sm:inline">Reviews</span>
                  {avgRating !== '0.0' && (
                    <span className="text-xs font-semibold">{avgRating}</span>
                  )}
                </Link>

                {/* Approve/Reject (only for pending) */}
                {unit.status === 'pending' && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    title="Review Unit"
                  >
                    <CheckCircle size={18} />
                    <span className="hidden sm:inline">Review</span>
                  </button>
                )}

                {/* Archive (if not archived) */}
                {unit.status !== 'archived' && (
                  <button
                    onClick={handleArchive}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Archive"
                  >
                    <Archive size={18} />
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {unit.description || 'No description provided'}
              </p>
            </div>

            {/* Images */}
            {unit.images && unit.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {unit.images.map((imageCategory, idx) => 
                    imageCategory.urls?.map((url, urlIdx) => (
                      <img
                        key={`${idx}-${urlIdx}`}
                        src={url}
                        alt={`${imageCategory.category || 'Image'} ${urlIdx + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(url, '_blank')}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Remark */}
            {unit.remark && (
              <div className={`p-4 rounded-lg border ${
                unit.remark.type === 'danger' ? 'bg-red-50 border-red-200' :
                unit.remark.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={18} className={
                    unit.remark.type === 'danger' ? 'text-red-600' :
                    unit.remark.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  } />
                  <h3 className="font-semibold text-gray-900">Admin Remark</h3>
                </div>
                <p className="text-gray-700">{unit.remark.text}</p>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Type</span>
                  <p className="font-medium text-gray-900 capitalize">{unit.type || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Price</span>
                  <p className="font-medium text-gray-900">
                    {unit.payment?.currency || 'USD'} {unit.payment?.price || '0'}
                    {unit.payment?.period && ` / ${unit.payment.period}`}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Total Units</span>
                  <p className="font-medium text-gray-900">{unit.totalnumber || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Availability</span>
                  <p className="font-medium text-gray-900">
                    {unit.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Visible</span>
                  <p className="font-medium text-gray-900">
                    {unit.visible ? 'Visible' : 'Hidden'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Views</span>
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-gray-400" />
                    <p className="font-medium text-gray-900">{unit.views || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rooms */}
            {unit.rooms && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Rooms</h2>
                <div className="grid grid-cols-2 gap-4">
                  {unit.rooms.bedrooms !== undefined && (
                    <div className="flex items-center gap-2">
                      <Bed size={20} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Bedrooms</p>
                        <p className="font-medium text-gray-900">{unit.rooms.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {unit.rooms.bathrooms !== undefined && (
                    <div className="flex items-center gap-2">
                      <Bath size={20} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Bathrooms</p>
                        <p className="font-medium text-gray-900">{unit.rooms.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {unit.rooms.kitchens !== undefined && (
                    <div className="flex items-center gap-2">
                      <Building2 size={20} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Kitchens</p>
                        <p className="font-medium text-gray-900">{unit.rooms.kitchens}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rating */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Rating</h2>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-gray-900">{avgRating}</div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.round(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Based on {unit.rating?.total || 0} review{unit.rating?.total !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Timeline</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Created</span>
                  <p className="font-medium text-gray-900">{formatDate(unit.createdAt)}</p>
                </div>
                {unit.updatedAt && (
                  <div>
                    <span className="text-sm text-gray-500">Last Updated</span>
                    <p className="font-medium text-gray-900">{formatDate(unit.updatedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Landlord Info */}
            {(unit.landlordId || unit.caretaker) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Landlord/Caretaker</h2>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">
                    {unit.caretaker?.name || unit.landlordId || 'N/A'}
                  </p>
                  {unit.caretaker?.id && (
                    <p className="text-sm text-gray-500">ID: {unit.caretaker.id}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          unit={unit}
          onApprove={handleApprove}
          onReject={handleReject}
          adminId={user?.uid || ''}
          adminName={user?.displayName || 'Admin'}
        />
      )}
    </section>
  );
}

