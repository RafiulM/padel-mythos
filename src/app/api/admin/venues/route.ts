import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/lib/db'
import { venues } from '~/lib/db/schema'
import { jsonError, parseBody, requireSession } from '~/lib/api-utils'
import { loadTenantVenuesWithCourts } from '~/lib/venue-queries'

const venueSchema = z.object({
  name: z.string().trim().min(2).max(255),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be kebab-case'),
  address: z.string().trim().max(2000).optional(),
  whatsapp: z.string().trim().max(32).optional(),
  openHour: z.number().int().min(0).max(23).default(7),
  closeHour: z.number().int().min(1).max(24).default(22),
  bankName: z.string().trim().max(64).optional(),
  bankNumber: z.string().trim().max(64).optional(),
  bankHolder: z.string().trim().max(255).optional(),
  qrisUrl: z.string().trim().url().optional(),
  paymentNotes: z.string().trim().max(2000).optional(),
})

// GET /api/admin/venues — list the tenant's venues with courts
export async function GET() {
  const { session, response } = await requireSession()
  if (response) return response

  const rows = await loadTenantVenuesWithCourts(session.user.id)
  return NextResponse.json(rows)
}

// POST /api/admin/venues — create a venue
export async function POST(req: Request) {
  const { session, response } = await requireSession()
  if (response) return response

  const { data, response: bodyError } = await parseBody(req, venueSchema)
  if (bodyError) return bodyError

  if (data.closeHour <= data.openHour) {
    return jsonError(400, 'closeHour must be after openHour')
  }

  const existing = await db.query.venues.findFirst({ where: eq(venues.slug, data.slug) })
  if (existing) return jsonError(409, 'Slug already in use')

  const id = crypto.randomUUID()
  await db.insert(venues).values({ ...data, id, tenantId: session.user.id })

  const created = await db.query.venues.findFirst({ where: eq(venues.id, id) })
  return NextResponse.json(created, { status: 201 })
}
