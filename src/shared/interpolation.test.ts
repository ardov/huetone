import { test, expect } from 'vitest'
import { paddedScale, linearScale, sycledLerp, lerp } from './interpolation'

test('lerp', () => {
  expect(lerp(100, 0, 0.5)).toBe(50)
  expect(lerp(0, 100, 0.5)).toBe(50)
  expect(lerp(15, 5, 0.1)).toBe(14)
})

test('sycledLerp with limit', () => {
  expect(sycledLerp(5, 95, 0.9, 100)).toBe(96)
  expect(sycledLerp(5, 15, 0.9, 100)).toBe(14)
  expect(sycledLerp(95, 5, 0.1, 100)).toBe(96)
  expect(sycledLerp(15, 5, 0.1, 100)).toBe(14)
})

test('linearScale', () => {
  expect(linearScale([0, 100], 360)(0.5)).toBe(50)
  expect(linearScale([0, 100], 360)(0)).toBe(0)
  expect(linearScale([0, 100], 360)(1)).toBe(100)
  expect(linearScale([50, 310], 360)(0.4)).toBe(10)
})
test('paddedScale', () => {
  expect(paddedScale(100, [0, 100])(50)).toBe(50)
  expect(paddedScale(100, [0, 100])(0)).toBe(0)
  expect(paddedScale(100, [0, 100])(20)).toBe(0)
  expect(paddedScale(100, [0, 100])(100)).toBe(100)
  expect(paddedScale(100, [10, 999], 1000)(40)).toBeLessThan(10)
})
