import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/components/Dashboard/ProtectedRoute';
import Loader from '@/components/ado/loader';

// Import dashboard components
import UserDashboard from './User/Dashboard';
import CaretakerDashboard from './Caretaker/Dashboard';
import AdminDashboard from './Admin/Admin';

/**
 * Unified Dashboard Router
 * 
 * This component handles role-based routing for all dashboard routes.
 * All routes are under /dashboard/* and the appropriate dashboard
 * is rendered based on the user's role.
 */
export default function Dashboard() {
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
  if (!firebaseUser && !user) {
    return <Navigate to="/login" replace />;
  }

  if(!user) {
    return (
      <div className='absolute top-0 left-0 w-screen h-screen'>
        <Loader style='dot-121' />
      </div>
    )
  }

  // Get user role
  const userRole = user.role?.role || 'user';

  return (
    <Routes>
      {/* User Dashboard Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute allowedRoles={['user', 'landlord', 'admin']}>
            {userRole === 'user' ? (
              <UserDashboard />
            ) : userRole === 'landlord' ? (
              <CaretakerDashboard />
            ) : userRole === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

