# Google OAuth 2.0 Setup Guide

This guide will help you set up Google OAuth 2.0 authentication for your GATE DS & AI Study Planner application.

## 🚀 Quick Setup Overview

1. **Google Cloud Console Setup** - Create OAuth credentials
2. **Supabase Configuration** - Enable Google provider
3. **Environment Variables** - Configure your app
4. **Testing** - Verify the integration

---

## 📋 Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `gate-study-planner`
4. Click "Create"

### 1.2 Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 1.3 Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - **App name**: `GATE DS & AI Study Planner`
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses for testing)
6. Save and continue

### 1.4 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Configure:
   - **Name**: `GATE Study Planner Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:5173/auth/callback` (for development)
     - `https://yourdomain.com/auth/callback` (for production)
     - Your Supabase auth callback URL (see Step 2)

5. Click "Create"
6. **Save the Client ID** - you'll need this for your environment variables

---

## 🔧 Step 2: Supabase Configuration

### 2.1 Enable Google Provider

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Authentication" → "Providers"
4. Find "Google" and toggle it on
5. Enter your Google OAuth credentials:
   - **Client ID**: From Step 1.4
   - **Client Secret**: From Step 1.4
6. Copy the **Callback URL** provided by Supabase
7. Add this callback URL to your Google OAuth configuration (Step 1.4)

### 2.2 Configure Site URL

1. In Supabase Dashboard, go to "Authentication" → "URL Configuration"
2. Set **Site URL** to:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:5173/auth/callback`
   - `https://yourdomain.com/auth/callback`

---

## 🔐 Step 3: Environment Variables

### 3.1 Update Your .env File

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_from_step_1_4

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME="GATE DS & AI Study Planner"

# Security Configuration
VITE_RATE_LIMIT_REQUESTS=5
VITE_RATE_LIMIT_WINDOW=60000

# Environment
VITE_ENVIRONMENT=development
```

### 3.2 Production Environment

For production, update the URLs:
```bash
VITE_APP_URL=https://yourdomain.com
VITE_ENVIRONMENT=production
```

---

## 🧪 Step 4: Testing the Integration

### 4.1 Development Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173/signin`

3. Click "Continue with Google"

4. Complete the OAuth flow

5. Verify you're redirected back and signed in

### 4.2 Test User Profile Creation

1. Check your Supabase Dashboard → "Authentication" → "Users"
2. Verify the Google user appears
3. Check "Table Editor" → "profiles" table
4. Confirm a profile was created with Google user data

---

## 🔒 Security Features Implemented

### ✅ CSRF Protection
- Unique tokens generated for each OAuth request
- State parameter validation on callback

### ✅ Rate Limiting
- 3 OAuth attempts per 5 minutes per client
- Prevents brute force attacks

### ✅ Input Validation
- All OAuth responses validated
- Error handling for malformed requests

### ✅ Secure Session Management
- Automatic token refresh
- Secure cookie handling via Supabase

### ✅ Role-Based Access Control
- User profiles automatically created
- Study preferences initialized
- Timezone detection

---

## 🚨 Troubleshooting

### Common Issues

**1. "OAuth client not found" error**
- Verify your Google Client ID is correct
- Check that the domain is authorized in Google Console

**2. "Redirect URI mismatch" error**
- Ensure all redirect URIs are added to Google Console
- Check for typos in URLs (http vs https)

**3. "Access denied" error**
- Verify OAuth consent screen is configured
- Check that required scopes are enabled

**4. User profile not created**
- Check Supabase RLS policies
- Verify the profiles table exists
- Check browser console for errors

### Debug Mode

Enable debug logging by adding to your .env:
```bash
VITE_DEBUG_AUTH=true
```

This will log OAuth flow details to the browser console.

---

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [OAuth Security Best Practices](https://tools.ietf.org/html/rfc6749#section-10)

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] OAuth consent screen approved by Google
- [ ] Production domain added to authorized origins
- [ ] Production redirect URIs configured
- [ ] Environment variables updated for production
- [ ] SSL certificate installed (HTTPS required)
- [ ] Rate limiting configured appropriately
- [ ] Error monitoring set up
- [ ] User data privacy policy updated

---

**🎉 Congratulations!** Your Google OAuth integration is now complete and secure!