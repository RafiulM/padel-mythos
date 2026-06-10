import { NextResponse } from 'next/server'
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '~/lib/db'
import { bookings, courts, venues } from '~/lib/db/schema'
import { jsonError } from '~/lib/api-utils'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

// GET /api/venues/[slug]/availability?date=YYYY-MM-DD
// Returns taken hours per court. PENDING and PAID bookings block slots.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const date = new URL(req.url).searchParams.get('date')

  if (!date || !DATE_RE.test(date)) {
    return jsonError(400, 'Query param "date" required as YYYY-MM-DD')
  }

  const [venue] = await db
    .select({ id: venues.id, openHour: venues.openHour, closeHour: venues.closeHour })
    .from(venues)
    .where(eq(venues.slug, slug))
    .limit(1)
  if (!venue) return jsonError(404, 'Venue not found')

  const venueCourts = await db.select({ id: courts.id }).from(courts).where(eq(courts.venueId, venue.id))
  const courtIds = venueCourts.map((c) => c.id)
  const rows = courtIds.length
    ? await db
        .select({
          courtId: bookings.courtId,
          startHour: bookings.startHour,
          duration: bookings.duration,
        })
        .from(bookings)
        .where(
          and(
            inArray(bookings.courtId, courtIds),
            eq(bookings.date, date),
            inArray(bookings.status, ['PENDING', 'PAID']),
          ),
        )
    : []

  const takenByCourt = new Map<string, Set<number>>(courtIds.map((id) => [id, new Set()]))
  for (const row of rows) {
    const taken = takenByCourt.get(row.courtId)
    for (let h = row.startHour; h < row.startHour + row.duration; h++) taken?.add(h)
  }

  return NextResponse.json({
    date,
    openHour: venue.openHour,
    closeHour: venue.closeHour,
    courts: courtIds.map((id) => ({
      courtId: id,
      takenHours: [...(takenByCourt.get(id) ?? [])].sort((a, b) => a - b),
    })),
  })
}
