import { oklch } from './oklch'
import { cielch } from './cielch'
import { hex2rgb, rgb2hex } from './common'
import { LCH, TColor, TLchSpace } from '../types'
import { clamp } from '../utils'

export const colorSpaces = {
  oklch: makeColorFuncs(oklch),
  cielch: makeColorFuncs(cielch),
}
export type TSpaceName = keyof typeof colorSpaces
export type TColorSpace = {
  name: TLchSpace['name']
  ranges: TLchSpace['ranges']
  hex2color: (hex: string) => TColor | null
  lch2color: (lch: LCH) => TColor
}

function makeColorFuncs(colorSpace: TLchSpace): TColorSpace {
  const { rgb2lch, lch2rgb, rgbTreshold, ranges, name } = colorSpace
  return {
    name,
    hex2color: (hex: string): TColor | null => {
      const rgb = hex2rgb(hex)
      if (!rgb) return null
      let [r, g, b] = rgb
      let [l, c, h] = rgb2lch(rgb)
      // prettier-ignore
      return {
        l, c, h,
        r, g, b,
        hex: rgb2hex([r, g, b]),
        displayable: true,
      }
    },
    lch2color: ([l, c, h]: LCH): TColor => {
      const [r, g, b] = lch2rgb([l, c, h])
      return {
        l,
        c,
        h,
        r: clamp(r, 0, 255),
        g: clamp(g, 0, 255),
        b: clamp(b, 0, 255),
        hex: rgb2hex([r, g, b]),
        displayable:
          Math.min(r, g, b) >= rgbTreshold.min &&
          Math.max(r, g, b) <= rgbTreshold.max,
      }
    },
    ranges,
  }
}
