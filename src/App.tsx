import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StudyProvider } from './context/StudyContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SignInForm from './components/auth/SignInForm';
import SignUpForm from './components/auth/SignUpForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import OAuthCallback from './components/auth/OAuthCallback';
import Header from './components/Header';
import CalendarView from './components/CalendarView';
import DailyTaskView from './components/DailyTaskView';
import ProgressAnalytics from './components/ProgressAnalytics';
import FloatingVoiceButton from './components/FloatingVoiceButton';
import { useStudy } from './context/StudyContext';

const AppContent: React.FC = () => {
  const { currentView } = useStudy();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView />;
      case 'daily':
        return <DailyTaskView />;
      case 'analytics':
        return <ProgressAnalytics />;
      default:
        return <CalendarView />;
    }
  };

  return (
    <div className="min-h-screen bg-palette-primary-black transition-all duration-500">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
      <FloatingVoiceButton />
    </div>
  );
};

const ProtectedApp: React.FC = () => {
  return (
    <ProtectedRoute>
      <StudyProvider>
        <AppContent />
      </StudyProvider>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          
          {/* Protected App Routes */}
          <Route path="/" element={<ProtectedApp />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;