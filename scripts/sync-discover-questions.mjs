#!/usr/bin/env node
/**
 * Sync Web discover question bank → UniApp business/discover-questions.ts
 * Usage: npm run questions:sync
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const sourcePath = path.resolve(root, '..', 'UniPrism_New-main', 'lib', 'discover-questions.ts')
const targetPath = path.join(root, 'business', 'discover-questions.ts')

if (!fs.existsSync(sourcePath)) {
  console.error(`Source not found: ${sourcePath}`)
  process.exit(1)
}

let content = fs.readFileSync(sourcePath, 'utf8')

const banner = `/**
 * AUTO-SYNCED from UniPrism_New-main/lib/discover-questions.ts
 * Do not edit manually — run: npm run questions:sync
 * Synced at: ${new Date().toISOString()}
 */

`

content = banner + content.replace(/^import \{ RIASECDimension/, "import { RIASECDimension")

fs.writeFileSync(targetPath, content, 'utf8')
console.log(`Synced ${sourcePath}`)
console.log(`     → ${targetPath}`)
console.log(`Lines: ${content.split('\n').length}`)
