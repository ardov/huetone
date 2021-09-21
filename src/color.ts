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

export const displayableChroma = (lch: LCH): boolean => {
  // @ts-ignore
  return !chroma.lch(...lch).clipped()
}

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

// COLORS

type LAB = [number, number, number]
type XYZ = [number, number, number]
type RGB = [number, number, number]

const refX = 95.047
const refY = 100
const refZ = 108.883

const lchToLab = (lch: LCH): LAB => {
  const [l, c, h] = lch
  const rad = h * (Math.PI / 180)
  const a = Math.cos(rad) * c
  const b = Math.sin(rad) * c
  return [l, a, b]
}
const labToXyz = (lab: LAB): XYZ => {
  const [l, a, b] = lab
  let y = (l + 16) / 116
  let x = a / 500 + y
  let z = y - b / 200

  return [gamma(x) * refX, gamma(y) * refY, gamma(z) * refZ]
}

const xyzToRgb = (xyz: XYZ): RGB => {
  let [x, y, z] = xyz.map(v => v / 100)

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415
  let b = x * 0.0557 + y * -0.204 + z * 1.057

  return [linear2srgb(r) * 255, linear2srgb(g) * 255, linear2srgb(b) * 255]
}

export const lch2rgb = (lch: LCH): RGB => {
  let lab = lchToLab(lch)
  let xyz = labToXyz(lab)
  return xyzToRgb(xyz)
}

export const displayable = (lch: LCH): boolean => {
  const [l, c, h] = lch
  if (l < 20 && c > 52 && h < 280) return false
  if (l > 94 && c > 25 && (h < 92 || h > 202)) return false

  const rgb = lch2rgb(lch)
  for (const value of rgb) {
    // if (value < 0 || value > 255) return false
    if (value < -0.4 || value > 255.4) return false
  }
  return true
}

const δ = 6 / 29

function gamma(t: number) {
  if (t > δ) return t * t * t
  else return 3 * δ * δ * (t - 4 / 29)
}

function linear2srgb(n: number) {
  if (n > 0.0031308) return 1.055 * n ** (1 / 2.4) - 0.055
  return 12.92 * n
}

//  TESTING

const makeLch = (): LCH => {
  return chroma
    .rgb(Math.random() * 255, Math.random() * 255, Math.random() * 255)
    .lch()
}

export const testMethods = () => {
  let colors: LCH[] = []
  for (let i = 0; i < 160000; i++) {
    colors.push(makeLch())
  }
  let t0 = performance.now()
  const myResults = colors.map(displayableChroma)
  let t1 = performance.now()
  const chromaResults = colors.map(displayable)
  let t2 = performance.now()
  console.log(
    'chroma: ',
    (t1 - t0).toFixed(2),
    chromaResults.filter(Boolean).length
  )
  console.log(
    'my    : ',
    (t2 - t1).toFixed(2),
    myResults.filter(Boolean).length
  )
}
// export const findDiff = () => {
//   for (let i = 0; i < colors.length; i++) {
//     let lch = colors[i]
//     if (displayable(lch) !== displayable2(lch)) {
//       console.group()
//       console.log('LCH: ', lch)
//       console.log(
//         'Chroma: ',
//         displayable(lch),
//         chroma.lch(...lch).rgb(),
//         chroma.lch(...lch).hex()
//       )
//       console.log('My    : ', displayable2(lch), lch2rgb(lch))
//       console.groupEnd()
//       return
//     }
//   }
// }

//  @ts-ignore
// window.colors = {
//   allRgb: () => {
//     let res = []
//     for (let r = 0; r <= 255; r++) {
//       for (let g = 0; g <= 255; g++) {
//         for (let b = 0; b <= 255; b++) {
//           res.push(chroma.rgb(r, g, b).lch())
//         }
//       }
//     }
//     console.log('ready')
//     return res
//   },
// }
