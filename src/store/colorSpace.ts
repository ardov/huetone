import { Palette } from '../types'
import { action, computed, atom } from 'nanostores'
import { TSpaceName } from '../color2'

export const colorSpaceStore = atom<TSpaceName>('cielch')

export const colorSpace = computed(colorSpaceStore, palette => {})

export const setPalette = action(
  colorSpaceStore,
  'set palette',
  (store, newPalette: Palette) => {
    // store.set(newPalette)
  }
)
