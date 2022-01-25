import { LCH, XYZ } from '../types'
import { TLchModel } from '.'
import {
  D65_to_D50,
  D50_to_D65,
  XYZ_to_Lab,
  Lab_to_XYZ,
  Lab_to_LCH,
  LCH_to_Lab,
  XYZ_to_OKLab,
  OKLab_to_XYZ,
  OKLab_to_OKLCH,
  OKLCH_to_OKLab,
} from './colorMath/conversions'

export const cielch: TLchModel = {
  name: 'cielch',
  lch2xyz: (lch: LCH) => D50_to_D65(Lab_to_XYZ(LCH_to_Lab(lch))),
  xyz2lch: (xyz: XYZ) => Lab_to_LCH(XYZ_to_Lab(D65_to_D50(xyz))),
  ranges: {
    l: { min: 0, max: 100, step: 0.5 },
    c: { min: 0, max: 134, step: 0.5 },
    h: { min: 0, max: 360, step: 0.5 },
  },
}

export const oklch: TLchModel = {
  name: 'oklch',
  lch2xyz: (lch: LCH) => OKLab_to_XYZ(OKLCH_to_OKLab(lch)),
  xyz2lch: (xyz: XYZ) => OKLab_to_OKLCH(XYZ_to_OKLab(xyz)),
  ranges: {
    l: { min: 0, max: 1, step: 0.005 },
    c: { min: 0, max: 0.33, step: 0.005 },
    h: { min: 0, max: 360, step: 0.5 },
  },
}
