/**
 * One-off brand asset derivatives.
 * Originals in public/images/brand/ are never overwritten.
 */
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'

const HEADER = 'public/images/brand/logo-header.png'
const ICON = 'public/images/brand/favicon-and-icon.png'

async function opaqueBounds(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * channels + 3]
      if (alpha > 12) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }
  return {
    file,
    canvas: `${width}x${height}`,
    visible: `${maxX - minX + 1}x${maxY - minY + 1}`,
    padding: { left: minX, top: minY, right: width - 1 - maxX, bottom: height - 1 - maxY },
  }
}

const headerPng = sharp(HEADER).resize({ width: 870, withoutEnlargement: true })
await headerPng.clone().png({ compressionLevel: 9 }).toFile('public/images/brand/logo-header-web.png')
await headerPng.clone().webp({ quality: 88, alphaQuality: 92 }).toFile('public/images/brand/logo-header-web.webp')

const icon256 = sharp(ICON).resize({ width: 256, withoutEnlargement: true })
await icon256.clone().png({ compressionLevel: 9 }).toFile('public/images/brand/icon-web.png')
await icon256.clone().webp({ quality: 88, alphaQuality: 92 }).toFile('public/images/brand/icon-web.webp')

const iconCrop = { left: 190, top: 186, width: 870, height: 870 }
const croppedIcon = () => sharp(ICON).extract(iconCrop)

await croppedIcon().resize(16, 16).png().toFile('public/favicon-16x16.png')
await croppedIcon().resize(32, 32).png().toFile('public/favicon-32x32.png')
await croppedIcon().resize(180, 180).png().toFile('public/apple-touch-icon.png')
await croppedIcon().resize(192, 192).png().toFile('public/icon-192.png')

const bounds = [await opaqueBounds(HEADER), await opaqueBounds(ICON)]
await writeFile('scripts/brand-bounds.json', `${JSON.stringify(bounds, null, 2)}\n`)
console.log(JSON.stringify(bounds, null, 2))
