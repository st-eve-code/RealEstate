import React from 'react';
import { useCaretakerActivities } from '@/Hooks/useCaretakerStats';
import { 
  Home, 
  Eye, 
  MessageSquare, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Upload,
  Edit,
  Clock
} from 'lucide-react';

const getActivityIcon = (type) => {
  switch (type) {
    case 'property_listed':
      return { icon: Home, color: 'text-blue-600', bg: 'bg-blue-100' };
    case 'property_viewed':
      return { icon: Eye, color: 'text-green-600', bg: 'bg-green-100' };
    case 'message_received':
      return { icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' };
    case 'payment_received':
      return { icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' };
    case 'property_updated':
      return { icon: Edit, color: 'text-orange-600', bg: 'bg-orange-100' };
    case 'media_uploaded':
      return { icon: Upload, color: 'text-blue-600', bg: 'bg-blue-100' };
    case 'error':
      return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' };
    case 'success':
      return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' };
    default:
      return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' };
  }
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

// Fallback activities if none exist
const defaultActivities = [
  { type: 'property_listed', title: 'Welcome to your dashboard', timestamp: new Date() },
  { type: 'success', title: 'Account setup completed', timestamp: new Date(Date.now() - 3600000) },
];

export default function RecentActivities({ userId }) {
  const { activities, loading } = useCaretakerActivities(userId, 5);

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-2">Recent Activities</h4>
      <p className="text-xs text-gray-500 mb-4">Latest updates and actions</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {displayActivities.map((activity, i) => {
            const { icon: Icon, color, bg } = getActivityIcon(activity.type);
            
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 group"
              >
                <div className={`${bg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 line-clamp-2">
                    {activity.title || activity.message || 'Activity'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTimeAgo(activity.timestamp || activity.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View All Button */}
      {activities.length > 0 && (
        <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
          View All Activities
        </button>
      )}
    </div>
  );
}