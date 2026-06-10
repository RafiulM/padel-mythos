import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/lib/db'
import { courts, venues } from '~/lib/db/schema'
import { jsonError, parseBody, requireSession } from '~/lib/api-utils'

const courtUpdateSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  type: z.enum(['Indoor', 'Outdoor']).optional(),
  pricePerHour: z.number().int().min(0).optional(),
})

type Params = { params: Promise<{ courtId: string }> }

/** Loads a court and verifies its venue belongs to the tenant. */
async function requireOwnedCourt(courtId: string, tenantId: string) {
  const [court] = await db
    .select({
      id: courts.id,
      venueId: courts.venueId,
      name: courts.name,
      type: courts.type,
      pricePerHour: courts.pricePerHour,
      tenantId: venues.tenantId,
    })
    .from(courts)
    .innerJoin(venues, eq(courts.venueId, venues.id))
    .where(eq(courts.id, courtId))
    .limit(1)
  if (!court) return { court: null, response: jsonError(404, 'Court not found') } as const
  if (court.tenantId !== tenantId) {
    return { court: null, response: jsonError(403, 'Forbidden') } as const
  }
  return { court, response: null } as const
}

// PATCH /api/admin/courts/[courtId]
export async function PATCH(req: Request, { params }: Params) {
  const { session, response } = await requireSession()
  if (response) return response

  const { courtId } = await params
  const { response: ownError } = await requireOwnedCourt(courtId, session.user.id)
  if (ownError) return ownError

  const { data, response: bodyError } = await parseBody(req, courtUpdateSchema)
  if (bodyError) return bodyError

  await db.update(courts).set(data).where(eq(courts.id, courtId))

  const updated = await db.query.courts.findFirst({ where: eq(courts.id, courtId) })
  return NextResponse.json(updated)
}

// DELETE /api/admin/courts/[courtId] — cascades to bookings
export async function DELETE(_req: Request, { params }: Params) {
  const { session, response } = await requireSession()
  if (response) return response

  const { courtId } = await params
  const { response: ownError } = await requireOwnedCourt(courtId, session.user.id)
  if (ownError) return ownError

  await db.delete(courts).where(eq(courts.id, courtId))
  return NextResponse.json({ ok: true })
}
