import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/lib/db'
import { courts } from '~/lib/db/schema'
import { parseBody, requireOwnedVenue, requireSession } from '~/lib/api-utils'

const courtSchema = z.object({
  name: z.string().trim().min(1).max(255),
  type: z.enum(['Indoor', 'Outdoor']).default('Indoor'),
  pricePerHour: z.number().int().min(0),
})

type Params = { params: Promise<{ venueId: string }> }

// GET /api/admin/venues/[venueId]/courts
export async function GET(_req: Request, { params }: Params) {
  const { session, response } = await requireSession()
  if (response) return response

  const { venueId } = await params
  const { response: ownError } = await requireOwnedVenue(venueId, session.user.id)
  if (ownError) return ownError

  const rows = await db.query.courts.findMany({ where: eq(courts.venueId, venueId) })
  return NextResponse.json(rows)
}

// POST /api/admin/venues/[venueId]/courts
export async function POST(req: Request, { params }: Params) {
  const { session, response } = await requireSession()
  if (response) return response

  const { venueId } = await params
  const { response: ownError } = await requireOwnedVenue(venueId, session.user.id)
  if (ownError) return ownError

  const { data, response: bodyError } = await parseBody(req, courtSchema)
  if (bodyError) return bodyError

  const id = crypto.randomUUID()
  await db.insert(courts).values({ ...data, id, venueId })

  const created = await db.query.courts.findFirst({ where: eq(courts.id, id) })
  return NextResponse.json(created, { status: 201 })
}
