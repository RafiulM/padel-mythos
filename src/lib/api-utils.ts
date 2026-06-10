import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import type { ZodType } from 'zod'
import { auth } from './auth'
import { db } from './db'
import { venues } from './db/schema'

export function jsonError(status: number, message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status })
}

/** Returns the authenticated session or a 401 response. */
export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return { session: null, response: jsonError(401, 'Unauthorized') } as const
  }
  return { session, response: null } as const
}

/** Loads a venue and verifies it belongs to the given tenant. */
export async function requireOwnedVenue(venueId: string, tenantId: string) {
  const venue = await db.query.venues.findFirst({ where: eq(venues.id, venueId) })
  if (!venue) return { venue: null, response: jsonError(404, 'Venue not found') } as const
  if (venue.tenantId !== tenantId) {
    return { venue: null, response: jsonError(403, 'Forbidden') } as const
  }
  return { venue, response: null } as const
}

/** Parses and validates a JSON request body against a Zod schema. */
export async function parseBody<T>(req: Request, schema: ZodType<T>) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return { data: null, response: jsonError(400, 'Invalid JSON body') } as const
  }
  const result = schema.safeParse(raw)
  if (!result.success) {
    return {
      data: null,
      response: jsonError(400, 'Validation failed', result.error.flatten()),
    } as const
  }
  return { data: result.data, response: null } as const
}

export function newBookingCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `PDL-${code}`
}
