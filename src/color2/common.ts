import { RGB } from './types'

//
// —————————————————————————————————————————————————————————————————————————————
// Linear RGB <-> sRGB

// Transfer function for channel. Linear -> sRBG
const gamma = (n: number) => {
  if (n < 0.0031308) return 12.92 * n
  return 1.055 * n ** (1 / 2.4) - 0.055
}

// Transfer function for channel. sRBG -> Linear
const gammaInv = (n: number) => {
  if (n < 0.04045) return n / 12.92
  return ((n + 0.055) / 1.055) ** 2.4
}

export function lrgb2rgb([r, g, b]: RGB): RGB {
  return [gamma(r) * 255, gamma(g) * 255, gamma(b) * 255]
}

export function rgb2lrgb([r, g, b]: RGB): RGB {
  return [gammaInv(r / 255), gammaInv(g / 255), gammaInv(b / 255)]
}

//
// —————————————————————————————————————————————————————————————————————————————
// HEX <-> RGB

export function hex2rgb(hex: string): RGB | null {
  let str = hex.toLowerCase()
  if (str.startsWith('#')) str = str.slice(1)

  if (str.match(/^([0-9a-f]{3})$/i)) {
    let r = (parseInt(str.charAt(0), 16) / 15) * 255
    let g = (parseInt(str.charAt(1), 16) / 15) * 255
    let b = (parseInt(str.charAt(2), 16) / 15) * 255
    return [r, g, b]
  }
  if (str.match(/^([0-9a-f]{6})$/i)) {
    let r = parseInt(str.slice(0, 2), 16)
    let g = parseInt(str.slice(2, 4), 16)
    let b = parseInt(str.slice(4, 6), 16)
    return [r, g, b]
  }
  if (str.match(/^([0-9a-f]{1})$/i)) {
    let a = (parseInt(str.slice(0), 16) / 15) * 255
    return [a, a, a]
  }
  if (str.match(/^([0-9a-f]{2})$/i)) {
    let a = parseInt(str.slice(0, 2), 16)
    return [a, a, a]
  }

  console.log('Failed to parse: ' + hex)

  return null
}

export function rgb2hex([r, g, b]: RGB) {
  const toHex = (x: number) =>
    Math.round(Math.min(255, Math.max(0, x)))
      .toString(16)
      .padStart(2, '0')
  return '#' + toHex(r) + toHex(g) + toHex(b)
}
