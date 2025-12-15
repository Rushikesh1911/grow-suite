import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { AuthLayout } from './components/auth/auth-layout';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import TermsOfService from './pages/legal/terms';
import PrivacyPolicy from './pages/legal/privacy';

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
            <Route path="/forgot-password" element={<div>Forgot Password</div>} />
            <Route path="/reset-password" element={<div>Reset Password</div>} />
          </Route>
          
          {/* Protected routes can be added here */}
          {/* 
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            ... other protected routes
          </Route>
          */}
          
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