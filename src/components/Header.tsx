import React from 'react';
import { Calendar, BarChart3, BookOpen, Moon, Sun, GraduationCap } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

const Header: React.FC = () => {
  const { currentView, setCurrentView, theme, toggleTheme } = useStudy();

  const navItems = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'daily', label: 'Daily View', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ] as const;

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  GATE DS & AI
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 -mt-1">Study Planner</p>
              </div>
            </div>
          </div>

          <nav className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 backdrop-blur-sm">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentView(id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    currentView === id
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/20'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">{label}</span>
                </button>
              ))}
            </div>
            
            <button
              onClick={toggleTheme}
              className="ml-3 p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
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