'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Building2,
  DollarSign,
  Calendar,
  User,
  Home,
  X,
  Maximize,
  Tag,
  TrendingUp,
  Shield,
  Sparkles,
  Info
} from 'lucide-react';
import { fetchUnitById, approveUnit, rejectUnit, archiveUnit, deleteUnit } from './services/unitService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import ReviewModal from './components/ReviewModal';
import ConfirmModal from '@/components/ConfirmModal';

export default function UnitDetails({ unitId: propUnitId, isSidebarCollapsed }) {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const unitId = propUnitId || params?.unitId;

  useEffect(() => {
    if (unitId) {
      loadUnit();
    }
  }, [unitId]);

  const loadUnit = async () => {
    if (!unitId) return;
    
    try {
      setLoading(true);
      const unitData = await fetchUnitById(unitId);
      if (unitData) {
        setUnit(unitData);
      } else {
        alert('Property not found');
        router.push('/dashboard/properties');
      }
    } catch (error) {
      console.error('Error loading unit:', error);
      alert('Failed to load property details');
      router.push('/dashboard/properties');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return new Date(timestamp).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
      alert('Property approved successfully');
      await loadUnit();
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error approving unit:', error);
      alert(error.message || 'Failed to approve property');
      throw error;
    }
  };

  const handleReject = async (id, adminId, adminName, reason) => {
    try {
      await rejectUnit(id, adminId, adminName, reason);
      alert('Property rejected successfully');
      await loadUnit();
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error rejecting unit:', error);
      alert(error.message || 'Failed to reject property');
      throw error;
    }
  };

  const openArchiveModal = () => {
    setConfirmAction('archive');
    setShowConfirmModal(true);
  };

  const openDeleteModal = () => {
    setConfirmAction('delete');
    setShowConfirmModal(true);
  };

  const openDeleteRemarkModal = () => {
    setConfirmAction('deleteRemark');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmAction === 'archive') {
        await archiveUnit(unit.id, user?.uid || '', user?.displayName || 'Admin');
        alert('Property archived successfully');
        await loadUnit();
      } else if (confirmAction === 'delete') {
        await deleteUnit(unit.id);
        alert('Property deleted successfully');
        router.push('/dashboard/properties');
      } else if (confirmAction === 'deleteRemark') {
        const propertyRef = doc(db, 'properties', unit.id);
        await updateDoc(propertyRef, {
          remark: null
        });
        alert('Remark deleted successfully');
        await loadUnit();
      }
    } catch (error) {
      console.error(`Error ${confirmAction}ing:`, error);
      alert(`Failed to ${confirmAction} property`);
    } finally {
      setConfirmAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <AlertTriangle size={64} className="mx-auto mb-4 text-red-500" />
          <p className="text-xl text-gray-600">Property not found</p>
        </div>
      </div>
    );
  }

  const avgRating = unit.rating?.average !== undefined ? unit.rating.average.toFixed(1) : '0.0';
  const allImages = unit.images?.flatMap(cat => cat.urls || []) || [];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved': return { color: 'bg-gradient-to-r from-green-400 to-green-600', text: 'text-white', icon: CheckCircle };
      case 'pending': return { color: 'bg-gradient-to-r from-yellow-400 to-yellow-600', text: 'text-white', icon: AlertTriangle };
      case 'rejected': return { color: 'bg-gradient-to-r from-red-400 to-red-600', text: 'text-white', icon: XCircle };
      case 'archived': return { color: 'bg-gradient-to-r from-gray-400 to-gray-600', text: 'text-white', icon: Archive };
      default: return { color: 'bg-gradient-to-r from-blue-400 to-blue-600', text: 'text-white', icon: Info };
    }
  };

  const statusConfig = getStatusConfig(unit.status);
  const StatusIcon = statusConfig.icon;

  return (
    <section className={`flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-16 lg:ml-16' : 'md:ml-64 lg:ml-64'
    }`}>
      <div className="max-w-[1600px] mx-auto">
        {/* Hero Header with Image */}
        <div className="relative h-[400px] overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: allImages[selectedImage] ? `url(${allImages[selectedImage]})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            {/* Top Bar */}
            <div className="flex items-start justify-between">
              <Link
                href="/dashboard/properties"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-all shadow-lg"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
              </Link>

              {/* Status Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg ${statusConfig.color}`}>
                <StatusIcon size={18} className={statusConfig.text} />
                <span className={`font-bold uppercase text-sm tracking-wider ${statusConfig.text}`}>
                  {unit.status || 'Unknown'}
                </span>
              </div>
            </div>

            {/* Property Info and Price - Left Side */}
            <div className="flex items-end justify-between">
              <div className="space-y-4 flex-1">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-2xl">
                    {unit.name || 'Unnamed Property'}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90 text-lg">
                    <MapPin size={22} />
                    <span className="drop-shadow-lg">{formatLocation(unit.location)}</span>
                  </div>
                </div>

                {/* Price Tag - Left Side */}
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                  <DollarSign size={28} className="text-green-400" />
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {unit.payment?.currency || 'USD'} {unit.payment?.price?.toLocaleString() || '0'}
                    </div>
                    {unit.payment?.period && (
                      <div className="text-sm text-white/80">per {unit.payment.period}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Thumbnails - Right Side */}
              {allImages.length > 1 && (
                <div className="ml-4">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent max-w-[400px]">
                    {allImages.slice(0, 6).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === idx ? 'border-white shadow-xl scale-110' : 'border-white/30 hover:border-white/60'
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Quick Stats */}
              <div className="flex items-center gap-6 mr-auto">
                {unit.rooms?.bedrooms !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Bed size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Bedrooms</div>
                      <div className="font-bold text-gray-900">{unit.rooms.bedrooms}</div>
                    </div>
                  </div>
                )}
                {unit.rooms?.bathrooms !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Bath size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Bathrooms</div>
                      <div className="font-bold text-gray-900">{unit.rooms.bathrooms}</div>
                    </div>
                  </div>
                )}
                {avgRating !== '0.0' && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Star size={20} className="text-yellow-600 fill-current" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Rating</div>
                      <div className="font-bold text-gray-900">{avgRating}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/properties/reports/${unit.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <FileText size={18} />
                  <span>Reports</span>
                </Link>

                <Link
                  href={`/dashboard/properties/reviews/${unit.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <Star size={18} />
                  <span>Reviews</span>
                </Link>

                {unit.status === 'pending' && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-medium"
                  >
                    <CheckCircle size={18} />
                    <span>Review</span>
                  </button>
                )}

                {unit.status !== 'archived' && (
                  <button
                    onClick={openArchiveModal}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    title="Archive"
                  >
                    <Archive size={20} />
                  </button>
                )}

                <button
                  onClick={openDeleteModal}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Admin Remark */}
              {unit.remark && (
                <div className={`relative p-6 rounded-2xl border-2 shadow-lg ${
                  unit.remark.type === 'danger' ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300' :
                  unit.remark.type === 'warning' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300' :
                  'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300'
                }`}>
                  <button
                    onClick={openDeleteRemarkModal}
                    className="absolute top-4 right-4 p-1.5 hover:bg-white/60 rounded-full transition-all"
                    title="Delete Remark"
                  >
                    <X size={18} className="text-gray-700" />
                  </button>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-xl ${
                      unit.remark.type === 'danger' ? 'bg-red-200' :
                      unit.remark.type === 'warning' ? 'bg-yellow-200' :
                      'bg-blue-200'
                    }`}>
                      <AlertTriangle size={24} className={
                        unit.remark.type === 'danger' ? 'text-red-700' :
                        unit.remark.type === 'warning' ? 'text-yellow-700' :
                        'text-blue-700'
                      } />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Admin Remark</h3>
                      <p className="text-gray-800 leading-relaxed">{unit.remark.text}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <MessageSquare size={24} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Description</h2>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {unit.description || 'No description provided'}
                </p>
              </div>

              {/* Amenities */}
              {unit.amenities && unit.amenities.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <Sparkles size={24} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {unit.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-xl text-sm font-semibold border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Images Grid */}
              {allImages.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allImages.map((url, idx) => (
                      <div 
                        key={idx} 
                        className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all"
                        onClick={() => setSelectedImage(idx)}
                      >
                        <img
                          src={url}
                          alt={`Property ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                          <Maximize size={24} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Property Stats */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp size={24} />
                  Property Stats
                </h2>
                <div className="space-y-4">
                  {unit.totalnumber && (
                    <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded-xl">
                      <div className="flex items-center gap-3">
                        <Building2 size={20} />
                        <span>Total Units</span>
                      </div>
                      <span className="font-bold text-xl">{unit.totalnumber}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded-xl">
                    <div className="flex items-center gap-3">
                      <Eye size={20} />
                      <span>Visible</span>
                    </div>
                    <span className={`font-bold ${unit.visible ? 'text-green-300' : 'text-red-300'}`}>
                      {unit.visible ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded-xl">
                    <div className="flex items-center gap-3">
                      <Tag size={20} />
                      <span>Type</span>
                    </div>
                    <span className="font-bold capitalize">{unit.type || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Rating Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Rating & Reviews</h2>
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-900 mb-3">{avgRating}</div>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={28}
                        className={i < Math.round(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500">
                    Based on <span className="font-bold text-gray-900">{unit.rating?.total || 0}</span> review{unit.rating?.total !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Calendar size={24} className="text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Timeline</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Created</div>
                      <div className="font-semibold text-gray-900">{formatDate(unit.createdAt)}</div>
                    </div>
                  </div>
                  {unit.updatedAt && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                        <div className="font-semibold text-gray-900">{formatDate(unit.updatedAt)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Landlord Info */}
              {(unit.landlordId || unit.caretaker) && (
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 backdrop-blur rounded-xl">
                      <User size={24} />
                    </div>
                    <h2 className="text-xl font-bold">Landlord</h2>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-lg">
                      {unit.caretaker?.name || unit.landlordId || 'N/A'}
                    </p>
                    {unit.caretaker?.id && (
                      <p className="text-sm text-white/80">ID: {unit.caretaker.id}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Availability Badge */}
              <div className={`rounded-2xl shadow-lg p-6 ${
                unit.available 
                  ? 'bg-gradient-to-br from-green-500 to-green-600' 
                  : 'bg-gradient-to-br from-red-500 to-red-600'
              } text-white`}>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
                    <Shield size={28} />
                  </div>
                  <div>
                    <div className="text-sm opacity-90 mb-1">Availability Status</div>
                    <div className="text-2xl font-bold">
                      {unit.available ? 'Available Now' : 'Not Available'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setConfirmAction(null);
        }}
        onConfirm={handleConfirmAction}
        title={
          confirmAction === 'archive' ? 'Archive Property' :
          confirmAction === 'delete' ? 'Delete Property' :
          'Delete Remark'
        }
        message={
          confirmAction === 'archive' ? `Are you sure you want to archive "${unit?.name}"? It will be hidden from listings.` :
          confirmAction === 'delete' ? `Are you sure you want to delete "${unit?.name}"? This action cannot be undone.` :
          'Are you sure you want to delete this admin remark? This action cannot be undone.'
        }
        confirmText={
          confirmAction === 'archive' ? 'Archive' :
          confirmAction === 'delete' ? 'Delete' :
          'Delete Remark'
        }
        cancelText="Cancel"
        type={confirmAction === 'archive' ? 'warning' : 'danger'}
      />
    </section>
  );
}
