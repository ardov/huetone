import { test, expect } from 'vitest'
import { colorSpaces } from '.'
import { TColor } from '../types'

const { cielch, oklch } = colorSpaces
const colors = ['#fffa02', '#000000', '#ff00ff', '#ffffff', '#ff0001']

test('Both sides converting CIELCH', () => {
  const { hex2color, lch2color } = cielch
  colors.forEach(original => {
    let color = hex2color(original) as TColor
    let { l, c, h } = color
    let transformed = lch2color([l, c, h])
    expect(transformed?.hex).toEqual(original)
    expect(transformed?.within_sRGB).toBeTruthy()
  })
})

test('Both sides converting OKLCH', () => {
  const { hex2color, lch2color } = oklch
  colors.forEach(original => {
    let color = hex2color(original) as TColor
    let { l, c, h } = color
    let transformed = lch2color([l, c, h])
    expect(transformed?.hex).toEqual(original)
    expect(transformed?.within_sRGB).toBeTruthy()
  })
})
