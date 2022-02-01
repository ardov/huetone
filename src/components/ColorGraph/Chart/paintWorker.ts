import { colorSpaces, TSpaceName } from '../../../colorFuncs'
import * as Comlink from 'comlink'
import { TColor } from '../../../types'
import { Pixels, TPixelData } from './Pixels'
import { paddedScale, sycledLerp } from './interpolation'

export type DrawChartProps = {
  width: number
  height: number
  widthFrom?: number,
  widthTo?: number,
  colors: TColor[]
  mode: TSpaceName
  showColors?: boolean
  showP3?: boolean
  showRec2020?: boolean
}

const getSrgbPixel = (): TPixelData => [255, 255, 255, 255]
const getP3pixel = (x: number, y: number): TPixelData => [198, 198, 198, 255]
const getRec2020pixel = (x: number, y: number): TPixelData => [
  171, 171, 171, 255,
]
// const getSrgbPixel = (): TPixelData => [255, 255, 255, 255]
// const getP3pixel = (x: number, y: number): TPixelData => [
//   x % 3 || y % 3 ? 255 : 80,
//   x % 3 || y % 3 ? 255 : 80,
//   x % 3 || y % 3 ? 255 : 80,
//   255,
// ]
// const getRec2020pixel = (x: number, y: number): TPixelData => [
//   255,
//   x % 2 || y % 3 ? 255 : 80,
//   x % 2 || y % 3 ? 255 : 80,
//   255,
// ]

function drawLuminosityChart(props: DrawChartProps) {
  const { width, height, colors, mode, showColors, showP3, showRec2020, widthFrom = 0, widthTo = width } = props
  const { ranges, lch2color } = colorSpaces[mode]
  let pixels = new Pixels(widthTo - widthFrom, height)
  let chromaScale = paddedScale(
    width,
    colors.map(color => color.c)
  )
  let hueScale = paddedScale(
    width,
    colors.map(color => color.h),
    ranges.h.max
  )

  for (let x = widthFrom; x < widthTo; x++) {
    let c = chromaScale(x)
    let h = hueScale(x)
    let hadColors = false

    for (let y = height; y >= 0; y--) {
      let l = sycledLerp(ranges.l.max, ranges.l.min, y / height)
      const { r, g, b, within_sRGB, within_P3, within_Rec2020 } = lch2color([
        l,
        c,
        h,
      ])
      const displayable = showRec2020
        ? within_Rec2020
        : showP3
        ? within_P3
        : within_sRGB
      // Luminosity chart only have colors in the middle. So if the current color is undisplayable and we already had displayable colors, there will be no more displayable colors.
      if (!displayable && hadColors) break

      const dx = x - widthFrom
      if (within_sRGB) {
        hadColors = true
        pixels.setPixel(dx, y, showColors ? [r, g, b, 255] : getSrgbPixel())
      } else if (showP3 && within_P3) {
        pixels.setPixel(dx, y, getP3pixel(dx, y))
      } else if (showRec2020 && within_Rec2020) {
        // const v = ((Math.sin((x + y * -0.8) * 1.5) + 1) / 2) * 55 + 200
        pixels.setPixel(dx, y, getRec2020pixel(dx, y))
      }
    }
  }

  return pixels.array
}

function drawChromaChart(props: DrawChartProps) {
  const { width, height, colors, mode, showColors, showP3, showRec2020, widthFrom = 0, widthTo = width } = props
  const { ranges, lch2color } = colorSpaces[mode]
  let pixels = new Pixels(widthTo - widthFrom, height)
  let luminostyScale = paddedScale(
    width,
    colors.map(color => color.l)
  )
  let hueScale = paddedScale(
    width,
    colors.map(color => color.h),
    ranges.h.max
  )

  for (let x = widthFrom; x < widthTo; x++) {
    let l = luminostyScale(x)
    let h = hueScale(x)

    // TODO: it will be a good optimisation to remember previous L H values and return the same column if they haven't changed

    // TODO: another good optimisation is to remember previous last displayable color and start from it. Or even combine it with binary search.

    for (let y = height; y >= 0; y--) {
      let c = sycledLerp(ranges.c.max, ranges.c.min, y / height)
      const { r, g, b, within_sRGB, within_P3, within_Rec2020 } = lch2color([
        l,
        c,
        h,
      ])
      const displayable = showRec2020
        ? within_Rec2020
        : showP3
        ? within_P3
        : within_sRGB
      // If color with this chroma is undisplayable, then all colors with higher chroma also will be undisplayable so we can just finish with this column.
      if (!displayable) break

      const dx = x - widthFrom
      if (within_sRGB) {
        pixels.setPixel(dx, y, showColors ? [r, g, b, 255] : getSrgbPixel())
      } else if (showP3 && within_P3) {
        pixels.setPixel(dx, y, getP3pixel(dx, y))
      } else if (showRec2020 && within_Rec2020) {
        pixels.setPixel(dx, y, getRec2020pixel(dx, y))
      }
    }
  }
  return pixels.array
}

function drawHueChart(props: DrawChartProps) {
  const { width, height, colors, mode, showColors, showP3, showRec2020, widthFrom = 0, widthTo = width } = props
  const { ranges, lch2color } = colorSpaces[mode]
  let pixels = new Pixels(widthTo - widthFrom, height)
  let luminostyScale = paddedScale(
    width,
    colors.map(color => color.l)
  )
  let chromaScale = paddedScale(
    width,
    colors.map(color => color.c)
  )

  for (let x = widthFrom; x < widthTo; x++) {
    let l = luminostyScale(x)
    let c = chromaScale(x)

    for (let y = height; y >= 0; y--) {
      let h = sycledLerp(ranges.h.max, ranges.h.min, y / height)
      const { r, g, b, within_sRGB, within_P3, within_Rec2020 } = lch2color([
        l,
        c,
        h,
      ])

      const dx = x - widthFrom
      if (within_sRGB) {
        pixels.setPixel(dx, y, showColors ? [r, g, b, 255] : getSrgbPixel())
      } else if (showP3 && within_P3) {
        pixels.setPixel(dx, y, getP3pixel(dx, y))
      } else if (showRec2020 && within_Rec2020) {
        pixels.setPixel(dx, y, getRec2020pixel(dx, y))
      }
    }
  }
  return pixels.array
}

const obj = { drawChromaChart, drawLuminosityChart, drawHueChart }
export type WorkerObj = typeof obj
Comlink.expose(obj)
