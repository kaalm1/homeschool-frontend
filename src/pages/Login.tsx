
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthenticationService, type TokenResponse } from '@/generated-api'

type LoginResponse = {
  access_token: string
}

export default function Login() {
  const [email, setEmail] = useState('demo@homeschool.app')
  const [password, setPassword] = useState('demo123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
  
    try {
      const res: TokenResponse = await AuthenticationService.loginApiV1AuthLoginPost({
        requestBody: { email, password },
      })
      localStorage.setItem('token', res.access_token)
      nav('/parent')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={handleLogin} className="card max-w-sm w-full space-y-4">
        <h1 className="text-2xl font-bold">Homeschool Helper</h1>
        <p className="text-sm text-slate-500">Demo login is prefilled. Backend must be running.</p>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        {error && <div className="text-red-600">{error}</div>}
        <button className="btn w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}
