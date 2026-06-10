// Shared types (mirroring the API responses) + formatting helpers.

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
  address: string | null
  whatsapp: string | null
  openHour: number
  closeHour: number
  bankName: string | null
  bankNumber: string | null
  bankHolder: string | null
  qrisUrl: string | null
  paymentNotes: string | null
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
  notes?: string | null
}

/** Per-court taken hours, as returned by /api/venues/[slug]/availability */
export interface Availability {
  date: string
  openHour: number
  closeHour: number
  courts: Array<{ courtId: string; takenHours: number[] }>
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

export function fmtOpenHours(v: Pick<Venue, 'openHour' | 'closeHour'>): string {
  return `${fmtHour(v.openHour)} – ${fmtHour(v.closeHour)}`
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Dibayar',
  CANCELLED: 'Dibatalkan',
  COMPLETED: 'Selesai',
}
