import { RenderStrategy } from '../'

export const render: RenderStrategy = async (
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
  const channelFuncs = funcsPool[0]

  const renderWidth = intrinsicWidth * scale
  const renderHeight = intrinsicHeight * scale

  const pixels = await channelFuncs[channel]({
    ...restRenderProps,
    width: renderWidth,
    height: renderHeight,
  })
  const image = new ImageData(pixels, renderWidth, renderHeight)
  const bitmap = await createImageBitmap(image)

  drawRegion(bitmap, 0, intrinsicWidth)
}
