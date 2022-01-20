import { colorSpaces, TSpaceName } from '../../../color2'
import * as Comlink from 'comlink'
import { TColor } from '../../../types'
import { Pixels } from './Pixels'
import { paddedScale, sycledLerp } from './interpolation'

type DrawChartProps = {
  width: number
  height: number
  colors: TColor[]
  mode: TSpaceName
  showColors?: boolean
}

function drawLuminosityChart({
  width,
  height,
  colors,
  mode,
  showColors,
}: DrawChartProps) {
  const { ranges, lch2color } = colorSpaces[mode]
  let pixels = new Pixels(width, height)
  let chromaScale = paddedScale(
    width,
    colors.map(color => color.c)
  )
  let hueScale = paddedScale(
    width,
    colors.map(color => color.h),
    ranges.h.max
  )

  for (let x = 0; x < width; x++) {
    let c = chromaScale(x)
    let h = hueScale(x)
    let hadColors = false

    for (let y = height; y >= 0; y--) {
      let l = sycledLerp(ranges.l.max, ranges.l.min, y / height)
      const { r, g, b, displayable } = lch2color([l, c, h])
      // Luminosity chart only have colors in the middle. So if the current color is undisplayable and we already had displayable colors, there will be no more displayable colors.
      if (!displayable && hadColors) break
      if (displayable) {
        hadColors = true
        pixels.setPixel(
          x,
          y,
          showColors ? r : 255,
          showColors ? g : 255,
          showColors ? b : 255,
          255
        )
      }
    }
  }

  return pixels.array
}

function drawChromaChart({
  width,
  height,
  colors,
  mode,
  showColors,
}: DrawChartProps) {
  const { ranges, lch2color } = colorSpaces[mode]
  let pixels = new Pixels(width, height)
  let luminostyScale = paddedScale(
    width,
    colors.map(color => color.l)
  )
  let hueScale = paddedScale(
    width,
    colors.map(color => color.h),
    ranges.h.max
  )

  for (let x = 0; x < width; x++) {
    let l = luminostyScale(x)
    let h = hueScale(x)

    // TODO: it will be a good optimisation to remember previous L H values and return the same column if they haven't changed

    // TODO: another good optimisation is to remember previous last displayable color and start from it. Or even combine it with binary search.

    for (let y = height; y >= 0; y--) {
      let c = sycledLerp(ranges.c.max, ranges.c.min, y / height)
      const { r, g, b, displayable } = lch2color([l, c, h])
      // If color with this chroma is undisplayable, then all colors with higher chroma also will be undisplayable so we can just finish with this column.
      if (!displayable) break
      pixels.setPixel(
        x,
        y,
        showColors ? r : 255,
        showColors ? g : 255,
        showColors ? b : 255,
        255
      )
    }
  }
  return pixels.array
}

function drawHueChart({
  width,
  height,
  colors,
  mode,
  showColors,
}: DrawChartProps) {
  const { ranges, lch2color } = colorSpaces[mode]
  let pixels = new Pixels(width, height)
  let luminostyScale = paddedScale(
    width,
    colors.map(color => color.l)
  )
  let chromaScale = paddedScale(
    width,
    colors.map(color => color.c)
  )

  for (let x = 0; x < width; x++) {
    let l = luminostyScale(x)
    let c = chromaScale(x)

    for (let y = height; y >= 0; y--) {
      let h = sycledLerp(ranges.h.max, ranges.h.min, y / height)
      const { r, g, b, displayable } = lch2color([l, c, h])
      if (displayable) {
        pixels.setPixel(
          x,
          y,
          showColors ? r : 255,
          showColors ? g : 255,
          showColors ? b : 255,
          255
        )
      }
    }
  }
  return pixels.array
}

const obj = { drawChromaChart, drawLuminosityChart, drawHueChart }
export type WorkerObj = typeof obj
Comlink.expose(obj)
