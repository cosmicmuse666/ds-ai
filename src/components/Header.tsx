import React, { useState } from 'react';
import { Calendar, BarChart3, BookOpen, GraduationCap, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../contexts/AuthContext';
import { isGoogleUser, getGoogleUserInfo } from '../lib/googleAuth';

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

  // Get user display information
  const getUserDisplayInfo = () => {
    if (!user) return { name: 'User', email: '', avatar: null, provider: 'email' };

    if (isGoogleUser(user)) {
      const googleInfo = getGoogleUserInfo(user);
      return {
        name: googleInfo?.name || user.user_metadata?.username || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: googleInfo?.picture || null,
        provider: 'google'
      };
    }

    return {
      name: user.user_metadata?.full_name || user.user_metadata?.username || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatar: user.user_metadata?.avatar_url || null,
      provider: 'email'
    };
  };

  const userInfo = getUserDisplayInfo();

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
                {userInfo.avatar ? (
                  <img
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                ) : (
                  <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-coral p-2 rounded-xl">
                    <User className="h-5 w-5 text-palette-white" />
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-palette-text-light">
                    {userInfo.name}
                  </p>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs text-palette-text-muted">
                      {userInfo.email}
                    </p>
                    {userInfo.provider === 'google' && (
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-palette-text-muted transition-transform duration-200 ${
                  showUserMenu ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 glass-card rounded-2xl shadow-xl border border-palette-medium-orchid/20 animate-fade-in">
                  <div className="p-4 border-b border-palette-medium-orchid/20">
                    <div className="flex items-center space-x-3">
                      {userInfo.avatar ? (
                        <img
                          src={userInfo.avatar}
                          alt={userInfo.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-coral p-3 rounded-xl">
                          <User className="h-6 w-6 text-palette-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-palette-text-light truncate">
                          {userInfo.name}
                        </p>
                        <p className="text-sm text-palette-text-muted truncate">
                          {userInfo.email}
                        </p>
                        {userInfo.provider === 'google' && (
                          <div className="flex items-center space-x-1 mt-1">
                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                              <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              />
                              <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              />
                            </svg>
                            <span className="text-xs text-palette-text-muted">Google Account</span>
                          </div>
                        )}
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
                      <span className="text-sm font-medium">Account Settings</span>
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