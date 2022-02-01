import { useEffect, useMemo, useRef } from 'react'
import { Channel, TColor } from '../../../types'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import { TSpaceName } from '../../../colorFuncs'
import { useStore } from '@nanostores/react'
import { paletteStore } from '../../../store/palette'
import { chartSettingsStore } from '../../../store/chartSettings'

import {
  // Using singleton worker pool shared between Canvases ensuring total pool size
  channelFuncs,
  BasicRender,
  ConcurrentRender,
  ConcurrentSpreadRender,
  RenderStrategyType
} from './RenderStrategy'

export const SUPERSAMPLING_RATIO = 1

export function Canvas(props: {
  width: number
  height: number
  channel: Channel
  colors: TColor[]
  renderStrategy?: RenderStrategyType
}) {
  const settings = useStore(chartSettingsStore)
  const { mode } = useStore(paletteStore)
  const { width, height, channel, colors, renderStrategy } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const debouncedRepaint = useMemo(() => {
    return debounce((colors: TColor[], mode: TSpaceName) => {
      console.log('🖼 Repaint canvas')
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!ctx) return

      const drawPartialImage = (bmp: ImageBitmap, from: number, to: number) => {
        ctx.clearRect(from, 0, to - from, height)
        ctx.drawImage(bmp, 0, 0, width, height)
      }

      const renderParams = { width, height, mode, colors, ...settings }

      switch (renderStrategy) {
        case 'basic':
          return BasicRender(channelFuncs, channel, renderParams, drawPartialImage, SUPERSAMPLING_RATIO)
        case 'concurrent':
          return ConcurrentRender(channelFuncs, channel, renderParams, drawPartialImage, SUPERSAMPLING_RATIO)
        default:
        case 'spread':
          return ConcurrentSpreadRender(channelFuncs, channel, renderParams, drawPartialImage, SUPERSAMPLING_RATIO)
      }
    }, 200)
  }, [channel, height, settings, width, renderStrategy])

  useEffect(() => {
    debouncedRepaint(colors, mode)
    return () => debouncedRepaint.cancel()
  }, [colors, debouncedRepaint, mode])
  return (
    <Wrapper>
      <StyledCanvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ filter: settings.showColors ? '' : 'var(--canvas-filter)' }}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  --c-1: hsl(0, 0%, 85%);
  --c-2: hsl(0, 0%, 94%);
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
