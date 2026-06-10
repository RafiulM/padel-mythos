import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/lib/db'
import { venues } from '~/lib/db/schema'
import { jsonError, parseBody, requireOwnedVenue, requireSession } from '~/lib/api-utils'
import { loadVenueWithCourtsById } from '~/lib/venue-queries'

const venueUpdateSchema = z.object({
  name: z.string().trim().min(2).max(255).optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be kebab-case')
    .optional(),
  address: z.string().trim().max(2000).nullish(),
  whatsapp: z.string().trim().max(32).nullish(),
  openHour: z.number().int().min(0).max(23).optional(),
  closeHour: z.number().int().min(1).max(24).optional(),
  bankName: z.string().trim().max(64).nullish(),
  bankNumber: z.string().trim().max(64).nullish(),
  bankHolder: z.string().trim().max(255).nullish(),
  qrisUrl: z.string().trim().url().nullish(),
  paymentNotes: z.string().trim().max(2000).nullish(),
})

type Params = { params: Promise<{ venueId: string }> }

// GET /api/admin/venues/[venueId]
export async function GET(_req: Request, { params }: Params) {
  const { session, response } = await requireSession()
  if (response) return response

  const { venueId } = await params
  const { response: ownError } = await requireOwnedVenue(venueId, session.user.id)
  if (ownError) return ownError

  const venue = await loadVenueWithCourtsById(venueId)
  return NextResponse.json(venue)
}

// PATCH /api/admin/venues/[venueId]
export async function PATCH(req: Request, { params }: Params) {
  const { session, response } = await requireSession()
  if (response) return response

  const { venueId } = await params
  const { venue, response: ownError } = await requireOwnedVenue(venueId, session.user.id)
  if (ownError) return ownError

  const { data, response: bodyError } = await parseBody(req, venueUpdateSchema)
  if (bodyError) return bodyError

  const openHour = data.openHour ?? venue.openHour
  const closeHour = data.closeHour ?? venue.closeHour
  if (closeHour <= openHour) return jsonError(400, 'closeHour must be after openHour')

  if (data.slug && data.slug !== venue.slug) {
    const taken = await db.query.venues.findFirst({ where: eq(venues.slug, data.slug) })
    if (taken) return jsonError(409, 'Slug already in use')
  }

  await db.update(venues).set(data).where(eq(venues.id, venueId))

  const updated = await loadVenueWithCourtsById(venueId)
  return NextResponse.json(updated)
}

// DELETE /api/admin/venues/[venueId] — cascades to courts and bookings
export async function DELETE(_req: Request, { params }: Params) {
  const { session, response } = await requireSession()
  if (response) return response

  const { venueId } = await params
  const { response: ownError } = await requireOwnedVenue(venueId, session.user.id)
  if (ownError) return ownError

  await db.delete(venues).where(eq(venues.id, venueId))
  return NextResponse.json({ ok: true })
}
