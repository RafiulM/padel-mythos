// Mock data + helpers for the frontend-only MVP.
// Mirrors the PRD schema: Tenant → Venue → Court → Booking.

export type BookingStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED'

export interface Court {
  id: string
  name: string
  type: 'Indoor' | 'Outdoor'
  pricePerHour: number
}

export interface Venue {
  id: string
  name: string
  slug: string
  address: string
  hours: string
  openHour: number
  closeHour: number
  wa: string
  bank: { name: string; number: string; holder: string }
  courts: Court[]
}

export interface Booking {
  id: string
  code: string
  courtId: string
  customerName: string
  customerWa: string
  date: string // YYYY-MM-DD
  startHour: number
  duration: number
  totalPrice: number
  status: BookingStatus
  notes?: string
}

export const VENUES: Venue[] = [
  {
    id: 'v1',
    name: 'Padel Senayan',
    slug: 'padel-senayan',
    address: 'Jl. Asia Afrika No. 8, Jakarta Pusat',
    hours: '07:00 – 22:00',
    openHour: 7,
    closeHour: 22,
    wa: '6281234567890',
    bank: { name: 'BCA', number: '8830112345', holder: 'PT Padel Senayan Jaya' },
    courts: [
      { id: 'a', name: 'Court A', type: 'Indoor', pricePerHour: 250000 },
      { id: 'b', name: 'Court B', type: 'Indoor', pricePerHour: 250000 },
      { id: 'c', name: 'Court C', type: 'Outdoor', pricePerHour: 200000 },
    ],
  },
  {
    id: 'v2',
    name: 'Padel Bekasi',
    slug: 'padel-bekasi',
    address: 'Jl. Ahmad Yani No. 12, Bekasi',
    hours: '08:00 – 22:00',
    openHour: 8,
    closeHour: 22,
    wa: '6281298765432',
    bank: { name: 'Mandiri', number: '1330022334455', holder: 'CV Padel Bekasi' },
    courts: [
      { id: 'd', name: 'Court 1', type: 'Indoor', pricePerHour: 180000 },
      { id: 'e', name: 'Court 2', type: 'Outdoor', pricePerHour: 150000 },
    ],
  },
]

export function venueBySlug(slug: string): Venue | undefined {
  return VENUES.find((v) => v.slug === slug)
}

export const DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
export const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export interface DateOption {
  key: string // YYYY-MM-DD
  day: string
  date: number
  label: string
}

export function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function upcomingDates(count = 7): DateOption[] {
  const out: DateOption[] = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    out.push({
      key: dateKey(d),
      day: DAYS_ID[d.getDay()],
      date: d.getDate(),
      label: `${DAYS_ID[d.getDay()]}, ${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`,
    })
  }
  return out
}

export function dateLabel(key: string): string {
  const d = new Date(`${key}T00:00:00`)
  return `${DAYS_ID[d.getDay()]}, ${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`
}

// Deterministic pseudo-availability so the grid looks alive without a backend.
export function slotTaken(courtIdx: number, key: string, hour: number): boolean {
  const dom = parseInt(key.slice(8, 10), 10)
  const h = (courtIdx * 31 + dom * 7 + hour * 13) % 10
  return h < 4
}

export function fmtRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID')
}

export function fmtRpShort(n: number): string {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + 'jt'
  if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + 'rb'
  return fmtRp(n)
}

export function fmtHour(h: number): string {
  return String(h).padStart(2, '0') + ':00'
}

export function newBookingCode(): string {
  return 'PDL-' + Math.random().toString(36).slice(2, 7).toUpperCase()
}

// Seed bookings for the dashboard, anchored to today's date so the
// calendar always has something to show.
export function seedBookings(venue: Venue): Booking[] {
  const dates = upcomingDates(3)
  const today = dates[0].key
  const tomorrow = dates[1].key
  const dayAfter = dates[2].key
  const c = venue.courts
  const price = (courtId: string, dur: number) =>
    (c.find((x) => x.id === courtId)?.pricePerHour ?? 0) * dur

  const rows: Array<[string, string, string, string, number, number, BookingStatus, string?]> = [
    // [code, courtId, name, wa, startHour, duration, status, notes?]
    ['PDL-8F2KQ', c[0].id, 'Rizky Maulana', '081234567890', 15, 2, 'PENDING', 'Sewa raket 2 buah'],
    ['PDL-3JD7A', c[1]?.id ?? c[0].id, 'Sarah Putri', '081298761234', 18, 1, 'PAID'],
    ['PDL-9QPL2', c[0].id, 'Andi Wijaya', '085712340987', 19, 2, 'PAID'],
    ['PDL-5TXR8', c[c.length - 1].id, 'Bima Sakti', '081377788899', 9, 1, 'COMPLETED'],
    ['PDL-2MN4V', c[0].id, 'Citra Lestari', '081555666777', 8, 1, 'CANCELLED', 'Dibatalkan pelanggan'],
  ]

  const out: Booking[] = rows.map(([code, courtId, name, wa, start, dur, status, notes], i) => ({
    id: 'b' + (i + 1),
    code,
    courtId,
    customerName: name,
    customerWa: wa,
    date: today,
    startHour: start,
    duration: dur,
    totalPrice: price(courtId, dur),
    status,
    notes,
  }))

  out.push(
    {
      id: 'b6',
      code: 'PDL-7HW3Z',
      courtId: c[1]?.id ?? c[0].id,
      customerName: 'Dewi Anggraini',
      customerWa: '081222333444',
      date: tomorrow,
      startHour: 17,
      duration: 2,
      totalPrice: price(c[1]?.id ?? c[0].id, 2),
      status: 'PENDING',
    },
    {
      id: 'b7',
      code: 'PDL-4Kc9B',
      courtId: c[0].id,
      customerName: 'Fajar Nugroho',
      customerWa: '085699887766',
      date: dayAfter,
      startHour: 20,
      duration: 1,
      totalPrice: price(c[0].id, 1),
      status: 'PAID',
    },
  )
  return out
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Dibayar',
  CANCELLED: 'Dibatalkan',
  COMPLETED: 'Selesai',
}
