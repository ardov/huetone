import { reorder } from './utils'
import { HexPalette, Palette, LCH } from './types'
import { clampToRgb, toHex, toLch } from './color'

export function parsePalette(raw: HexPalette): Palette {
  return {
    name: raw.name,
    hues: raw.hues.map(hue => hue.name),
    tones: [...raw.tones],
    colors: raw.hues.map(hue => hue.colors.map(toLch)),
  }
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
  return {
    ...palette,
    hues: palette.hues.filter((_, i) => i !== idx),
    colors: palette.colors.filter((_, i) => i !== idx),
  }
}

export function removeTone(palette: Palette, idx: number): Palette {
  return {
    ...palette,
    tones: palette.tones.filter((_, i) => i !== idx),
    colors: palette.colors.map(tones => tones.filter((_, i) => i !== idx)),
  }
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
    colors: palette.colors.map((shades, hueId) =>
      hue === hueId
        ? shades.map((lch, toneId) => (toneId === tone ? color : lch))
        : shades
    ),
  }
}

export function clampColorsToRgb(palette: Palette): Palette {
  return {
    ...palette,
    colors: palette.colors.map(shades => shades.map(clampToRgb)),
  }
}
