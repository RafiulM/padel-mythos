import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

function SectionTag({ children }: { children: ReactNode }) {
  return (
    <div className="pl-tag">
      <span className="pl-tag-dot"></span>
      {children}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
      <circle cx="8" cy="8" r="7.25" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1.5"></circle>
      <path d="M5 8.2l2 2 4-4.2" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
}

export function Nav() {
  return (
    <header className="pl-nav">
      <div className="pl-container pl-nav-inner">
        <Link to="/" className="pl-logo">Padelin</Link>
        <nav className="pl-nav-links">
          <a href="#pemilik">Untuk Venue</a>
          <a href="#pemain">Untuk Pemain</a>
          <a href="#cara-kerja">Cara Kerja</a>
          <a href="#harga">Harga</a>
        </nav>
        <div className="pl-nav-actions">
          <Link className="pl-nav-login" to="/login">Masuk</Link>
          <Link className="pl-btn pl-btn-primary pl-btn-sm" to="/login">Daftar Gratis</Link>
        </div>
      </div>
    </header>
  )
}

/* ---------- hero phone mock ---------- */

function PhoneSlot({ label, state }: { label: string; state: 'free' | 'taken' | 'selected' }) {
  const base: React.CSSProperties = {
    padding: '9px 0',
    textAlign: 'center',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.02em',
    fontVariantNumeric: 'tabular-nums',
  }
  const styles: Record<string, React.CSSProperties> = {
    free: { ...base, background: 'rgba(163,230,53,0.12)', color: 'var(--accent)', border: '1px solid rgba(163,230,53,0.35)' },
    taken: { ...base, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'line-through' },
    selected: { ...base, background: 'var(--accent)', color: '#0B120D', border: '1px solid var(--accent)', boxShadow: '0 4px 16px rgba(163,230,53,0.35)' },
  }
  return <div style={styles[state]}>{label}</div>
}

function PhoneDateChip({ day, date, active }: { day: string; date: string; active?: boolean }) {
  return (
    <div
      style={{
        minWidth: 46,
        padding: '8px 0',
        borderRadius: 12,
        textAlign: 'center',
        background: active ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
        color: active ? '#0B120D' : 'rgba(255,255,255,0.7)',
        border: active ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{day}</div>
      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{date}</div>
    </div>
  )
}

export function PadelinPhone() {
  const slots: Array<[string, 'free' | 'taken' | 'selected']> = [
    ['07:00', 'taken'], ['08:00', 'free'], ['09:00', 'free'],
    ['10:00', 'taken'], ['11:00', 'free'], ['12:00', 'taken'],
    ['13:00', 'free'], ['14:00', 'free'], ['15:00', 'selected'],
    ['16:00', 'free'], ['17:00', 'taken'], ['18:00', 'taken'],
  ]
  return (
    <div className="pl-phone">
      <div className="pl-phone-screen">
        <div className="pl-phone-notch"></div>
        <div style={{ padding: '14px 18px 0 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            padelin.id/venue/padel-senayan
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6, letterSpacing: '-0.01em' }}>Padel Senayan</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>Jl. Asia Afrika No. 8, Jakarta Pusat</div>
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '14px 18px 0 18px', overflow: 'hidden' }}>
          <PhoneDateChip day="Sen" date="10" active />
          <PhoneDateChip day="Sel" date="11" />
          <PhoneDateChip day="Rab" date="12" />
          <PhoneDateChip day="Kam" date="13" />
          <PhoneDateChip day="Jum" date="14" />
          <PhoneDateChip day="Sab" date="15" />
        </div>

        <div style={{ padding: '14px 18px 0 18px' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderRadius: 14,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Court A · Indoor</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Rp 250.000 / jam</div>
            </div>
            <div
              style={{
                fontSize: 11, fontWeight: 700, color: 'var(--accent)',
                background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.3)',
                padding: '4px 10px', borderRadius: 999,
              }}
            >
              7 slot kosong
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 18px 0 18px', flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Pilih jam main
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {slots.map(([label, state]) => (
              <PhoneSlot key={label} label={label} state={state} />
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 18px 16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            <span>15:00 — 17:00 · 2 jam</span>
            <span style={{ color: '#EDF2EC', fontWeight: 700 }}>Rp 500.000</span>
          </div>
          <div
            style={{
              background: 'var(--accent)', color: '#0B120D', textAlign: 'center',
              padding: '13px 0', borderRadius: 14, fontSize: 15, fontWeight: 700,
              boxShadow: '0 8px 24px rgba(163,230,53,0.3)',
            }}
          >
            Booking Sekarang
          </div>
          <div style={{ textAlign: 'center', fontSize: 10.5, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
            Tanpa akun · cukup nama & nomor WhatsApp
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="pl-hero">
      <div className="pl-container pl-hero-inner">
        <div className="pl-hero-copy">
          <SectionTag>Platform booking lapangan padel · Indonesia</SectionTag>
          <h1 className="pl-h1">
            Jadwal penuh,<br />tanpa drama <em>WhatsApp.</em>
          </h1>
          <p className="pl-body pl-hero-sub">
            Pelanggan melihat slot kosong dan booking sendiri — tanpa akun, kurang dari
            satu menit. Anda tinggal konfirmasi pembayaran dari satu dashboard.
          </p>
          <div className="pl-hero-actions">
            <Link className="pl-btn pl-btn-primary" to="/login">Daftar Gratis</Link>
            <a className="pl-btn pl-btn-ghost" href="#cara-kerja">Lihat Cara Kerja</a>
          </div>
          <div className="pl-hero-stats">
            <div className="pl-stat">
              <div className="pl-stat-num">&lt; 1 mnt</div>
              <div className="pl-stat-label">checkout pelanggan</div>
            </div>
            <div className="pl-stat-divider"></div>
            <div className="pl-stat">
              <div className="pl-stat-num">0</div>
              <div className="pl-stat-label">double booking</div>
            </div>
            <div className="pl-stat-divider"></div>
            <div className="pl-stat">
              <div className="pl-stat-num">1 link</div>
              <div className="pl-stat-label">per venue, siap dibagikan</div>
            </div>
          </div>
        </div>
        <div className="pl-hero-phone">
          <div className="pl-phone-glow"></div>
          <PadelinPhone />
        </div>
      </div>
    </section>
  )
}

/* ---------- Untuk Pemilik Venue ---------- */

function BookingRow({ name, court, time, price, status }: { name: string; court: string; time: string; price: string; status: 'PENDING' | 'PAID' }) {
  const statusStyle: React.CSSProperties =
    status === 'PENDING'
      ? { color: '#E8C268', background: 'rgba(232,194,104,0.1)', border: '1px solid rgba(232,194,104,0.3)' }
      : { color: 'var(--accent)', background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.3)' }
  return (
    <div className="pl-booking-row">
      <div className="pl-booking-avatar">{name[0]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="pl-booking-name">{name}</div>
        <div className="pl-booking-meta">{court} · {time}</div>
      </div>
      <div className="pl-booking-price">{price}</div>
      <div className="pl-booking-status" style={statusStyle}>{status === 'PENDING' ? 'Pending' : 'Paid'}</div>
    </div>
  )
}

export function OwnerSection() {
  return (
    <section className="pl-section" id="pemilik">
      <div className="pl-container pl-split">
        <div className="pl-split-copy">
          <SectionTag>Untuk pemilik venue</SectionTag>
          <h2 className="pl-h2">
            Dashboard yang rapi, <em>bukan</em> ratusan chat WhatsApp.
          </h2>
          <p className="pl-body">
            Semua pesanan masuk ke satu kalender. Cek mutasi, klik konfirmasi,
            dan jadwal di halaman publik langsung terblokir — tanpa risiko double booking.
          </p>
          <ul className="pl-checklist">
            <li><CheckIcon /><span><strong>Kalender semua lapangan</strong> dalam satu layar, per venue dan per cabang.</span></li>
            <li><CheckIcon /><span><strong>Konfirmasi pembayaran manual</strong> — transfer bank atau QRIS, sesuai cara Anda bekerja.</span></li>
            <li><CheckIcon /><span><strong>Link unik per venue</strong> yang siap dibagikan ke Instagram dan WhatsApp.</span></li>
            <li><CheckIcon /><span><strong>Multi-venue, multi-lapangan</strong> — kelola harga dan jam operasional tiap lapangan.</span></li>
          </ul>
        </div>
        <div>
          <div className="pl-dash-card">
            <div className="pl-dash-head">
              <div>
                <div className="pl-dash-title">Booking Masuk</div>
                <div className="pl-dash-sub">Padel Senayan · Senin, 10 Juni</div>
              </div>
              <div className="pl-dash-badge">3 baru</div>
            </div>
            <BookingRow name="Rizky Maulana" court="Court A" time="15:00 · 2 jam" price="Rp 500rb" status="PENDING" />
            <BookingRow name="Sarah Putri" court="Court B" time="18:00 · 1 jam" price="Rp 250rb" status="PAID" />
            <BookingRow name="Andi Wijaya" court="Court A" time="19:00 · 2 jam" price="Rp 500rb" status="PAID" />
            <div className="pl-dash-confirm">
              <span>Dana masuk dari Rizky?</span>
              <span className="pl-dash-confirm-btn">Konfirmasi Pembayaran</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Untuk Pemain ---------- */

export function PlayerSection() {
  const cards = [
    {
      num: '01',
      title: 'Tanpa akun, tanpa aplikasi',
      body: 'Buka link venue, isi nama dan nomor WhatsApp. Selesai. Tidak ada registrasi, tidak ada download.',
    },
    {
      num: '02',
      title: 'Slot kosong terlihat real-time',
      body: 'Jam yang tersedia tampil hijau, yang penuh tercoret. Tidak perlu tanya-tanya admin lagi.',
    },
    {
      num: '03',
      title: 'Bayar seperti biasa',
      body: 'Transfer bank atau scan QRIS milik venue langsung dari halaman invoice. Checkout kurang dari satu menit.',
    },
  ]
  return (
    <section className="pl-section pl-section-alt" id="pemain">
      <div className="pl-container">
        <div className="pl-center-head">
          <SectionTag>Untuk pemain</SectionTag>
          <h2 className="pl-h2">Booking lapangan secepat <em>chat</em> — tapi tanpa menunggu balasan.</h2>
        </div>
        <div className="pl-cards3">
          {cards.map((c) => (
            <div className="pl-card" key={c.num}>
              <div className="pl-card-num">{c.num}</div>
              <div className="pl-card-title">{c.title}</div>
              <p className="pl-card-body">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Cara Kerja ---------- */

export function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Daftar & atur venue',
      body: 'Tambahkan lokasi, lapangan, harga per jam, dan unggah QRIS atau nomor rekening Anda.',
    },
    {
      num: '2',
      title: 'Bagikan link venue',
      body: 'Setiap venue punya URL sendiri. Taruh di bio Instagram atau balas chat dengan satu link.',
      code: 'padelin.id/venue/padel-senayan',
    },
    {
      num: '3',
      title: 'Terima & konfirmasi booking',
      body: 'Pesanan masuk berstatus Pending. Cek dana, klik konfirmasi, jadwal otomatis terkunci.',
    },
  ]
  return (
    <section className="pl-section" id="cara-kerja">
      <div className="pl-container">
        <div className="pl-center-head">
          <SectionTag>Cara kerja</SectionTag>
          <h2 className="pl-h2">Tiga langkah, <em>lapangan penuh.</em></h2>
        </div>
        <div className="pl-steps">
          {steps.map((s, i) => (
            <div className="pl-step" key={s.num}>
              <div className="pl-step-num">{s.num}</div>
              <div className="pl-step-title">{s.title}</div>
              <p className="pl-card-body">{s.body}</p>
              {s.code ? <div className="pl-step-code">{s.code}</div> : null}
              {i < steps.length - 1 ? <div className="pl-step-line"></div> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Harga ---------- */

export function PricingSection() {
  return (
    <section className="pl-section pl-section-alt" id="harga">
      <div className="pl-container pl-pricing-wrap">
        <div className="pl-pricing-copy">
          <SectionTag>Harga</SectionTag>
          <h2 className="pl-h2">Satu langganan, <em>semua fitur.</em></h2>
          <p className="pl-body">
            Tanpa komisi per booking. Tanpa biaya tersembunyi.
            Berhenti kapan saja.
          </p>
        </div>
        <div className="pl-price-card">
          <div className="pl-price-plan">Padelin Pro</div>
          <div className="pl-price-amount">
            <span className="pl-price-currency">Rp</span>
            <span className="pl-price-num">249rb</span>
            <span className="pl-price-period">/ bulan per venue</span>
          </div>
          <ul className="pl-checklist pl-checklist-tight">
            <li><CheckIcon /><span>Lapangan & booking tanpa batas</span></li>
            <li><CheckIcon /><span>Halaman publik dengan link unik</span></li>
            <li><CheckIcon /><span>Dashboard kalender & konfirmasi pembayaran</span></li>
            <li><CheckIcon /><span>Pembayaran via transfer bank / QRIS Anda sendiri</span></li>
          </ul>
          <Link className="pl-btn pl-btn-primary pl-btn-block" to="/login">Coba Gratis 14 Hari</Link>
          <div className="pl-price-note">Tanpa kartu kredit untuk memulai</div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Final CTA + Footer ---------- */

export function FinalCTA() {
  return (
    <section className="pl-section pl-final" id="daftar">
      <div className="pl-container pl-final-inner">
        <h2 className="pl-h2 pl-h2-big">Tutup WhatsApp,<br /><em>buka jadwal.</em></h2>
        <p className="pl-body" style={{ margin: '0 auto' }}>
          Daftarkan venue Anda hari ini. Dalam 15 menit, pelanggan sudah bisa booking sendiri.
        </p>
        <div className="pl-hero-actions" style={{ justifyContent: 'center' }}>
          <Link className="pl-btn pl-btn-primary" to="/login">Daftar Gratis</Link>
          <a className="pl-btn pl-btn-ghost" href="#cara-kerja">Lihat Cara Kerja</a>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="pl-footer">
      <div className="pl-container pl-footer-inner">
        <div className="pl-logo">Padelin</div>
        <div className="pl-footer-links">
          <a href="#pemilik">Untuk Venue</a>
          <a href="#pemain">Untuk Pemain</a>
          <a href="#cara-kerja">Cara Kerja</a>
          <a href="#harga">Harga</a>
          <Link to="/venue/$slug" params={{ slug: 'padel-senayan' }}>Demo Venue</Link>
        </div>
        <div className="pl-footer-copy">© 2026 Padelin</div>
      </div>
    </footer>
  )
}
