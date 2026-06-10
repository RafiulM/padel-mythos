import type { Metadata } from 'next'
import { LoginClient } from './login-client'

export const metadata: Metadata = {
  title: 'Masuk — Padelin',
}

export default function LoginPage() {
  return <LoginClient />
}
