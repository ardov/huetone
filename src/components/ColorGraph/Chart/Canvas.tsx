import { useEffect, useMemo, useRef } from 'react'
// @ts-ignore Module not found
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./paintWorker'
import { WorkerObj } from './paintWorker'
import * as Comlink from 'comlink'
import { Channel, LCH } from '../../../types'
import debounce from 'lodash/debounce'
import styled from 'styled-components'

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
      console.log('🖼 Repaint canvas')
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!ctx) return
      const pixels = await drawChart({ width, height, colors, channel })
      const imageData = new ImageData(pixels, width, height)
      ctx.putImageData(imageData, 0, 0)
    }, 200)
  }, [channel, height, width])

  useEffect(() => {
    debouncedRepaint(colors)
    return () => {
      debouncedRepaint.cancel()
    }
  }, [colors, debouncedRepaint])
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
