import { createFileRoute, notFound } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  newBookingCode,
  slotTaken,
  upcomingDates,
  venueBySlug,
  type Court,
  type DateOption,
} from '~/lib/data'
import { BookingSheet, CourtCard, DateChip, Invoice, Slot, type BookingForm, type PlacedBooking } from '~/components/booking'

export const Route = createFileRoute('/venue/$slug')({
  loader: ({ params }) => {
    const venue = venueBySlug(params.slug)
    if (!venue) throw notFound()
    return { slug: params.slug }
  },
  head: ({ params }) => ({
    meta: [{ title: `${venueBySlug(params.slug)?.name ?? 'Venue'} — Booking · Padelin` }],
  }),
  notFoundComponent: () => (
    <div className="pb-page">
      <div className="pb-app">
        <div className="pb-screen" style={{ justifyContent: 'center', textAlign: 'center', gap: 12 }}>
          <div className="pb-venue-name">Venue tidak ditemukan</div>
          <div className="pb-pay-note" style={{ margin: '0 auto' }}>
            Periksa kembali link yang Anda terima dari venue.
          </div>
        </div>
      </div>
    </div>
  ),
  component: VenuePage,
})

interface Picked {
  court: Court
  courtIdx: number
  dateObj: DateOption
  hour: number
}

function VenuePage() {
  const { slug } = Route.useParams()
  const venue = venueBySlug(slug)!

  const dates = useMemo(() => upcomingDates(7), [])
  const hours = useMemo(
    () => Array.from({ length: venue.closeHour - venue.openHour }, (_, i) => venue.openHour + i),
    [venue],
  )

  const [dateIdx, setDateIdx] = useState(0)
  const [courtIdx, setCourtIdx] = useState(0)
  const [picked, setPicked] = useState<Picked | null>(null)
  const [booking, setBooking] = useState<PlacedBooking | null>(null)
  // locally-made bookings (frontend-only): "courtId|date|hour" → true
  const [localBookings, setLocalBookings] = useState<Record<string, boolean>>({})

  const isFree = (cIdx: number, hour: number) =>
    !slotTaken(cIdx, dates[dateIdx].key, hour) &&
    !localBookings[`${venue.courts[cIdx].id}|${dates[dateIdx].key}|${hour}`]

  const freeCount = (cIdx: number) => hours.filter((h) => isFree(cIdx, h)).length

  const isFreeAtPicked = (hour: number) =>
    picked !== null &&
    !slotTaken(picked.courtIdx, picked.dateObj.key, hour) &&
    !localBookings[`${picked.court.id}|${picked.dateObj.key}|${hour}`]

  const submit = (form: BookingForm) => {
    if (!picked) return
    const b: PlacedBooking = { ...picked, ...form, code: newBookingCode() }
    const next = { ...localBookings }
    for (let i = 0; i < form.duration; i++) {
      next[`${picked.court.id}|${picked.dateObj.key}|${picked.hour + i}`] = true
    }
    setLocalBookings(next)
    setPicked(null)
    setBooking(b)
  }

  return (
    <div className="pb-page">
      <div className="pb-app">
        {booking ? (
          <Invoice venue={venue} booking={booking} onBack={() => setBooking(null)} />
        ) : (
          <div className="pb-screen">
            {/* header */}
            <div className="pb-head">
              <div className="pb-url">padelin.id/venue/{venue.slug}</div>
              <h1 className="pb-venue-name">{venue.name}</h1>
              <div className="pb-venue-meta">
                <span>{venue.address}</span>
                <span className="pb-venue-hours">Buka {venue.hours}</span>
              </div>
            </div>

            {/* date strip */}
            <div className="pb-label">Pilih tanggal</div>
            <div className="pb-dates">
              {dates.map((d, i) => (
                <DateChip key={d.key} d={d} active={i === dateIdx} onClick={() => setDateIdx(i)} />
              ))}
            </div>

            {/* courts */}
            <div className="pb-label">Pilih lapangan</div>
            <div className="pb-courts">
              {venue.courts.map((c, i) => (
                <CourtCard
                  key={c.id}
                  court={c}
                  active={i === courtIdx}
                  freeCount={freeCount(i)}
                  onClick={() => setCourtIdx(i)}
                />
              ))}
            </div>

            {/* slots */}
            <div className="pb-label pb-label-slots">
              <span>Pilih jam main</span>
              <span className="pb-legend">
                <span className="pb-legend-dot pb-legend-free"></span> kosong
                <span className="pb-legend-dot pb-legend-taken"></span> terisi
              </span>
            </div>
            <div className="pb-slots">
              {hours.map((h) => (
                <Slot
                  key={h}
                  hour={h}
                  taken={!isFree(courtIdx, h)}
                  onClick={() =>
                    setPicked({ court: venue.courts[courtIdx], courtIdx, dateObj: dates[dateIdx], hour: h })
                  }
                />
              ))}
            </div>

            <div className="pb-foot-hint">
              Pilih jam kosong untuk booking — tanpa akun, cukup nama &amp; nomor WhatsApp.
            </div>
          </div>
        )}

        {picked ? (
          <BookingSheet
            venue={venue}
            court={picked.court}
            dateObj={picked.dateObj}
            hour={picked.hour}
            isFree={isFreeAtPicked}
            onClose={() => setPicked(null)}
            onSubmit={submit}
          />
        ) : null}
      </div>
    </div>
  )
}
