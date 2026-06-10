'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fmtOpenHours,
  upcomingDates,
  type Availability,
  type Court,
  type DateOption,
  type Venue,
} from '~/lib/data'
import { BookingSheet, CourtCard, DateChip, Invoice, Slot, type BookingForm, type PlacedBooking } from '~/components/booking'

interface Picked {
  court: Court
  dateObj: DateOption
  hour: number
}

export function VenueClient({ venue }: { venue: Venue }) {
  const dates = useMemo(() => upcomingDates(7), [])
  const hours = useMemo(
    () => Array.from({ length: venue.closeHour - venue.openHour }, (_, i) => venue.openHour + i),
    [venue],
  )

  const [dateIdx, setDateIdx] = useState(0)
  const [courtIdx, setCourtIdx] = useState(0)
  const [picked, setPicked] = useState<Picked | null>(null)
  const [booking, setBooking] = useState<PlacedBooking | null>(null)
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const dateKey = dates[dateIdx].key

  const loadAvailability = useCallback(async (date: string) => {
    setAvailability(null)
    const res = await fetch(`/api/venues/${venue.slug}/availability?date=${date}`)
    if (res.ok) setAvailability(await res.json())
  }, [venue.slug])

  useEffect(() => {
    loadAvailability(dateKey)
  }, [dateKey, loadAvailability])

  const takenFor = (courtId: string) =>
    availability?.courts.find((c) => c.courtId === courtId)?.takenHours ?? []

  const isFree = (court: Court, hour: number) =>
    availability !== null && !takenFor(court.id).includes(hour)

  const freeCount = (court: Court) => hours.filter((h) => isFree(court, h)).length

  const isFreeAtPicked = (hour: number) => picked !== null && isFree(picked.court, hour)

  const submit = async (form: BookingForm) => {
    if (!picked) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courtId: picked.court.id,
          customerName: form.name,
          customerWa: form.wa.replace(/[\s-]/g, ''),
          date: picked.dateObj.key,
          startHour: picked.hour,
          duration: form.duration,
          notes: form.notes.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setSubmitError(
          res.status === 409
            ? 'Slot baru saja terisi oleh pelanggan lain. Silakan pilih jam lain.'
            : (body?.error ?? 'Booking gagal, coba lagi.'),
        )
        loadAvailability(dateKey)
        return
      }

      const created: { code: string; totalPrice: number } = await res.json()
      setBooking({
        ...form,
        total: created.totalPrice,
        code: created.code,
        court: picked.court,
        dateObj: picked.dateObj,
        hour: picked.hour,
      })
      setPicked(null)
      loadAvailability(dateKey)
    } catch {
      setSubmitError('Jaringan bermasalah, coba lagi.')
    } finally {
      setSubmitting(false)
    }
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
                <span className="pb-venue-hours">Buka {fmtOpenHours(venue)}</span>
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
                  freeCount={freeCount(c)}
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
                  taken={!isFree(venue.courts[courtIdx], h)}
                  onClick={() =>
                    setPicked({ court: venue.courts[courtIdx], dateObj: dates[dateIdx], hour: h })
                  }
                />
              ))}
            </div>

            <div className="pb-foot-hint">
              {availability === null
                ? 'Memuat ketersediaan…'
                : 'Pilih jam kosong untuk booking — tanpa akun, cukup nama & nomor WhatsApp.'}
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
            busy={submitting}
            error={submitError}
            onClose={() => { setPicked(null); setSubmitError(null) }}
            onSubmit={submit}
          />
        ) : null}
      </div>
    </div>
  )
}
