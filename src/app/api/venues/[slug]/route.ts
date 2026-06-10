import { NextResponse } from 'next/server'
import { jsonError } from '~/lib/api-utils'
import { loadVenueWithCourtsBySlug } from '~/lib/venue-queries'

// GET /api/venues/[slug] — public venue page data (courts + payment info)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const venue = await loadVenueWithCourtsBySlug(slug)

  if (!venue) return jsonError(404, 'Venue not found')

  const { tenantId, ...publicVenue } = venue
  return NextResponse.json(publicVenue)
}
