// ==========================================
// PetPooja - Main App with Routing
// ==========================================

import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore, useAuthStore, useSidebarStore } from './lib/store';

// Layout
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Auth
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';

// Features
import TableGrid from './features/billing/TableGrid';
import BillingScreen from './features/billing/BillingScreen';
import Dashboard from './features/dashboard/Dashboard';
import Heatmap from './features/dashboard/Heatmap';
import Inventory from './features/inventory/Inventory';
import OnlineOrders from './features/orders/OnlineOrders';
import AIChat from './features/ai/AIChat';
import MenuManagement from './features/menu/MenuManagement';
import RevenueIntelligence from './features/revenue/RevenueIntelligence';
import LandingPage from './features/landing/LandingPage';

function AuthGuard() {
  const { isAuthenticated, loading } = useAuthStore();
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Loading...</div>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/landing" replace />;
  return <Outlet />;
}

function AppLayout() {
  const { collapsed } = useSidebarStore();
  const location = useLocation();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className={`app-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Header />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="app-content"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Placeholder pages for routes not yet fully built
function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{description}</p>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🚧</div>
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Coming Soon</div>
        <div className="text-secondary">This module is under development</div>
      </div>
    </div>
  );
}

import SettingsLayout from './features/settings/SettingsLayout';
import Overview from './features/settings/sections/Overview';
import RestaurantProfile from './features/settings/sections/RestaurantProfile';
import BillConfiguration from './features/settings/sections/BillConfiguration';
import Integrations from './features/settings/sections/Integrations';
import NotificationSettings from './features/settings/sections/NotificationSettings';
import StaffPreferences from './features/settings/sections/StaffPreferences';
import ReportPreferences from './features/settings/sections/ReportPreferences';
import DataBackup from './features/settings/sections/DataBackup';
import SecuritySettings from './features/settings/sections/SecuritySettings';
import Appearance from './features/settings/sections/Appearance';

import SecurityLayout from './features/security/SecurityLayout';
import RoleBasedAccessControl from './features/security/sections/RoleBasedAccessControl';
import PasswordManagement from './features/security/sections/PasswordManagement';
import TwoFactorAuth from './features/security/sections/TwoFactorAuth';
import SessionTimeout from './features/security/sections/SessionTimeout';
import AuditLogs from './features/security/sections/AuditLogs';
import RlsPolicies from './features/security/sections/RlsPolicies';

import StaffLayout from './features/staff/StaffLayout';
import StaffList from './features/staff/sections/StaffList';
import StaffForm from './features/staff/sections/StaffForm';
import RoleTemplates from './features/staff/sections/RoleTemplates';
import PermissionsMatrix from './features/staff/sections/PermissionsMatrix';
import ShiftTracking from './features/staff/sections/ShiftTracking';
import StaffPerformance from './features/staff/sections/StaffPerformance';
import StaffActivityLogs from './features/staff/sections/StaffActivityLogs';

import AlertsLayout from './features/alerts/AlertsLayout';
import AlertsOverview from './features/alerts/sections/Overview';
import TableAlerts from './features/alerts/sections/TableAlerts';
import OrderAlerts from './features/alerts/sections/OrderAlerts';
import OperationalAlerts from './features/alerts/sections/OperationalAlerts';
import AIAlerts from './features/alerts/sections/AIAlerts';
import AlertSettings from './features/alerts/sections/AlertSettings';

export default function App() {
  const { theme } = useThemeStore();
  const { initAuth } = useAuthStore();

  // Initialize auth and theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    initAuth();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<AuthGuard />}>
          {/* Billing Screen (Full Screen) */}
          <Route path="/billing" element={<BillingScreen />} />

          {/* Main Layout Routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<TableGrid />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/heatmap" element={<Heatmap />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/orders" element={<OnlineOrders />} />
            <Route path="/ai" element={<AIChat />} />
            <Route path="/revenue" element={<RevenueIntelligence />} />

            {/* Staff Module */}
            <Route path="/staff" element={<StaffLayout />}>
              <Route index element={<Navigate to="list" replace />} />
              <Route path="list" element={<StaffList />} />
              <Route path="form" element={<StaffForm />} />
              <Route path="roles" element={<RoleTemplates />} />
              <Route path="permissions" element={<PermissionsMatrix />} />
              <Route path="shifts" element={<ShiftTracking />} />
              <Route path="performance" element={<StaffPerformance />} />
              <Route path="logs" element={<StaffActivityLogs />} />
            </Route>

            {/* Smart Alerts Module */}
            <Route path="/alerts" element={<AlertsLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<AlertsOverview />} />
              <Route path="tables" element={<TableAlerts />} />
              <Route path="orders" element={<OrderAlerts />} />
              <Route path="operational" element={<OperationalAlerts />} />
              <Route path="ai" element={<AIAlerts />} />
              <Route path="settings" element={<AlertSettings />} />
            </Route>

            {/* Security Module */}
            <Route path="/security" element={<SecurityLayout />}>
              <Route index element={<Navigate to="rbac" replace />} />
              <Route path="rbac" element={<RoleBasedAccessControl />} />
              <Route path="password" element={<PasswordManagement />} />
              <Route path="2fa" element={<TwoFactorAuth />} />
              <Route path="sessions" element={<SessionTimeout />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="rls" element={<RlsPolicies />} />
            </Route>

            {/* Settings Module */}
            <Route path="/settings" element={<SettingsLayout />}>
              <Route index element={<Overview />} />
              <Route path="profile" element={<RestaurantProfile />} />
              <Route path="billing" element={<BillConfiguration />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="notifications" element={<NotificationSettings />} />
              <Route path="staff" element={<StaffPreferences />} />
              <Route path="reports" element={<ReportPreferences />} />
              <Route path="backup" element={<DataBackup />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route path="appearance" element={<Appearance />} />
            </Route>

          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
