import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { resetPassword, resetPasswordSchema } from '../../lib/auth';
import { z } from 'zod';
import AuthLayout from './AuthLayout';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await resetPassword({ email });
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="Password reset instructions sent"
      >
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-palette-yellow to-palette-yellow-bright p-4 rounded-2xl w-fit mx-auto">
            <CheckCircle2 className="h-8 w-8 text-palette-primary-black" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-palette-text-light mb-2">
              Reset Link Sent!
            </h3>
            <p className="text-palette-text-muted mb-4">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="text-sm text-palette-text-muted">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => setSuccess(false)}
                className="text-palette-medium-orchid hover:text-palette-light-violet font-semibold"
              >
                try again
              </button>
            </p>
          </div>

          <Link
            to="/signin"
            className="btn-primary w-full py-3 rounded-xl font-semibold transition-all duration-200 inline-block text-center"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive reset instructions"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Back Link */}
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-palette-medium-orchid hover:text-palette-light-violet font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Sign In
        </Link>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-palette-text-light mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-palette-text-muted" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-palette-medium-orchid/30 rounded-xl bg-palette-bg-darker text-palette-text-light placeholder-palette-text-muted focus:ring-2 focus:ring-palette-medium-orchid focus:border-transparent transition-all duration-200"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-palette-coral/10 border border-palette-coral/30 rounded-xl">
            <p className="text-sm text-palette-coral flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Sending Reset Link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-palette-text-muted">
            Remember your password?{' '}
            <Link
              to="/signin"
              className="text-palette-medium-orchid hover:text-palette-light-violet font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;