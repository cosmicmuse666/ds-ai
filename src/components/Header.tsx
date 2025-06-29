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
    <header className="glass-card border-b border-palette-purple/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-palette-purple to-palette-yellow rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-palette-purple to-palette-yellow p-2.5 rounded-xl">
                  <GraduationCap className="h-7 w-7 text-palette-dark" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-palette-purple to-palette-yellow bg-clip-text text-transparent">
                  GATE DS & AI
                </h1>
                <p className="text-sm text-palette-text-light/70 -mt-1">Study Planner</p>
              </div>
            </div>
          </div>

          <nav className="flex items-center space-x-2">
            <div className="flex items-center glass-card-light rounded-2xl p-1.5 backdrop-blur-sm">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentView(id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    currentView === id
                      ? 'btn-primary shadow-purple'
                      : 'text-palette-text-light/80 hover:bg-palette-purple/20 hover:text-palette-purple'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">{label}</span>
                </button>
              ))}
            </div>
            
            <button
              onClick={toggleTheme}
              className="ml-3 p-3 rounded-xl text-palette-text-light/80 hover:bg-palette-purple/20 hover:text-palette-purple transition-all duration-200 hover:scale-105"
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