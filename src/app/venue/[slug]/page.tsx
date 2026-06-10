import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Venue } from '~/lib/data'
import { loadVenueWithCourtsBySlug } from '~/lib/venue-queries'
import { VenueClient } from './venue-client'

interface VenuePageProps {
  params: Promise<{ slug: string }>
}

async function loadVenue(slug: string): Promise<Venue | null> {
  const venue = await loadVenueWithCourtsBySlug(slug)
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
