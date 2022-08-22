import LZString from 'lz-string'
import { colorSpaces } from 'shared/colorFuncs'
import {
  HexPalette,
  OldLchPalette,
  Palette,
  spaceName,
  TColor,
  TokenExport,
} from 'shared/types'

export function jsonToHexPalette(json: string | null): HexPalette | null {
  if (!json) return null
  let palette
  try {
    palette = JSON.parse(json)
  } catch (e) {
    console.error('Unable to parse palette from URL', e)
    return null
  }

  if (validatePalette(palette)) {
    return palette
  }

  console.error('Invalid palette in the URL', palette)
  return null
}

/** Parser to convert saved palettes to local format.
 *  @param hexPalette
 *  @param mode color mode "cielch" or "oklch"
 */
export function parseHexPalette(
  hexPalette: HexPalette,
  mode: spaceName
): Palette {
  const { hex2color } = colorSpaces[mode]
  const hues = hexPalette.hues.filter(hue => hue?.colors?.length)
  const hueNames = hues.map(hue => hue.name || '???')
  const maxTones = hues
    .map(hue => hue.colors.length)
    .reduce((prev, curr) => Math.max(curr, prev), 0)
  const toneNames = Array.from(Array(maxTones)).map(
    (v, idx) => hexPalette?.tones?.[idx] || (idx * 100).toString()
  )
  const colors = hues.map(hue =>
    toneNames.map(
      (v, idx) => hex2color(hue.colors[idx]) || (hex2color('#000') as TColor)
    )
  )

  return {
    name: hexPalette.name || 'Loaded palette',
    mode,
    hues: hueNames,
    tones: toneNames,
    colors,
  }
}

/** Converter for old LCH palettes which still can be stored in localStorage.
 *  @param OldLchPalette
 */
export function parseOldLchPalette(lchPalette: OldLchPalette): HexPalette {
  return {
    name: lchPalette.name,
    tones: lchPalette.tones,
    hues: lchPalette.hues.map((name, hueId) => ({
      name,
      colors: lchPalette.colors[hueId].map(
        lch => colorSpaces.cielch.lch2color(lch).hex
      ),
    })),
  }
}

/** Checks if the given palette is valid and can be used */
export function validatePalette(palette: Palette | null): boolean {
  if (!palette) return false
  if (!palette.hues?.length) return false
  if (!palette.tones?.length) return false
  // if (!palette.colors?.length) return false
  return true
}

/** Convert local palette to hexPalette format
 *  @param palette
 */
export function exportToHexPalette(palette: Palette): HexPalette {
  return {
    name: palette.name,
    hues: palette.hues.map((hue, i) => ({
      name: hue,
      colors: palette.colors[i].map(color => color.hex),
    })),
    tones: [...palette.tones],
  }
}

/** Convert local palette to design tokens format
 *  @param palette
 */
export function exportToTokens(palette: Palette): TokenExport {
  let tokens: TokenExport = {}
  let { tones, hues, colors } = palette
  hues.forEach((hue, hueIdx) => {
    if (!tokens[hue]) tokens[hue] = {}
    tones.forEach((tone, toneIdx) => {
      const color = colors[hueIdx][toneIdx]
      tokens[hue][tone] = {
        value: color.hex,
        type: 'color',
      }
    })
  })
  return tokens
}

/** Convert local palette to CSS varibles
 *  @param palette
 */
export function exportToCSS(palette: Palette): string {
  let { tones, hues, colors, name } = palette
  let strings: string[] = [`/* ${name} color palette */`]
  hues.forEach((hue, hueIdx) => {
    strings.push('')
    strings.push('/* ' + hue + ' */')
    tones.forEach((tone, toneIdx) => {
      const color = colors[hueIdx][toneIdx]
      strings.push(`--${hue}-${tone}: ${color.hex};`)
    })
  })
  return strings.join('\n')
}

/** Get palette permalink
 *  @param palette
 */
export function getPaletteLink(palette: Palette): string {
  const hexPalette = exportToHexPalette(palette)
  const compressed = LZString.compressToEncodedURIComponent(
    JSON.stringify(hexPalette)
  )
  const url = new URL(window.location.href)
  url.searchParams.set('palette', compressed)
  return url.toString()
}
