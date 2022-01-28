/** Standard linear interpolation */
export const lerp = (start: number, end: number, t: number) => {
  if (t <= 0) return start
  if (t >= 1) return end
  return start * (1 - t) + end * t
}

/** Inverse linear interpolation. Give value, get t */
export const invLerp = (start: number, end: number, value: number) => {
  return (value - start) / (end - start)
}

export const remap = (
  iMin: number,
  iMax: number,
  oMin: number,
  oMax: number,
  iValue: number
) => {
  let t = invLerp(iMin, iMax, iValue)
  return lerp(oMin, oMax, t)
}

/** Linear interpolation that searches for shortest distance on the circle.
 *  Used mainly to interpolate hue values.
 *  @param startValue
 *  @param endValue
 *  @param t current position in range 0..1
 *  @param rangeLimit number after which circle start again. E.g. 360 for hue
 */
export function sycledLerp(
  start: number,
  end: number,
  t: number,
  limit?: number
) {
  if (!limit) return lerp(start, end, t)
  const innerDistance = Math.abs(end - start)
  const outterDistance = Math.abs(
    Math.min(start, end) + limit - Math.max(start, end)
  )
  if (innerDistance <= outterDistance) return lerp(start, end, t)
  if (start > end) return lerp(start, end + limit, t) % limit
  return lerp(start + limit, end, t) % limit
}

export const linearScale = (stops: number[], limit?: number) => {
  if (stops.length === 1) return () => stops[0]
  const sectionWidth = 1 / (stops.length - 1)
  return (t: number) => {
    if (t <= 0) return stops[0]
    if (t >= 1) return stops[stops.length - 1]
    const firstStopIdx = Math.floor(t / sectionWidth)
    const tNormalized = (t % sectionWidth) / sectionWidth
    const start = stops[firstStopIdx]
    const end = stops[firstStopIdx + 1]

    return sycledLerp(start, end, tNormalized, limit)
  }
}

export const paddedScale = (width: number, stops: number[], limit?: number) => {
  const columnWidth = width / stops.length
  const padStart = columnWidth / 2
  const padEnd = columnWidth / 2
  const scale = linearScale(stops, limit)

  return (x: number) => {
    if (stops.length === 1) return stops[0]
    if (x <= padStart) return stops[0]
    if (x >= width - padEnd) return stops[stops.length - 1]
    // const tNormalized = invLerp(padStart, width - padEnd, x)
    const tNormalized = (x - padStart) / (width - padStart - padEnd)
    return scale(tNormalized)
  }
}

// const scaleValue = (
//   value: number,
//   from: [number, number],
//   to: [number, number]
// ) => {
//   const ratio = (to[1] - to[0]) / (from[1] - from[0])
//   const change = (value - from[0]) * ratio
//   return to[0] + change
// }
