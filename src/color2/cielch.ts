import chroma from 'chroma-js'
import { lrgb2rgb } from './common'
import { RGB, LCH, LAB, XYZ, TLchSpace } from '../types'

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
  const { sin, cos, PI } = Math
  const rad = h * (PI / 180)
  const a = c * cos(rad)
  const b = c * sin(rad)
  return [L, a, b]
}

//
// —————————————————————————————————————————————————————————————————————————————
// RGB <-> CIELCH

const lch2rgb = (lch: LCH): RGB => xyz2rgb(lab2xyz(lch2lab(lch)))

const rgb2lch = ([r, g, b]: RGB): LCH => {
  return chroma
    .rgb(r, g, b)
    .lch()
    .map(n => (isNaN(n) ? 0 : n)) as LCH
}

//
// —————————————————————————————————————————————————————————————————————————————
// Object

export const cielch: TLchSpace = {
  name: 'cielch',
  rgb2lch,
  lch2rgb,
  rgbTreshold: { min: -0.05, max: 255.1 },
  ranges: {
    l: { min: 0, max: 100 },
    c: { min: 0, max: 134 },
    h: { min: 0, max: 360 },
  },
}
