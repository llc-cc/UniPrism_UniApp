#!/usr/bin/env node
/**
 * Verify miniapp question bank matches Web ACTIVE_QUESTION_IDS.
 * Usage: node scripts/verify-discover-parity.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const webPath = path.resolve(root, '..', 'UniPrism_New-main', 'lib', 'discover-questions.ts')
const appPath = path.join(root, 'business', 'discover-questions.ts')

function extractActiveIds(content) {
  const match = content.match(/const ACTIVE_QUESTION_IDS = \[([\s\S]*?)\] as const/)
  if (!match) throw new Error('ACTIVE_QUESTION_IDS not found')
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
}

const webIds = extractActiveIds(fs.readFileSync(webPath, 'utf8'))
const appContent = fs.readFileSync(appPath, 'utf8')
const appIds = extractActiveIds(appContent)

let ok = true
if (webIds.length !== appIds.length) {
  console.error(`Count mismatch: web=${webIds.length} app=${appIds.length}`)
  ok = false
}

for (let i = 0; i < Math.max(webIds.length, appIds.length); i += 1) {
  if (webIds[i] !== appIds[i]) {
    console.error(`ID mismatch at ${i}: web=${webIds[i]} app=${appIds[i]}`)
    ok = false
  }
}

const expectedTypes = new Set(['profile-form', 'interest-tag-grid', 'card-select', 'free-text'])
const typeMatches = [...appContent.matchAll(/type: '([^']+)'/g)].map((m) => m[1])
const activeBlock = appContent.slice(appContent.indexOf('export const ALL_QUESTIONS'))
const activeTypes = [...activeBlock.matchAll(/type: '([^']+)'/g)].map((m) => m[1])
const unexpected = [...new Set(activeTypes)].filter((t) => !expectedTypes.has(t))
if (unexpected.length) {
  console.error('Unexpected types in ALL_QUESTIONS:', unexpected.join(', '))
  ok = false
}

console.log(`Web active questions: ${webIds.length}`)
console.log(`App active questions: ${appIds.length}`)
console.log(`Active types: ${[...new Set(activeTypes)].join(', ')}`)

if (ok) {
  console.log('OK — question bank IDs match Web.')
  process.exit(0)
}

process.exit(1)
