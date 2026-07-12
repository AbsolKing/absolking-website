import { readFileSync, writeFileSync } from 'fs'
import { spawnSync } from 'child_process'

const BACKFILL = '2026-05-10'

const FILES = [
  { path: 'src/data/anime.js', idKey: 'anilistId' },
  { path: 'src/data/manga.js', idKey: 'anilistId' },
  { path: 'src/data/movies.js', idKey: 'tmdbId' },
  { path: 'src/data/games.js',  idKey: 'rawgId' },
]

function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf-8',
    timeout: 5000,
  })
  if (result.status !== 0) return ''
  return result.stdout.trim()
}

function getDateFromNeedle(file, needle) {
  const out = runGit([
    'log', '--all', '--reverse', '--format=%cI',
    '-S', needle,
    '--', file,
  ])
  if (!out) return null
  const first = out.split('\n')[0]
  return first.slice(0, 10)
}

const titleRe = /^(\s+)title:\s*'((?:[^'\\]|\\.)*)'/

for (const { path, idKey } of FILES) {
  console.log(`\n  ${path}`)
  const text = readFileSync(path, 'utf-8')
  const lines = text.split('\n')

  // Find all entry title lines with their positions
  const entries = []
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(titleRe)
    if (!m) continue
    // Skip if dateAdded already present (e.g. re-run)
    if (lines[i + 1] && lines[i + 1].includes('dateAdded:')) continue

    const indent = m[1]
    const rawTitle = m[2]  // raw content between outer quotes (backslash-escapes preserved)
    entries.push({ lineIdx: i, indent, rawTitle })
  }

  console.log(`    found ${entries.length} entries without dateAdded`)

  // Determine date for each entry (bottom-up to preserve line numbers during read)
  const insertions = []
  for (const entry of entries) {
    const { lineIdx, rawTitle } = entry
    let date = null

    // Try to extract an ID from the lines after the title in the same entry block
    // Walk forward to find the entry's closing brace (to extract the ID)
    const entryLines = []
    let braceDepth = 1
    for (let j = lineIdx + 1; j < lines.length; j++) {
      entryLines.push(lines[j])
      braceDepth += (lines[j].match(/{/g) || []).length
      braceDepth -= (lines[j].match(/}/g) || []).length
      if (braceDepth <= 0) break
    }

    // Try ID-based search first (more stable)
    const idLine = entryLines.find(l => l.trim().startsWith(`${idKey}:`))
    if (idLine) {
      const idVal = idLine.match(/:\s*(\d+)/)?.[1]
      if (idVal) {
        const idNeedle = `${idKey}: ${idVal}`
        date = getDateFromNeedle(path, idNeedle)
      }
    }

    // Fall back to title search
    if (!date) {
      const needle = `title: '${rawTitle}'`
      date = getDateFromNeedle(path, needle)
    }

    if (!date) {
      date = BACKFILL
      console.log(`      using backfill date for: ${rawTitle}`)
    }

    insertions.push({ ...entry, date })
  }

  // Apply insertions bottom-up (reverse order) so earlier line indices aren't shifted
  const newLines = [...lines]
  for (let i = insertions.length - 1; i >= 0; i--) {
    const { lineIdx, indent, date } = insertions[i]
    newLines.splice(lineIdx + 1, 0, `${indent}dateAdded: '${date}',`)
  }

  writeFileSync(path, newLines.join('\n'))
  console.log(`    inserted ${insertions.length} dateAdded lines`)
}

console.log('\nDone.')
