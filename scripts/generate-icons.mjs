// Generates the placeholder icons (“C” monogram) with no dependency: npm run icons
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'

const BG = [0x01, 0x01, 0x01] // noir Valkyries
const FG = [0xad, 0x96, 0xdc] // violet Valkyries
const OUT = new URL('../public/icons/', import.meta.url)
mkdirSync(OUT, { recursive: true })

// Ring open on the right (opening of ±40°), in normalised coordinates [0,1].
function coverage(x, y, scale) {
  const dx = x - 0.5
  const dy = y - 0.5
  const r = Math.hypot(dx, dy)
  const outer = 0.3 * scale
  const inner = 0.17 * scale
  if (r > outer || r < inner) return 0
  const angle = Math.abs(Math.atan2(dy, dx)) // 0 = droite
  return angle < (40 * Math.PI) / 180 ? 0 : 1
}

function png(size, scale) {
  const SS = 3
  const raw = Buffer.alloc((size * 3 + 1) * size)
  for (let py = 0; py < size; py++) {
    raw[py * (size * 3 + 1)] = 0
    for (let px = 0; px < size; px++) {
      let c = 0
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++) c += coverage((px + (sx + 0.5) / SS) / size, (py + (sy + 0.5) / SS) / size, scale)
      const a = c / (SS * SS)
      for (let k = 0; k < 3; k++) raw[py * (size * 3 + 1) + 1 + px * 3 + k] = Math.round(BG[k] * (1 - a) + FG[k] * a)
    }
  }
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    return c >>> 0
  })
  const crc = (buf) => {
    let c = 0xffffffff
    for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const td = Buffer.concat([Buffer.from(type), data])
    const c = Buffer.alloc(4)
    c.writeUInt32BE(crc(td))
    return Buffer.concat([len, td, c])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

writeFileSync(new URL('icon-192.png', OUT), png(192, 1))
writeFileSync(new URL('icon-512.png', OUT), png(512, 1))
// Maskable: reduced motif to stay inside the safe zone (80 %).
writeFileSync(new URL('maskable-512.png', OUT), png(512, 0.8))

// SVG: stroke 0.13 wide, mean radius 0.235 (equivalent to the ring above).
const r = 0.235 * 512
const a = (40 * Math.PI) / 180
const x = 256 + r * Math.cos(a)
const y = 256 - r * Math.sin(a)
writeFileSync(
  new URL('icon.svg', OUT),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#010101"/><path d="M ${x.toFixed(1)} ${y.toFixed(1)} A ${r} ${r} 0 1 0 ${x.toFixed(1)} ${(512 - y).toFixed(1)}" fill="none" stroke="#AD96DC" stroke-width="${(0.13 * 512).toFixed(1)}"/></svg>\n`,
)
console.log('Icons generated in public/icons/')
