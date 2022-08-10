import { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { useStore } from '@nanostores/react'
import { Channel, spaceName, TColor } from 'shared/types'
import { paletteStore } from 'store/palette'
import { chartSettingsStore } from 'store/chartSettings'

import {
  // Using singleton worker pool shared between Canvases ensuring total pool size
  channelFuncs,
  ConcurrentSpreadRender,
  RenderStrategyType,
  DrawPartialFn,
  ConcurrentSpreadStrategyParams,
} from './RenderStrategy'
import { drawImageOnCanvasSafe } from './drawImageOnCanvasSafe'

/** 100 is kind of optimal repaint ratio (1% per 'frame-column'). More areas cause more worker overhead */
export const OPTIMAL_SPREAD_AREAS_AMOUNT = 100
export const SUPERSAMPLING_RATIO = 1

const RENDER_STRATEGY_DEBOUNCE: { [K in RenderStrategyType]: number } = {
  basic: 200,
  concurrent: 50,
  spread: 0,
}
const RENDER_STRATEGY_SPREAD: { [K in RenderStrategyType]: number } = {
  basic: 1,
  concurrent: channelFuncs.length,
  spread: OPTIMAL_SPREAD_AREAS_AMOUNT,
}

export function Canvas(props: {
  width: number
  height: number
  channel: Channel
  colors: TColor[]
  renderStrategy?: RenderStrategyType
}) {
  const settings = useStore(chartSettingsStore)
  const { mode } = useStore(paletteStore)
  const {
    width,
    height,
    channel,
    colors,
    renderStrategy = 'concurrent',
  } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const debouncedRepaint = useMemo(() => {
    const debounceRate = RENDER_STRATEGY_DEBOUNCE[renderStrategy]
    const renderSpread = RENDER_STRATEGY_SPREAD[renderStrategy]

    return debounce((colors: TColor[], mode: spaceName) => {
      console.log('🖼 Repaint canvas')
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!ctx) return

      const drawPartialImage: DrawPartialFn = (image, from, to) => {
        ctx.clearRect(from, 0, to - from, height)
        drawImageOnCanvasSafe(ctx, image, from, to, height)
      }

      const renderParams: ConcurrentSpreadStrategyParams = {
        width,
        height,
        mode,
        colors,
        ...settings,
        spread: renderSpread,
        scale: SUPERSAMPLING_RATIO,
      }

      return ConcurrentSpreadRender(
        channelFuncs,
        channel,
        renderParams,
        drawPartialImage
      )
    }, debounceRate)
  }, [channel, height, settings, width, renderStrategy])

  useEffect(() => {
    debouncedRepaint(colors, mode)
    return () => {
      // get previously fired render operation to shortcut execution and to abort any bitmap commits from it
      debouncedRepaint(colors, mode)?.abort()
      debouncedRepaint.cancel()
    }
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
