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
const webLib = path.resolve(root, '..', 'UniPrism_New-main', 'lib')
const webData = path.resolve(root, '..', 'UniPrism_New-main', 'data')
const sourcePath = path.join(webLib, 'discover-questions.ts')
const targetPath = path.join(root, 'business', 'discover-questions.ts')
const abilitySourcePath = path.join(webLib, 'discoverAbilityModule.ts')
const abilityTargetPath = path.join(root, 'business', 'discoverAbilityModule.ts')
const hollandFineSourcePath = path.join(webLib, 'hollandFineQuestionBank.ts')
const hollandFineTargetPath = path.join(root, 'business', 'hollandFineQuestionBank.ts')
const surakartaSourceDir = path.join(webLib, 'surakarta')
const surakartaTargetDir = path.join(root, 'business', 'surakarta')
const hollandFineJsonSourcePath = path.join(webData, 'holland-fine-grained-question-bank.json')
const hollandFineJsonTargetPath = path.join(root, 'data', 'holland-fine-grained-question-bank.json')

if (!fs.existsSync(sourcePath)) {
  console.error(`Source not found: ${sourcePath}`)
  process.exit(1)
}

function syncSurakartaDeps() {
  if (!fs.existsSync(surakartaSourceDir)) return

  fs.mkdirSync(surakartaTargetDir, { recursive: true })
  for (const fileName of fs.readdirSync(surakartaSourceDir)) {
    if (!fileName.endsWith('.ts')) continue
    const from = path.join(surakartaSourceDir, fileName)
    const to = path.join(surakartaTargetDir, fileName)
    fs.copyFileSync(from, to)
    console.log(`Synced ${from}`)
    console.log(`     → ${to}`)
  }
}

function syncExtraFile(from, to) {
  if (!fs.existsSync(from)) return
  fs.mkdirSync(path.dirname(to), { recursive: true })
  let content = fs.readFileSync(from, 'utf8')
  if (from.endsWith('hollandFineQuestionBank.ts')) {
    content = content
      .replace("import bankData from '@/data/holland-fine-grained-question-bank.json';", "import bankData from '../data/holland-fine-grained-question-bank.json';")
      .replace("import type { RIASECDimension } from '@/lib/riasecEngine';", "import type { RIASECDimension } from './riasecEngine';")
    fs.writeFileSync(to, content, 'utf8')
  } else {
    fs.copyFileSync(from, to)
  }
  console.log(`Synced ${from}`)
  console.log(`     → ${to}`)
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
syncExtraFile(abilitySourcePath, abilityTargetPath)
syncExtraFile(hollandFineSourcePath, hollandFineTargetPath)
syncExtraFile(hollandFineJsonSourcePath, hollandFineJsonTargetPath)
syncSurakartaDeps()
