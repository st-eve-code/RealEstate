import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

/**
 * Protected Route Component for Caretaker Dashboard
 * 
 * Only allows access to users with "landlord" role.
 * Redirects to login if not authenticated, or shows access denied if not a landlord.
 */
export default function ProtectedCaretakerRoute({ children }) {
  const { user, firebaseUser, loadingUser } = useAuth();

  // Show loading state while checking authentication
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!firebaseUser || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is a landlord
  const isLandlord = user.role?.role === 'landlord';

  if (!isLandlord) {
    // User is authenticated but not a landlord
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You need to be a landlord to access the Caretaker Dashboard.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and is a landlord, render the children
  return <>{children}</>;
}

