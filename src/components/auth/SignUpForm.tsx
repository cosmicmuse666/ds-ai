import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { signUp, signUpSchema } from '../../lib/auth';
import { z } from 'zod';
import AuthLayout from './AuthLayout';

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateField = (name: string, value: string) => {
    try {
      if (name === 'email') {
        signUpSchema.shape.email.parse(value);
      } else if (name === 'password') {
        signUpSchema.shape.password.parse(value);
      } else if (name === 'username') {
        signUpSchema.shape.username.parse(value);
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

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const result = await signUp(formData);
      
      if (result.needsEmailConfirmation) {
        setSuccess(true);
      } else {
        // User is automatically signed in
        window.location.href = '/';
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent you a confirmation link"
      >
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-palette-yellow to-palette-yellow-bright p-4 rounded-2xl w-fit mx-auto">
            <CheckCircle2 className="h-8 w-8 text-palette-primary-black" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-palette-text-light mb-2">
              Account Created Successfully!
            </h3>
            <p className="text-palette-text-muted mb-4">
              Please check your email and click the confirmation link to activate your account.
            </p>
            <p className="text-sm text-palette-text-muted">
              Didn't receive the email? Check your spam folder or{' '}
              <button className="text-palette-medium-orchid hover:text-palette-light-violet font-semibold">
                resend confirmation
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
      title="Create Account"
      subtitle="Start your GATE preparation journey"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-palette-text-light mb-2">
            Full Name (Optional)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-palette-text-muted" />
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-palette-medium-orchid/30 rounded-xl bg-palette-bg-darker text-palette-text-light placeholder-palette-text-muted focus:ring-2 focus:ring-palette-medium-orchid focus:border-transparent transition-all duration-200"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-palette-text-light mb-2">
            Username *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-palette-text-muted" />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-palette-bg-darker text-palette-text-light placeholder-palette-text-muted focus:ring-2 focus:ring-palette-medium-orchid focus:border-transparent transition-all duration-200 ${
                errors.username ? 'border-palette-coral' : 'border-palette-medium-orchid/30'
              }`}
              placeholder="Choose a username"
              required
            />
          </div>
          {errors.username && (
            <p className="mt-2 text-sm text-palette-coral flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.username}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-palette-text-light mb-2">
            Email Address *
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
            Password *
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
              placeholder="Create a strong password"
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
          {formData.password && (
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
                  style={{ width: `${(getPasswordStrength(formData.password).level === 'strong' ? 100 : 
                    getPasswordStrength(formData.password).level === 'good' ? 80 :
                    getPasswordStrength(formData.password).level === 'medium' ? 60 : 40)}%` }}
                />
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-2 text-sm text-palette-coral flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.password}
            </p>
          )}
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-palette-text-muted">
            Already have an account?{' '}
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

export default SignUpForm;