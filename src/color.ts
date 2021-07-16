import chroma from 'chroma-js'
import { LCH } from './types'

export const MAX_L = 100
export const MAX_C = 150
export const MAX_H = 360

export const toLch = (hex: string): LCH =>
  chroma(hex)
    .lch()
    .map(n => (isNaN(n) ? 0 : n)) as LCH

export const toHex = (lch: LCH): string => chroma.lch(...lch).hex()

export const clampLch = (lch: LCH): LCH => {
  const maximums = [MAX_L, MAX_C, MAX_H]
  return lch
    .map(n => (isNaN(n) ? 0 : n))
    .map(n => (n < 0 ? 0 : n))
    .map((n, i) => (n > maximums[i] ? maximums[i] : n)) as LCH
}

export const wcagContrast = (color1: string, color2: string): number =>
  chroma.contrast(color1, color2)

export const getMostContrast = (color: string, colorList: string[]): string => {
  const contrastRatios = colorList.map(c => wcagContrast(color, c))
  const maxContrast = Math.max(...contrastRatios)
  const i = contrastRatios.indexOf(maxContrast)
  return colorList[i]
}

export const valid = chroma.valid
