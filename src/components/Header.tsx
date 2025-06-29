import React, { useState } from 'react';
import { Calendar, BarChart3, BookOpen, GraduationCap, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { currentView, setCurrentView } = useStudy();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'daily', label: 'Daily View', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ] as const;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

          <div className="flex items-center space-x-4">
            {/* Navigation */}
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

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 glass-card-light rounded-2xl p-3 hover:bg-palette-medium-orchid/20 transition-all duration-200"
              >
                <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-coral p-2 rounded-xl">
                  <User className="h-5 w-5 text-palette-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-palette-text-light">
                    {user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-palette-text-muted">
                    {user?.email}
                  </p>
                </div>
                <ChevronDown className={`h-4 w-4 text-palette-text-muted transition-transform duration-200 ${
                  showUserMenu ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 glass-card rounded-2xl shadow-xl border border-palette-medium-orchid/20 animate-fade-in">
                  <div className="p-4 border-b border-palette-medium-orchid/20">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-coral p-2 rounded-xl">
                        <User className="h-6 w-6 text-palette-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-palette-text-light">
                          {user?.user_metadata?.full_name || user?.user_metadata?.username || 'User'}
                        </p>
                        <p className="text-sm text-palette-text-muted">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Add profile/settings functionality here
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-palette-text-light hover:bg-palette-medium-orchid/20 transition-all duration-200"
                    >
                      <Settings className="h-5 w-5 text-palette-text-muted" />
                      <span className="text-sm font-medium">Settings</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-palette-coral hover:bg-palette-coral/20 transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;