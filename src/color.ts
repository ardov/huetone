import chroma from 'chroma-js'
import { APCAcontrast, sRGBtoY } from 'apca-w3'

export const wcagContrast = (backgroundHex: string, textHex: string): number =>
  chroma.contrast(backgroundHex, textHex)

export const apcaContrast = (backgroundHex: string, textHex: string): number =>
  Math.abs(
    APCAcontrast(
      sRGBtoY(chroma(textHex).hex()),
      sRGBtoY(chroma(backgroundHex).hex())
    )
  )

export const deltaEContrast = (
  backgroundHex: string,
  textHex: string
): number => chroma.deltaE(backgroundHex, textHex)

export const getMostContrast = (color: string, colorList: string[]): string => {
  const contrastRatios = colorList.map(c => apcaContrast(color, c))
  const maxContrast = Math.max(...contrastRatios)
  const i = contrastRatios.indexOf(maxContrast)
  return colorList[i]
}

export const valid = chroma.valid
