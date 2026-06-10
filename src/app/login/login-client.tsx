'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from '~/lib/auth-client'

export function LoginClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const valid = email.includes('@') && password.length >= 8 && !busy

  const submit = async () => {
    setBusy(true)
    setError(null)
    const { error: err } = await signIn.email({ email, password })
    if (err) {
      setError(err.message ?? 'Email atau password salah.')
      setBusy(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="lg-page">
      <div className="lg-card">
        <Link href="/" className="pl-logo">Padelin</Link>
        <div>
          <div className="lg-title">Masuk ke dashboard</div>
          <div className="lg-sub">Kelola venue, lapangan, dan konfirmasi booking pelanggan Anda.</div>
        </div>

        <label className="pb-field">
          <span className="pb-field-label">Email</span>
          <input
            className="pb-input"
            type="email"
            placeholder="admin@venue.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="pb-field">
          <span className="pb-field-label">Password</span>
          <input
            className="pb-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && valid) submit()
            }}
          />
        </label>

        {error ? <div className="pb-field-err">{error}</div> : null}

        <button className="pb-btn-primary" disabled={!valid} onClick={submit}>
          {busy ? 'Memproses…' : 'Masuk'}
        </button>

        <div className="lg-hint">
          Akun demo: owner@padelin.test / password123
        </div>
      </div>
    </div>
  )
}
