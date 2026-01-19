'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { fetchUnits, approveUnit, rejectUnit, archiveUnit, deleteUnit, addRemarkToUnit } from './services/unitService';
import { 
  Search, 
  Plus, 
  Filter, 
  Building2, 
  MapPin, 
  Eye, 
  Archive, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Star,
  DollarSign,
  Bed,
  Bath,
  TrendingUp,
  AlertTriangle,
  Home,
  Sparkles
} from 'lucide-react';
import ReviewModal from './components/ReviewModal';
import RemarksModal from './components/RemarksModal';
import ConfirmModal from '@/components/ConfirmModal';

export default function Property({ isSidebarCollapsed }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    loadUnits();
  }, []);

  useEffect(() => {
    filterUnits();
  }, [units, searchTerm, statusFilter]);

  const loadUnits = async () => {
    try {
      setLoading(true);
      const data = await fetchUnits();
      setUnits(data);
    } catch (error) {
      console.error('Error loading units:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUnits = () => {
    let filtered = units;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(unit => unit.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(unit =>
        unit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUnits(filtered);
  };

  const handleApprove = async (id, adminId, adminName, reason) => {
    try {
      await approveUnit(id, adminId, adminName, reason);
      alert('Property approved successfully');
      await loadUnits();
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error approving unit:', error);
      alert('Failed to approve unit');
      throw error;
    }
  };

  const handleReject = async (id, adminId, adminName, reason) => {
    try {
      await rejectUnit(id, adminId, adminName, reason);
      alert('Property rejected successfully');
      await loadUnits();
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error rejecting unit:', error);
      alert('Failed to reject unit');
      throw error;
    }
  };

  const handleAddRemark = async (unitId, remarkData) => {
    try {
      await addRemarkToUnit(unitId, remarkData);
      alert('Remark added successfully');
      await loadUnits();
      setShowRemarksModal(false);
      setSelectedUnit(null);
    } catch (error) {
      console.error('Error adding remark:', error);
      alert('Failed to add remark');
    }
  };

  const openArchiveModal = (unit) => {
    setSelectedUnit(unit);
    setConfirmAction('archive');
    setShowConfirmModal(true);
  };

  const openDeleteModal = (unit) => {
    setSelectedUnit(unit);
    setConfirmAction('delete');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUnit) return;

    try {
      if (confirmAction === 'archive') {
        await archiveUnit(selectedUnit.id, user?.uid || '', user?.displayName || 'Admin');
        alert('Unit archived successfully');
      } else if (confirmAction === 'delete') {
        await deleteUnit(selectedUnit.id);
        alert('Unit deleted successfully');
      }
      await loadUnits();
    } catch (error) {
      console.error(`Error ${confirmAction}ing unit:`, error);
      alert(`Failed to ${confirmAction} unit`);
    } finally {
      setSelectedUnit(null);
      setConfirmAction(null);
    }
  };

  const handleArchive = openArchiveModal;
  const handleDelete = openDeleteModal;

  const getStatusBadge = (status) => {
    const configs = {
      approved: { bg: 'bg-gradient-to-r from-green-400 to-green-600', text: 'text-white', icon: CheckCircle },
      pending: { bg: 'bg-gradient-to-r from-yellow-400 to-yellow-600', text: 'text-white', icon: AlertTriangle },
      rejected: { bg: 'bg-gradient-to-r from-red-400 to-red-600', text: 'text-white', icon: XCircle },
      archived: { bg: 'bg-gradient-to-r from-gray-400 to-gray-600', text: 'text-white', icon: Archive },
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${config.bg} ${config.text} shadow-md`}>
        <Icon size={14} />
        {status}
      </span>
    );
  };

  const stats = {
    total: units.length,
    approved: units.filter(u => u.status === 'approved').length,
    pending: units.filter(u => u.status === 'pending').length,
    rejected: units.filter(u => u.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-16 lg:ml-16' : 'md:ml-64 lg:ml-64'
    }`}>
      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Property Management</h1>
              <p className="text-gray-600">Manage and monitor all properties</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Total Properties</div>
              <Building2 size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">All listings</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Approved</div>
              <CheckCircle size={20} className="text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-xs text-gray-500 mt-1">Active listings</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Pending</div>
              <AlertTriangle size={20} className="text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-500 mt-1">Awaiting review</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Rejected</div>
              <XCircle size={20} className="text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-xs text-gray-500 mt-1">Not approved</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'approved', 'pending', 'rejected', 'archived'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        {filteredUnits.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <Home size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                    <img
                      src={unit.images?.[0]?.urls?.[0] || '/placeholder-property.jpg'}
                      alt={unit.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(unit.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link href={`/dashboard/properties/${unit.id}`}>
                          <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 cursor-pointer">
                            {unit.name || 'Unnamed Property'}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <MapPin size={16} />
                          <span className="text-sm">
                            {unit.location?.city || unit.location?.address || 'Location not specified'}
                          </span>
                        </div>

                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-4 mb-4">
                          {unit.rooms?.bedrooms !== undefined && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <div className="p-1.5 bg-blue-100 rounded-lg">
                                <Bed size={16} className="text-blue-600" />
                              </div>
                              <span className="text-sm font-medium">{unit.rooms.bedrooms} Beds</span>
                            </div>
                          )}
                          {unit.rooms?.bathrooms !== undefined && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <div className="p-1.5 bg-purple-100 rounded-lg">
                                <Bath size={16} className="text-purple-600" />
                              </div>
                              <span className="text-sm font-medium">{unit.rooms.bathrooms} Baths</span>
                            </div>
                          )}
                          {unit.rating?.average && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <div className="p-1.5 bg-yellow-100 rounded-lg">
                                <Star size={16} className="text-yellow-600 fill-current" />
                              </div>
                              <span className="text-sm font-medium">{unit.rating.average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <DollarSign size={20} className="text-green-600" />
                          <span className="text-2xl font-bold text-green-600">
                            {unit.payment?.currency || 'USD'} {unit.payment?.price?.toLocaleString() || '0'}
                          </span>
                          {unit.payment?.period && (
                            <span className="text-sm text-gray-500">/ {unit.payment.period}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        <Link
                          href={`/dashboard/properties/${unit.id}`}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        
                        {unit.status === 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedUnit(unit);
                              setShowReviewModal(true);
                            }}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Review"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            setSelectedUnit(unit);
                            setShowRemarksModal(true);
                          }}
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                          title="Add Remark"
                        >
                          <MessageSquare size={18} />
                        </button>

                        {unit.status !== 'archived' && (
                          <button
                            onClick={() => handleArchive(unit)}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Archive"
                          >
                            <Archive size={18} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(unit)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Remark Badge */}
                    {unit.remark && (
                      <div className="mt-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                          unit.remark.type === 'danger' ? 'bg-gradient-to-r from-red-400 to-red-600 text-white' :
                          unit.remark.type === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                          'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                        }`}>
                          <AlertTriangle size={16} />
                          <span>{unit.remark.text || "Has Admin Remark"}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedUnit && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedUnit(null);
          }}
          unit={selectedUnit}
          onApprove={handleApprove}
          onReject={handleReject}
          adminId={user?.uid || ''}
          adminName={user?.displayName || 'Admin'}
        />
      )}

      {/* Remarks Modal */}
      {showRemarksModal && selectedUnit && (
        <RemarksModal
          isOpen={showRemarksModal}
          onClose={() => {
            setShowRemarksModal(false);
            setSelectedUnit(null);
          }}
          unit={selectedUnit}
          onAddRemark={handleAddRemark}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setConfirmAction(null);
          setSelectedUnit(null);
        }}
        onConfirm={handleConfirmAction}
        title={confirmAction === 'archive' ? 'Archive Property' : 'Delete Property'}
        message={
          confirmAction === 'archive'
            ? `Are you sure you want to archive "${selectedUnit?.name}"? It will be hidden from listings.`
            : `Are you sure you want to delete "${selectedUnit?.name}"? This action cannot be undone.`
        }
        confirmText={confirmAction === 'archive' ? 'Archive' : 'Delete'}
        cancelText="Cancel"
        type={confirmAction === 'archive' ? 'warning' : 'danger'}
      />
    </section>
  );
}
