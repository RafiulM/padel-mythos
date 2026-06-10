import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const candidates = [
  join(process.cwd(), '.next', 'standalone', 'server.js'),
  join(process.cwd(), 'server.js'),
]

let patched = false

for (const file of candidates) {
  if (!existsSync(file)) continue

  const source = readFileSync(file, 'utf8')
  const next = source
    .replace(
      'const currentPort = parseInt(process.env.PORT, 10) || 3000',
      'const currentPort = process.env.LSNODE_SOCKET || parseInt(process.env.PORT, 10) || 3000',
    )
    .replace(
      "const hostname = process.env.HOSTNAME || '0.0.0.0'",
      "const hostname = process.env.LSNODE_SOCKET ? undefined : (process.env.HOSTNAME || '0.0.0.0')",
    )

  if (next !== source) {
    writeFileSync(file, next)
    console.log(`Patched Hostinger socket support in ${file}`)
    patched = true
  }
}

if (!patched) {
  console.log('No standalone server.js found to patch.')
}
