import { LAB, LCH, RGB, XYZ } from '../../types'

type Refs = [number, number, number]

export const D50: Refs
export const D65: Refs

export function lin_sRGB(rgb: RGB): RGB
export function gam_sRGB(rgb: RGB): RGB
export function lin_sRGB_to_XYZ(rgb: RGB): XYZ
export function XYZ_to_lin_sRGB(xyz: XYZ): RGB

export function lin_P3(rgb: RGB): RGB
export function gam_P3(rgb: RGB): RGB
export function lin_P3_to_XYZ(rgb: RGB): XYZ
export function XYZ_to_lin_P3(xyz: XYZ): RGB

export function lin_ProPhoto(rgb: RGB): RGB
export function gam_ProPhoto(rgb: RGB): RGB
export function lin_ProPhoto_to_XYZ(rgb: RGB): XYZ
export function XYZ_to_lin_ProPhoto(xyz: XYZ): RGB

export function lin_a98rgb(rgb: RGB): RGB
export function gam_a98rgb(rgb: RGB): RGB
export function lin_a98rgb_to_XYZ(rgb: RGB): XYZ
export function XYZ_to_lin_a98rgb(xyz: XYZ): RGB

export function lin_2020(rgb: RGB): RGB
export function gam_2020(rgb: RGB): RGB
export function lin_2020_to_XYZ(rgb: RGB): XYZ
export function XYZ_to_lin_2020(xyz: XYZ): RGB

export function D65_to_D50(xyz: XYZ): XYZ
export function D50_to_D65(xyz: XYZ): XYZ

export function XYZ_to_Lab(xyz: XYZ): LAB
export function Lab_to_XYZ(lab: LAB): XYZ
export function Lab_to_LCH(lab: LAB): LCH
export function LCH_to_Lab(lch: LCH): LAB

export function XYZ_to_OKLab(xyz: XYZ): LAB
export function OKLab_to_XYZ(lab: LAB): XYZ
export function OKLab_to_OKLCH(lab: LAB): LCH
export function OKLCH_to_OKLab(lch: LCH): LAB

// export function rectangular_premultiply(color:RGB, alpha:number):RGB
// export function rectangular_un_premultiply
// export function polar_premultiply
// export function polar_un_premultiply
// export function hsl_premultiply
