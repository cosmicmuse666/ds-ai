import React from 'react';
import { Calendar, BarChart3, BookOpen, GraduationCap } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

const Header: React.FC = () => {
  const { currentView, setCurrentView } = useStudy();

  const navItems = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'daily', label: 'Daily View', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ] as const;

  return (
    <header className="glass-card border-b border-palette-medium-orchid/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet p-2.5 rounded-xl">
                  <GraduationCap className="h-7 w-7 text-palette-primary-black" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet bg-clip-text text-transparent">
                  GATE DS & AI
                </h1>
                <p className="text-sm text-palette-text-muted -mt-1">Study Planner</p>
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
                      : 'text-palette-text-light hover:bg-palette-medium-orchid/20 hover:text-palette-medium-orchid'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">{label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;