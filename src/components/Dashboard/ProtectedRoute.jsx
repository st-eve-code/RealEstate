import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import Loader from '@/components/ado/loader';

/**
 * Protected Route Component
 * 
 * Handles role-based access control for dashboard routes.
 * Redirects to login if not authenticated, or shows access denied if wrong role.
 * 
 * @param {React.ReactNode} children - The component to render if access is granted
 * @param {string[]} allowedRoles - Array of allowed role strings (e.g., ['user', 'landlord', 'admin'])
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, firebaseUser, loadingUser } = useAuth();

  // Show loading state while checking authentication
  if (loadingUser) {
    return (
      <div className="absolute top-0 left-0 w-screen h-screen">
        <Loader style='factory-stack' />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!firebaseUser || !user) {
    return <Navigate to="/login" replace />;
  }

  // Get user role
  const userRole = user.role?.role || 'user';

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User is authenticated but doesn't have required role
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Required role: {allowedRoles.join(' or ')}.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has required role, render the children
  return <>{children}</>;
}

