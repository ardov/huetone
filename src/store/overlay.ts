import { action, computed, map } from 'nanostores'
import { selectedStore } from './currentPosition'

export type TOverlayMode = 'APCA' | 'WCAG' | 'NONE' | 'DELTA_E'
type TVersus = 'selected' | string

export const overlayStore = map<{ mode: TOverlayMode; versus: TVersus }>({
  mode: 'APCA',
  versus: 'white',
})

export const versusColorStore = computed(
  [overlayStore, selectedStore],
  (overlay, selected) => {
    if (overlay.versus === 'selected') {
      return selected.color.hex
    }
    return overlay.versus
  }
)

// ACTIONS

export const setOverlayMode = action(
  overlayStore,
  'setOverlayMode',
  (store, mode: TOverlayMode) => {
    store.setKey('mode', mode)
  }
)

export const setVersusColor = action(
  overlayStore,
  'setVersusColor',
  (store, color: TVersus) => {
    store.setKey('versus', color)
  }
)
