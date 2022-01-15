import chroma from 'chroma-js'
import { hex2rgb, rgb2hex, lrgb2rgb } from './common'
import { clamp } from './utils'
import { RGB, LCH, LAB, XYZ, TLchSpace, TClampedRgb } from './types'
const { min, max, sin, cos, PI } = Math

//
// —————————————————————————————————————————————————————————————————————————————
// Linear RGB <-> XYZ

const xyz2rgb = (xyz: XYZ): RGB => {
  let [x, y, z] = xyz.map(v => v / 100)
  let r = x * 3.2406 + y * -1.5372 + z * -0.4986
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415
  let b = x * 0.0557 + y * -0.204 + z * 1.057
  return lrgb2rgb([r, g, b])
}

//
// —————————————————————————————————————————————————————————————————————————————
// XYZ <-> CIELab

const refX = 95.047
const refY = 100
const refZ = 108.883
const δ = 6 / 29
function fn(t: number) {
  if (t > δ) return t * t * t
  else return 3 * δ * δ * (t - 4 / 29)
}

const lab2xyz = ([l, a, b]: LAB): XYZ => {
  let y = (l + 16) / 116
  let x = a / 500 + y
  let z = y - b / 200
  return [fn(x) * refX, fn(y) * refY, fn(z) * refZ]
}

//
// —————————————————————————————————————————————————————————————————————————————
// CIELab <-> CIELCH

const lch2lab = ([L, c, h]: LCH): LAB => {
  const rad = h * (PI / 180)
  const a = c * cos(rad)
  const b = c * sin(rad)
  return [L, a, b]
}

//
// —————————————————————————————————————————————————————————————————————————————
// RGB <-> CIELCH

export const lch2rgb = (lch: LCH): RGB => {
  return xyz2rgb(lab2xyz(lch2lab(lch)))
}

export const rgb2lch = ([r, g, b]: RGB): LCH => {
  return chroma
    .rgb(r, g, b)
    .lch()
    .map(n => (isNaN(n) ? 0 : n)) as LCH
}

//
// —————————————————————————————————————————————————————————————————————————————
// CIELCH -> Clamped RGB

export function lch2rgbClamped(lch: LCH): TClampedRgb {
  const [r, g, b] = lch2rgb(lch)
  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255),
    clamped: min(r, g, b) < 0 || max(r, g, b) > 255,
    undisplayable: min(r, g, b) < -0.05 || max(r, g, b) > 255.1,
  }
}

//
// —————————————————————————————————————————————————————————————————————————————
// CIELCH <-> HEX

function lch2hex(lch: LCH): string {
  const { r, g, b } = lch2rgbClamped(lch)
  return rgb2hex([r, g, b])
}

function hex2lch(hex: string): LCH {
  const rgb = hex2rgb(hex)
  if (rgb) return rgb2lch(rgb)
  console.log('error parsing hex: ', hex)
  return [0, 0, 0]
}

//
// —————————————————————————————————————————————————————————————————————————————
// Object

export const cielch: TLchSpace = {
  fromRgb: rgb2lch,
  fromHex: hex2lch,
  toHex: lch2hex,
  toRgb: lch2rgb,
  toClampedRgb: lch2rgbClamped,
  ranges: {
    l: { min: 0, max: 100 },
    c: { min: 0, max: 134 },
    h: { min: 0, max: 360 },
  },
}

// export const cielch = {
//   fromRgb: rgb2lch,
//   toRgb: lch2rgb,
// }
