import fs from 'fs'
import path from 'path'

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'unpackage' || entry.name === 'node_modules') continue
      walk(full, acc)
    } else if (/\.(vue|js|ts)$/.test(entry.name)) {
      acc.push(full)
    }
  }
  return acc
}

const pattern = /(\/(?:design|images|videos)\/[^\s'"`]+)/g
const paths = new Set()

for (const file of walk('.')) {
  const text = fs.readFileSync(file, 'utf8')
  for (const match of text.matchAll(pattern)) {
    paths.add(match[1].replace(/['"`]+$/, ''))
  }
}

const sorted = [...paths].sort()
console.log(sorted.join('\n'))
console.error(`total ${sorted.length}`)
