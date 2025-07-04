import React from 'react';
import { GraduationCap } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-palette-primary-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet rounded-xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet p-3 rounded-xl">
                <GraduationCap className="h-8 w-8 text-palette-primary-black" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet bg-clip-text text-transparent mb-2">
            GATE DS & AI Study Planner
          </h1>
          <h2 className="text-xl font-bold text-palette-text-light mb-2">{title}</h2>
          <p className="text-palette-text-muted">{subtitle}</p>
        </div>

        {/* Form Container */}
        <div className="glass-card rounded-3xl shadow-xl p-8">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-palette-text-muted">
            Secure authentication powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;