import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Clock, MapPin, DollarSign, Eye, ArrowRight, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface RecentlyViewedProps {
  variant?: 'sidebar' | 'full'; // sidebar for dashboard widget, full for dedicated page
  maxItems?: number;
}

export default function RecentlyViewed({ variant = 'sidebar', maxItems = 5 }: RecentlyViewedProps) {
  const { viewedUnits, user, refreshViewedUnits } = useAuth();
  const router = useRouter();

  const displayedUnits = viewedUnits.slice(0, maxItems);

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Recently';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  const handleRemove = async (unitId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid, 'lastViewedUnits', unitId);
      await deleteDoc(docRef);
      await refreshViewedUnits();
      console.log('[Recently Viewed] Removed unit:', unitId);
    } catch (error) {
      console.error('[Recently Viewed] Error removing unit:', error);
    }
  };

  const handleViewProperty = (unitId: string) => {
    router.push(`/dashboard/properties/${unitId}`);
  };

  if (viewedUnits.length === 0) {
    return (
      <div className={`${variant === 'sidebar' ? 'bg-white rounded-lg shadow-sm border border-gray-200 p-4' : 'bg-white rounded-xl shadow-md p-6'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-blue-600" size={20} />
          <h3 className={`font-bold text-gray-900 ${variant === 'sidebar' ? 'text-base' : 'text-xl'}`}>
            Recently Viewed
          </h3>
        </div>
        <div className="text-center py-8">
          <Eye size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No properties viewed yet</p>
          <p className="text-xs text-gray-400 mt-1">Browse properties to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${variant === 'sidebar' ? 'bg-white rounded-lg shadow-sm border border-gray-200 p-4' : 'bg-white rounded-xl shadow-md p-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="text-blue-600" size={20} />
          <h3 className={`font-bold text-gray-900 ${variant === 'sidebar' ? 'text-base' : 'text-xl'}`}>
            Recently Viewed
          </h3>
        </div>
        {variant === 'sidebar' && viewedUnits.length > maxItems && (
          <button
            onClick={() => router.push('/dashboard/history')}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      {/* Property List */}
      <div className="space-y-3">
        {displayedUnits.map((unit) => (
          <div
            key={unit.id}
            onClick={() => handleViewProperty(unit.id)}
            className="group cursor-pointer border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex gap-3">
              {/* Placeholder for property image - you can add image URL to LastViewedUnit if available */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                <Eye size={24} className="text-blue-600" />
              </div>

              {/* Property Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                  {unit.name}
                </h4>
                
                {/* Location */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin size={12} />
                  <span className="truncate">{unit.location.city}, {unit.location.country}</span>
                </div>

                {/* Price and Time */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                    <DollarSign size={12} />
                    <span>{unit.payment.price?.toLocaleString()} {unit.payment.currency}</span>
                    {unit.payment.period && (
                      <span className="text-gray-500 font-normal">/{unit.payment.period}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(unit.viewedAt)}
                  </span>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => handleRemove(unit.id, e)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                title="Remove from history"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {variant === 'full' && viewedUnits.length > maxItems && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Showing {maxItems} of {viewedUnits.length} properties
          </p>
        </div>
      )}
    </div>
  );
}
