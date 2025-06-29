import React from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import Header from './components/Header';
import CalendarView from './components/CalendarView';
import DailyTaskView from './components/DailyTaskView';
import ProgressAnalytics from './components/ProgressAnalytics';
import FloatingVoiceButton from './components/FloatingVoiceButton';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
      <FloatingVoiceButton />
    </div>
  );
};

function App() {
  return (
    <StudyProvider>
      <AppContent />
    </StudyProvider>
  );
}

export default App;