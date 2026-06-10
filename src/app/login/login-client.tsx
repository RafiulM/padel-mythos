'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LoginClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const valid = email.includes('@') && password.length >= 4

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
              if (e.key === 'Enter' && valid) router.push('/dashboard')
            }}
          />
        </label>

        <button className="pb-btn-primary" disabled={!valid} onClick={() => router.push('/dashboard')}>
          Masuk
        </button>

        <div className="lg-hint">
          Demo frontend — isi email &amp; password apa saja untuk masuk.
        </div>
      </div>
    </div>
  )
}
