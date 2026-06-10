import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { bookings, courts, venues } from '~/lib/db/schema'
import { jsonError } from '~/lib/api-utils'

// GET /api/bookings/[code] — public invoice lookup by booking code.
// Returns booking + venue payment instructions (bank / QRIS).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params

  const [row] = await db
    .select({
      id: bookings.id,
      code: bookings.code,
      courtId: bookings.courtId,
      customerName: bookings.customerName,
      customerWa: bookings.customerWa,
      date: bookings.date,
      startHour: bookings.startHour,
      duration: bookings.duration,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      notes: bookings.notes,
      createdAt: bookings.createdAt,
      courtName: courts.name,
      courtType: courts.type,
      courtPricePerHour: courts.pricePerHour,
      venueName: venues.name,
      venueSlug: venues.slug,
      venueAddress: venues.address,
      venueWhatsapp: venues.whatsapp,
      venueBankName: venues.bankName,
      venueBankNumber: venues.bankNumber,
      venueBankHolder: venues.bankHolder,
      venueQrisUrl: venues.qrisUrl,
      venuePaymentNotes: venues.paymentNotes,
    })
    .from(bookings)
    .innerJoin(courts, eq(bookings.courtId, courts.id))
    .innerJoin(venues, eq(courts.venueId, venues.id))
    .where(eq(bookings.code, code.toUpperCase()))
    .limit(1)

  if (!row) return jsonError(404, 'Booking not found')

  const booking = {
    id: row.id,
    code: row.code,
    courtId: row.courtId,
    customerName: row.customerName,
    customerWa: row.customerWa,
    date: row.date,
    startHour: row.startHour,
    duration: row.duration,
    totalPrice: row.totalPrice,
    status: row.status,
    notes: row.notes,
    createdAt: row.createdAt,
    court: {
      name: row.courtName,
      type: row.courtType,
      pricePerHour: row.courtPricePerHour,
      venue: {
        name: row.venueName,
        slug: row.venueSlug,
        address: row.venueAddress,
        whatsapp: row.venueWhatsapp,
        bankName: row.venueBankName,
        bankNumber: row.venueBankNumber,
        bankHolder: row.venueBankHolder,
        qrisUrl: row.venueQrisUrl,
        paymentNotes: row.venuePaymentNotes,
      },
    },
  }

  return NextResponse.json(booking)
}
