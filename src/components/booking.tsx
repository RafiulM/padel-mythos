import { useEffect, useMemo, useState } from 'react'
import {
  fmtHour,
  fmtRp,
  type Court,
  type DateOption,
  type Venue,
} from '~/lib/data'

/* ---------- atoms ---------- */

export function DateChip({ d, active, onClick }: { d: DateOption; active: boolean; onClick: () => void }) {
  return (
    <button className={'pb-date' + (active ? ' is-active' : '')} onClick={onClick}>
      <span className="pb-date-day">{d.day}</span>
      <span className="pb-date-num">{d.date}</span>
    </button>
  )
}

export function CourtCard({ court, active, freeCount, onClick }: { court: Court; active: boolean; freeCount: number; onClick: () => void }) {
  return (
    <button className={'pb-court' + (active ? ' is-active' : '')} onClick={onClick}>
      <span className="pb-court-name">{court.name}</span>
      <span className="pb-court-type">{court.type}</span>
      <span className="pb-court-price">{fmtRp(court.pricePerHour)}<small>/jam</small></span>
      <span className="pb-court-free">{freeCount} slot kosong</span>
    </button>
  )
}

export function Slot({ hour, taken, onClick }: { hour: number; taken: boolean; onClick: () => void }) {
  return (
    <button className={'pb-slot' + (taken ? ' is-taken' : '')} disabled={taken} onClick={onClick}>
      {fmtHour(hour)}
    </button>
  )
}

export function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="pb-row">
      <span className="pb-row-label">{label}</span>
      <span className={'pb-row-value' + (strong ? ' is-strong' : '')}>{value}</span>
    </div>
  )
}

/* ---------- booking form (bottom sheet) ---------- */

export interface BookingForm {
  name: string
  wa: string
  duration: number
  notes: string
  total: number
}

export function BookingSheet({
  venue,
  court,
  dateObj,
  hour,
  isFree,
  onClose,
  onSubmit,
}: {
  venue: Venue
  court: Court
  dateObj: DateOption
  hour: number
  isFree: (hour: number) => boolean
  onClose: () => void
  onSubmit: (form: BookingForm) => void
}) {
  const [name, setName] = useState('')
  const [wa, setWa] = useState('')
  const [duration, setDuration] = useState(1)
  const [notes, setNotes] = useState('')

  // which durations are possible from this start hour
  const maxDur = useMemo(() => {
    let d = 0
    for (let i = 0; i < 3; i++) {
      const h = hour + i
      if (h + 1 > venue.closeHour || !isFree(h)) break
      d++
    }
    return d
  }, [hour, isFree, venue.closeHour])

  useEffect(() => {
    if (duration > maxDur) setDuration(maxDur)
  }, [maxDur, duration])

  const total = court.pricePerHour * duration
  const waValid = /^(\+?62|0)8\d{7,12}$/.test(wa.replace(/[\s-]/g, ''))
  const valid = name.trim().length >= 2 && waValid

  return (
    <div className="pb-scrim" onClick={onClose}>
      <div className="pb-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="pb-sheet-grab"></div>
        <div className="pb-sheet-head">
          <div>
            <div className="pb-sheet-title">Detail Booking</div>
            <div className="pb-sheet-sub">{court.name} · {dateObj.label} · {fmtHour(hour)}</div>
          </div>
          <button className="pb-sheet-close" onClick={onClose} aria-label="Tutup">✕</button>
        </div>

        <label className="pb-field">
          <span className="pb-field-label">Nama</span>
          <input
            className="pb-input"
            placeholder="Nama lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </label>

        <label className="pb-field">
          <span className="pb-field-label">Nomor WhatsApp</span>
          <input
            className="pb-input"
            placeholder="08xxxxxxxxxx"
            inputMode="tel"
            value={wa}
            onChange={(e) => setWa(e.target.value)}
          />
          {wa.length > 0 && !waValid ? (
            <span className="pb-field-err">Format nomor belum benar — contoh: 081234567890</span>
          ) : null}
        </label>

        <div className="pb-field">
          <span className="pb-field-label">Durasi main</span>
          <div className="pb-seg">
            {[1, 2, 3].map((d) => (
              <button
                key={d}
                className={'pb-seg-btn' + (duration === d ? ' is-active' : '')}
                disabled={d > maxDur}
                onClick={() => setDuration(d)}
              >
                {d} jam
              </button>
            ))}
          </div>
          {maxDur < 3 ? (
            <span className="pb-field-hint">Maksimal {maxDur} jam — slot berikutnya sudah terisi</span>
          ) : null}
        </div>

        <label className="pb-field">
          <span className="pb-field-label">Catatan <em>(opsional)</em></span>
          <textarea
            className="pb-input pb-textarea"
            placeholder="Misal: sewa raket 2 buah"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </label>

        <div className="pb-sheet-total">
          <div>
            <div className="pb-sheet-total-label">Total</div>
            <div className="pb-sheet-total-time">{fmtHour(hour)} – {fmtHour(hour + duration)} · {duration} jam</div>
          </div>
          <div className="pb-sheet-total-num">{fmtRp(total)}</div>
        </div>

        <button
          className="pb-btn-primary"
          disabled={!valid}
          onClick={() => onSubmit({ name: name.trim(), wa, duration, notes, total })}
        >
          Booking Sekarang
        </button>
        <div className="pb-sheet-foot">Tanpa akun · konfirmasi pembayaran oleh admin venue</div>
      </div>
    </div>
  )
}

