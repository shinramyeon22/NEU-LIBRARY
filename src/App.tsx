import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, OnboardingGuard, AdminRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import SessionEntry from './pages/SessionEntry';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin'; // ← NEW

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
            
            <Route element={<OnboardingGuard />}>
              <Route path="/" element={<SessionEntry />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* NEW ADMIN ROUTE */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;