'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      localStorage.setItem('mynovia_token', data.token)
      localStorage.setItem('mynovia_user', JSON.stringify(data.user))
      // 1 hour expiry
      localStorage.setItem('mynovia_token_expires', Date.now() + 3600000)
      router.push('/admin')
    } catch (err) {
      setError('Connection error')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-heading text-[32px] tracking-[3px] text-charcoal uppercase">My Novia</h1>
          <p className="text-xs font-sans text-body-gray tracking-wider mt-2 uppercase">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 bg-white font-body text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 bg-white font-body text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {error && <p className="text-red-600 text-sm font-sans">{error}</p>}

          <button type="submit" disabled={loading} className="btn-dark w-full text-center disabled:opacity-50">
            {loading ? 'LOADING...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  )
}
