import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationService, type TokenResponse } from '@/generated-api';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('demo@homeschool.app');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

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
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-md"
      >
        <h1 className="text-2xl font-bold">Homeschool Helper</h1>
        <p className="text-sm text-slate-500">Demo login is prefilled. Backend must be running.</p>
        <input
          className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && <div className="text-red-600">{error}</div>}
        <button
          className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
