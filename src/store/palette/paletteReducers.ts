import { colorSpaces } from 'shared/colorFuncs'
import { reorder } from 'shared/utils'
import { Palette, LCH, TColor, spaceName } from 'shared/types'

export function addHue(palette: Palette, hueName: string = 'Gray'): Palette {
  const { lch2color, ranges } = colorSpaces[palette.mode]
  const lMax = ranges.l.max
  const length = palette.tones.length
  const hueSequence: TColor[] = Array(length)
    .fill(0)
    .map((_, i) => lch2color([(lMax / (length + 1)) * (length - i), 0, 0]))
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
  lch: LCH,
  hue: number,
  tone: number
): Palette {
  // TODO: clamp LCH values
  const { lch2color } = colorSpaces[palette.mode]
  const color = lch2color(lch)
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
  const { lch2color } = colorSpaces[palette.mode]
  return {
    ...palette,
    colors: palette.colors.map(colors =>
      colors.map((color, toneId) =>
        toneId === tone ? lch2color([luminance, color.c, color.h]) : color
      )
    ),
  }
}

export function setHueHue(
  palette: Palette,
  hueValue: number,
  hueId: number
): Palette {
  const { lch2color } = colorSpaces[palette.mode]
  return {
    ...palette,
    colors: palette.colors.map((colors, id) =>
      id === hueId
        ? colors.map(({ l, c }) => lch2color([l, c, hueValue]))
        : colors
    ),
  }
}

export function clampColorsToRgb(palette: Palette): Palette {
  const { hex2color } = colorSpaces[palette.mode]
  return {
    ...palette,
    colors: palette.colors.map(shades =>
      shades.map(color => {
        if (color.within_sRGB) return color
        const clamped = hex2color(color.hex)
        if (!clamped) {
          console.error('Invalid hex while parsing color', color)
        }
        return clamped || color
      })
    ),
  }
}

export function convertToMode(palette: Palette, mode: spaceName): Palette {
  const { hex2color } = colorSpaces[mode]
  return {
    ...palette,
    mode,
    colors: palette.colors.map(colors =>
      colors.map(color => {
        let newColor = hex2color(color.hex)
        return newColor || color
      })
    ),
  }
}
