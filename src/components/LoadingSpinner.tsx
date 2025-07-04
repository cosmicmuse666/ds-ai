import React from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-palette-primary-black flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet rounded-xl blur opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet p-4 rounded-xl">
              <GraduationCap className="h-10 w-10 text-palette-primary-black" />
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="h-8 w-8 text-palette-medium-orchid animate-spin" />
          <span className="text-lg font-semibold text-palette-text-light">Loading...</span>
        </div>

        {/* App Name */}
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet bg-clip-text text-transparent">
            GATE DS & AI Study Planner
          </h1>
          <p className="text-palette-text-muted text-sm mt-1">Preparing your study environment</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;