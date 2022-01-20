import LZString from 'lz-string'
import { PRESETS } from '../presets'
import { HexPalette } from '../types'
import { PALETTE_KEY } from '../constants'
import { jsonToHexPalette } from '../palette'
import { atom } from 'nanostores'

export const paletteListStore = atom<HexPalette[]>(getInitialList())

function getInitialList(): HexPalette[] {
  const urlPalette = getUrlPaletteAndClean()
  const savedPalettes = getSavedPalettes()
  let paletteList: HexPalette[] = []
  if (urlPalette) paletteList.push(urlPalette)
  paletteList = paletteList.concat(savedPalettes).concat(PRESETS)
  return paletteList
}

/** Load palettes from localStorage */
function getSavedPalettes(): HexPalette[] {
  const json = localStorage.getItem(PALETTE_KEY)
  if (!json) return []
  return []
  // TODO: Support several palettes
  // const palette = jsonToHexPalette(json)
  // return palette ? [palette] : []
}

/** Parse palette from URL and remove URL param */
function getUrlPaletteAndClean() {
  const url = new URL(window.location.href)
  const compressed = url.searchParams.get(PALETTE_KEY)
  if (!compressed) return null
  const json = LZString.decompressFromEncodedURIComponent(compressed)
  if (!json) return null
  url.searchParams.delete(PALETTE_KEY)
  window.history.replaceState('page2', 'Title', url)
  return jsonToHexPalette(json)
}
