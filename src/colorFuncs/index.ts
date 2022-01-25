import { LCH, RGB, TColor, XYZ } from '../types'
import { clamp } from '../utils'
import { oklch, cielch } from './colorSpaces'
import {
  isWithinGamut,
  forceIntoGamut,
  srgb2hex,
  hex2rgb,
  xyz2rgb,
  rgb2xyz,
  xyz2p3,
  xyz2rec2020,
} from './utils'

export const colorSpaces = {
  oklch: colorSpaceMaker(oklch),
  cielch: colorSpaceMaker(cielch),
}

export type TSpaceName = keyof typeof colorSpaces

export type TLchModel = {
  name: TSpaceName
  ranges: {
    l: { min: number; max: number; step: number }
    c: { min: number; max: number; step: number }
    h: { min: number; max: number; step: number }
  }
  xyz2lch: (xyz: XYZ) => LCH
  lch2xyz: (lch: LCH) => XYZ
}

export type TColorSpace = {
  name: TLchModel['name']
  ranges: TLchModel['ranges']
  hex2color: (hex: string) => TColor | null
  lch2color: (lch: LCH) => TColor
}

/** Makes color space object with essential functions */
function colorSpaceMaker(colorSpace: TLchModel): TColorSpace {
  const { lch2xyz, xyz2lch, ranges, name } = colorSpace

  // Full conversions
  const lch2rgb = (lch: LCH) => xyz2rgb(lch2xyz(lch))
  const rgb2lch = (rgb: RGB) => xyz2lch(rgb2xyz(rgb))

  function lch2color(lch: LCH): TColor {
    const xyz = lch2xyz(lch)
    const srgb = xyz2rgb(xyz)
    const within_sRGB = isWithinGamut(srgb)
    const [r, g, b] = srgb.map(c => clamp(c * 255, 0, 255))
    const [l, c, h] = lch

    // prettier-ignore
    return {
      l, c, h,
      r, g, b,
      get hex () {
        const rgb = within_sRGB ? srgb : forceIntoGamut(lch, lch2rgb)
        return srgb2hex(rgb)
      },
      within_sRGB,
      get within_P3 () {
        return within_sRGB || isWithinGamut(xyz2p3(xyz))
      },
      get within_Rec2020 () {
        return within_sRGB || this.within_P3 || isWithinGamut(xyz2rec2020(xyz))
      },
    }
  }

  function hex2color(hex: string): TColor | null {
    const rgb = hex2rgb(hex)?.map(c => c / 255) as RGB
    if (!rgb) return null
    const [l, c, h] = rgb2lch(rgb)
    const [r, g, b] = rgb.map(c => clamp(c * 255, 0, 255))

    // prettier-ignore
    return {
      l, c, h,
      r, g, b,
      hex: srgb2hex(rgb),
      within_sRGB: true,
      within_P3: true,
      within_Rec2020: true,
    }
  }

  return { name, ranges, hex2color, lch2color }
}
