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
    const bitmap = await channelFuncs[channel]({
      ...restRenderProps,
      width: renderWidth,
      height: renderHeight,
    })

    if (!cancelled) {
      drawRegion(bitmap, 0, intrinsicWidth)
    }
  }

  return {
    /** Basic Strategy is single-frame single-worker operation, therefore only result commit is cancellable */
    abort: () => { cancelled = true },
    progress: renderFrame()
  }
}
