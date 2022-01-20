import { Palette } from '../types'
import { action, computed, map } from 'nanostores'
import { colorSpaces, TSpaceName } from '../color2'
import { convertToMode } from '../palette'

const initialPalette: Palette = {
  mode: 'cielch',
  name: 'initial',
  hues: ['Hue1'],
  tones: ['100'],
  colors: [
    [{ r: 0, g: 0, b: 0, hex: '#000000', l: 0, c: 0, h: 0, displayable: true }],
  ],
}

export const paletteStore = map<Palette>(initialPalette)

export const setPalette = action(
  paletteStore,
  'setPalette',
  (store, newPalette: Palette) => {
    store.set(newPalette)
  }
)

export const colorSpaceStore = computed(paletteStore, palette => {
  return colorSpaces[palette.mode]
})

export const switchColorSpace = action(
  paletteStore,
  'switchColorSpace',
  (store, space: TSpaceName) => {
    const palette = store.get()
    if (palette.mode === space) return
    store.set(convertToMode(palette, space))
  }
)

export const toggleColorSpace = action(
  paletteStore,
  'toggleColorSpace',
  store => {
    const palette = store.get()
    switchColorSpace(palette.mode === 'cielch' ? 'oklch' : 'cielch')
  }
)
