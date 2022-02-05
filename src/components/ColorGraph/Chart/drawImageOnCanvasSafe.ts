import { PaintResult } from './RenderStrategy'

const isSafari = /.*Version.*Safari.*/.test(navigator.userAgent)

/**
 * ### XXX: Review opportunity to use async OffscreenCanvas in worker when better supported
 *
 * ## drawImage(ImageBitmap)
 * Total 200-215μs, **blocking 30-45μs**
 * * new ImageData             ~  40μs on Worker
 * * createImageBitmap         ~ 130μs on Worker
 * * [draw with scaling]:         45μs on Main
 * * [draw w/o scaling]:          30μs on Main
 *
 * ## putImageData (scaling not possible)
 * Total 210μs, **blocking 170μs**
 * * new ImageData             ~  40μs on Worker
 * * putImageData              ~ 170μs on Main
 *
 * ## createImageBitmap on main thread
 * Because Safari can not createImageBitmap in workers
 * Total 370-385μs, **blocking 330-355μs**
 * * new ImageData             ~  40μs on Worker
 * * createImageData           ~ 300μs on Main
 * * [draw w/o scaling]:          45μs on Main
 * * [draw with scaling]:         30μs on Main
 *
 * ## offscreen w/o scaling
 * Total 465μs, **blocking 425μs**
 * * new ImageData             ~  40μs on Worker
 * * offscreen scaling:          350μs on Main
 * * offscreen to screen:         75μs on Main
 *
 *
 * ## offscreen with scaling
 * Total 660μs, **blocking 620μs**
 * * new ImageData              ~  40μs on Worker
 * * offscreen scaling:          520μs on Main
 * * offscreen to screen:        100μs on Main
 *
 */
export function drawImageOnCanvasSafe(
  ctx: CanvasRenderingContext2D,
  image: PaintResult,
  from: number,
  to: number,
  height: number
) {
  const redrawWidth = to - from

  if (image instanceof ImageBitmap) {
    // Worker was able to prepare a bitmap
    ctx.drawImage(image, from, 0, redrawWidth, height)
  } else if (image.height === height) {

  /** An assumption on whether scaling of rendered image to intrinsic canvas size is required */
    // putImageData if fastest for non-scale ImageData render
    ctx.putImageData(image, from, 0)
  } else if ('createImageBitmap' in window && !isSafari) {

  /** Fallback area for scaling and obsolete user-agents */
    // Safari lacks proper Canvas and ImageBitmap implementation
    // https://bugs.webkit.org/show_bug.cgi?id=182424
    void createImageBitmap(image)
      .then(bitmap => ctx.drawImage(bitmap, from, 0, redrawWidth, height))
      // if somehow Safari passed user-agent check, it will throw error from drawImage
      .catch(() => offscreenRenderFallback(ctx, image, from, to, height))
  } else {
    // fallback is the slowest but safest option
    offscreenRenderFallback(ctx, image, from, to, height)
  }
}

function offscreenRenderFallback(
  ctx: CanvasRenderingContext2D,
  image: ImageData,
  from: number,
  to: number,
  height: number
) {
  const offscreenCanvas = document.createElement('canvas')
  const offscreenContext = offscreenCanvas.getContext('2d')
  if (!offscreenContext) return

  offscreenCanvas.width = image.width
  offscreenCanvas.height = image.height
  offscreenContext.putImageData(image, 0, 0)

  ctx.drawImage(offscreenCanvas, from, 0, to - from, height)
}
