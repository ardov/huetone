import { Palette, spaceName } from 'shared/types'
import { computed, map, onMount } from 'nanostores'
import { colorSpaces } from 'shared/colorFuncs'
import { parseHexPalette } from '.'
import { persistentAtom } from '@nanostores/persistent'
import { PRESETS } from 'shared/presets'
import { HexPalette } from 'shared/types'
import { PALETTE_KEY } from 'shared/constants'
import { atom } from 'nanostores'
import { isEqual } from 'lodash'
import {
  decodeUserPalettes,
  getUrlPalette,
  cleanURL,
  initialPalette,
} from './utils'
const presets = PRESETS.map(p => ({ ...p, isPreset: true }))

// —————————————————————————————————————————————————————————————————————————————
// PALETTE INDEX

/** Index of selected palette */
export const paletteIdStore = atom<number>(0)

// —————————————————————————————————————————————————————————————————————————————
// PALETTE LIST

/** Array of user palettes saved in localStorage */
export const savedPalettesStore = persistentAtom<HexPalette[]>(
  PALETTE_KEY,
  [],
  { encode: JSON.stringify, decode: decodeUserPalettes }
)

/** Array of all palettes: user palettes + presets */
export const paletteListStore = computed(savedPalettesStore, palettes => {
  return palettes.concat(presets)
})

/** On mount add palette from the URL in the beginning of the list. */
onMount(paletteListStore, () => {
  const urlPalette = getUrlPalette()
  cleanURL()
  if (!urlPalette) return
  const savedPalettes = savedPalettesStore.get()
  const urlIdx = savedPalettes.findIndex(p => isEqual(p, urlPalette))
  if (urlIdx > -1) {
    paletteIdStore.set(urlIdx)
  } else {
    savedPalettesStore.set([urlPalette, ...savedPalettesStore.get()])
  }
})

// —————————————————————————————————————————————————————————————————————————————
// CURRENT PALETTE

export const paletteStore = map<Palette>(initialPalette)

onMount(paletteStore, () => {
  const list = paletteListStore.get()
  const idx = paletteIdStore.get()
  paletteStore.set(parseHexPalette(list[idx], spaceName.oklch))
})

export const colorSpaceStore = computed(
  paletteStore,
  palette => colorSpaces[palette.mode]
)
