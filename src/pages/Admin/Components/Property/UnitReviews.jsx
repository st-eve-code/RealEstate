import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, User, Clock } from 'lucide-react';
import { fetchUnitReviews, fetchUnitById } from './services/unitService';

export default function UnitReviews({ isSidebarCollapsed }) {
  const { unitId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [unitId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [unitData, reviewsData] = await Promise.all([
        fetchUnitById(unitId),
        fetchUnitReviews(unitId),
      ]);
      setUnit(unitData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load reviews');
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
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
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

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
            <div className="flex items-center gap-3 mb-2">
              <Star size={24} className="text-yellow-500" />
              <h1 className="text-2xl font-bold text-gray-800">Unit Reviews</h1>
            </div>
            {unit && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h2 className="font-semibold text-lg">{unit.name}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {reviews.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Star size={48} className="mx-auto mb-4 opacity-50" />
              <p>No reviews found for this unit</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.author || `User ${review.uid?.slice(0, 8)}`}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(review.rating || 0)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                  <div className="ml-11">
                    {review.title && (
                      <h3 className="font-semibold text-gray-900 mb-1">{review.title}</h3>
                    )}
                    <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

