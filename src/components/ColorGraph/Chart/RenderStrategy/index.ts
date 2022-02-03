import { TSettings } from '../../../../store/chartSettings'
import { Channel } from '../../../../types'
import { DrawChartProps } from '../paintWorker'
import { ChannelFuncs, PaintResult } from './WorkerPool'

export type RenderStrategyParams = Omit<DrawChartProps, 'widthTo' | 'widthFrom'>
export type RenderStrategyType = 'basic' | 'concurrent' | 'spread'

export type DrawPartialFn = (data: PaintResult, widthFrom: number, widthTo: number) => void
export type RenderStrategy<ExtraParams = {}>
  = (
  funcsPool: ChannelFuncs[],
  channel: Channel,
  params: ExtraParams & TSettings & RenderStrategyParams,
  drawPartialRegion: DrawPartialFn,
  scale?: number
) => {
  progress: Promise<unknown>,
  abort: () => void
}

export * from './Basic'
export * from './Concurrent'
export * from './WorkerPool'
