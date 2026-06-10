import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '~/lib/auth'
import { DashboardClient } from './dashboard-client'

export const metadata: Metadata = {
  title: 'Dashboard — Padelin',
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/login')
  }

  return <DashboardClient />
}
