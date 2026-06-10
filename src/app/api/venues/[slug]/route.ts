import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { venues } from '~/lib/db/schema'
import { jsonError } from '~/lib/api-utils'

// GET /api/venues/[slug] — public venue page data (courts + payment info)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const venue = await db.query.venues.findFirst({
    where: eq(venues.slug, slug),
    with: {
      courts: {
        columns: { id: true, name: true, type: true, pricePerHour: true },
      },
    },
  })

  if (!venue) return jsonError(404, 'Venue not found')

  const { tenantId, ...publicVenue } = venue
  return NextResponse.json(publicVenue)
}
