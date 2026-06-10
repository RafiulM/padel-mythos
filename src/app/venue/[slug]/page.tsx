import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { venues } from '~/lib/db/schema'
import type { Venue } from '~/lib/data'
import { VenueClient } from './venue-client'

interface VenuePageProps {
  params: Promise<{ slug: string }>
}

async function loadVenue(slug: string): Promise<Venue | null> {
  const venue = await db.query.venues.findFirst({
    where: eq(venues.slug, slug),
    columns: {
      id: true,
      name: true,
      slug: true,
      address: true,
      whatsapp: true,
      openHour: true,
      closeHour: true,
      bankName: true,
      bankNumber: true,
      bankHolder: true,
      qrisUrl: true,
      paymentNotes: true,
    },
    with: {
      courts: {
        columns: { id: true, name: true, type: true, pricePerHour: true },
      },
    },
  })
  return venue ?? null
}

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { slug } = await params
  const venue = await loadVenue(slug)

  return {
    title: `${venue?.name ?? 'Venue'} — Booking · Padelin`,
  }
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { slug } = await params
  const venue = await loadVenue(slug)

  if (!venue) {
    notFound()
  }

  return <VenueClient venue={venue} />
}
