import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'
import { parseDatabaseUrl } from './parse-url'

// Reuse the pool across Next.js dev hot-reloads to avoid exhausting
// MySQL connections.
const globalForDb = globalThis as unknown as { dbPool?: mysql.Pool }

const pool =
  globalForDb.dbPool ??
  mysql.createPool({
    ...parseDatabaseUrl(process.env.DATABASE_URL ?? ''),
    connectionLimit: 10,
  })

if (process.env.NODE_ENV !== 'production') globalForDb.dbPool = pool

export const db = drizzle(pool, { schema, mode: 'default' })

export type Db = typeof db
