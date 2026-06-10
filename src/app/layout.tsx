import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../styles/app.css'

export const metadata: Metadata = {
  title: 'Padelin — Booking Lapangan Padel Tanpa Drama',
  description:
    'Platform booking lapangan padel untuk pemilik venue di Indonesia. Pelanggan booking tanpa akun, Anda tinggal konfirmasi pembayaran.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
