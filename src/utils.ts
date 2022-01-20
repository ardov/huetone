export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  let result = Array.from(list)
  let object = result[startIndex]
  result.splice(startIndex, 1)
  result.splice(endIndex, 0, object)
  return result
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))
