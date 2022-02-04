export function buildDrawingAreas(width: number, areasCount: number) {
  const drawingAreaWidth = Math.ceil(width / areasCount)
  const drawingAreas = new Array(areasCount)
    .fill(0)
    .map((_, i) => i * drawingAreaWidth)
  drawingAreas.push(width)

  return drawingAreas
}
