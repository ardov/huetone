import { cielch as lch } from '../../../color2'
import * as Comlink from 'comlink'
import { LCH } from '../../../types'
import { Pixels } from './Pixels'
import { paddedScale, sycledLerp } from './interpolation'

const { ranges, toClampedRgb } = lch

type DrawChartProps = {
  width: number
  height: number
  colors: LCH[]
  channel: 'l' | 'c' | 'h'
}

function drawChart({ width, height, colors, channel }: DrawChartProps) {
  if (channel === 'c') return drawChromaChart(width, height, colors, true)
  if (channel === 'l') return drawLuminosityChart(width, height, colors, true)
  if (channel === 'h') return drawHueChart(width, height, colors, true)
  let pixels = new Pixels(width, height)

  return pixels.array
}

function drawLuminosityChart(
  width: number,
  height: number,
  colors: LCH[],
  showColors?: boolean
) {
  let pixels = new Pixels(width, height)
  let chromaScale = paddedScale(
    width,
    colors.map(([l, c, h]) => c)
  )
  let hueScale = paddedScale(
    width,
    colors.map(([l, c, h]) => h),
    ranges.h.max
  )

  for (let x = 0; x < width; x++) {
    let c = chromaScale(x)
    let h = hueScale(x)
    let hadColors = false

    for (let y = height; y >= 0; y--) {
      let l = sycledLerp(ranges.l.max, ranges.l.min, y / height)
      const { r, g, b, clamped } = toClampedRgb([l, c, h])
      // Luminosity chart only have colors in the middle. So if the current color is undisplayable and we already had displayable colors, there will be no more displayable colors.
      if (clamped && hadColors) break
      if (!clamped) {
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

function drawChromaChart(
  width: number,
  height: number,
  colors: LCH[],
  showColors?: boolean
) {
  let pixels = new Pixels(width, height)
  let luminostyScale = paddedScale(
    width,
    colors.map(([l, c, h]) => l)
  )
  let hueScale = paddedScale(
    width,
    colors.map(([l, c, h]) => h),
    ranges.h.max
  )

  for (let x = 0; x < width; x++) {
    let l = luminostyScale(x)
    let h = hueScale(x)

    // TODO: it will be a good optimisation to remember previous L H values and return the same column if they haven't changed

    // TODO: another good optimisation is to remember previous last displayable color and start from it. Or even combine it with binary search.

    for (let y = height; y >= 0; y--) {
      let c = sycledLerp(ranges.c.max, ranges.c.min, y / height)
      const { r, g, b, clamped } = toClampedRgb([l, c, h])
      // If color with this chroma is undisplayable, then all colors with higher chroma also will be undisplayable so we can just finish with this column.
      if (clamped) break
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

function drawHueChart(
  width: number,
  height: number,
  colors: LCH[],
  showColors?: boolean
) {
  let pixels = new Pixels(width, height)
  let luminostyScale = paddedScale(
    width,
    colors.map(([l, c, h]) => l)
  )
  let chromaScale = paddedScale(
    width,
    colors.map(([l, c, h]) => c)
  )

  for (let x = 0; x < width; x++) {
    let l = luminostyScale(x)
    let c = chromaScale(x)

    for (let y = height; y >= 0; y--) {
      let h = sycledLerp(ranges.h.max, ranges.h.min, y / height)
      const { r, g, b, clamped } = toClampedRgb([l, c, h])
      if (!clamped) {
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

const obj = { drawChart }
export type WorkerObj = typeof obj
Comlink.expose(obj)
