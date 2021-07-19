import { useEffect, useMemo, useRef } from 'react'
import { Channel, LCH } from '../../types'
import debounce from 'lodash/debounce'
import { drawChart } from './draw'

export function Canvas(props: {
  width: number
  height: number
  channel: Channel
  colors: LCH[]
}) {
  const { width, height, channel, colors } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const debouncedRepaint = useMemo(
    () =>
      debounce(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const intWidth = Math.ceil(width)
        const intHeight = Math.ceil(height)
        const pixels = drawChart({
          width: intWidth,
          height: intHeight,
          colors: colors,
          channel: channel,
        })
        const imageData = new ImageData(pixels, intWidth, intHeight)
        ctx?.putImageData(imageData, 0, 0)
      }, 300),
    [channel, colors, height, width]
  )

  useEffect(() => {
    debouncedRepaint()
    return () => {
      debouncedRepaint.cancel()
    }
  }, [channel, colors, height, width, debouncedRepaint])
  return <canvas ref={canvasRef} width={width} height={height} />
}
