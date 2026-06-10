import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import * as schema from './db/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'mysql',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  // dev convenience: Next may pick 3000 or 3001 depending on what's free
  trustedOrigins:
    process.env.NODE_ENV !== 'production'
      ? ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001']
      : undefined,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
})

export type Session = typeof auth.$Infer.Session
