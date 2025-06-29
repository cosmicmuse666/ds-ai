import { supabase } from './supabase';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URL = `${window.location.origin}/auth/callback`;

// Rate limiting for OAuth attempts
class OAuthRateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 3, windowMs = 300000) { // 3 attempts per 5 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  getRemainingTime(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return 0;
    return Math.max(0, attempt.resetTime - Date.now());
  }
}

const oauthRateLimiter = new OAuthRateLimiter();

// CSRF protection for OAuth
const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const storeCSRFToken = (token: string): void => {
  sessionStorage.setItem('oauth_csrf_token', token);
  // Auto-expire after 10 minutes
  setTimeout(() => {
    sessionStorage.removeItem('oauth_csrf_token');
  }, 600000);
};

const validateCSRFToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('oauth_csrf_token');
  sessionStorage.removeItem('oauth_csrf_token');
  return storedToken === token && token.length === 64;
};

// Google OAuth sign-in
export const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Rate limiting check
    const clientId = 'google_oauth_' + (navigator.userAgent || 'unknown');
    if (!oauthRateLimiter.isAllowed(clientId)) {
      const remainingTime = Math.ceil(oauthRateLimiter.getRemainingTime(clientId) / 1000 / 60);
      throw new Error(`Too many OAuth attempts. Please try again in ${remainingTime} minutes.`);
    }

    // Validate Google Client ID
    if (!GOOGLE_CLIENT_ID) {
      throw new Error('Google OAuth is not configured. Please contact support.');
    }

    // Generate and store CSRF token
    const csrfToken = generateCSRFToken();
    storeCSRFToken(csrfToken);

    // Initiate Google OAuth flow with Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: REDIRECT_URL,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          state: csrfToken, // Include CSRF token in state
        },
        scopes: 'openid email profile'
      }
    });

    if (error) {
      console.error('Google OAuth error:', error);
      throw new Error(error.message || 'Failed to initiate Google sign-in');
    }

    return { success: true };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};

// Handle OAuth callback
export const handleOAuthCallback = async (url: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const urlParams = new URLSearchParams(url.split('#')[1] || url.split('?')[1]);
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      let errorMessage = 'Authentication failed';
      
      switch (error) {
        case 'access_denied':
          errorMessage = 'Access was denied. Please try again and grant the necessary permissions.';
          break;
        case 'invalid_request':
          errorMessage = 'Invalid authentication request. Please try again.';
          break;
        case 'unauthorized_client':
          errorMessage = 'Authentication service is not properly configured.';
          break;
        default:
          errorMessage = errorDescription || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    // Validate CSRF token
    if (state && !validateCSRFToken(state)) {
      throw new Error('Security validation failed. Please try signing in again.');
    }

    // Let Supabase handle the session
    const { data, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error('Failed to establish session after authentication');
    }

    if (!data.session) {
      throw new Error('No session found after authentication');
    }

    // Ensure user profile exists
    await ensureUserProfile(data.session.user);

    return { success: true };
  } catch (error) {
    console.error('OAuth callback error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication callback failed'
    };
  }
};

// Ensure user profile exists for OAuth users
const ensureUserProfile = async (user: any) => {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return; // Profile already exists
    }

    // Extract user data from OAuth provider
    const userData = user.user_metadata || {};
    const email = user.email;
    const fullName = userData.full_name || userData.name || '';
    const avatarUrl = userData.avatar_url || userData.picture || '';
    
    // Generate username from email or name
    let username = '';
    if (userData.preferred_username) {
      username = userData.preferred_username;
    } else if (fullName) {
      username = fullName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    } else if (email) {
      username = email.split('@')[0].replace(/[^a-z0-9_]/g, '');
    }

    // Ensure username is unique
    let finalUsername = username;
    let counter = 1;
    while (true) {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', finalUsername)
        .single();

      if (!existingUser) break;
      
      finalUsername = `${username}_${counter}`;
      counter++;
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username: finalUsername,
        full_name: fullName,
        email: email,
        avatar_url: avatarUrl,
        study_preferences: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          theme: 'dark',
          notifications: true
        }
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Don't throw here as the user is already authenticated
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    // Don't throw here as the user is already authenticated
  }
};

// Sign out with additional cleanup
export const signOutWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Clear any OAuth-related storage
    sessionStorage.removeItem('oauth_csrf_token');
    localStorage.removeItem('google_oauth_state');
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }

    // Clear application data
    localStorage.removeItem('gateStudySchedule');
    localStorage.removeItem('gateResetSystemState');
    localStorage.removeItem('rememberMe');

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign out failed'
    };
  }
};

// Check if user signed in with Google
export const isGoogleUser = (user: any): boolean => {
  return user?.app_metadata?.provider === 'google';
};

// Get user's Google profile information
export const getGoogleUserInfo = (user: any) => {
  if (!isGoogleUser(user)) return null;

  const metadata = user.user_metadata || {};
  return {
    name: metadata.full_name || metadata.name,
    email: user.email,
    picture: metadata.avatar_url || metadata.picture,
    emailVerified: metadata.email_verified || false,
    provider: 'google'
  };
};

// Validate Google OAuth configuration
export const validateGoogleOAuthConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!GOOGLE_CLIENT_ID) {
    errors.push('Google Client ID is not configured');
  }

  if (!import.meta.env.VITE_SUPABASE_URL) {
    errors.push('Supabase URL is not configured');
  }

  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    errors.push('Supabase Anon Key is not configured');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};