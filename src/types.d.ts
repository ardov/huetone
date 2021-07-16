export type LCH = [number, number, number]

export type HexPalette = {
  name: string
  tones: string[]
  hues: {
    name: string
    colors: string[]
  }[]
}

export type Palette = {
  name: string
  hues: string[]
  tones: string[]
  colors: LCH[][]
}
