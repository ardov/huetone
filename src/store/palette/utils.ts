import { Palette, spaceName } from 'shared/types'
import LZString from 'lz-string'
import { HexPalette } from 'shared/types'
import { PALETTE_KEY } from 'shared/constants'
import { jsonToHexPalette, parseOldLchPalette } from './converters'

/** Parse string from localStorage into HexPalette */
export function decodeUserPalettes(json: string): HexPalette[] {
  if (!json) return []
  try {
    const userPalettes = JSON.parse(json)
    if (Array.isArray(userPalettes)) {
      return userPalettes
    } else {
      // Supporting old format where colors were stored as LCH
      // TODO: remove after Feb 20
      return [parseOldLchPalette(userPalettes)]
    }
  } catch (error) {
    console.error(error)
  }
  return []
}

/** Parse palette from URL */
export function getUrlPalette() {
  const url = new URL(window.location.href)
  const compressed = url.searchParams.get(PALETTE_KEY)
  if (!compressed) return null
  const json = LZString.decompressFromEncodedURIComponent(compressed)
  if (!json) return null
  return jsonToHexPalette(json)
}

/** Remove palette from URL */
export function cleanURL() {
  const url = new URL(window.location.href)
  url.searchParams.delete(PALETTE_KEY)
  window.history.replaceState('', '', url)
}
export const initialPalette: Palette = {
  mode: spaceName.cielch,
  name: 'initial',
  hues: ['Hue1'],
  tones: ['100'],
  colors: [
    [
      {
        mode: spaceName.cielch,
        r: 0,
        g: 0,
        b: 0,
        hex: '#000000',
        l: 0,
        c: 0,
        h: 0,
        within_sRGB: true,
        within_P3: true,
        within_Rec2020: true,
      },
    ],
  ],
}
