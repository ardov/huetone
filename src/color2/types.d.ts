export type XYZ = [number, number, number]
export type LAB = [number, number, number]
export type LCH = [number, number, number]
export type OKLAB = [number, number, number]
export type OKLCH = [number, number, number]
export type RGB = [number, number, number]
export type HSL = [number, number, number]

export type TClampedRgb = {
  r: number
  g: number
  b: number
  clamped: boolean
  undisplayable: boolean
}

export type TLchSpace = {
  fromRgb: (rgb: RGB) => LCH
  fromHex: (hex: string) => LCH
  toHex: (lch: LCH) => string
  toRgb: (lch: LCH) => RGB
  toClampedRgb: (lch: LCH) => {
    r: number
    g: number
    b: number
    clamped: boolean
    undisplayable: boolean
  }
  ranges: {
    l: { min: number; max: number }
    c: { min: number; max: number }
    h: { min: number; max: number }
  }
}
