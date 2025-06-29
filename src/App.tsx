import React from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import Header from './components/Header';
import CalendarView from './components/CalendarView';
import DailyTaskView from './components/DailyTaskView';
import ProgressAnalytics from './components/ProgressAnalytics';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
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