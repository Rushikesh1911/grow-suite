import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { AuthLayout } from './components/auth/auth-layout';
import { ProtectedRoute } from './components/auth/protected-route';
import { Toaster } from '@/components/ui/toaster';

// Layouts
import { DashboardLayout } from './components/dashboard/dashboard-layout';

// Pages
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Onboarding from './pages/onboarding';
import TermsOfService from './pages/legal/terms';
import PrivacyPolicy from './pages/legal/privacy';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
import DashboardPage from './pages/dashboard';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Legal pages */}
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Auth routes with layout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password"  element={<ResetPassword />} />
          </Route>
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* Dashboard layout with nested routes */}
            <Route
              element={
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* Add more dashboard routes here */}
              {/* 
              <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
              */}
            </Route>
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;