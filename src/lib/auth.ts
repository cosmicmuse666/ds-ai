import { supabase } from './supabase';
import { z } from 'zod';

// Validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional()
});

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

// Rate limiting
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 60000) {
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

const authRateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Auth functions
export const signUp = async (data: z.infer<typeof signUpSchema>) => {
  try {
    // Validate input
    const validatedData = signUpSchema.parse(data);
    
    // Rate limiting
    const clientId = 'signup_' + (navigator.userAgent || 'unknown');
    if (!authRateLimiter.isAllowed(clientId)) {
      const remainingTime = Math.ceil(authRateLimiter.getRemainingTime(clientId) / 1000);
      throw new Error(`Too many signup attempts. Please try again in ${remainingTime} seconds.`);
    }

    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeInput(validatedData.email.toLowerCase()),
      password: validatedData.password,
      username: sanitizeInput(validatedData.username),
      fullName: validatedData.fullName ? sanitizeInput(validatedData.fullName) : undefined
    };

    // Check if username is already taken
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', sanitizedData.username)
      .single();

    if (existingProfile) {
      throw new Error('Username is already taken');
    }

    // Sign up with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: sanitizedData.email,
      password: sanitizedData.password,
      options: {
        data: {
          username: sanitizedData.username,
          full_name: sanitizedData.fullName
        }
      }
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create user account');
    }

    return {
      user: authData.user,
      session: authData.session,
      needsEmailConfirmation: !authData.session
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
};

export const signIn = async (data: z.infer<typeof signInSchema>, rememberMe = false) => {
  try {
    // Validate input
    const validatedData = signInSchema.parse(data);
    
    // Rate limiting
    const clientId = 'signin_' + validatedData.email;
    if (!authRateLimiter.isAllowed(clientId)) {
      const remainingTime = Math.ceil(authRateLimiter.getRemainingTime(clientId) / 1000);
      throw new Error(`Too many login attempts. Please try again in ${remainingTime} seconds.`);
    }

    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeInput(validatedData.email.toLowerCase()),
      password: validatedData.password
    };

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: sanitizedData.email,
      password: sanitizedData.password
    });

    if (authError) {
      throw authError;
    }

    // Handle remember me functionality
    if (rememberMe && authData.session) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }

    return {
      user: authData.user,
      session: authData.session
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear local storage
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('gateStudySchedule');
    localStorage.removeItem('gateResetSystemState');
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data: z.infer<typeof resetPasswordSchema>) => {
  try {
    // Validate input
    const validatedData = resetPasswordSchema.parse(data);
    
    // Rate limiting
    const clientId = 'reset_' + validatedData.email;
    if (!authRateLimiter.isAllowed(clientId)) {
      const remainingTime = Math.ceil(authRateLimiter.getRemainingTime(clientId) / 1000);
      throw new Error(`Too many reset attempts. Please try again in ${remainingTime} seconds.`);
    }

    // Sanitize input
    const email = sanitizeInput(validatedData.email.toLowerCase());

    // Send reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    // Validate password
    const validatedPassword = signUpSchema.shape.password.parse(newPassword);

    const { error } = await supabase.auth.updateUser({
      password: validatedPassword
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    return null;
  }
};

export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    return null;
  }
};