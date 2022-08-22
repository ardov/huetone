export enum spaceName {
  oklch = 'oklch',
  cielch = 'cielch',
}

export type XYZ = [number, number, number]
export type LAB = [number, number, number]
export type LCH = [number, number, number]
export type RGB = [number, number, number]

export type Channel = 'l' | 'c' | 'h'

export type HexPalette = {
  name: string
  tones: string[]
  hues: {
    name: string
    colors: string[]
  }[]

  // Used only locally
  isPreset?: boolean
}

type ColorToken = {
  value: string
  type: 'color'
}

export type TokenExport = {
  [hue: string]: {
    [tone: string]: ColorToken
  }
}

export type TColor = {
  mode: spaceName
  l: number
  c: number
  h: number
  r: number
  g: number
  b: number
  hex: string
  within_sRGB: boolean
  within_P3: boolean
  within_Rec2020: boolean
}

export type TLchModel = {
  name: spaceName
  rgb2lch: (rgb: RGB) => LCH
  lch2rgb: (lch: LCH) => RGB
  rgbTreshold: { min: number; max: number }
  ranges: {
    l: { min: number; max: number }
    c: { min: number; max: number }
    h: { min: number; max: number }
  }
}

export type Palette = {
  mode: spaceName
  name: string
  hues: string[]
  tones: string[]
  colors: TColor[][]
}

export type OldLchPalette = {
  name: string
  hues: string[]
  tones: string[]
  colors: LCH[][]
}
