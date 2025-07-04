import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { updatePassword } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import AuthLayout from './AuthLayout';

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the auth callback
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setError('Invalid or expired reset link');
        return;
      }
      
      if (!data.session) {
        setError('Invalid or expired reset link');
        return;
      }
    };

    handleAuthCallback();
  }, []);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    
    if (strength <= 2) return { level: 'weak', color: 'bg-palette-coral', text: 'Weak' };
    if (strength <= 3) return { level: 'medium', color: 'bg-palette-yellow', text: 'Medium' };
    if (strength <= 4) return { level: 'good', color: 'bg-palette-medium-orchid', text: 'Good' };
    return { level: 'strong', color: 'bg-palette-yellow', text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await updatePassword(password);
      setSuccess(true);
      
      // Redirect to app after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Password Updated"
        subtitle="Your password has been successfully changed"
      >
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-palette-yellow to-palette-yellow-bright p-4 rounded-2xl w-fit mx-auto">
            <CheckCircle2 className="h-8 w-8 text-palette-primary-black" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-palette-text-light mb-2">
              Password Reset Successful!
            </h3>
            <p className="text-palette-text-muted">
              Your password has been updated. You'll be redirected to the app shortly.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-palette-medium-orchid" />
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Choose a strong password for your account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-palette-text-light mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-palette-text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-palette-medium-orchid/30 rounded-xl bg-palette-bg-darker text-palette-text-light placeholder-palette-text-muted focus:ring-2 focus:ring-palette-medium-orchid focus:border-transparent transition-all duration-200"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-palette-text-muted hover:text-palette-text-light transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-palette-text-muted">Password Strength</span>
                <span className={`text-xs font-semibold ${
                  passwordStrength.level === 'strong' ? 'text-palette-yellow' :
                  passwordStrength.level === 'good' ? 'text-palette-medium-orchid' :
                  passwordStrength.level === 'medium' ? 'text-palette-yellow' :
                  'text-palette-coral'
                }`}>
                  {passwordStrength.text}
                </span>
              </div>
              <div className="w-full bg-palette-bg-darker rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.level === 'strong' ? 100 : 
                    passwordStrength.level === 'good' ? 80 :
                    passwordStrength.level === 'medium' ? 60 : 40)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-palette-text-light mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-palette-text-muted" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-palette-bg-darker text-palette-text-light placeholder-palette-text-muted focus:ring-2 focus:ring-palette-medium-orchid focus:border-transparent transition-all duration-200 ${
                confirmPassword && password !== confirmPassword ? 'border-palette-coral' : 'border-palette-medium-orchid/30'
              }`}
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-palette-text-muted hover:text-palette-text-light transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="mt-2 text-sm text-palette-coral flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Passwords do not match
            </p>
          )}
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
          disabled={loading || password !== confirmPassword || !password}
          className="w-full btn-primary py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Updating Password...
            </>
          ) : (
            'Update Password'
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordForm;