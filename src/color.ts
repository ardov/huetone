import chroma from 'chroma-js'
import { apcaContrast as rawApcaConterast } from './APCAcontrast'
import { LCH } from './types'

export const MAX_L = 100
export const MAX_C = 134
export const MAX_H = 360

export const toLch = (hex: string): LCH =>
  chroma(hex)
    .lch()
    .map(n => (isNaN(n) ? 0 : n)) as LCH

export const toHex = (lch: LCH): string => chroma.lch(...lch).hex()
export const toRgb = (lch: LCH): [number, number, number] =>
  chroma.lch(...lch).rgb()

export const clampLch = (lch: LCH): LCH => {
  const maximums = [MAX_L, MAX_C, MAX_H]
  return lch
    .map(n => (isNaN(n) ? 0 : n))
    .map(n => (n < 0 ? 0 : n))
    .map((n, i) => (n > maximums[i] ? maximums[i] : n)) as LCH
}

export const clampToRgb = (lch: LCH): LCH => {
  const color = chroma.lch(...lch)
  // @ts-ignore
  if (color.clipped()) return toLch(color.hex())
  return lch
}

// @ts-ignore
export const displayable = (lch: LCH): boolean => !chroma.lch(...lch).clipped()

export const wcagContrast = (backgroundHex: string, textHex: string): number =>
  chroma.contrast(backgroundHex, textHex)

export const apcaContrast = (backgroundHex: string, textHex: string): number =>
  Math.abs(rawApcaConterast(chroma(backgroundHex).rgb(), chroma(textHex).rgb()))

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

// const lchToLab = (lch: LCH) => {
//   const [l, c, h] = lch
//   const rad = h * (Math.PI / 180)
//   const a = Math.cos(rad) * c
//   const b = Math.sin(rad) * c
//   return [l, a, b] as LCH
// }
// const labToXyz = (lab: LCH) => {
//   const [l, a, b] = lab
//   let y = (l + 16) / 116
//   let x = a / 500 + y
//   let z = y - b / 200

//   // return [gamma(x)*,a,b]
// }

// function gamma(n: number) {
//   const cube = n ** 3
//   if (cube > 0.008856) return cube
//   return (cube - 16 / 116) / 7.787
// }
