import pngToIco from 'png-to-ico'
import { writeFile } from 'node:fs/promises'

const buf = await pngToIco(['public/favicon-16x16.png', 'public/favicon-32x32.png'])
await writeFile('public/favicon.ico', buf)
console.log('wrote public/favicon.ico', buf.length)
