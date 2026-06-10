import { NextResponse } from 'next/server'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { BOOKING_STATUSES, bookings, courts, venues } from '~/lib/db/schema'
import type { BookingStatus } from '~/lib/db/schema'
import { jsonError, requireSession } from '~/lib/api-utils'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

// GET /api/admin/bookings?venueId=&date=YYYY-MM-DD&status=
// Lists bookings across all of the tenant's venues.
export async function GET(req: Request) {
  const { session, response } = await requireSession()
  if (response) return response

  const sp = new URL(req.url).searchParams
  const venueId = sp.get('venueId')
  const date = sp.get('date')
  const status = sp.get('status')

  if (date && !DATE_RE.test(date)) return jsonError(400, '"date" must be YYYY-MM-DD')
  if (status && !BOOKING_STATUSES.includes(status as BookingStatus)) {
    return jsonError(400, `"status" must be one of ${BOOKING_STATUSES.join(', ')}`)
  }

  const conditions = [eq(venues.tenantId, session.user.id)]
  if (venueId) conditions.push(eq(venues.id, venueId))
  if (date) conditions.push(eq(bookings.date, date))
  if (status) conditions.push(eq(bookings.status, status as BookingStatus))

  const rows = await db
    .select({
      id: bookings.id,
      code: bookings.code,
      customerName: bookings.customerName,
      customerWa: bookings.customerWa,
      date: bookings.date,
      startHour: bookings.startHour,
      duration: bookings.duration,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      notes: bookings.notes,
      createdAt: bookings.createdAt,
      court: { id: courts.id, name: courts.name },
      venue: { id: venues.id, name: venues.name, slug: venues.slug },
    })
    .from(bookings)
    .innerJoin(courts, eq(bookings.courtId, courts.id))
    .innerJoin(venues, eq(courts.venueId, venues.id))
    .where(and(...conditions))
    .orderBy(desc(bookings.date), desc(bookings.startHour))

  return NextResponse.json(rows)
}
