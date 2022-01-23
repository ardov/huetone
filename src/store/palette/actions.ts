import { HexPalette, LCH, Palette } from '../../types'
import { action } from 'nanostores'
import { TSpaceName } from '../../color2'
import { convertToMode } from './paletteReducers'
import { paletteStore, paletteIdStore, paletteListStore } from './stores'
import {
  clampColorsToRgb,
  setHueHue,
  setToneLuminance,
} from './paletteReducers'
import { parseHexPalette } from './converters'
import { selectedStore } from '../currentPosition'
import { colorSpaceStore, exportToHexPalette, savedPalettesStore } from '.'

export const switchPalette = (id: number) => {
  const paletteList = paletteListStore.get()
  if (!paletteList[id]) return
  paletteIdStore.set(id)
  const { mode } = paletteStore.get()
  const newPalette = parseHexPalette(paletteList[id], mode)
  paletteStore.set(newPalette)
}

export const switchColorSpace = action(
  paletteStore,
  'switchColorSpace',
  (store, space: TSpaceName) => {
    const palette = store.get()
    if (palette.mode === space) return
    store.set(convertToMode(palette, space))
  }
)

// Palllete list actions

export const updateSavedPalette = action(
  savedPalettesStore,
  'updateSavedPalette',
  (store, palette: HexPalette, idx: number) => {
    const paletteList = store.get()
    store.set(paletteList.map((p, i) => (i === idx ? palette : p)))
  }
)

const removeSavedPalette = action(
  savedPalettesStore,
  'removeSavedPalette',
  (store, idx: number) => {
    const paletteList = store.get()
    store.set(paletteList.filter((_, i) => i !== idx))
  }
)

export const deletePalette = (idx: number) => {
  removeSavedPalette(idx)
  const currentId = paletteIdStore.get()
  if (currentId > idx) paletteIdStore.set(currentId - 1)
  if (currentId === idx) switchPalette(currentId)
}

// Color space actions

export const toggleColorSpace = action(
  paletteStore,
  'toggleColorSpace',
  store => {
    const palette = store.get()
    switchColorSpace(palette.mode === 'cielch' ? 'oklch' : 'cielch')
  }
)

//  Palette actions

/** Main action for editing the palette.  */
export const setPalette = action(
  paletteStore,
  'setPalette',
  (store, newPalette: Palette) => {
    const savedPalettes = savedPalettesStore.get()
    const currentId = paletteIdStore.get()
    if (currentId > savedPalettes.length - 1) {
      // Trying to change preset
      const name = newPalette.name + ' copy'
      const changedPalette = { ...newPalette, name }
      savedPalettesStore.set([
        exportToHexPalette(changedPalette),
        ...savedPalettes,
      ])
      paletteIdStore.set(0)
      store.set(changedPalette)
    } else {
      // Changing user palette
      store.set(newPalette)
      setTimeout(() => {
        updateSavedPalette(exportToHexPalette(newPalette), currentId)
      }, 10)
    }
  }
)

export const pushColorsIntoRgb = action(
  paletteStore,
  'pushColorsIntoRgb',
  store => setPalette(clampColorsToRgb(store.get()))
)

export const currentLuminanceToColumn = action(
  paletteStore,
  'currentLuminanceToColumn',
  store => {
    const selected = selectedStore.get()
    setPalette(setToneLuminance(store.get(), selected.color.l, selected.toneId))
  }
)

export const currentHueToRow = action(
  paletteStore,
  'currentHueToRow',
  store => {
    const selected = selectedStore.get()
    setPalette(setHueHue(store.get(), selected.color.h, selected.hueId))
  }
)

export const renamePalette = action(paletteStore, 'rename', (store, name) => {
  setPalette({ ...store.get(), name })
})

export const setLchColor = action(
  paletteStore,
  'setLchColor',
  (store, lch: LCH, hueId: number, toneId: number) => {
    const palette = store.get()
    const { lch2color } = colorSpaceStore.get()
    const color = lch2color(lch)
    setPalette({
      ...palette,
      colors: palette.colors.map((tones, hue) =>
        hue === hueId
          ? tones.map((lch, tone) => (toneId === tone ? color : lch))
          : tones
      ),
    })
  }
)
