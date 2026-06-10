import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { parseDatabaseUrl } from './src/lib/db/parse-url'

export default defineConfig({
  dialect: 'mysql',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: parseDatabaseUrl(process.env.DATABASE_URL ?? ''),
})
