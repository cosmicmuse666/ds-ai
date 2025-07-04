import React from 'react';
import { CheckCircle2, XCircle, X, RotateCcw } from 'lucide-react';

interface ResetNotificationProps {
  show: boolean;
  type: 'success' | 'error';
  message: string;
  onDismiss: () => void;
}

const ResetNotification: React.FC<ResetNotificationProps> = ({
  show,
  type,
  message,
  onDismiss
}) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className={`glass-card rounded-2xl shadow-2xl p-4 max-w-sm border ${
        type === 'success' 
          ? 'border-palette-yellow/30 bg-palette-yellow/10' 
          : 'border-palette-coral/30 bg-palette-coral/10'
      }`}>
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-xl ${
            type === 'success' 
              ? 'bg-palette-yellow/20' 
              : 'bg-palette-coral/20'
          }`}>
            {type === 'success' ? (
              <CheckCircle2 className={`h-5 w-5 ${
                type === 'success' ? 'text-palette-yellow' : 'text-palette-coral'
              }`} />
            ) : (
              <XCircle className="h-5 w-5 text-palette-coral" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <RotateCcw className="h-4 w-4 text-palette-text-light" />
              <h4 className="font-semibold text-palette-text-light text-sm">
                {type === 'success' ? 'Reset Complete' : 'Reset Failed'}
              </h4>
            </div>
            <p className="text-xs text-palette-text-muted leading-relaxed">
              {message}
            </p>
          </div>
          
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-palette-text-muted hover:text-palette-text-light hover:bg-palette-bg-light/50 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetNotification;