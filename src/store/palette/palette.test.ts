import { HexPalette } from '../../types'
import { exportToHexPalette } from './converters'
import { parseHexPalette } from './index'

const hexPalette: HexPalette = {
  name: 'Test palette',
  tones: ['100', '200', '300'],
  hues: [
    { name: 'Blue', colors: ['#f04e89', '#123321', '#eee123'] },
    { name: 'Red', colors: ['#ffae22', '#eeeeee', '#000000'] },
  ],
}

test('Parsing hex palette', () => {
  const palette = parseHexPalette(hexPalette, 'cielch')
  const hex = exportToHexPalette(palette)
  expect(hex).toEqual(hexPalette)
  expect(palette.colors.length).toEqual(hexPalette.hues.length)
})
