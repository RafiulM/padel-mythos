import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/lib/db'
import { BOOKING_STATUSES, bookings, courts, venues } from '~/lib/db/schema'
import { jsonError, parseBody, requireSession } from '~/lib/api-utils'

const statusSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
})

type Params = { params: Promise<{ bookingId: string }> }

/** Loads a booking and verifies it belongs to one of the tenant's venues. */
async function requireOwnedBooking(bookingId: string, tenantId: string) {
  const [booking] = await db
    .select({
      id: bookings.id,
      tenantId: venues.tenantId,
    })
    .from(bookings)
    .innerJoin(courts, eq(bookings.courtId, courts.id))
    .innerJoin(venues, eq(courts.venueId, venues.id))
    .where(eq(bookings.id, bookingId))
    .limit(1)
  if (!booking) {
    return { booking: null, response: jsonError(404, 'Booking not found') } as const
  }
  if (booking.tenantId !== tenantId) {
    return { booking: null, response: jsonError(403, 'Forbidden') } as const
  }
  return { booking, response: null } as const
}

// PATCH /api/admin/bookings/[bookingId] — update status
// (confirm payment: PENDING -> PAID, cancel, complete)
export async function PATCH(req: Request, { params }: Params) {
  const { session, response } = await requireSession()
  if (response) return response

  const { bookingId } = await params
  const { response: ownError } = await requireOwnedBooking(bookingId, session.user.id)
  if (ownError) return ownError

  const { data, response: bodyError } = await parseBody(req, statusSchema)
  if (bodyError) return bodyError

  await db.update(bookings).set({ status: data.status }).where(eq(bookings.id, bookingId))

  const updated = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingId) })
  return NextResponse.json(updated)
}

// DELETE /api/admin/bookings/[bookingId]
export async function DELETE(_req: Request, { params }: Params) {
  const { session, response } = await requireSession()
  if (response) return response

  const { bookingId } = await params
  const { response: ownError } = await requireOwnedBooking(bookingId, session.user.id)
  if (ownError) return ownError

  await db.delete(bookings).where(eq(bookings.id, bookingId))
  return NextResponse.json({ ok: true })
}
