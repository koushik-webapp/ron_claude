// Builds the small JPEG thumbnails the gallery tiles display, so the page never
// has to download full videos/photos just to show a preview.
//
//   public/gallery/<section>/<name>.<mp4|jpg|...>  →  public/gallery/<section>/thumbs/<name>.jpg
//
// Run after adding gallery media:  npm run gallery:thumbs
// Rebuild every thumb:             npm run gallery:thumbs -- --force
// Requires ffmpeg on PATH.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, parse } from 'node:path'
import { fileURLToPath } from 'node:url'

const GALLERY_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'gallery')
const SECTIONS = ['reviews', 'jobs']
const MAX_WIDTH = 480 // tiles are ≤ 240 CSS px wide, so this covers 2x screens
const force = process.argv.includes('--force')

let built = 0
for (const section of SECTIONS) {
  const dir = join(GALLERY_DIR, section)
  const outDir = join(dir, 'thumbs')
  mkdirSync(outDir, { recursive: true })

  for (const file of readdirSync(dir)) {
    const { name, ext } = parse(file)
    const isVideo = /^\.(mp4|mov|webm)$/i.test(ext)
    if (!isVideo && !/^\.(jpe?g|png|webp)$/i.test(ext)) continue

    const dest = join(outDir, `${name}.jpg`)
    if (existsSync(dest) && !force) continue

    execFileSync('ffmpeg', [
      '-v', 'error', '-y',
      // Same frame the tiles used to seek to before thumbnails existed
      ...(isVideo ? ['-ss', '0.1'] : []),
      '-i', join(dir, file),
      '-frames:v', '1',
      '-vf', `scale='min(${MAX_WIDTH},iw)':-2`,
      '-q:v', '4',
      dest,
    ])
    console.log(`built ${section}/thumbs/${name}.jpg`)
    built++
  }
}
console.log(built ? `Done — ${built} thumbnail(s) built.` : 'All thumbnails already exist (use --force to rebuild).')
