import { TSettings } from '../../../../store/chartSettings'
import { Channel } from '../../../../types'
import { DrawChartProps } from '../paintWorker'
import { ChannelFuncs } from './WorkerPool'

export type RenderStrategyParams = Omit<DrawChartProps, 'widthTo' | 'widthFrom'>
export type RenderStrategyType = 'basic'

export type DrawPartialFn = (data: ImageBitmap, widthFrom: number, widthTo: number) => void
export type RenderStrategy<ExtraParams = {}>
  = (
  funcsPool: ChannelFuncs[],
  channel: Channel,
  params: ExtraParams & TSettings & RenderStrategyParams,
  drawPartialRegion: DrawPartialFn,
  scale?: number
) => Promise<unknown>

export * from './Basic'

export * from './WorkerPool'
