import { NextResponse } from 'next/server'
import { and, eq, inArray, lt, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/lib/db'
import { bookings, courts, venues } from '~/lib/db/schema'
import { jsonError, newBookingCode, parseBody } from '~/lib/api-utils'

const createBookingSchema = z.object({
  courtId: z.string().min(1),
  customerName: z.string().trim().min(2).max(255),
  customerWa: z
    .string()
    .trim()
    .regex(/^(\+?62|0)8\d{7,12}$/, 'Invalid Indonesian WhatsApp number'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startHour: z.number().int().min(0).max(23),
  duration: z.number().int().min(1).max(6),
  notes: z.string().trim().max(1000).optional(),
})

/** Today's date string in WIB (UTC+7) — the platform targets Indonesia. */
function todayWib(): string {
  return new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10)
}

class BookingConflictError extends Error {}

// POST /api/bookings — public guest checkout, no login required
export async function POST(req: Request) {
  const { data, response } = await parseBody(req, createBookingSchema)
  if (response) return response

  const { courtId, date, startHour, duration } = data

  if (date < todayWib()) return jsonError(400, 'Cannot book a past date')

  try {
    const booking = await db.transaction(async (tx) => {
      // Lock the court row so concurrent bookings for the same court
      // serialize here — the overlap check below stays race-free.
      const [court] = await tx
        .select({
          id: courts.id,
          name: courts.name,
          pricePerHour: courts.pricePerHour,
          openHour: venues.openHour,
          closeHour: venues.closeHour,
          venueName: venues.name,
          venueSlug: venues.slug,
        })
        .from(courts)
        .innerJoin(venues, eq(courts.venueId, venues.id))
        .where(eq(courts.id, courtId))
        .for('update')

      if (!court) throw new BookingConflictError('COURT_NOT_FOUND')

      if (startHour < court.openHour || startHour + duration > court.closeHour) {
        throw new BookingConflictError('OUTSIDE_HOURS')
      }

      const overlapping = await tx
        .select({ id: bookings.id })
        .from(bookings)
        .where(
          and(
            eq(bookings.courtId, courtId),
            eq(bookings.date, date),
            inArray(bookings.status, ['PENDING', 'PAID']),
            lt(bookings.startHour, startHour + duration),
            sql`${bookings.startHour} + ${bookings.duration} > ${startHour}`,
          ),
        )
        .limit(1)

      if (overlapping.length > 0) throw new BookingConflictError('SLOT_TAKEN')

      const code = newBookingCode()
      const totalPrice = court.pricePerHour * duration

      await tx.insert(bookings).values({
        code,
        courtId,
        customerName: data.customerName,
        customerWa: data.customerWa,
        date,
        startHour,
        duration,
        totalPrice,
        notes: data.notes,
      })

      return { code, totalPrice, court }
    })

    return NextResponse.json(
      {
        code: booking.code,
        status: 'PENDING',
        courtName: booking.court.name,
        venueName: booking.court.venueName,
        venueSlug: booking.court.venueSlug,
        date,
        startHour,
        duration,
        totalPrice: booking.totalPrice,
      },
      { status: 201 },
    )
  } catch (err) {
    if (err instanceof BookingConflictError) {
      switch (err.message) {
        case 'COURT_NOT_FOUND':
          return jsonError(404, 'Court not found')
        case 'OUTSIDE_HOURS':
          return jsonError(400, 'Requested time is outside venue operating hours')
        case 'SLOT_TAKEN':
          return jsonError(409, 'Slot is no longer available')
      }
    }
    throw err
  }
}
