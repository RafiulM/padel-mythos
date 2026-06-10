import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [{ title: 'Masuk — Padelin' }],
  }),
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const valid = email.includes('@') && password.length >= 4

  return (
    <div className="lg-page">
      <div className="lg-card">
        <Link to="/" className="pl-logo">Padelin</Link>
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
              if (e.key === 'Enter' && valid) navigate({ to: '/dashboard' })
            }}
          />
        </label>

        <button className="pb-btn-primary" disabled={!valid} onClick={() => navigate({ to: '/dashboard' })}>
          Masuk
        </button>

        <div className="lg-hint">
          Demo frontend — isi email &amp; password apa saja untuk masuk.
        </div>
      </div>
    </div>
  )
}
