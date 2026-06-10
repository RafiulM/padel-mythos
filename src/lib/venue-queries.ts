import { eq, inArray } from 'drizzle-orm'
import { db } from '~/lib/db'
import { courts, venues } from '~/lib/db/schema'
import type { Court, Venue } from '~/lib/data'

const venueColumns = {
  id: venues.id,
  tenantId: venues.tenantId,
  name: venues.name,
  slug: venues.slug,
  address: venues.address,
  whatsapp: venues.whatsapp,
  openHour: venues.openHour,
  closeHour: venues.closeHour,
  bankName: venues.bankName,
  bankNumber: venues.bankNumber,
  bankHolder: venues.bankHolder,
  qrisUrl: venues.qrisUrl,
  paymentNotes: venues.paymentNotes,
}

const courtColumns = {
  id: courts.id,
  venueId: courts.venueId,
  name: courts.name,
  type: courts.type,
  pricePerHour: courts.pricePerHour,
}

interface VenueRow {
  id: string
  tenantId: string
  name: string
  slug: string
  address: string | null
  whatsapp: string | null
  openHour: number
  closeHour: number
  bankName: string | null
  bankNumber: string | null
  bankHolder: string | null
  qrisUrl: string | null
  paymentNotes: string | null
}

interface VenueWithTenant extends Venue {
  tenantId: string
}

function attachCourts(rows: VenueRow[], courtRows: Array<Court & { venueId: string }>): VenueWithTenant[] {
  const courtsByVenue = new Map<string, Court[]>()

  for (const court of courtRows) {
    const { venueId, ...publicCourt } = court
    const venueCourts = courtsByVenue.get(venueId) ?? []
    venueCourts.push(publicCourt)
    courtsByVenue.set(venueId, venueCourts)
  }

  return rows.map((venue) => ({
    ...venue,
    courts: courtsByVenue.get(venue.id) ?? [],
  }))
}

export async function loadVenueWithCourtsBySlug(slug: string): Promise<VenueWithTenant | null> {
  const rows = await db.select(venueColumns).from(venues).where(eq(venues.slug, slug)).limit(1)
  const [venue] = await loadVenuesWithCourts(rows)
  return venue ?? null
}

export async function loadVenueWithCourtsById(id: string): Promise<VenueWithTenant | null> {
  const rows = await db.select(venueColumns).from(venues).where(eq(venues.id, id)).limit(1)
  const [venue] = await loadVenuesWithCourts(rows)
  return venue ?? null
}

export async function loadTenantVenuesWithCourts(tenantId: string): Promise<VenueWithTenant[]> {
  const rows = await db.select(venueColumns).from(venues).where(eq(venues.tenantId, tenantId))
  return loadVenuesWithCourts(rows)
}

async function loadVenuesWithCourts(rows: VenueRow[]): Promise<VenueWithTenant[]> {
  if (rows.length === 0) return []

  const courtRows = await db
    .select(courtColumns)
    .from(courts)
    .where(inArray(courts.venueId, rows.map((venue) => venue.id)))

  return attachCourts(rows, courtRows)
}
