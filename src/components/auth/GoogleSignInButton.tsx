import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { signInWithGoogle, validateGoogleOAuthConfig } from '../../lib/googleAuth';

interface GoogleSignInButtonProps {
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  onError, 
  disabled = false,
  className = ""
}) => {
  const [loading, setLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  React.useEffect(() => {
    // Validate configuration on component mount
    const { valid, errors } = validateGoogleOAuthConfig();
    if (!valid) {
      setConfigError(errors.join(', '));
    }
  }, []);

  const handleGoogleSignIn = async () => {
    if (configError) {
      onError?.(configError);
      return;
    }

    setLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      if (!result.success) {
        onError?.(result.error || 'Google sign-in failed');
      }
      // If successful, the OAuth flow will redirect the user
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (configError) {
    return (
      <div className="w-full p-3 bg-palette-coral/10 border border-palette-coral/30 rounded-xl">
        <div className="flex items-center space-x-2 text-palette-coral">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">Google sign-in is not available</span>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center space-x-3 px-4 py-3 border border-palette-medium-orchid/30 rounded-xl bg-palette-bg-darker hover:bg-palette-bg-light text-palette-text-light font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-palette-medium-orchid/50 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Connecting to Google...</span>
        </>
      ) : (
        <>
          <svg className="h-5 w-5" viewBox="0 0 24 24">
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
          <span>Continue with Google</span>
        </>
      )}
    </button>
  );
};

export default GoogleSignInButton;