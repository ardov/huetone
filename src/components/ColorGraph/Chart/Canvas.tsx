import { useEffect, useMemo, useRef } from 'react'
// @ts-ignore Module not found
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./paintWorker'
import { WorkerObj } from './paintWorker'
import * as Comlink from 'comlink'
import { Channel, TColor } from '../../../types'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import { TSpaceName } from '../../../color2'
import { useStore } from '@nanostores/react'
import { paletteStore } from '../../../store/palette'

const worker = new Worker()
const { drawChromaChart, drawHueChart, drawLuminosityChart } =
  Comlink.wrap<WorkerObj>(worker)

const funcs = {
  l: drawLuminosityChart,
  c: drawChromaChart,
  h: drawHueChart,
}

export function Canvas(props: {
  width: number
  height: number
  channel: Channel
  colors: TColor[]
}) {
  const { width, height, channel, colors } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { mode } = useStore(paletteStore)

  const debouncedRepaint = useMemo(() => {
    return debounce(async (colors: TColor[], mode: TSpaceName) => {
      console.log('🖼 Repaint canvas')
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!ctx) return
      const pixels = await funcs[channel]({ width, height, colors, mode })
      const imageData = new ImageData(pixels, width, height)
      ctx.putImageData(imageData, 0, 0)
    }, 200)
  }, [channel, height, width])

  useEffect(() => {
    debouncedRepaint(colors, mode)
    return () => {
      debouncedRepaint.cancel()
    }
  }, [colors, debouncedRepaint, mode])
  return (
    <Wrapper>
      <StyledCanvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ filter: 'var(--canvas-filter)' }}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  --c-1: var(--c-bg-card);
  --c-2: var(--c-divider);
  overflow: hidden;
  border-radius: 0 0 8px 8px;
  background-color: var(--c-2);
  background-image: linear-gradient(45deg, var(--c-1) 25%, transparent 25%),
    linear-gradient(-45deg, var(--c-1) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--c-1) 75%),
    linear-gradient(-45deg, transparent 75%, var(--c-1) 75%);
  background-size: 6px 6px;
  background-position: 0 0, 0 3px, 3px -3px, -3px 0px;
`

const StyledCanvas = styled.canvas`
  filter: drop-shadow(0px 0px 1px var(--c-1));
`
