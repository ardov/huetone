export type TPixelData = [number, number, number, number]

export class Pixels {
  width: number
  height: number
  array: Uint8ClampedArray
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.array = new Uint8ClampedArray(width * height * 4).fill(0)
  }
  setPixel(x: number, y: number, pixelData: TPixelData) {
    const [r, g, b, a] = pixelData
    let displacement = y * this.width * 4 + x * 4
    this.array[displacement] = r
    this.array[displacement + 1] = g
    this.array[displacement + 2] = b
    this.array[displacement + 3] = a
  }
}
