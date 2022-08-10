import { atom, computed, action } from 'nanostores'
import { clamp } from 'shared/utils'
import { paletteStore } from './palette'

export type TPosition = [number, number]

const currentPositionStore = atom<TPosition | null>(null)

export const setSelected = action(
  currentPositionStore,
  'select color',
  (store, position: TPosition) => {
    store.set(position)
  }
)

export const selectedStore = computed(
  [currentPositionStore, paletteStore],
  (position, palette) => {
    let hueId = 0
    let toneId = 0
    if (!position) {
      // If no current position select the middle of the palette
      hueId = Math.floor(palette.hues.length / 2)
      toneId = Math.floor(palette.tones.length / 2)
    } else {
      // Make sure current position isn't outside the palette
      hueId = clamp(position[0], 0, palette.hues.length - 1)
      toneId = clamp(position[1], 0, palette.tones.length - 1)
    }
    const color = palette.colors[hueId][toneId]
    return { hueId, toneId, color }
  }
)
