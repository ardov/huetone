import { Channel } from 'shared/types'
import { DrawChartProps, WorkerObj } from './worker/paintWorker'

// @ts-ignore Module not found
// eslint-disable-next-line import/no-webpack-loader-syntax
import PaintWorker from './worker/paintWorker?worker'
import * as Comlink from 'comlink'

export type PaintResult = ImageBitmap | ImageData
export type ExecutableFunc = (props: DrawChartProps) => PaintResult
export type ChannelFuncs = {
  [K in Channel]: Comlink.Remote<ExecutableFunc>
}

/*
 * context switching overhead and multicore throttling kills burst performance
 *
 *  1c/12 = 5550ms = 100%    (+0, 0% ovh)
 *  2c/12 = 2850ms =  51%    (+1, 2% ovh)
 *  4c/12 = 1490ms =  27%    (+2, 8% ovh)
 *  6c/12 = 1110ms =  20%    (+3, 15% ovh)
 *  8c/12 =  960ms =  17.3%  (+4.8, 27% ovh)
 * 10c/12 =  905ms =  16.3%  (+6.3, 38% ovh)
 * 12c/12 =  885ms =  15.5%  (+7.1%, 45% ovh)
 *
 *  1c/8  = 6060ms = 100%
 *  2c/8  = 3200ms =  52%
 *  4c/8  = 2100ms =  34%
 *  6c/8  = 1920ms =  31%
 *  8c/8  = 1870ms =  30%
 */
const OPTIMAL_GAIN_CORES_RATIO = 2 / 3
const logicalCores = navigator.hardwareConcurrency || 1
// todo maybe perform actual short perf test to determine physical cores count
const physicalCores = logicalCores / 2

export function convertWorkerToFuncs(
  worker: Comlink.Remote<WorkerObj>
): ChannelFuncs {
  return {
    l: worker.drawLuminosityChart,
    c: worker.drawChromaChart,
    h: worker.drawHueChart,
  }
}

class CanvasWorkerPool {
  static readonly optimalPoolSize = Math.max(
    1,
    Math.floor(physicalCores * OPTIMAL_GAIN_CORES_RATIO)
  )

  private readonly workers: Worker[]
  private readonly comlinks: Comlink.Remote<WorkerObj>[]
  private readonly funcs: ChannelFuncs[]

  constructor(size: number = CanvasWorkerPool.optimalPoolSize) {
    const workers = new Array(size).fill(0).map(() => new PaintWorker())
    const comlinks = workers.map(w => Comlink.wrap<WorkerObj>(w))

    const funcs = comlinks.map(convertWorkerToFuncs)

    this.workers = workers
    this.comlinks = comlinks
    this.funcs = funcs
  }

  get channelFuncs(): ChannelFuncs[] {
    if (this.funcs.length > 0) {
      return this.funcs
    } else {
      throw new Error('Worker pool has been released')
    }
  }

  release(): void {
    this.comlinks.forEach(c => c[Comlink.releaseProxy]())
    this.workers.forEach(w => w.terminate())
    this.funcs.splice(0, this.funcs.length)
  }
}

const singletonPool = new CanvasWorkerPool()

/** Use singleton pool for app-agnostic compute handling. Use hook if app will introduce routing */
export const { channelFuncs } = singletonPool
export const { optimalPoolSize } = CanvasWorkerPool
