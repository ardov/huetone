import { rgb2hex, hex2rgb, lrgb2rgb, rgb2lrgb } from './common'
import { clamp } from './utils'
import { RGB, LAB, LCH, TClampedRgb, TLchSpace } from './types'
const { min, max, cbrt, sqrt, atan2, sin, cos, PI } = Math

//
// —————————————————————————————————————————————————————————————————————————————
// Linear RGB <-> Lab

export function lrgb2lab([r, g, b]: RGB): LAB {
  const l = cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

export function lab2lrgb([L, a, b]: LAB): RGB {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

//
// —————————————————————————————————————————————————————————————————————————————
// Lab <-> LCH

function lab2lch([L, a, b]: LAB): LCH {
  const c = sqrt(a * a + b * b)
  let h = 0
  if (c) {
    h = (atan2(b, a) * 180) / PI
    h %= 360
    if (h < 0) h += 360
  }
  return [L * 100, c * 100, h]
}

function lch2lab([L, c, h]: LCH): LAB {
  L /= 100
  c /= 100
  const rad = h * (PI / 180)
  const a = c * cos(rad)
  const b = c * sin(rad)
  return [L, a, b]
}

//
// —————————————————————————————————————————————————————————————————————————————
// RGB <-> LCH

export function rgb2lch(rgb: RGB): LCH {
  return lab2lch(lrgb2lab(rgb2lrgb(rgb)))
}

export function lch2rgb(lch: LCH): RGB {
  return lrgb2rgb(lab2lrgb(lch2lab(lch)))
}

//
// —————————————————————————————————————————————————————————————————————————————
// LCH -> Clamped RGB

export function lch2rgbClamped(lch: LCH): TClampedRgb {
  const [r, g, b] = lch2rgb(lch)
  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255),
    clamped: min(r, g, b) < 0 || max(r, g, b) > 255,
    undisplayable: min(r, g, b) < -0.0005 || max(r, g, b) > 255.00001,
  }
}

//
// —————————————————————————————————————————————————————————————————————————————
// LCH <-> HEX

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

export const oklch: TLchSpace = {
  fromRgb: rgb2lch,
  fromHex: hex2lch,
  toHex: lch2hex,
  toRgb: lch2rgb,
  toClampedRgb: lch2rgbClamped,
  ranges: {
    l: { min: 0, max: 100 },
    c: { min: 0, max: 32 },
    h: { min: 0, max: 360 },
  },
}
