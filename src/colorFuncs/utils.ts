import { LCH, RGB, XYZ } from '../types'
import {
  gam_2020,
  gam_P3,
  gam_sRGB,
  lin_sRGB,
  lin_sRGB_to_XYZ,
  XYZ_to_lin_2020,
  XYZ_to_lin_P3,
  XYZ_to_lin_sRGB,
} from './colorMath/conversions'

// XYZ conversions
export const xyz2rgb = (xyz: XYZ) => gam_sRGB(XYZ_to_lin_sRGB(xyz))
export const rgb2xyz = (rgb: RGB) => lin_sRGB_to_XYZ(lin_sRGB(rgb))
export const xyz2p3 = (xyz: XYZ) => gam_P3(XYZ_to_lin_P3(xyz))
export const xyz2rec2020 = (xyz: XYZ) => gam_2020(XYZ_to_lin_2020(xyz))

export function isWithinGamut(rgb: RGB) {
  const ε = 0.000005
  return rgb.reduce((a, b) => a && b >= 0 - ε && b <= 1 + ε, true)
}

/** Moves an lch color into sRGB or other gamut
 *  by holding the l and h steady,
 *  and adjusting the c via binary-search
 *  until the color is on the gamut boundary.
 *  Logic by [Chris Lilley](https://svgees.us/)
 */
export function forceIntoGamut(lch: LCH, lch2rgb: (lch: LCH) => RGB): RGB {
  let rgb = lch2rgb(lch)
  if (isWithinGamut(rgb)) return rgb

  let [l, c, h] = lch
  let hiC = c
  let loC = 0
  const ε = 0.0001 // .0001 chosen fairly arbitrarily as "close enough"
  c /= 2

  while (hiC - loC > ε) {
    rgb = lch2rgb([l, c, h])
    if (isWithinGamut(rgb)) loC = c
    else hiC = c
    c = (hiC + loC) / 2
  }

  return rgb
}

export function hex2rgb(hex: string): RGB | null {
  let str = hex.toLowerCase()
  if (str.startsWith('#')) str = str.slice(1)

  if (str.match(/^([0-9a-f]{3})$/i)) {
    let r = (parseInt(str.charAt(0), 16) / 15) * 255
    let g = (parseInt(str.charAt(1), 16) / 15) * 255
    let b = (parseInt(str.charAt(2), 16) / 15) * 255
    return [r, g, b]
  }
  if (str.match(/^([0-9a-f]{6})$/i)) {
    let r = parseInt(str.slice(0, 2), 16)
    let g = parseInt(str.slice(2, 4), 16)
    let b = parseInt(str.slice(4, 6), 16)
    return [r, g, b]
  }
  if (str.match(/^([0-9a-f]{1})$/i)) {
    let a = (parseInt(str.slice(0), 16) / 15) * 255
    return [a, a, a]
  }
  if (str.match(/^([0-9a-f]{2})$/i)) {
    let a = parseInt(str.slice(0, 2), 16)
    return [a, a, a]
  }

  console.log('Failed to parse: ' + hex)

  return null
}

/** Convert sRGB to hex
 *  @param rgb — channels within [0-1]
 */
export function srgb2hex([r, g, b]: RGB) {
  const toHex = (x: number) =>
    Math.round(Math.min(255, Math.max(0, x * 255)))
      .toString(16)
      .padStart(2, '0')
  return '#' + toHex(r) + toHex(g) + toHex(b)
}
