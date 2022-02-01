import { ChannelFuncs, RenderStrategy } from '../'
import { buildDrawingAreas } from './buildDrawingAreas'

export const render: RenderStrategy = (
  funcsPool,
  channel,
  {
    width: intrinsicWidth,
    height: intrinsicHeight,
    ...restRenderProps
  },
  drawRegion,
  scale = 1,
) => {
  let cancelled = false

  const renderWidth = intrinsicWidth * scale
  const renderHeight = intrinsicHeight * scale

  const drawingAreas = buildDrawingAreas(renderWidth, funcsPool.length)

  const drawFramePartial = async(funcs: ChannelFuncs, areaIndex: number) => {
    const widthFrom = drawingAreas[areaIndex]
    const widthTo = drawingAreas[areaIndex + 1]

    const pixels = await funcs[channel]({
      ...restRenderProps,
      width: renderWidth,
      height: renderHeight,
      widthFrom,
      widthTo,
    })

    if (!cancelled) {
      const image = new ImageData(pixels, widthTo - widthFrom, renderHeight)
      const bitmap = await createImageBitmap(image)

      const intrinsicWidthFrom = widthFrom / scale
      const intrinsicWidthTo = widthTo / scale
      drawRegion(bitmap, intrinsicWidthFrom, intrinsicWidthTo)
    }
  }

  // compute one frame composed of {funcsPool.length} partials
  const rendering = Promise.all(funcsPool.map(drawFramePartial))

  return {
    /** Concurrent Strategy is single-frame multi-worker operation, therefore only result commits are cancellable */
    abort: () => { cancelled = true },
    progress: rendering
  }
}
