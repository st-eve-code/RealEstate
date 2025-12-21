import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { fetchUnits, approveUnit, rejectUnit, archiveUnit, deleteUnit, addRemarkToUnit } from './services/unitService';
import UnitFilters from './components/UnitFilters';
import UnitTable from './components/UnitTable';
import ReviewModal from './components/ReviewModal';
import RemarksModal from './components/RemarksModal';
import { AlertTriangle } from 'lucide-react';

export default function Property({ isSidebarCollapsed }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    loadUnits();
  }, [filters.status, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    applyFilters();
  }, [filters.searchTerm, units]);

  const loadUnits = async () => {
    try {
      setLoading(true);
      const data = await fetchUnits({
        status: filters.status,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setUnits(data);
    } catch (error) {
      console.error('Error loading units:', error);
      alert('Failed to load units');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...units];

    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((unit) => {
        const name = (unit.name || '').toLowerCase();
        const location = unit.location
          ? (typeof unit.location === 'string'
              ? unit.location.toLowerCase()
              : `${unit.location.city || ''} ${unit.location.country || ''} ${unit.location.address || ''}`.toLowerCase())
          : '';
        const type = (unit.type || '').toLowerCase();
        const landlordId = (unit.landlordId || unit.caretaker?.id || '').toLowerCase();
        
        return (
          name.includes(term) ||
          location.includes(term) ||
          type.includes(term) ||
          landlordId.includes(term)
        );
      });
    }

    setFilteredUnits(filtered);
  };

  const handleApprove = async (unitId, adminId, adminName, reason) => {
    try {
      await approveUnit(unitId, adminId, adminName, reason);
      alert('Unit approved successfully');
      await loadUnits();
    } catch (error) {
      console.error('Error approving unit:', error);
      alert(error.message || 'Failed to approve unit');
      throw error;
    }
  };

  const handleReject = async (unitId, adminId, adminName, reason) => {
    try {
      await rejectUnit(unitId, adminId, adminName, reason);
      alert('Unit rejected successfully');
      await loadUnits();
    } catch (error) {
      console.error('Error rejecting unit:', error);
      alert(error.message || 'Failed to reject unit');
      throw error;
    }
  };

  const handleArchive = async (unit) => {
    if (!confirm(`Are you sure you want to archive "${unit.name}"?`)) return;
    try {
      await archiveUnit(unit.id, user?.uid || '', user?.displayName || 'Admin');
      alert('Unit archived successfully');
      await loadUnits();
    } catch (error) {
      console.error('Error archiving unit:', error);
      alert('Failed to archive unit');
    }
  };

  const handleDelete = async (unit) => {
    if (!confirm(`Are you sure you want to delete "${unit.name}"? This action cannot be undone.`)) return;
    try {
      await deleteUnit(unit.id);
      alert('Unit deleted successfully');
      await loadUnits();
    } catch (error) {
      console.error('Error deleting unit:', error);
      alert('Failed to delete unit');
    }
  };

  const handleAddRemark = async (unitId, remark) => {
    try {
      await addRemarkToUnit(unitId, remark);
      alert('Remark added successfully');
      await loadUnits();
    } catch (error) {
      console.error('Error adding remark:', error);
      alert('Failed to add remark');
      throw error;
    }
  };

  const handleViewDetails = (unitId) => {
    navigate(`/dashboard/properties/${unitId}`);
  };

  const handleReview = (unit) => {
    setSelectedUnit(unit);
    setShowReviewModal(true);
  };

  const handleAddRemarkClick = (unit) => {
    setSelectedUnit(unit);
    setShowRemarksModal(true);
  };

  // Count units with high reports
  const highReportUnits = units.filter((unit) => (unit.reportCount || 0) > 5);

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
            <p className="mt-4 text-gray-600">Loading units...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Property Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Review, approve, reject, and manage property listings
              </p>
            </div>
            <div className="flex items-center gap-4">
              {highReportUnits.length > 0 && (
                <Link
                  to="/dashboard/properties?filter=high-reports"
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <AlertTriangle size={18} />
                  <span className="font-semibold">{highReportUnits.length} High Reports</span>
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{units.length}</div>
              <div className="text-sm text-gray-600">Total Units</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {units.filter((u) => u.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {units.filter((u) => u.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {highReportUnits.length}
              </div>
              <div className="text-sm text-gray-600">High Reports</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <UnitFilters filters={filters} onFiltersChange={setFilters} />

        {/* Table */}
        <UnitTable
          units={filteredUnits}
          onApprove={handleReview}
          onReject={handleReview}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onViewReports={(unitId) => navigate(`/dashboard/properties/reports/${unitId}`)}
          onViewReviews={(unitId) => navigate(`/dashboard/properties/reviews/${unitId}`)}
          onAddRemark={handleAddRemarkClick}
          onViewDetails={handleViewDetails}
        />
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
    </section>
  );
}

