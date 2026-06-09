/**
 * 从 mini-program-asset-urls.md 批量下载资源到 static/assets/remote/
 * 需在服务器 OSS 代理可用后运行；下载完成后把路径加入 business/local-asset-map.js
 *
 * 用法: node scripts/download-miniapp-assets.mjs
 */
import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const md = fs.readFileSync(path.resolve(root, '..', 'mini-program-asset-urls.md'), 'utf8')
const urls = [...md.matchAll(/https:\/\/uniprism\.cn(\/(?:design|images|videos)\/[^\s)]+)/g)].map((m) => m[1])
const outRoot = path.join(root, 'static', 'assets', 'remote')
const host = 'uniprism.cn'

function download(objectPath) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outRoot, objectPath.replace(/^\//, ''))
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    const req = https.get(
      {
        hostname: host,
        path: `/api/oss-assets${objectPath}`,
        headers: { Host: host },
        timeout: 30000,
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume()
          reject(new Error(`${objectPath} -> HTTP ${res.statusCode}`))
          return
        }
        const chunks = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => {
          fs.writeFileSync(filePath, Buffer.concat(chunks))
          resolve(filePath)
        })
      },
    )
    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy()
      reject(new Error(`${objectPath} -> timeout`))
    })
  })
}

let ok = 0
let fail = 0
for (const objectPath of urls) {
  try {
    await download(objectPath)
    ok += 1
    process.stdout.write('.')
  } catch (error) {
    fail += 1
    console.error(`\nFAIL ${objectPath}: ${error.message}`)
  }
}
console.log(`\nDone. success=${ok} fail=${fail}`)
