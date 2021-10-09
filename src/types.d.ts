export type LCH = [number, number, number]

export type Channel = 'l' | 'c' | 'h'

export type HexPalette = {
  name: string
  tones: string[]
  hues: {
    name: string
    colors: string[]
  }[]
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

export type Palette = {
  name: string
  hues: string[]
  tones: string[]
  colors: LCH[][]
}

export type OverlayMode = 'WCAG' | 'APCA'
