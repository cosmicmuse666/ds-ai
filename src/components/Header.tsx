import React from 'react';
import { Calendar, BarChart3, BookOpen, Moon, Sun } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

const Header: React.FC = () => {
  const { currentView, setCurrentView, theme, toggleTheme } = useStudy();

  const navItems = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'daily', label: 'Daily View', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ] as const;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                GATE DS & AI Planner
              </h1>
            </div>
          </div>

          <nav className="flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
            
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;