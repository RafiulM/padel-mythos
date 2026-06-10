// Lenient mysql:// URL parser. `new URL()` rejects passwords containing
// unencoded special chars (#, ?, etc. — common on shared hosting), so we
// split the string ourselves and percent-decode when possible.

export interface DbConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
}

const decode = (s: string) => {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

export function parseDatabaseUrl(raw: string): DbConfig {
  // greedy (.*)@ so passwords containing @ still split at the LAST @
  const m = raw.match(/^mysql:\/\/(?:(.*)@)?([^@/:]+)(?::(\d+))?\/([^?]+)(?:\?.*)?$/)
  if (!m) {
    throw new Error(
      'Invalid DATABASE_URL — expected mysql://user:password@host:port/database',
    )
  }
  const [, auth = '', host, port, database] = m
  const sep = auth.indexOf(':')
  return {
    host,
    port: port ? Number(port) : 3306,
    user: decode(sep === -1 ? auth : auth.slice(0, sep)),
    password: decode(sep === -1 ? '' : auth.slice(sep + 1)),
    database: decode(database),
  }
}
