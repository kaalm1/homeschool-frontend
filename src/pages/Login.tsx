import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationService, type TokenResponse, type GoogleAuthRequest } from '@/generated-api';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  // Clear auth state function
  const clearAuthState = () => {
    localStorage.removeItem('token');
    setError(null);
    setLoading(false);
    setGoogleLoading(false);

    // Clean up URL if we're on callback route
    if (window.location.pathname === '/auth/google/callback') {
      nav('/login', { replace: true });
    }
  };

  // Handle Google OAuth callback
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        setError('Google authentication was cancelled or failed');
        clearAuthState();
        return;
      }

      if (code) {
        setGoogleLoading(true);
        try {
          const googleAuthRequest: GoogleAuthRequest = { code, state };
          const res: TokenResponse =
            await AuthenticationService.googleCallbackApiV1AuthGoogleCallbackPost({
              requestBody: googleAuthRequest,
            });

          localStorage.setItem('token', res.access_token);
          nav('/parent');
        } catch (err: unknown) {
          console.error('Google OAuth callback error:', err);

          let errorMessage = 'Google login failed';
          if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.detail || errorMessage;

            // Handle 401 specifically
            if (err.response?.status === 401) {
              errorMessage = 'Authentication failed. Please try again.';
            }
          }

          setError(errorMessage);
          clearAuthState(); // Clear auth state on failure
        } finally {
          setGoogleLoading(false);
        }
      }
    };

    handleGoogleCallback();
  }, [nav]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res: TokenResponse = await AuthenticationService.loginApiV1AuthLoginPost({
        requestBody: { email, password },
      });
      localStorage.setItem('token', res.access_token);
      nav('/parent');
    } catch (err: unknown) {
      console.error('Email login error:', err);

      let errorMessage = 'Login failed';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.detail || errorMessage;

        // Handle 401 specifically
        if (err.response?.status === 401) {
          errorMessage = 'Invalid email or password';
        }
      }

      setError(errorMessage);
      clearAuthState(); // Clear auth state on failure
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError(null);

    try {
      // Get Google OAuth URL from backend
      const response = await AuthenticationService.getGoogleAuthUrlApiV1AuthGoogleUrlGet();

      // Redirect to Google OAuth
      window.location.href = response.auth_url;
    } catch (err: unknown) {
      console.error('Google OAuth init error:', err);

      setGoogleLoading(false);
      let errorMessage = 'Failed to initialize Google login';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.detail || errorMessage;
      }

      setError(errorMessage);
      clearAuthState(); // Clear auth state on failure
    }
  }

  // Show loading state during Google callback
  if (googleLoading && new URLSearchParams(window.location.search).get('code')) {
    return (
      <div className="grid min-h-screen place-items-center p-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-md">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Completing Google sign in...</p>

          {/* Cancel button for stuck flows */}
          <button
            onClick={clearAuthState}
            className="mt-4 text-sm text-gray-500 underline hover:text-gray-700"
          >
            Cancel and return to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-center text-2xl font-bold">Homeschool Helper</h1>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
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
          {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            disabled={loading || googleLoading}
          />
          <input
            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading || googleLoading}
          />
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <div className="flex items-start justify-between">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-400 hover:text-red-600"
                  type="button"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading || googleLoading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
