// Seeds a demo tenant (via Better Auth, so the password hash is valid),
// two venues, their courts, and sample bookings. Run: npm run db:seed
import 'dotenv/config'
import { eq, inArray } from 'drizzle-orm'
import { auth } from '../auth'
import { db } from './index'
import { bookings, courts, user, venues, type BookingStatus } from './schema'

const TENANT = {
  name: 'Demo Owner',
  email: 'owner@padelin.test',
  password: 'password123',
}

const VENUES = [
  {
    name: 'Padel Senayan',
    slug: 'padel-senayan',
    address: 'Jl. Asia Afrika No. 8, Jakarta Pusat',
    whatsapp: '6281234567890',
    openHour: 7,
    closeHour: 22,
    bankName: 'BCA',
    bankNumber: '8830112345',
    bankHolder: 'PT Padel Senayan Jaya',
    courts: [
      { name: 'Court A', type: 'Indoor' as const, pricePerHour: 250000 },
      { name: 'Court B', type: 'Indoor' as const, pricePerHour: 250000 },
      { name: 'Court C', type: 'Outdoor' as const, pricePerHour: 200000 },
    ],
  },
  {
    name: 'Padel Bekasi',
    slug: 'padel-bekasi',
    address: 'Jl. Ahmad Yani No. 12, Bekasi',
    whatsapp: '6281298765432',
    openHour: 8,
    closeHour: 22,
    bankName: 'Mandiri',
    bankNumber: '1330022334455',
    bankHolder: 'CV Padel Bekasi',
    courts: [
      { name: 'Court 1', type: 'Indoor' as const, pricePerHour: 180000 },
      { name: 'Court 2', type: 'Outdoor' as const, pricePerHour: 150000 },
    ],
  },
]

// [code, courtIdx, name, wa, dayOffset, startHour, duration, status, notes?]
type BookingSeed = [string, number, string, string, number, number, number, BookingStatus, string?]

const BOOKING_SEEDS: Record<string, BookingSeed[]> = {
  'padel-senayan': [
    ['PDL-8F2KQ', 0, 'Rizky Maulana', '081234567890', 0, 15, 2, 'PENDING', 'Sewa raket 2 buah'],
    ['PDL-3JD7A', 1, 'Sarah Putri', '081298761234', 0, 18, 1, 'PAID'],
    ['PDL-9QPL2', 0, 'Andi Wijaya', '085712340987', 0, 19, 2, 'PAID'],
    ['PDL-5TXR8', 2, 'Bima Sakti', '081377788899', 0, 9, 1, 'COMPLETED'],
    ['PDL-2MN4V', 0, 'Citra Lestari', '081555666777', 0, 8, 1, 'CANCELLED', 'Dibatalkan pelanggan'],
    ['PDL-7HW3Z', 1, 'Dewi Anggraini', '081222333444', 1, 17, 2, 'PENDING'],
    ['PDL-4KC9B', 0, 'Fajar Nugroho', '085699887766', 2, 20, 1, 'PAID'],
  ],
  'padel-bekasi': [
    ['PDL-6RT2M', 0, 'Gilang Pratama', '081311122233', 0, 16, 2, 'PENDING'],
    ['PDL-1VB8X', 1, 'Hana Safitri', '082144455566', 0, 19, 1, 'PAID'],
    ['PDL-9ZC3D', 0, 'Iqbal Ramadhan', '081377711100', 1, 10, 2, 'PAID', 'Turnamen kecil'],
  ],
}

function dateKey(dayOffset: number): string {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

async function seedBookings(slug: string, venueCourts: Array<{ id: string; pricePerHour: number }>) {
  const seeds = BOOKING_SEEDS[slug] ?? []
  if (seeds.length === 0) return

  const existing = await db
    .select({ code: bookings.code })
    .from(bookings)
    .where(inArray(bookings.code, seeds.map((s) => s[0])))
  const existingCodes = new Set(existing.map((r) => r.code))

  const rows = seeds
    .filter(([code]) => !existingCodes.has(code))
    .map(([code, courtIdx, customerName, customerWa, dayOffset, startHour, duration, status, notes]) => {
      const court = venueCourts[courtIdx] ?? venueCourts[0]
      return {
        code,
        courtId: court.id,
        customerName,
        customerWa,
        date: dateKey(dayOffset),
        startHour,
        duration,
        totalPrice: court.pricePerHour * duration,
        status,
        notes,
      }
    })

  if (rows.length > 0) {
    await db.insert(bookings).values(rows)
    console.log(`Seeded ${rows.length} bookings for ${slug}`)
  } else {
    console.log(`Bookings for ${slug} already seeded`)
  }
}

async function main() {
  let tenant = await db.query.user.findFirst({ where: eq(user.email, TENANT.email) })

  if (!tenant) {
    await auth.api.signUpEmail({ body: TENANT })
    tenant = await db.query.user.findFirst({ where: eq(user.email, TENANT.email) })
    if (!tenant) throw new Error('Tenant sign-up failed')
    console.log(`Created tenant ${TENANT.email} (password: ${TENANT.password})`)
  } else {
    console.log(`Tenant ${TENANT.email} already exists`)
  }

  for (const { courts: courtRows, ...venueData } of VENUES) {
    let venue = await db.query.venues.findFirst({
      where: eq(venues.slug, venueData.slug),
    })

    if (!venue) {
      const venueId = crypto.randomUUID()
      await db.insert(venues).values({ ...venueData, id: venueId, tenantId: tenant.id })
      await db.insert(courts).values(courtRows.map((c) => ({ ...c, venueId })))
      venue = (await db.query.venues.findFirst({ where: eq(venues.id, venueId) }))!
      console.log(`Created venue ${venueData.slug} with ${courtRows.length} courts`)
    } else {
      console.log(`Venue ${venueData.slug} already exists`)
    }

    // seed bookings against the venue's actual courts, ordered as defined above
    const venueCourts = await db.query.courts.findMany({
      where: eq(courts.venueId, venue.id),
      orderBy: (c, { asc }) => [asc(c.createdAt), asc(c.name)],
    })
    await seedBookings(venueData.slug, venueCourts)
  }

  console.log('Seed complete')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
