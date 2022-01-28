type RGB = [number, number, number]

declare module 'apca-w3' {
  export function APCAcontrast(
    textY: number,
    backgroundY: number,
    decimals?: number
  ): number | string
  export function sRGBtoY(rgb: RGB): number
  export function displayP3toY(rgb: RGB): number
  export function adobeRGBtoY(rgb: RGB): number
  // export function alphaBlend()
  // export function calcAPCA()
}
