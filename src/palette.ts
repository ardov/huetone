import { reorder } from './utils'
import { HexPalette, Palette, LCH, TokenExport } from './types'
import { clampToRgb, toHex, toLch } from './color'

const fillerColor = '#000'

export function parsePalette(raw: HexPalette): Palette {
  const hues = raw.hues.filter(hue => hue?.colors?.length)
  const hueNames = hues.map(hue => hue.name || '???')
  const maxTones = hues
    .map(hue => hue.colors.length)
    .reduce((prev, curr) => Math.max(curr, prev), 0)
  const toneNames = Array.from(Array(maxTones)).map(
    (v, idx) => raw?.tones?.[idx] || (idx * 100).toString()
  )
  const colors = hues.map(hue =>
    toneNames.map((v, idx) => hue.colors[idx] || fillerColor).map(toLch)
  )

  return {
    name: raw.name || 'Loaded palette',
    hues: hueNames,
    tones: toneNames,
    colors,
  }
}

export function validatePalette(palette: Palette | null): boolean {
  if (!palette) return false
  if (!palette.hues?.length) return false
  if (!palette.tones?.length) return false
  if (!palette.colors?.length) return false
  return true
}

export function paletteToHex(palette: Palette): HexPalette {
  return {
    name: palette.name,
    hues: palette.hues.map((hue, i) => ({
      name: hue,
      colors: palette.colors[i].map(toHex),
    })),
    tones: [...palette.tones],
  }
}

export function paletteToTokens(palette: Palette): TokenExport {
  let tokens: TokenExport = {}
  let { tones, hues, colors } = palette
  hues.forEach((hue, hueIdx) => {
    if (!tokens[hue]) tokens[hue] = {}
    tones.forEach((tone, toneIdx) => {
      tokens[hue][tone] = {
        value: toHex(colors[hueIdx][toneIdx]),
        type: 'color',
      }
    })
  })
  return tokens
}

export function addHue(palette: Palette, hueName: string = 'Gray'): Palette {
  const length = palette.tones.length
  const hueSequence: LCH[] = Array(length)
    .fill(0)
    .map((_, i) => [(100 / (length + 1)) * (length - i), 0, 0])
  return {
    ...palette,
    hues: [...palette.hues, hueName],
    colors: [...palette.colors, hueSequence],
  }
}

export function addTone(
  palette: Palette,
  toneName: string = (palette.tones.length + 1) * 100 + ''
): Palette {
  return {
    ...palette,
    tones: [...palette.tones, toneName],
    colors: palette.colors.map(tones => [...tones, tones[tones.length - 1]]),
  }
}

export function duplicateTone(
  palette: Palette,
  toneId: number,
  insertId: number
): Palette {
  const tones = [...palette.tones]
  tones.splice(insertId, 0, tones[toneId])
  return {
    ...palette,
    tones,
    colors: palette.colors.map(tones => {
      const colors = [...tones]
      colors.splice(insertId, 0, colors[toneId])
      return colors
    }),
  }
}

export function duplicateHue(
  palette: Palette,
  hueId: number,
  insertId: number
): Palette {
  const hues = [...palette.hues]
  hues.splice(insertId, 0, hues[hueId])
  const colors = [...palette.colors]
  colors.splice(insertId, 0, colors[hueId])
  return {
    ...palette,
    hues,
    colors,
  }
}

export function removeHue(palette: Palette, idx: number): Palette {
  // Do not remove last hue
  if (palette.hues.length === 1) return palette
  let hues = palette.hues.filter((_, i) => i !== idx)
  let colors = palette.colors.filter((_, i) => i !== idx)
  return { ...palette, hues, colors }
}

export function removeTone(palette: Palette, idx: number): Palette {
  // Do not remove last tone
  if (palette.tones.length === 1) return palette
  let tones = palette.tones.filter((_, i) => i !== idx)
  let colors = palette.colors.map(tones => tones.filter((_, i) => i !== idx))
  return { ...palette, tones, colors }
}

export function reorderHues(
  palette: Palette,
  idxFrom: number,
  idxTo: number
): Palette {
  return {
    ...palette,
    hues: reorder(palette.hues, idxFrom, idxTo),
    colors: reorder(palette.colors, idxFrom, idxTo),
  }
}

export function reorderTones(
  palette: Palette,
  idxFrom: number,
  idxTo: number
): Palette {
  return {
    ...palette,
    tones: reorder(palette.tones, idxFrom, idxTo),
    colors: palette.colors.map(tones => reorder(tones, idxFrom, idxTo)),
  }
}

export function renameHue(
  palette: Palette,
  hue: number,
  newName: string
): Palette {
  return {
    ...palette,
    hues: palette.hues.map((name, i) => (i === hue ? newName : name)),
  }
}

export function renameTone(
  palette: Palette,
  tone: number,
  newName: string
): Palette {
  return {
    ...palette,
    tones: palette.tones.map((name, i) => (i === tone ? newName : name)),
  }
}

export function setColor(
  palette: Palette,
  color: LCH,
  hue: number,
  tone: number
): Palette {
  return {
    ...palette,
    colors: palette.colors.map((tones, hueId) =>
      hue === hueId
        ? tones.map((lch, toneId) => (toneId === tone ? color : lch))
        : tones
    ),
  }
}

export function setToneLuminance(
  palette: Palette,
  luminance: number,
  tone: number
): Palette {
  return {
    ...palette,
    colors: palette.colors.map(colors =>
      colors.map((lch, toneId) =>
        toneId === tone ? [luminance, lch[1], lch[2]] : lch
      )
    ),
  }
}

export function setHueHue(
  palette: Palette,
  hueValue: number,
  hueId: number
): Palette {
  return {
    ...palette,
    colors: palette.colors.map((colors, id) =>
      id === hueId ? colors.map(([l, c]) => [l, c, hueValue]) : colors
    ),
  }
}

export function clampColorsToRgb(palette: Palette): Palette {
  return {
    ...palette,
    colors: palette.colors.map(shades => shades.map(clampToRgb)),
  }
}
