import { test, expect } from 'vitest'
import { HexPalette, spaceName } from 'shared/types'
import { exportToHexPalette, parseHexPalette } from './converters'

const hexPalette: HexPalette = {
  name: 'Test palette',
  tones: ['100', '200', '300'],
  hues: [
    { name: 'Blue', colors: ['#f04e89', '#123321', '#eee123'] },
    { name: 'Red', colors: ['#ffae22', '#eeeeee', '#000000'] },
  ],
}

test('Parsing hex palette', () => {
  const palette = parseHexPalette(hexPalette, spaceName.cielch)
  const hex = exportToHexPalette(palette)
  expect(hex).toEqual(hexPalette)
  expect(palette.colors.length).toEqual(hexPalette.hues.length)
})
