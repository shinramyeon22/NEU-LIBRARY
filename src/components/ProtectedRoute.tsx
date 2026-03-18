import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const OnboardingGuard: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) return null;

  if (profile && !profile.college) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export const AdminRoute: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) return null;

  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};