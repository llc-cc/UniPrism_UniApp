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
const appPath = path.join(root, 'subpkg', 'discover', 'business', 'discover-questions.ts')

function extractActiveIdsBlock(content) {
  const match = content.match(/const ACTIVE_QUESTION_IDS = \[([\s\S]*?)\] as const;/)
  if (!match) throw new Error('ACTIVE_QUESTION_IDS not found')
  return match[1]
}

function normalizeBlock(block) {
  return block.replace(/\s+/g, ' ').trim()
}

const webContent = fs.readFileSync(webPath, 'utf8')
const appContent = fs.readFileSync(appPath, 'utf8')
const webIdsBlock = extractActiveIdsBlock(webContent)
const appIdsBlock = extractActiveIdsBlock(appContent)

let ok = true
if (normalizeBlock(webIdsBlock) !== normalizeBlock(appIdsBlock)) {
  console.error('ACTIVE_QUESTION_IDS block mismatch between Web and MiniApp')
  ok = false
}

const expectedTypes = new Set(['profile-form', 'card-select', 'holland-fine-grained', 'career-calibration-scale'])
const typeMatches = [...appContent.matchAll(/type: '([^']+)'/g)].map((m) => m[1])
const activeBlock = appContent.slice(appContent.indexOf('export const ALL_QUESTIONS'))
const activeTypes = [...activeBlock.matchAll(/type: '([^']+)'/g)].map((m) => m[1])
const unexpected = [...new Set(activeTypes)].filter((t) => !expectedTypes.has(t))
if (unexpected.length) {
  console.error('Unexpected types in ALL_QUESTIONS:', unexpected.join(', '))
  ok = false
}

console.log(`Web ACTIVE_QUESTION_IDS block length: ${webIdsBlock.length}`)
console.log(`App ACTIVE_QUESTION_IDS block length: ${appIdsBlock.length}`)
console.log(`Active types: ${[...new Set(activeTypes)].join(', ')}`)

if (ok) {
  console.log('OK — question bank IDs match Web.')
  process.exit(0)
}

process.exit(1)
