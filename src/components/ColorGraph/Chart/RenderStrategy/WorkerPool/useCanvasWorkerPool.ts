import { useEffect, useState } from 'react'
import { convertWorkerToFuncs, ChannelFuncs } from './CanvasWorkerPool'
import { WorkerObj } from './worker/paintWorker'

// @ts-ignore Module not found
// eslint-disable-next-line import/no-webpack-loader-syntax
import PaintWorker from './worker/paintWorker?name=PaintWorker?worker'
import * as Comlink from 'comlink'

/** Use singleton pool for app-agnostic compute handling. Use hook if app will introduce routing */
export function useCanvasWorkerPool(poolSize: number): ChannelFuncs[] {
  const [funcs, setFuncs] = useState<ChannelFuncs[]>([])

  useEffect(() => {
    if (poolSize > 0) {
      const ww = new Array(poolSize).fill(0).map(() => new PaintWorker())
      const cc = ww.map(w => Comlink.wrap<WorkerObj>(w))

      setFuncs(cc.map(convertWorkerToFuncs))

      return () => {
        cc.forEach(c => c[Comlink.releaseProxy]())
        ww.forEach(w => w.terminate())
      }
    }
  }, [poolSize])

  return funcs
}
