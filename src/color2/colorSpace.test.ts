import { colorSpaces } from '.'
import { TColor } from '../types'
import { hex2rgb } from './common'

test('Hex parser', () => {
  expect(hex2rgb('#Ff0')).toEqual([255, 255, 0])
})

const { cielch, oklch } = colorSpaces
const colors = ['#fffa02', '#000000', '#ff00ff', '#ffffff', '#ff0001']

test('Both sides converting CIE', () => {
  const { hex2color, lch2color } = cielch
  colors.forEach(original => {
    let color = hex2color(original) as TColor
    let { l, c, h } = color
    let transformed = lch2color([l, c, h])
    expect(transformed?.hex).toEqual(original)
    expect(transformed?.displayable).toBeTruthy()
  })
})

test('Both sides converting OK', () => {
  const { hex2color, lch2color } = oklch
  colors.forEach(original => {
    let color = hex2color(original) as TColor
    let { l, c, h } = color
    let transformed = lch2color([l, c, h])
    expect(transformed?.hex).toEqual(original)
    expect(transformed?.displayable).toBeTruthy()
  })
})
