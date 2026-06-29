#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const base = path.join(root, 'subpkg', 'discover')
const exts = ['', '.js', '.ts', '.vue', '.json']

function resolveImport(fromFile, spec) {
  if (!spec.startsWith('.')) return null
  const dir = path.dirname(fromFile)
  const target = path.normalize(path.join(dir, spec))
  for (const ext of exts) {
    const candidate = target + ext
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return { ok: true, resolved: candidate }
    }
  }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    for (const ext of exts) {
      const candidate = path.join(target, 'index' + ext)
      if (fs.existsSync(candidate)) return { ok: true, resolved: candidate }
    }
  }
  return { ok: false, target }
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const entry = path.join(dir, name)
    if (fs.statSync(entry).isDirectory()) walk(entry, out)
    else if (/\.(vue|js|ts)$/.test(name)) out.push(entry)
  }
  return out
}

const broken = []
const importRe = /from\s+['"](\.[^'"]+)['"]/g
for (const file of walk(base)) {
  const text = fs.readFileSync(file, 'utf8')
  let match
  while ((match = importRe.exec(text))) {
    const spec = match[1]
    const result = resolveImport(file, spec)
    if (result && !result.ok) {
      broken.push({
        file: path.relative(root, file),
        spec,
        target: path.relative(root, result.target),
      })
    }
  }
}

if (broken.length === 0) {
  console.log('All subpkg/discover relative imports resolve OK')
} else {
  console.log('Broken imports:')
  for (const item of broken) {
    console.log(`- ${item.file}: ${item.spec} -> ${item.target}`)
  }
  process.exit(1)
}
