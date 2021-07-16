import { reorder } from './utils'
import { HexPalette, Palette, LCH } from './types'
import { toLch } from './color'

const DEFAULT_LCH: LCH = [0, 0, 0]

export function parsePalette(raw: HexPalette): Palette {
  return {
    name: raw.name,
    hues: raw.hues.map(hue => hue.name),
    tones: [...raw.tones],
    colors: raw.hues.map(hue => hue.colors.map(toLch)),
  }
}

export function addHue(palette: Palette, hueName: string = 'New hue'): Palette {
  return {
    ...palette,
    hues: [...palette.hues, hueName],
    colors: [...palette.colors, Array(palette.tones.length).fill(DEFAULT_LCH)],
  }
}

export function addTone(
  palette: Palette,
  toneName: string = 'New tone'
): Palette {
  return {
    ...palette,
    tones: [...palette.tones, toneName],
    colors: palette.colors.map(tones => [...tones, DEFAULT_LCH]),
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
