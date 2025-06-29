import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { handleOAuthCallback } from '../../lib/googleAuth';
import LoadingSpinner from '../LoadingSpinner';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const fullUrl = window.location.href;
        const result = await handleOAuthCallback(fullUrl);

        if (result.success) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Redirect to the intended page or home
          const from = location.state?.from?.pathname || '/';
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1500);
        } else {
          setStatus('error');
          setMessage(result.error || 'Authentication failed');
          
          // Redirect to sign-in page after error
          setTimeout(() => {
            navigate('/signin', { replace: true });
          }, 3000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred during authentication');
        
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 3000);
      }
    };

    processCallback();
  }, [navigate, location]);

  if (status === 'processing') {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-palette-primary-black flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Status Icon */}
        <div className="flex justify-center">
          {status === 'success' ? (
            <div className="bg-gradient-to-r from-palette-yellow to-palette-yellow-bright p-4 rounded-2xl">
              <CheckCircle2 className="h-12 w-12 text-palette-primary-black" />
            </div>
          ) : (
            <div className="bg-gradient-to-r from-palette-coral to-palette-coral-light p-4 rounded-2xl">
              <AlertCircle className="h-12 w-12 text-palette-white" />
            </div>
          )}
        </div>

        {/* Message */}
        <div>
          <h2 className="text-2xl font-bold text-palette-text-light mb-2">
            {status === 'success' ? 'Welcome!' : 'Authentication Error'}
          </h2>
          <p className="text-palette-text-muted">{message}</p>
        </div>

        {/* Loading indicator for success */}
        {status === 'success' && (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-palette-medium-orchid" />
            <span className="text-sm text-palette-text-muted">Redirecting...</span>
          </div>
        )}

        {/* Manual redirect for error */}
        {status === 'error' && (
          <button
            onClick={() => navigate('/signin', { replace: true })}
            className="btn-primary px-6 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;