import {
  boolean,
  date,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'

// ---------------------------------------------------------------------------
// Better Auth tables (user = tenant / venue owner account)
// ---------------------------------------------------------------------------

export const user = mysqlTable('user', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const session = mysqlTable(
  'session',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    expiresAt: timestamp('expires_at', { fsp: 3 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { fsp: 3 })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_user_id_idx').on(table.userId)],
)

export const account = mysqlTable(
  'account',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', { fsp: 3 }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { fsp: 3 }),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { fsp: 3 })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('account_user_id_idx').on(table.userId)],
)

export const verification = mysqlTable(
  'verification',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    identifier: varchar('identifier', { length: 255 }).notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { fsp: 3 }).notNull(),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { fsp: 3 })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
)

// ---------------------------------------------------------------------------
// Domain tables: Tenant (user) -> Venue -> Court -> Booking
// ---------------------------------------------------------------------------

export const venues = mysqlTable(
  'venues',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tenantId: varchar('tenant_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    address: text('address'),
    whatsapp: varchar('whatsapp', { length: 32 }),
    openHour: int('open_hour').notNull().default(7),
    closeHour: int('close_hour').notNull().default(22),
    bankName: varchar('bank_name', { length: 64 }),
    bankNumber: varchar('bank_number', { length: 64 }),
    bankHolder: varchar('bank_holder', { length: 255 }),
    qrisUrl: text('qris_url'),
    paymentNotes: text('payment_notes'),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
  },
  (table) => [index('venues_tenant_id_idx').on(table.tenantId)],
)

export const courts = mysqlTable(
  'courts',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    venueId: varchar('venue_id', { length: 36 })
      .notNull()
      .references(() => venues.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    type: mysqlEnum('type', ['Indoor', 'Outdoor']).notNull().default('Indoor'),
    pricePerHour: int('price_per_hour').notNull(),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
  },
  (table) => [index('courts_venue_id_idx').on(table.venueId)],
)

export const BOOKING_STATUSES = ['PENDING', 'PAID', 'CANCELLED', 'COMPLETED'] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export const bookings = mysqlTable(
  'bookings',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    code: varchar('code', { length: 16 }).notNull().unique(),
    courtId: varchar('court_id', { length: 36 })
      .notNull()
      .references(() => courts.id, { onDelete: 'cascade' }),
    customerName: varchar('customer_name', { length: 255 }).notNull(),
    customerWa: varchar('customer_wa', { length: 32 }).notNull(),
    date: date('date', { mode: 'string' }).notNull(),
    startHour: int('start_hour').notNull(),
    duration: int('duration').notNull(),
    totalPrice: int('total_price').notNull(),
    status: mysqlEnum('status', BOOKING_STATUSES).notNull().default('PENDING'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
  },
  (table) => [index('bookings_court_date_idx').on(table.courtId, table.date)],
)

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  venues: many(venues),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}))

export const venueRelations = relations(venues, ({ one, many }) => ({
  tenant: one(user, { fields: [venues.tenantId], references: [user.id] }),
  courts: many(courts),
}))

export const courtRelations = relations(courts, ({ one, many }) => ({
  venue: one(venues, { fields: [courts.venueId], references: [venues.id] }),
  bookings: many(bookings),
}))

export const bookingRelations = relations(bookings, ({ one }) => ({
  court: one(courts, { fields: [bookings.courtId], references: [courts.id] }),
}))
