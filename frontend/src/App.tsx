import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SplashLoadingScreen } from './components/loading/SplashLoadingScreen';
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Authenticated Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { RequirementsListPage } from './pages/requirements/RequirementsListPage';
import { NewRequirementPage } from './pages/requirements/NewRequirementPage';
import { FreightIntelligencePage } from './pages/freight/FreightIntelligencePage';
import { VesselOptimizerPage } from './pages/vessels/VesselOptimizerPage';
import { PortIntelligencePage } from './pages/ports/PortIntelligencePage';
import { CostIntelligencePage } from './pages/cost/CostIntelligencePage';
import { AICharterAdvisorPage } from './pages/charter/AICharterAdvisorPage';
import { ShipmentsListPage } from './pages/shipments/ShipmentsListPage';
import { ShipmentDetailPage } from './pages/shipments/ShipmentDetailPage';
import { LiveTrackingPage } from './pages/tracking/LiveTrackingPage';
import { EtaIntelligencePage } from './pages/eta/EtaIntelligencePage';
import { RiskAlertCenterPage } from './pages/alerts/RiskAlertCenterPage';
import { WhatIfSimulatorPage } from './pages/simulator/WhatIfSimulatorPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { MasterDataPage } from './pages/admin/MasterDataPage';
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';

import { PageLoadingSpinner } from './components/loading/PageLoadingSpinner';

// Splash screen wrapper for initial landing experience
const SplashWrapper: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashLoadingScreen onComplete={() => setShowSplash(false)} />;
  }

  return <LandingPage />;
};

// Route protection component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8FC]">
        <PageLoadingSpinner message="Authenticating I-STELX Session..." subMessage="Verifying credentials & security tokens" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SplashWrapper />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Authenticated Dashboard & Workspace Shell */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Planning */}
            <Route path="/requirements" element={<RequirementsListPage />} />
            <Route path="/requirements/new" element={<NewRequirementPage />} />
            <Route path="/freight" element={<FreightIntelligencePage />} />
            <Route path="/vessels" element={<VesselOptimizerPage />} />
            <Route path="/ports" element={<PortIntelligencePage />} />
            <Route path="/cost" element={<CostIntelligencePage />} />

            {/* Operations */}
            <Route path="/tracking" element={<LiveTrackingPage />} />
            <Route path="/shipments" element={<ShipmentsListPage />} />
            <Route path="/shipments/:id" element={<ShipmentDetailPage />} />
            <Route path="/alerts" element={<RiskAlertCenterPage />} />

            {/* Intelligence */}
            <Route path="/charter-advisor" element={<AICharterAdvisorPage />} />
            <Route path="/simulator" element={<WhatIfSimulatorPage />} />
            <Route path="/eta" element={<EtaIntelligencePage />} />

            {/* Analytics & Reports */}
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/reports" element={<ReportsPage />} />

            {/* Administration */}
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/master-data" element={<MasterDataPage />} />
            <Route path="/admin/settings" element={<SystemSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
