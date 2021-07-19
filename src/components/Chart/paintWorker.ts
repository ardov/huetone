import { MAX_C, MAX_H, MAX_L, displayable } from '../../color'
import * as Comlink from 'comlink'
import { LCH } from '../../types'

const domains = {
  l: [MAX_L, 0] as [number, number],
  c: [MAX_C, 0] as [number, number],
  h: [MAX_H, 0] as [number, number],
}

type DrawChartProps = {
  width: number
  height: number
  colors: LCH[]
  channel: 'l' | 'c' | 'h'
}

function drawChart({ width, height, colors, channel }: DrawChartProps) {
  console.log('RUN WORKER')
  let pixels = new Uint8ClampedArray(width * height * 4)

  const channelValues = {
    l: colors.map(c => c[0]),
    c: colors.map(c => c[1]),
    h: colors.map(c => c[2]),
  }

  const horizontalScales = {
    l: paddedScale(channelValues.l, width),
    c: paddedScale(channelValues.c, width),
    h: paddedScale(channelValues.h, width),
  }

  for (let x = 0; x < width; x++) {
    let value = {
      l: horizontalScales.l(x),
      c: horizontalScales.c(x),
      h: horizontalScales.h(x),
    }

    for (let y = 0; y < height; y++) {
      value[channel] = scaleValue(y, [0, height], domains[channel])

      const { r, g, b, a } = displayable([value.l, value.c, value.h])
        ? { r: 255, g: 255, b: 255, a: 255 }
        : { r: 230, g: 230, b: 230, a: 255 }

      const displacement = y * width * 4 + x * 4
      pixels[displacement] = r
      pixels[displacement + 1] = g
      pixels[displacement + 2] = b
      pixels[displacement + 3] = a
    }
  }
  return pixels
}

const paddedScale = (stops: number[], width: number) => {
  const columnWidth = width / stops.length
  const padStart = columnWidth / 2
  const padEnd = columnWidth / 2
  return (value: number) => {
    if (value <= padStart) return stops[0]
    if (value >= width - padEnd) return stops[stops.length - 1]
    return linearScale(stops, width - padEnd - padStart)(value - padStart)
  }
}

const linearScale = (stops: number[], width: number) => {
  if (stops.length === 1) return () => stops[0]
  const sections = stops.length - 1
  const sectionWidth = width / sections
  return (value: number) => {
    if (value <= 0) return stops[0]
    if (value >= width) return stops[stops.length - 1]
    const idxFrom = Math.floor(value / sectionWidth)
    const localValue = value % sectionWidth
    return scaleValue(
      localValue,
      [0, sectionWidth],
      [stops[idxFrom], stops[idxFrom + 1]]
    )
  }
}

const scaleValue = (
  value: number,
  from: [number, number],
  to: [number, number]
) => {
  const ratio = (to[1] - to[0]) / (from[1] - from[0])
  const change = (value - from[0]) * ratio
  return to[0] + change
}

const obj = {
  drawChart,
}

export type WorkerObj = typeof obj
Comlink.expose(obj)
