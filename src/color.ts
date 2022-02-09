import chroma from 'chroma-js'
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { TColor } from './types'

export const wcagContrast = (backgroundHex: string, textHex: string): number =>
  chroma.contrast(backgroundHex, textHex)

export const apcaContrast = (backgroundHex: string, textHex: string): number =>
  Math.round(
    Math.abs(
      +APCAcontrast(
        sRGBtoY(chroma(textHex).rgb()),
        sRGBtoY(chroma(backgroundHex).rgb())
      )
    )
  )

export const deltaEContrast = (
  backgroundHex: string,
  textHex: string
): number => chroma.deltaE(backgroundHex, textHex)

export const getMostContrast = (color: string, colorList: string[]): string => {
  const contrastRatios = colorList.map(c => apcaContrast(color, c))
  const maxContrast = Math.max(...contrastRatios)
  const i = contrastRatios.indexOf(maxContrast)
  return colorList[i]
}

export const valid = chroma.valid

export const colorToLchString = (color: TColor) => {
  const { mode, l, c, h } = color
  if (mode === 'cielch') {
    return `lch(${round(l)}% ${round(c, 3)} ${round(h)})`
  } else if (mode === 'oklch') {
    // In Feb 2022 it's only available in Safari TP
    return `oklch(${round(l)}% ${round(c, 3)} ${round(h)})`
  }
  return ''
}

function round(v: number, exp = 2) {
  return Math.round(v * 10 ** exp) / 10 ** exp
}
