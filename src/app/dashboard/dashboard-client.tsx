'use client'

import Link from 'next/link'
import { useMemo, useState, type ReactNode } from 'react'
import {
  STATUS_LABEL,
  VENUES,
  dateLabel,
  fmtHour,
  fmtRp,
  fmtRpShort,
  seedBookings,
  upcomingDates,
  type Booking,
  type BookingStatus,
  type Court,
  type Venue,
} from '~/lib/data'

type Tab = 'booking' | 'kalender' | 'lapangan' | 'pembayaran'

type IconName = 'inbox' | 'calendar' | 'court' | 'card' | 'clock' | 'check' | 'cash'

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    inbox: (
      <>
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    court: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M12 5v14" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    card: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    cash: (
      <>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M6 12h.01M18 12h.01" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  )
}

const TABS: Array<{ key: Tab; label: string; icon: IconName }> = [
  { key: 'booking', label: 'Booking', icon: 'inbox' },
  { key: 'kalender', label: 'Kalender', icon: 'calendar' },
  { key: 'lapangan', label: 'Lapangan', icon: 'court' },
  { key: 'pembayaran', label: 'Pembayaran', icon: 'card' },
]

export function DashboardClient() {
  const [venueId, setVenueId] = useState(VENUES[0].id)
  const [tab, setTab] = useState<Tab>('booking')

  // frontend-only state: courts + bookings per venue, seeded from mock data
  const [venueCourts, setVenueCourts] = useState<Record<string, Court[]>>(() =>
    Object.fromEntries(VENUES.map((v) => [v.id, v.courts])),
  )
  const [venueBookings, setVenueBookings] = useState<Record<string, Booking[]>>(() =>
    Object.fromEntries(VENUES.map((v) => [v.id, seedBookings(v)])),
  )

  const venue = VENUES.find((v) => v.id === venueId)!
  const courts = venueCourts[venueId]
  const bookings = venueBookings[venueId]

  const setBookings = (next: Booking[]) => setVenueBookings({ ...venueBookings, [venueId]: next })
  const setCourts = (next: Court[]) => setVenueCourts({ ...venueCourts, [venueId]: next })

  const setStatus = (id: string, status: BookingStatus) =>
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)))

  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length

  const nav = (
    <>
      {TABS.map((t) => (
        <button
          key={t.key}
          className={'db-nav-btn' + (tab === t.key ? ' is-active' : '')}
          onClick={() => setTab(t.key)}
        >
          <span className="db-nav-ico" aria-hidden><Icon name={t.icon} /></span> {t.label}
          {t.key === 'booking' && pendingCount > 0 ? <span className="db-nav-count">{pendingCount}</span> : null}
        </button>
      ))}
    </>
  )

  const venueSelect = (
    <select className="db-venue-select" value={venueId} onChange={(e) => setVenueId(e.target.value)}>
      {VENUES.map((v) => (
        <option key={v.id} value={v.id}>{v.name}</option>
      ))}
    </select>
  )

  return (
    <div className="db-root">
      {/* desktop sidebar */}
      <aside className="db-side">
        <Link href="/" className="pl-logo">Padelin</Link>
        <div>
          <div className="db-side-label">Venue aktif</div>
          {venueSelect}
        </div>
        <nav className="db-nav">
          <div className="db-side-label">Menu</div>
          {nav}
        </nav>
        <div className="db-side-foot">
          <Link href={`/venue/${venue.slug}`} className="db-public-link">
            padelin.id/venue/{venue.slug} ↗
          </Link>
          <Link href="/login" className="db-logout">Keluar</Link>
        </div>
      </aside>

      {/* mobile top bar */}
      <div className="db-mobile-bar">
        <div className="db-mobile-top">
          <Link href="/" className="pl-logo">Padelin</Link>
          {venueSelect}
        </div>
        <div className="db-mobile-nav">{nav}</div>
      </div>

      <main className="db-main">
        {tab === 'booking' ? (
          <BookingTab venue={venue} courts={courts} bookings={bookings} onSetStatus={setStatus} />
        ) : null}
        {tab === 'kalender' ? <CalendarTab venue={venue} courts={courts} bookings={bookings} /> : null}
        {tab === 'lapangan' ? <CourtsTab courts={courts} onChange={setCourts} /> : null}
        {tab === 'pembayaran' ? <PaymentTab venue={venue} /> : null}
      </main>
    </div>
  )
}

/* ==================== Booking tab ==================== */

const FILTERS: Array<{ key: BookingStatus | 'ALL'; label: string }> = [
  { key: 'ALL', label: 'Semua' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'PAID', label: 'Dibayar' },
  { key: 'COMPLETED', label: 'Selesai' },
  { key: 'CANCELLED', label: 'Dibatalkan' },
]

