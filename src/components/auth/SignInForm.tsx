import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { signIn, signInSchema } from '../../lib/auth';
import { z } from 'zod';
import AuthLayout from './AuthLayout';

const SignInForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    try {
      if (name === 'email') {
        signInSchema.shape.email.parse(value);
      } else if (name === 'password') {
        signInSchema.shape.password.parse(value);
      }
      setErrors(prev => ({ ...prev, [name]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0].message }));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (value) {
      validateField(name, value);
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await signIn(formData, rememberMe);
      // Redirect will be handled by the auth context
      window.location.href = '/';
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your study journey"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-palette-bg-darker text-palette-text-light placeholder-palette-text-muted focus:ring-2 focus:ring-palette-medium-orchid focus:border-transparent transition-all duration-200 ${
                errors.email ? 'border-palette-coral' : 'border-palette-medium-orchid/30'
              }`}
              placeholder="Enter your email"
              required
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-palette-coral flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-palette-text-light mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-palette-text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-palette-bg-darker text-palette-text-light placeholder-palette-text-muted focus:ring-2 focus:ring-palette-medium-orchid focus:border-transparent transition-all duration-200 ${
                errors.password ? 'border-palette-coral' : 'border-palette-medium-orchid/30'
              }`}
              placeholder="Enter your password"
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
          {errors.password && (
            <p className="mt-2 text-sm text-palette-coral flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-palette-medium-orchid bg-palette-bg-darker border-palette-medium-orchid/30 rounded focus:ring-palette-medium-orchid focus:ring-2"
            />
            <span className="ml-2 text-sm text-palette-text-muted">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-palette-medium-orchid hover:text-palette-light-violet font-semibold transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-4 bg-palette-coral/10 border border-palette-coral/30 rounded-xl">
            <p className="text-sm text-palette-coral flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {errors.submit}
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
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-palette-text-muted">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-palette-medium-orchid hover:text-palette-light-violet font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignInForm;