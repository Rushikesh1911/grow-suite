import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { AuthLayout } from './components/auth/auth-layout';
import { ProtectedRoute } from './components/auth/protected-route';
import { Toaster } from '@/components/ui/toaster';

// Layouts
import { AppLayout } from './components/app/app-layout';

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
import ClientsPage from './pages/clients';
import ClientDetailPage from './pages/clients/[id]';
import ProjectsPage from './pages/projects';
import InvoicesPage from './pages/invoices';

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
            
            {/* Dashboard routes with layout */}
            <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
            <Route path="/projects" element={<AppLayout><ProjectsPage /></AppLayout>} />
            <Route path="/clients" element={<AppLayout><ClientsPage /></AppLayout>} />
            <Route path="/clients/:id" element={<AppLayout><ClientDetailPage /></AppLayout>} />
            <Route path="/invoices" element={<AppLayout><InvoicesPage /></AppLayout>} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<Navigate to="/notfound" replace />} />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;