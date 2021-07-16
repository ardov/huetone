export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// export function clone<T>(obj: T) {
//   return JSON.parse(JSON.stringify(obj)) as T
// }
