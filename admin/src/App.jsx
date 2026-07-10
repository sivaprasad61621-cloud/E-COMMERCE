import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import ProductsPage from './features/products/ProductsPage';
import CategoriesPage from './features/categories/CategoriesPage';
import OrdersPage from './features/orders/OrdersPage';
import OrderDetailPage from './features/orders/OrderDetailPage';
import CustomersPage from './features/customers/CustomersPage';
import ReportsPage from './features/reports/ReportsPage';
import SettingsPage from './features/settings/SettingsPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={<Navigate to="/" replace />} 
        />
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <Layout>
                <ProductsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/categories" 
          element={
            <ProtectedRoute>
              <Layout>
                <CategoriesPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <Layout>
                <OrdersPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders/:id" 
          element={
            <ProtectedRoute>
              <Layout>
                <OrderDetailPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/customers" 
          element={
            <ProtectedRoute>
              <Layout>
                <CustomersPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <Layout>
                <ReportsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
