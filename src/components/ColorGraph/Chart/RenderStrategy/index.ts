import { TSettings } from 'store/chartSettings'
import { Channel } from 'shared/types'
import { DrawChartProps } from './WorkerPool/worker/paintWorker'
import { ChannelFuncs, PaintResult } from './WorkerPool'

export type RenderStrategyType = 'basic' | 'concurrent' | 'spread'

export type DrawPartialFn = (
  data: PaintResult,
  widthFrom: number,
  widthTo: number
) => void

type InternalRenderStrategyParams = Omit<
  DrawChartProps,
  'widthTo' | 'widthFrom'
>
export type RenderStrategyParams<ExtraParams = {}> = ExtraParams &
  TSettings &
  InternalRenderStrategyParams

export type RenderStrategy<ExtraParams = { scale: number }> = (
  funcsPool: ChannelFuncs[],
  channel: Channel,
  params: RenderStrategyParams<ExtraParams>,
  drawPartialRegion: DrawPartialFn
) => {
  progress: Promise<unknown>
  abort: () => void
}

export * from './Concurrent'
export * from './WorkerPool'
