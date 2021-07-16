declare type LCH = [number, number, number]

declare type HexPalette = {
  name: string
  tones: string[]
  hues: {
    name: string
    colors: string[]
  }[]
}

declare type Palette = {
  name: string
  hues: string[]
  tones: string[]
  colors: LCH[][]
}
