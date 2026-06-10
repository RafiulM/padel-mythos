import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { bookings } from '~/lib/db/schema'
import { jsonError } from '~/lib/api-utils'

// GET /api/bookings/[code] — public invoice lookup by booking code.
// Returns booking + venue payment instructions (bank / QRIS).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params

  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.code, code.toUpperCase()),
    with: {
      court: {
        columns: { name: true, type: true, pricePerHour: true },
        with: {
          venue: {
            columns: {
              name: true,
              slug: true,
              address: true,
              whatsapp: true,
              bankName: true,
              bankNumber: true,
              bankHolder: true,
              qrisUrl: true,
              paymentNotes: true,
            },
          },
        },
      },
    },
  })

  if (!booking) return jsonError(404, 'Booking not found')

  return NextResponse.json(booking)
}
