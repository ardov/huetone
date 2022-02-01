import { RenderStrategy } from '../'

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

  const channelFuncs = funcsPool[0]

  const renderWidth = intrinsicWidth * scale
  const renderHeight = intrinsicHeight * scale

  async function renderFrame() {
    const pixels = await channelFuncs[channel]({
      ...restRenderProps,
      width: renderWidth,
      height: renderHeight,
    })

    if (!cancelled) {
      const image = new ImageData(pixels, renderWidth, renderHeight)
      const bitmap = await createImageBitmap(image)
      drawRegion(bitmap, 0, intrinsicWidth)
    }
  }

  return {
    /** Basic Strategy is single-frame single-worker operation, therefore only result commit is cancellable */
    abort: () => { cancelled = true },
    progress: renderFrame()
  }
}