function BookingTab({
  venue,
  courts,
  bookings,
  onSetStatus,
}: {
  venue: Venue
  courts: Court[]
  bookings: Booking[]
  onSetStatus: (id: string, status: BookingStatus) => void
}) {
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL')

  const today = upcomingDates(1)[0].key
  const pending = bookings.filter((b) => b.status === 'PENDING').length
  const todayCount = bookings.filter((b) => b.date === today && b.status !== 'CANCELLED').length
  const revenue = bookings
    .filter((b) => b.status === 'PAID' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalPrice, 0)

  const shown = bookings
    .filter((b) => filter === 'ALL' || b.status === filter)
    .sort((a, b) => (a.date + fmtHour(a.startHour)).localeCompare(b.date + fmtHour(b.startHour)))

  const courtName = (id: string) => courts.find((c) => c.id === id)?.name ?? '?'
  const countFor = (key: BookingStatus | 'ALL') =>
    key === 'ALL' ? bookings.length : bookings.filter((b) => b.status === key).length

  return (
    <>
      <div className="db-main-head">
        <div>
          <h1 className="db-title">Booking Masuk</h1>
          <p className="db-subtitle">{venue.name} · {dateLabel(today)}</p>
        </div>
      </div>

      <div className="db-stats">
        <div className="db-stat">
          <div className="db-stat-icon is-warn"><Icon name="clock" size={18} /></div>
          <div>
            <div className="db-stat-num is-warn">{pending}</div>
            <div className="db-stat-label">Menunggu konfirmasi</div>
          </div>
        </div>
        <div className="db-stat">
          <div className="db-stat-icon"><Icon name="check" size={18} /></div>
          <div>
            <div className="db-stat-num">{todayCount}</div>
            <div className="db-stat-label">Booking hari ini</div>
          </div>
        </div>
        <div className="db-stat">
          <div className="db-stat-icon is-accent"><Icon name="cash" size={18} /></div>
          <div>
            <div className="db-stat-num is-accent">{fmtRpShort(revenue)}</div>
            <div className="db-stat-label">Pendapatan terkonfirmasi</div>
          </div>
        </div>
        <div className="db-stat">
          <div className="db-stat-icon"><Icon name="court" size={18} /></div>
          <div>
            <div className="db-stat-num">{courts.length}</div>
            <div className="db-stat-label">Lapangan aktif</div>
          </div>
        </div>
      </div>

      <div className="db-card">
        <div className="db-card-head">
          <div>
            <div className="db-card-title">Daftar Pesanan</div>
            <div className="db-card-sub">Cek mutasi bank Anda, lalu konfirmasi pembayaran di sini.</div>
          </div>
          <div className="db-filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={'db-filter' + (filter === f.key ? ' is-active' : '')}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className="db-filter-count">{countFor(f.key)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="db-bookings">
          {shown.length === 0 ? (
            <div className="db-empty">
              <Icon name="inbox" size={22} />
              <span>Tidak ada booking dengan status ini.</span>
            </div>
          ) : null}
          {shown.map((b) => (
            <div className="db-booking" key={b.id}>
              <div className="pl-booking-avatar">{b.customerName[0]}</div>
              <div className="db-booking-main">
                <div className="db-booking-top">
                  <span className="db-booking-name">{b.customerName}</span>
                  <span className={`db-badge db-badge-${b.status}`}>{STATUS_LABEL[b.status]}</span>
                </div>
                <div className="db-booking-meta">
                  {courtName(b.courtId)} · {dateLabel(b.date)} · {fmtHour(b.startHour)}–{fmtHour(b.startHour + b.duration)} ({b.duration} jam)
                </div>
                <div className="db-booking-meta">
                  <span className="db-booking-code">{b.code}</span> · WA {b.customerWa}
                  {b.notes ? <> · “{b.notes}”</> : null}
                </div>
              </div>
              <div className="db-booking-side">
                <div className="db-booking-price">{fmtRp(b.totalPrice)}</div>
                <div className="db-booking-actions">
                  {b.status === 'PENDING' ? (
                    <>
                      <button className="db-act db-act-confirm" onClick={() => onSetStatus(b.id, 'PAID')}>
                        Konfirmasi Pembayaran
                      </button>
                      <button className="db-act db-act-danger" onClick={() => onSetStatus(b.id, 'CANCELLED')}>
                        Tolak
                      </button>
                    </>
                  ) : null}
                  {b.status === 'PAID' ? (
                    <>
                      <button className="db-act" onClick={() => onSetStatus(b.id, 'COMPLETED')}>
                        Tandai Selesai
                      </button>
                      <button className="db-act db-act-danger" onClick={() => onSetStatus(b.id, 'CANCELLED')}>
                        Batalkan
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ==================== Calendar tab ==================== */

function CalendarTab({ venue, courts, bookings }: { venue: Venue; courts: Court[]; bookings: Booking[] }) {
  const dates = useMemo(() => upcomingDates(7), [])
  const [dateIdx, setDateIdx] = useState(0)
  const date = dates[dateIdx]

  const hours = Array.from({ length: venue.closeHour - venue.openHour }, (_, i) => venue.openHour + i)
  const active = bookings.filter((b) => b.date === date.key && b.status !== 'CANCELLED')

  const blockAt = (courtId: string, hour: number) =>
    active.find((b) => b.courtId === courtId && b.startHour === hour)
  const coveredBy = (courtId: string, hour: number) =>
    active.some((b) => b.courtId === courtId && hour > b.startHour && hour < b.startHour + b.duration)

  return (
    <>
      <div className="db-main-head">
        <div>
          <h1 className="db-title">Kalender Lapangan</h1>
          <p className="db-subtitle">{venue.name} · {date.label}</p>
        </div>
      </div>

      <div className="db-card">
        <div className="db-cal-toolbar">
          <div className="pb-dates">
            {dates.map((d, i) => (
              <button key={d.key} className={'pb-date' + (i === dateIdx ? ' is-active' : '')} onClick={() => setDateIdx(i)}>
                <span className="pb-date-day">{d.day}</span>
                <span className="pb-date-num">{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="db-cal-wrap">
          <div className="db-cal" style={{ gridTemplateColumns: `72px repeat(${courts.length}, 1fr)` }}>
            <div className="db-cal-head">Jam</div>
            {courts.map((c) => (
              <div className="db-cal-head" key={c.id}>
                {c.name}
                <small>{c.type} · {fmtRpShort(c.pricePerHour)}/jam</small>
              </div>
            ))}
            {hours.map((h) => (
              <CalRow key={h} hour={h} courts={courts} blockAt={blockAt} coveredBy={coveredBy} />
            ))}
          </div>
        </div>

        <div className="db-cal-legend">
          <span><i className="db-leg-PENDING"></i> Pending</span>
          <span><i className="db-leg-PAID"></i> Dibayar</span>
          <span><i className="db-leg-COMPLETED"></i> Selesai</span>
        </div>
      </div>
    </>
  )
}

function CalRow({
  hour,
  courts,
  blockAt,
  coveredBy,
}: {
  hour: number
  courts: Court[]
  blockAt: (courtId: string, hour: number) => Booking | undefined
  coveredBy: (courtId: string, hour: number) => boolean
}) {
  return (
    <>
      <div className="db-cal-cell db-cal-time">{fmtHour(hour)}</div>
      {courts.map((c) => {
        const b = blockAt(c.id, hour)
        return (
          <div className="db-cal-cell" key={c.id}>
            {b ? (
              <div
                className={`db-cal-block db-cal-block-${b.status}`}
                style={{ height: `calc(${b.duration * 100}% - 6px)` }}
              >
                {b.customerName}
                <small>{fmtHour(b.startHour)}–{fmtHour(b.startHour + b.duration)} · {STATUS_LABEL[b.status]}</small>
              </div>
            ) : coveredBy(c.id, hour) ? null : null}
          </div>
        )
      })}
    </>
  )
}

/* ==================== Courts tab ==================== */

function CourtsTab({ courts, onChange }: { courts: Court[]; onChange: (next: Court[]) => void }) {
  const [editing, setEditing] = useState<Court | null>(null)
  const [adding, setAdding] = useState(false)

  const save = (court: Court) => {
    if (courts.some((c) => c.id === court.id)) {
      onChange(courts.map((c) => (c.id === court.id ? court : c)))
    } else {
      onChange([...courts, court])
    }
    setEditing(null)
    setAdding(false)
  }

  const remove = (id: string) => onChange(courts.filter((c) => c.id !== id))

  return (
    <>
      <div className="db-main-head">
        <div>
          <h1 className="db-title">Kelola Lapangan</h1>
          <p className="db-subtitle">Nama, tipe, dan tarif sewa per jam untuk setiap lapangan.</p>
        </div>
        <button className="db-act db-act-confirm" onClick={() => { setAdding(true); setEditing(null) }}>
          + Tambah Lapangan
        </button>
      </div>

      <div className="db-card">
        <div className="db-courts">
          {courts.map((c) => (
            <div className="db-court-card" key={c.id}>
              <div className="db-court-top">
                <div className="db-court-name">{c.name}</div>
                <span className={'db-court-chip' + (c.type === 'Indoor' ? ' is-indoor' : '')}>{c.type}</span>
              </div>
              <div className="db-court-price">{fmtRp(c.pricePerHour)} <small>/ jam</small></div>
              <div className="db-court-actions">
                <button className="db-act" onClick={() => { setEditing(c); setAdding(false) }}>Edit</button>
                <button className="db-act db-act-danger" onClick={() => remove(c.id)}>Hapus</button>
              </div>
            </div>
          ))}
          {courts.length === 0 ? (
            <div className="db-empty">
              <Icon name="court" size={22} />
              <span>Belum ada lapangan. Tambahkan yang pertama.</span>
            </div>
          ) : null}
        </div>
      </div>

      {adding || editing ? (
        <div className="db-card">
          <div className="db-card-head">
            <div className="db-card-title">{editing ? `Edit ${editing.name}` : 'Lapangan Baru'}</div>
          </div>
          <CourtForm
            initial={editing ?? undefined}
            onCancel={() => { setEditing(null); setAdding(false) }}
            onSave={save}
          />
        </div>
      ) : null}
    </>
  )
}

function CourtForm({ initial, onSave, onCancel }: { initial?: Court; onSave: (c: Court) => void; onCancel: () => void }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState<Court['type']>(initial?.type ?? 'Indoor')
  const [price, setPrice] = useState(initial?.pricePerHour ?? 200000)

  const valid = name.trim().length >= 1 && price > 0

  return (
    <div className="db-form">
      <label className="pb-field">
        <span className="pb-field-label">Nama lapangan</span>
        <input className="pb-input" placeholder="Misal: Court A" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <div className="db-form-row">
        <div className="pb-field">
          <span className="pb-field-label">Tipe</span>
          <div className="pb-seg">
            {(['Indoor', 'Outdoor'] as const).map((t) => (
              <button key={t} className={'pb-seg-btn' + (type === t ? ' is-active' : '')} onClick={() => setType(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <label className="pb-field">
          <span className="pb-field-label">Harga per jam (Rp)</span>
          <input
            className="pb-input"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value.replace(/\D/g, ''), 10) || 0)}
          />
        </label>
      </div>
      <div className="db-booking-actions">
        <button
          className="db-act db-act-confirm"
          disabled={!valid}
          onClick={() =>
            onSave({
              id: initial?.id ?? 'c' + Math.random().toString(36).slice(2, 8),
              name: name.trim(),
              type,
              pricePerHour: price,
            })
          }
        >
          Simpan
        </button>
        <button className="db-act" onClick={onCancel}>Batal</button>
      </div>
    </div>
  )
}

/* ==================== Payment tab ==================== */

function PaymentTab({ venue }: { venue: Venue }) {
  const [bankName, setBankName] = useState(venue.bank.name)
  const [bankNumber, setBankNumber] = useState(venue.bank.number)
  const [bankHolder, setBankHolder] = useState(venue.bank.holder)
  const [qrisName, setQrisName] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  return (
    <>
      <div className="db-main-head">
        <div>
          <h1 className="db-title">Info Pembayaran</h1>
          <p className="db-subtitle">Ditampilkan di halaman invoice pelanggan setelah booking.</p>
        </div>
      </div>

      <div className="db-grid2">
      <div className="db-card">
        <div className="db-card-head">
          <div>
            <div className="db-card-title">Transfer Bank</div>
            <div className="db-card-sub">Nomor rekening tujuan transfer pelanggan.</div>
          </div>
        </div>
        <div className="db-form">
          <div className="db-form-row">
            <label className="pb-field">
              <span className="pb-field-label">Bank</span>
              <input className="pb-input" value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </label>
            <label className="pb-field">
              <span className="pb-field-label">Nomor rekening</span>
              <input className="pb-input" inputMode="numeric" value={bankNumber} onChange={(e) => setBankNumber(e.target.value)} />
            </label>
          </div>
          <label className="pb-field">
            <span className="pb-field-label">Atas nama</span>
            <input className="pb-input" value={bankHolder} onChange={(e) => setBankHolder(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="db-card">
        <div className="db-card-head">
          <div>
            <div className="db-card-title">QRIS</div>
            <div className="db-card-sub">Unggah gambar kode QRIS milik venue Anda.</div>
          </div>
        </div>
        <div className="db-form">
          <div className="pb-qris-ph" style={{ width: 200, height: 200 }}>
            <span>{qrisName ?? 'belum ada gambar QRIS'}</span>
          </div>
          <label className="db-act" style={{ width: 'fit-content', cursor: 'pointer' }}>
            {qrisName ? 'Ganti Gambar' : 'Unggah QRIS'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => setQrisName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
        </div>
      </div>
      </div>

      <div className="db-card">
        <div className="db-booking-actions">
          <button className="db-act db-act-confirm" onClick={save}>
            {saved ? 'Tersimpan ✓' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </>
  )
}
