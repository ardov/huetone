import * as Comlink from 'comlink'
import { obj } from './paintWorker'

Comlink.expose(obj)
