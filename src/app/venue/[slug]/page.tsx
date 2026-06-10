import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { venueBySlug } from '~/lib/data'
import { VenueClient } from './venue-client'

interface VenuePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { slug } = await params
  const venue = venueBySlug(slug)

  return {
    title: `${venue?.name ?? 'Venue'} — Booking · Padelin`,
  }
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { slug } = await params
  const venue = venueBySlug(slug)

  if (!venue) {
    notFound()
  }

  return <VenueClient slug={slug} />
}
