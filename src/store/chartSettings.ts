import { action } from 'nanostores'
import { persistentMap } from '@nanostores/persistent'

export type TSettings = {
  showColors: boolean
  showP3: boolean
  showRec2020: boolean
}

export const chartSettingsStore = persistentMap<TSettings>(
  'settings:',
  {
    showColors: false,
    showP3: false,
    showRec2020: false,
  },
  { encode: JSON.stringify, decode: JSON.parse }
)

export const toggleShowColors = action(
  chartSettingsStore,
  'toggleShowColors',
  store => store.setKey('showColors', !store.get().showColors)
)

export const toggleShowP3 = action(chartSettingsStore, 'toggleShowP3', store =>
  store.setKey('showP3', !store.get().showP3)
)

export const toggleShowRec2020 = action(
  chartSettingsStore,
  'toggleShowRec2020',
  store => store.setKey('showRec2020', !store.get().showRec2020)
)