/* ---------- invoice / summary screen ---------- */

export interface PlacedBooking extends BookingForm {
  code: string
  court: Court
  dateObj: DateOption
  hour: number
}

export function Invoice({ venue, booking, onBack }: { venue: Venue; booking: PlacedBooking; onBack: () => void }) {
  const [payTab, setPayTab] = useState<'qris' | 'bank'>('qris')
  const [copied, setCopied] = useState(false)

  const copyAccount = () => {
    try {
      navigator.clipboard.writeText(venue.bank.number)
    } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const waMessage = encodeURIComponent(
    `Halo, saya ${booking.name}. Saya sudah transfer ${fmtRp(booking.total)} untuk booking ${booking.code} (${booking.court.name}, ${booking.dateObj.label}, ${fmtHour(booking.hour)}).`,
  )

  return (
    <div className="pb-screen">
      <div className="pb-invoice-head">
        <button className="pb-back" onClick={onBack} aria-label="Kembali">←</button>
        <div className="pb-invoice-head-text">
          <div className="pb-invoice-code">{booking.code}</div>
          <div className="pb-invoice-venue">{venue.name}</div>
        </div>
        <div className="pb-status pb-status-pending">Menunggu Pembayaran</div>
      </div>

      <div className="pb-card">
        <Row label="Lapangan" value={`${booking.court.name} · ${booking.court.type}`} />
        <Row label="Tanggal" value={booking.dateObj.label} />
        <Row label="Jam" value={`${fmtHour(booking.hour)} – ${fmtHour(booking.hour + booking.duration)}`} />
        <Row label="Durasi" value={`${booking.duration} jam`} />
        <Row label="Nama" value={booking.name} />
        <Row label="WhatsApp" value={booking.wa} />
        {booking.notes ? <Row label="Catatan" value={booking.notes} /> : null}
        <div className="pb-card-divider"></div>
        <Row label="Total" value={fmtRp(booking.total)} strong />
      </div>

      <div className="pb-pay-title">Cara Pembayaran</div>
      <div className="pb-seg pb-seg-pay">
        <button className={'pb-seg-btn' + (payTab === 'qris' ? ' is-active' : '')} onClick={() => setPayTab('qris')}>QRIS</button>
        <button className={'pb-seg-btn' + (payTab === 'bank' ? ' is-active' : '')} onClick={() => setPayTab('bank')}>Transfer Bank</button>
      </div>

      {payTab === 'qris' ? (
        <div className="pb-card pb-pay-card">
          <div className="pb-qris-ph">
            <span>gambar QRIS venue</span>
          </div>
          <div className="pb-pay-note">Scan dengan aplikasi bank atau e-wallet apa pun, lalu bayar {fmtRp(booking.total)}.</div>
        </div>
      ) : (
        <div className="pb-card pb-pay-card">
          <div className="pb-bank">
            <div>
              <div className="pb-bank-name">{venue.bank.name}</div>
              <div className="pb-bank-number">{venue.bank.number.replace(/(\d{4})(\d{3})(\d+)/, '$1 $2 $3')}</div>
              <div className="pb-bank-holder">a.n. {venue.bank.holder}</div>
            </div>
            <button className="pb-copy" onClick={copyAccount}>{copied ? 'Tersalin ✓' : 'Salin'}</button>
          </div>
          <div className="pb-pay-note">Transfer tepat {fmtRp(booking.total)} agar mudah diverifikasi admin.</div>
        </div>
      )}

      <div className="pb-pay-steps">
        Setelah membayar, admin akan memverifikasi dana masuk dan status booking berubah menjadi
        <span className="pb-status-inline"> Dikonfirmasi</span>. Jadwal Anda otomatis terkunci.
      </div>

      <a className="pb-btn-primary pb-btn-wa" href={`https://wa.me/${venue.wa}?text=${waMessage}`} target="_blank" rel="noreferrer">
        Konfirmasi via WhatsApp
      </a>
      <button className="pb-btn-ghost" onClick={onBack}>Kembali ke Jadwal</button>
    </div>
  )
}
