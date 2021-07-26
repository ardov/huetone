import { useEffect, useMemo, useRef } from 'react'
// @ts-ignore Module not found
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./paintWorker'
import { WorkerObj } from './paintWorker'
import * as Comlink from 'comlink'
import { Channel, LCH } from '../../types'
import debounce from 'lodash/debounce'

const worker = new Worker()
const { drawChart } = Comlink.wrap<WorkerObj>(worker)

export function Canvas(props: {
  width: number
  height: number
  channel: Channel
  colors: LCH[]
}) {
  const { width, height, channel, colors } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const debouncedRepaint = useMemo(() => {
    return debounce(async (colors: LCH[]) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      const pixels = await drawChart({ width, height, colors, channel })
      const imageData = new ImageData(pixels, width, height)
      ctx?.putImageData(imageData, 0, 0)
    }, 200)
  }, [channel, height, width])

  useEffect(() => {
    debouncedRepaint(colors)
    return () => {
      debouncedRepaint.cancel()
    }
  }, [colors, debouncedRepaint])
  return <canvas ref={canvasRef} width={width} height={height} />
}
