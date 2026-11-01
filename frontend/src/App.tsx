import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/Layout/Layout';
import HomePage from '@/pages/HomePage';
import ProgramPage from '@/pages/ProgramPage';
import AboutPage from '@/pages/AboutPage';
import AdminPage from '@/pages/AdminPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { useAuthStore } from '@/store/authStore';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-gdm-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gdm-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-gdm-muted text-sm">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#131929',
            color: '#F1F5F9',
            border: '1px solid #1E2D45',
          },
        }}
      />
      <Routes>
        {/* Public routes with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="programacao" element={<ProgramPage />} />
          <Route path="sobre" element={<AboutPage />} />
        </Route>

        {/* Admin login (no layout) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected admin panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

