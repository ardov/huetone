import { hex2rgb, rgb2hex } from './common'
import { oklch } from './oklch'
import { cielch } from './cielch'

const { toClampedRgb, fromRgb } = cielch

test('Hex parser', () => {
  expect(hex2rgb('#Ff0')).toEqual([255, 255, 0])
})

test('Both sides converting CIE', () => {
  const { toClampedRgb, fromHex, toHex } = cielch
  const colors = ['#fffa02', '#000000', '#ff00ff', '#ffffff', '#ff0001']
  colors.forEach(original => {
    let lch = fromHex(original)
    let { r, g, b, undisplayable } = toClampedRgb(lch)
    let hex = toHex(lch)
    expect(hex).toEqual(original)
    expect(undisplayable).toBeFalsy()
  })
})

test('Both sides converting OK', () => {
  const { toClampedRgb, fromHex, toHex } = oklch
  const colors = ['#fffa02', '#000000', '#ff00ff', '#ffffff', '#ff0001']
  colors.forEach(original => {
    let lch = fromHex(original)
    let { r, g, b, undisplayable } = toClampedRgb(lch)
    let hex = toHex(lch)
    expect(hex).toEqual(original)
    expect(undisplayable).toBeFalsy()
  })
})
